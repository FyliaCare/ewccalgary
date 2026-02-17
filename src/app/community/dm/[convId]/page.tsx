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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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

  const pollMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/dm/${convId}/messages`);
      if (res.ok) {
        const data = await res.json();
        const msgs = data.messages as DmMessage[];
        if (msgs.length > 0) {
          const latestId = msgs[msgs.length - 1].id;
          if (latestId !== lastMsgIdRef.current) {
            lastMsgIdRef.current = latestId;
            setMessages(msgs);
            if (atBottom) {
              setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
            }
          }
        }
      }
    } catch { /* silent */ }
  }, [convId, atBottom]);

  useEffect(() => {
    fetchConversationInfo();
    fetchMessages();
  }, [fetchConversationInfo, fetchMessages]);

  useEffect(() => {
    const interval = setInterval(pollMessages, 3000);
    return () => clearInterval(interval);
  }, [pollMessages]);

  useEffect(() => {
    if (messages.length > 0 && atBottom) {
      messagesEndRef.current?.scrollIntoView();
    }
  }, [messages.length > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScroll = () => {
    const c = containerRef.current;
    if (!c) return;
    setAtBottom(c.scrollHeight - c.scrollTop - c.clientHeight < 50);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/chat/dm/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage.trim() }),
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages((prev) => [...prev, msg]);
        lastMsgIdRef.current = msg.id;
        setNewMessage("");
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          setAtBottom(true);
        }, 50);
      }
    } catch { /* silent */ }
    setSending(false);
    inputRef.current?.focus();
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
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-ewc-navy-light border-b border-white/10 px-4 py-3 flex items-center gap-3 flex-shrink-0 z-10">
        <Link
          href="/community/dm"
          className="text-ewc-silver hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-ewc-burgundy/30 flex items-center justify-center text-white text-xs font-bold">
            {otherMember?.avatar ? (
              <img
                src={otherMember.avatar}
                alt=""
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              otherMember?.displayName?.charAt(0).toUpperCase() || "?"
            )}
          </div>
          {otherMember?.isOnline && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-ewc-navy-light" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-medium text-sm truncate">
            {otherMember?.displayName || "Loading..."}
          </h2>
          <p className="text-ewc-silver/50 text-xs">
            {otherMember?.isOnline ? (
              <span className="text-green-400">Online</span>
            ) : (
              "Offline"
            )}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4"
      >
        {hasMore && (
          <div className="text-center py-2 mb-2">
            <button
              onClick={() => messages.length > 0 && fetchMessages(messages[0].id)}
              className="text-ewc-burgundy-light text-xs hover:underline"
            >
              Load earlier messages
            </button>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-ewc-burgundy/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">👋</span>
              </div>
              <p className="text-ewc-silver text-sm">
                Say hello to {otherMember?.displayName?.split(" ")[0] || "them"}!
              </p>
            </div>
          </div>
        ) : (
          getDateGroups().map((group) => (
            <div key={group.date}>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-ewc-silver/50 text-[11px] font-medium uppercase">
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
                    }`}
                  >
                    <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                      {!collapsed && !isOwn && (
                        <span className="text-[10px] text-ewc-silver/40 mb-0.5 ml-1">
                          {formatTime(msg.createdAt)}
                        </span>
                      )}
                      <div
                        className={`px-3 py-2 rounded-2xl text-sm break-words ${
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
          className="absolute bottom-24 md:bottom-20 right-6 w-9 h-9 bg-ewc-burgundy rounded-full flex items-center justify-center text-white shadow-lg"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="px-4 py-3 bg-ewc-navy-light border-t border-white/10 flex items-center gap-2 flex-shrink-0 mb-14 md:mb-0"
      >
        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-white text-sm placeholder:text-ewc-silver/50 focus:outline-none focus:border-ewc-burgundy transition-colors"
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || sending}
          className="w-10 h-10 bg-ewc-burgundy rounded-full flex items-center justify-center text-white hover:bg-ewc-burgundy-hover transition-colors disabled:opacity-40 flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
