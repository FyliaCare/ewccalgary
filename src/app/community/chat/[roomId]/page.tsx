"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Users,
  MessageCircle,
  Reply,
  Smile,
  X,
  Hash,
  Lock,
  Megaphone,
  ChevronDown,
} from "lucide-react";
import { useCommunity } from "../../layout";

interface Message {
  id: string;
  content: string;
  type: string;
  senderId: string;
  createdAt: string;
  edited: boolean;
  sender: {
    id: string;
    displayName: string;
    avatar: string | null;
    isOnline: boolean;
  };
  replyTo?: {
    id: string;
    content: string;
    sender: { displayName: string };
  };
  reactions: {
    id: string;
    emoji: string;
    memberId: string;
    member: { id: string; displayName: string };
  }[];
}

interface RoomDetail {
  id: string;
  name: string;
  description: string | null;
  type: string;
  members: {
    id: string;
    role: string;
    member: {
      id: string;
      displayName: string;
      avatar: string | null;
      isOnline: boolean;
      lastSeen: string;
    };
  }[];
  _count: { members: number; messages: number };
}

const EMOJIS = ["❤️", "🙏", "🔥", "😂", "👏", "🙌", "💯", "✝️"];

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { member } = useCommunity();
  const roomId = params.roomId as string;

  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showEmojiFor, setShowEmojiFor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [atBottom, setAtBottom] = useState(true);
  const [longPressMsg, setLongPressMsg] = useState<string | null>(null);
  const [sendAnimation, setSendAnimation] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchRoom = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/rooms/${roomId}`);
      if (res.ok) setRoom(await res.json());
      else router.push("/community/chat");
    } catch {
      router.push("/community/chat");
    }
  }, [roomId, router]);

  const fetchMessages = useCallback(async (cursor?: string) => {
    try {
      const url = cursor
        ? `/api/chat/rooms/${roomId}/messages?cursor=${cursor}`
        : `/api/chat/rooms/${roomId}/messages`;
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
          lastMessageIdRef.current = data.messages[data.messages.length - 1].id;
        }
      }
    } catch { /* silent */ }
  }, [roomId]);

  const pollMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/rooms/${roomId}/messages`);
      if (res.ok) {
        const data = await res.json();
        const newMsgs = data.messages as Message[];
        if (newMsgs.length > 0) {
          const latestId = newMsgs[newMsgs.length - 1].id;
          if (latestId !== lastMessageIdRef.current) {
            lastMessageIdRef.current = latestId;
            setMessages(newMsgs);
            if (atBottom) {
              setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
            }
          }
        }
      }
    } catch { /* silent */ }
  }, [roomId, atBottom]);

  useEffect(() => {
    fetchRoom();
    fetchMessages();
  }, [fetchRoom, fetchMessages]);

  useEffect(() => {
    const interval = setInterval(pollMessages, 3000);
    return () => clearInterval(interval);
  }, [pollMessages]);

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
    const container = messagesContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    setAtBottom(scrollHeight - scrollTop - clientHeight < 50);
  };

  const loadMore = async () => {
    if (messages.length === 0 || loadingMore || !hasMore) return;
    setLoadingMore(true);
    await fetchMessages(messages[0].id);
    setLoadingMore(false);
  };

  // Long press handler for mobile reactions
  const handleTouchStart = (msgId: string) => {
    longPressTimer.current = setTimeout(() => {
      setLongPressMsg(msgId);
      setShowEmojiFor(msgId);
      // Haptic feedback (if supported)
      if (navigator.vibrate) navigator.vibrate(30);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    setSending(true);
    setSendAnimation(true);
    setTimeout(() => setSendAnimation(false), 300);

    try {
      const body: Record<string, string> = { content: newMessage.trim() };
      if (replyTo) body.replyToId = replyTo.id;

      const res = await fetch(`/api/chat/rooms/${roomId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const msg = await res.json();
        setMessages((prev) => [...prev, msg]);
        lastMessageIdRef.current = msg.id;
        setNewMessage("");
        setReplyTo(null);
        // Reset textarea height
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

  const toggleReaction = async (messageId: string, emoji: string) => {
    try {
      const res = await fetch("/api/chat/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, emoji }),
      });
      if (res.ok) {
        setShowEmojiFor(null);
        setLongPressMsg(null);
        pollMessages();
      }
    } catch { /* silent */ }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setAtBottom(true);
  };

  const getRoomIcon = () => {
    switch (room?.type) {
      case "announcement": return <Megaphone className="w-4 h-4 text-ewc-burgundy-light" />;
      case "private": return <Lock className="w-4 h-4 text-ewc-silver" />;
      default: return <Hash className="w-4 h-4 text-ewc-silver" />;
    }
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
    const groups: { date: string; messages: Message[] }[] = [];
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

  // Skeleton loading screen
  if (!room) {
    return (
      <div className="h-screen flex flex-col bg-ewc-navy">
        {/* Skeleton header */}
        <div className="bg-ewc-navy-light border-b border-white/10 px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <div className="w-5 h-5 skeleton rounded" />
          <div className="w-9 h-9 skeleton rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="w-24 h-4 skeleton" />
            <div className="w-32 h-3 skeleton" />
          </div>
        </div>
        {/* Skeleton messages */}
        <div className="flex-1 p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`flex gap-3 ${i % 2 === 0 ? "" : "flex-row-reverse"}`}>
              <div className="w-8 h-8 skeleton rounded-full flex-shrink-0" />
              <div className="space-y-1.5" style={{ width: `${40 + Math.random() * 30}%` }}>
                <div className="h-3 skeleton w-16" />
                <div className="h-10 skeleton rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-ewc-navy">
      {/* Header — frosted glass */}
      <div className="bg-ewc-navy-light/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center gap-3 flex-shrink-0 z-10 safe-area-top">
        <Link
          href="/community/chat"
          className="text-ewc-silver hover:text-white press-effect p-1 -ml-1 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
          {getRoomIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-medium text-sm truncate">{room.name}</h2>
          <p className="text-ewc-silver/60 text-xs truncate">
            {room._count.members} members • {room._count.messages} messages
          </p>
        </div>
        <button
          onClick={() => setShowMembers(!showMembers)}
          className="text-ewc-silver hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors press-effect"
        >
          <Users className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Messages area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-0 community-scroll overscroll-contain"
          >
            {/* Load more */}
            {hasMore && (
              <div className="text-center py-3 mb-2">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="text-ewc-burgundy-light text-xs press-effect px-4 py-2 rounded-full bg-white/5 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 border border-ewc-burgundy-light border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </span>
                  ) : "Load earlier messages"}
                </button>
              </div>
            )}

            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center py-16">
                <div className="text-center fade-in-up">
                  <div className="w-16 h-16 rounded-2xl bg-ewc-burgundy/10 flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-8 h-8 text-ewc-burgundy-light/50" />
                  </div>
                  <p className="text-ewc-silver text-sm">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              </div>
            ) : (
              getDateGroups().map((group) => (
                <div key={group.date}>
                  {/* Date separator */}
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
                    const sameSender = prevMsg?.senderId === msg.senderId;
                    const withinMinute = prevMsg &&
                      new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() < 60000;
                    const collapsed = sameSender && withinMinute;

                    return (
                      <div
                        key={msg.id}
                        className={`group flex gap-2.5 ${collapsed ? "mt-0.5" : "mt-3"} ${
                          isOwn ? "flex-row-reverse" : ""
                        } msg-appear`}
                        onTouchStart={() => handleTouchStart(msg.id)}
                        onTouchEnd={handleTouchEnd}
                        onTouchCancel={handleTouchEnd}
                      >
                        {/* Avatar */}
                        {!collapsed ? (
                          <div className="w-8 h-8 rounded-full bg-ewc-burgundy/30 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                            {msg.sender.avatar ? (
                              <img src={msg.sender.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              msg.sender.displayName?.charAt(0).toUpperCase()
                            )}
                          </div>
                        ) : (
                          <div className="w-8 flex-shrink-0" />
                        )}

                        <div className={`max-w-[78%] min-w-0 ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                          {/* Name + time */}
                          {!collapsed && (
                            <div className={`flex items-center gap-2 mb-0.5 ${isOwn ? "flex-row-reverse" : ""}`}>
                              <span className="text-xs font-medium text-ewc-burgundy-light">
                                {msg.sender.displayName}
                              </span>
                              <span className="text-[10px] text-ewc-silver/40">
                                {formatTime(msg.createdAt)}
                              </span>
                            </div>
                          )}

                          {/* Reply preview */}
                          {msg.replyTo && (
                            <div className={`text-[11px] px-2.5 py-1.5 mb-0.5 rounded-lg border-l-2 border-ewc-burgundy/50 bg-white/5 text-ewc-silver/60 ${isOwn ? "ml-auto" : ""}`}>
                              <span className="text-ewc-burgundy-light font-medium">
                                {msg.replyTo.sender.displayName}
                              </span>
                              : {msg.replyTo.content.substring(0, 60)}
                              {msg.replyTo.content.length > 60 ? "..." : ""}
                            </div>
                          )}

                          {/* Message bubble */}
                          <div
                            className={`relative px-3.5 py-2.5 rounded-2xl text-[15px] leading-relaxed break-words ${
                              isOwn
                                ? "bg-ewc-burgundy text-white rounded-br-md"
                                : "bg-white/10 text-white rounded-bl-md"
                            } ${longPressMsg === msg.id ? "ring-2 ring-ewc-burgundy-light/50 scale-[1.02]" : ""} transition-transform duration-150`}
                          >
                            {msg.content}
                            {msg.edited && (
                              <span className="text-[9px] ml-1 opacity-50">(edited)</span>
                            )}

                            {/* Desktop hover actions */}
                            <div className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex gap-0.5 ${isOwn ? "-left-16" : "-right-16"}`}>
                              <button
                                onClick={() => { setReplyTo(msg); textareaRef.current?.focus(); }}
                                className="p-1 rounded bg-white/10 text-ewc-silver hover:text-white"
                                title="Reply"
                              >
                                <Reply className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setShowEmojiFor(showEmojiFor === msg.id ? null : msg.id)}
                                className="p-1 rounded bg-white/10 text-ewc-silver hover:text-white"
                                title="React"
                              >
                                <Smile className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Emoji picker — mobile: shown on long press, desktop: on hover click */}
                          {showEmojiFor === msg.id && (
                            <div className={`flex gap-1.5 mt-1.5 flex-wrap ${isOwn ? "justify-end" : ""} scale-in`}>
                              {EMOJIS.map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => toggleReaction(msg.id, emoji)}
                                  className="text-lg hover:scale-125 active:scale-95 transition-transform p-1 rounded-lg hover:bg-white/10"
                                >
                                  {emoji}
                                </button>
                              ))}
                              {/* Mobile: Reply & Close buttons */}
                              <button
                                onClick={() => {
                                  setReplyTo(msg);
                                  setShowEmojiFor(null);
                                  setLongPressMsg(null);
                                  textareaRef.current?.focus();
                                }}
                                className="p-1.5 rounded-lg bg-white/10 text-ewc-silver hover:text-white md:hidden"
                              >
                                <Reply className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { setShowEmojiFor(null); setLongPressMsg(null); }}
                                className="p-1.5 rounded-lg bg-white/10 text-ewc-silver hover:text-white"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          {/* Reactions */}
                          {msg.reactions.length > 0 && (
                            <div className={`flex gap-1 mt-1 flex-wrap ${isOwn ? "justify-end" : ""}`}>
                              {Object.entries(
                                msg.reactions.reduce((acc: Record<string, { count: number; hasOwn: boolean }>, r) => {
                                  if (!acc[r.emoji]) acc[r.emoji] = { count: 0, hasOwn: false };
                                  acc[r.emoji].count++;
                                  if (r.memberId === member?.id) acc[r.emoji].hasOwn = true;
                                  return acc;
                                }, {})
                              ).map(([emoji, data]) => (
                                <button
                                  key={emoji}
                                  onClick={() => toggleReaction(msg.id, emoji)}
                                  className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs border transition-all active:scale-95 ${
                                    data.hasOwn
                                      ? "bg-ewc-burgundy/20 border-ewc-burgundy/40 text-white"
                                      : "bg-white/5 border-white/10 text-ewc-silver"
                                  }`}
                                >
                                  <span>{emoji}</span>
                                  <span className="text-[10px]">{data.count}</span>
                                </button>
                              ))}
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

          {/* Scroll to bottom FAB */}
          {!atBottom && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-20 right-4 w-10 h-10 bg-ewc-burgundy rounded-full flex items-center justify-center text-white shadow-lg press-effect z-10 scale-in"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          )}

          {/* Reply bar */}
          {replyTo && (
            <div className="px-4 py-2.5 bg-white/5 border-t border-white/10 flex items-center gap-2 slide-in-up">
              <Reply className="w-4 h-4 text-ewc-burgundy flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-ewc-burgundy-light font-medium">{replyTo.sender.displayName}</p>
                <p className="text-xs text-ewc-silver truncate">{replyTo.content}</p>
              </div>
              <button onClick={() => setReplyTo(null)} className="text-ewc-silver hover:text-white press-effect p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input bar — auto-resize textarea */}
          <form
            onSubmit={sendMessage}
            className="px-3 py-2.5 bg-ewc-navy-light/95 backdrop-blur-xl border-t border-white/10 flex items-end gap-2 flex-shrink-0 safe-area-bottom"
          >
            <div className="flex-1 relative">
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

        {/* Members sidebar (desktop) */}
        {showMembers && (
          <div className="hidden md:block w-64 border-l border-white/10 bg-ewc-navy-light overflow-y-auto flex-shrink-0 community-scroll">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium text-sm">Members</h3>
                <button onClick={() => setShowMembers(false)} className="text-ewc-silver hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-3 space-y-1">
              {room.members
                .sort((a, b) => (a.member.isOnline ? -1 : 1) - (b.member.isOnline ? -1 : 1))
                .map((rm) => (
                  <div key={rm.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/5">
                    <div className="relative flex-shrink-0">
                      <div className="w-7 h-7 rounded-full bg-ewc-burgundy/30 flex items-center justify-center text-white text-[11px] font-bold">
                        {rm.member.displayName?.charAt(0).toUpperCase()}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-ewc-navy-light ${
                        rm.member.isOnline ? "bg-green-500" : "bg-ewc-silver/30"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs truncate">{rm.member.displayName}</p>
                      {rm.role !== "member" && (
                        <span className="text-[9px] text-ewc-burgundy-light uppercase font-bold">{rm.role}</span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile members panel (overlay) — slide from right */}
      {showMembers && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 fade-in" onClick={() => setShowMembers(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-ewc-navy-light overflow-y-auto slide-in-right community-scroll">
            <div className="p-4 border-b border-white/10 flex items-center justify-between safe-area-top">
              <h3 className="text-white font-medium text-sm">Members ({room._count.members})</h3>
              <button onClick={() => setShowMembers(false)} className="text-ewc-silver hover:text-white press-effect p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 space-y-0.5">
              {room.members
                .sort((a, b) => (a.member.isOnline ? -1 : 1) - (b.member.isOnline ? -1 : 1))
                .map((rm) => (
                  <div key={rm.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 list-press transition-colors">
                    <div className="relative flex-shrink-0">
                      <div className="w-9 h-9 rounded-full bg-ewc-burgundy/30 flex items-center justify-center text-white text-xs font-bold">
                        {rm.member.displayName?.charAt(0).toUpperCase()}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-ewc-navy-light ${
                        rm.member.isOnline ? "bg-green-500" : "bg-ewc-silver/30"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{rm.member.displayName}</p>
                      <p className="text-ewc-silver/50 text-[11px]">
                        {rm.member.isOnline ? (
                          <span className="text-green-400">Online</span>
                        ) : (
                          `Last seen ${new Date(rm.member.lastSeen).toLocaleDateString()}`
                        )}
                      </p>
                    </div>
                    {rm.role !== "member" && (
                      <span className="text-[10px] bg-ewc-burgundy/20 text-ewc-burgundy-light px-1.5 py-0.5 rounded font-bold uppercase">
                        {rm.role}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
