"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, ChevronDown } from "lucide-react";
import { useCommunity } from "../../layout";

interface DmMessage {
  id: string;
  content: string;
  type: string;
  senderId: string;
  createdAt: string;
  read: boolean;
  sender: {
    id: string;
    displayName: string;
    avatar: string | null;
    isOnline: boolean;
  };
}

interface ConversationInfo {
  id: string;
  otherMember: {
    id: string;
    displayName: string;
    avatar: string | null;
    isOnline: boolean;
  };
}

export default function DMConversationPage() {
  const params = useParams();
  const { member } = useCommunity();
  const convId = params.convId as string;

  const [otherMember, setOtherMember] = useState<ConversationInfo["otherMember"] | null>(null);
  const [messages, setMessages] = useState<DmMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [atBottom, setAtBottom] = useState(true);
  const [sendAnimation, setSendAnimation] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastMsgIdRef = useRef<string | null>(null);

  const fetchConversationInfo = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/dm");
      if (res.ok) {
        const convs = await res.json();
        const conv = convs.find((c: ConversationInfo) => c.id === convId);
        if (conv) setOtherMember(conv.otherMember);
      }
    } catch { /* silent */ }
  }, [convId]);

  const fetchMessages = useCallback(async (cursor?: string) => {
    try {
      const url = cursor
        ? `/api/chat/dm/${convId}/messages?cursor=${cursor}`
        : `/api/chat/dm/${convId}/messages`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (cursor) {
          setMessages((prev) => [...data.messages, ...prev]);
        } else {
          setMessages(data.messages);
        }
        setHasMore(data.hasMore);
        if (!cursor && data.messages.length > 0) {
          lastMsgIdRef.current = data.messages[data.messages.length - 1].id;
        }
      }
    } catch { /* silent */ }
  }, [convId]);

  // Use a ref for atBottom so SSE handler doesn't cause reconnections
  const atBottomRef = useRef(atBottom);
  useEffect(() => { atBottomRef.current = atBottom; }, [atBottom]);

  useEffect(() => {
    fetchConversationInfo();
    fetchMessages();
  }, [fetchConversationInfo, fetchMessages]);

  // SSE: real-time message stream (replaces 3-second polling)
  useEffect(() => {
    const eventSource = new EventSource(`/api/chat/dm/${convId}/stream`);

    eventSource.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as DmMessage;
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        lastMsgIdRef.current = msg.id;
        if (atBottomRef.current) {
          setTimeout(
            () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
            100
          );
        }
      } catch { /* malformed event */ }
    };

    eventSource.onerror = () => {
      // EventSource auto-reconnects with Last-Event-ID
    };

    return () => eventSource.close();
  }, [convId]);

  useEffect(() => {
    if (messages.length > 0 && atBottom) {
      messagesEndRef.current?.scrollIntoView();
    }
  }, [messages.length > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-resize textarea
  const adjustTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const handleScroll = () => {
    const c = containerRef.current;
    if (!c) return;
    setAtBottom(c.scrollHeight - c.scrollTop - c.clientHeight < 50);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    setSending(true);
    setSendAnimation(true);
    setTimeout(() => setSendAnimation(false), 300);

    try {
      const res = await fetch(`/api/chat/dm/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage.trim() }),
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        lastMsgIdRef.current = msg.id;
        setNewMessage("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          setAtBottom(true);
        }, 50);
      }
    } catch { /* silent */ }
    setSending(false);
    textareaRef.current?.focus();
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  };

  const getDateGroups = () => {
    const groups: { date: string; messages: DmMessage[] }[] = [];
    let currentDate = "";
    messages.forEach((msg) => {
      const date = formatDate(msg.createdAt);
      if (date !== currentDate) {
        currentDate = date;
        groups.push({ date, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });
    return groups;
  };

  return (
    <div className="flex flex-col h-screen bg-ewc-navy">
      {/* Header — frosted glass */}
      <div className="bg-ewc-navy-light/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center gap-3 flex-shrink-0 z-10 safe-area-top">
        <Link
          href="/community/dm"
          className="text-ewc-silver hover:text-white press-effect p-1 -ml-1 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-ewc-burgundy/30 flex items-center justify-center text-white text-sm font-bold">
            {otherMember?.avatar ? (
              <img src={otherMember.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              otherMember?.displayName?.charAt(0).toUpperCase() || "?"
            )}
          </div>
          {otherMember?.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-ewc-navy-light" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-medium text-[15px] truncate">
            {otherMember?.displayName || (
              <div className="w-24 h-4 skeleton rounded" />
            )}
          </h2>
          <p className="text-xs">
            {otherMember?.isOnline ? (
              <span className="text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                Online
              </span>
            ) : (
              <span className="text-ewc-silver/50">Offline</span>
            )}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 community-scroll overscroll-contain"
      >
        {hasMore && (
          <div className="text-center py-3 mb-2">
            <button
              onClick={() => messages.length > 0 && fetchMessages(messages[0].id)}
              className="text-ewc-burgundy-light text-xs press-effect px-4 py-2 rounded-full bg-white/5"
            >
              Load earlier messages
            </button>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="flex items-center justify-center py-16 fade-in-up">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-ewc-burgundy/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">👋</span>
              </div>
              <p className="text-ewc-silver text-sm">
                Say hello to {otherMember?.displayName?.split(" ")[0] || "them"}!
              </p>
              <p className="text-ewc-silver/40 text-xs mt-1">Messages are private</p>
            </div>
          </div>
        ) : (
          getDateGroups().map((group) => (
            <div key={group.date}>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-ewc-silver/50 text-[11px] font-medium uppercase bg-ewc-navy px-2 py-0.5 rounded-full">
                  {group.date}
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {group.messages.map((msg, idx) => {
                const isOwn = msg.senderId === member?.id;
                const prevMsg = idx > 0 ? group.messages[idx - 1] : null;
                const collapsed =
                  prevMsg?.senderId === msg.senderId &&
                  new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() < 60000;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"} ${
                      collapsed ? "mt-0.5" : "mt-3"
                    } msg-appear`}
                  >
                    <div className={`max-w-[78%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                      {!collapsed && !isOwn && (
                        <span className="text-[10px] text-ewc-silver/40 mb-0.5 ml-1">
                          {formatTime(msg.createdAt)}
                        </span>
                      )}
                      <div
                        className={`px-3.5 py-2.5 rounded-2xl text-[15px] leading-relaxed break-words ${
                          isOwn
                            ? "bg-ewc-burgundy text-white rounded-br-md"
                            : "bg-white/10 text-white rounded-bl-md"
                        }`}
                      >
                        {msg.content}
                      </div>
                      {!collapsed && isOwn && (
                        <div className="flex items-center gap-1 mt-0.5 mr-1">
                          <span className="text-[10px] text-ewc-silver/40">
                            {formatTime(msg.createdAt)}
                          </span>
                          {msg.read && (
                            <span className="text-[10px] text-ewc-burgundy-light">✓✓</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom */}
      {!atBottom && (
        <button
          onClick={() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            setAtBottom(true);
          }}
          className="absolute bottom-20 right-4 w-10 h-10 bg-ewc-burgundy rounded-full flex items-center justify-center text-white shadow-lg press-effect z-10 scale-in"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}

      {/* Input — auto-resize textarea */}
      <form
        onSubmit={sendMessage}
        className="px-3 py-2.5 bg-ewc-navy-light/95 backdrop-blur-xl border-t border-white/10 flex items-end gap-2 flex-shrink-0 safe-area-bottom"
      >
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              adjustTextarea();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            placeholder="Type a message..."
            rows={1}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-white text-[15px] placeholder:text-ewc-silver/50 focus:outline-none focus:border-ewc-burgundy/50 transition-colors resize-none overflow-hidden leading-normal"
            style={{ maxHeight: "120px" }}
          />
        </div>
        <button
          type="submit"
          disabled={!newMessage.trim() || sending}
          className={`w-10 h-10 bg-ewc-burgundy rounded-full flex items-center justify-center text-white transition-all disabled:opacity-30 disabled:scale-90 flex-shrink-0 mb-0.5 press-effect ${
            sendAnimation ? "send-pulse" : ""
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
