"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Plus, Search, X, MessageCircle } from "lucide-react";
import { useCommunity } from "../layout";

interface DmConversation {
  id: string;
  otherMember: {
    id: string;
    displayName: string;
    avatar: string | null;
    isOnline: boolean;
  };
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: string;
  };
  unreadCount: number;
  updatedAt: string;
}

interface MemberResult {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  isOnline: boolean;
}

export default function DMListPage() {
  const { member } = useCommunity();
  const router = useRouter();
  const [conversations, setConversations] = useState<DmConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewDM, setShowNewDM] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<MemberResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [starting, setStarting] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/dm");
      if (res.ok) setConversations(await res.json());
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 8000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  const searchMembers = async (q: string) => {
    setSearch(q);
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/chat/members?search=${encodeURIComponent(q)}`);
      if (res.ok) {
        const members = await res.json();
        setSearchResults(members.filter((m: MemberResult) => m.id !== member?.id));
      }
    } catch { /* silent */ }
    setSearching(false);
  };

  const startConversation = async (otherMemberId: string) => {
    setStarting(true);
    try {
      const res = await fetch("/api/chat/dm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otherMemberId }),
      });
      if (res.ok) {
        const conv = await res.json();
        router.push(`/community/dm/${conv.id}`);
      }
    } catch { /* silent */ }
    setStarting(false);
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `${days}d`;
  };

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Direct Messages
          </h1>
          <p className="text-ewc-silver text-sm mt-0.5">
            {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowNewDM(!showNewDM)}
          className="w-10 h-10 bg-ewc-burgundy rounded-xl flex items-center justify-center text-white hover:bg-ewc-burgundy-hover transition-colors press-effect shadow-lg shadow-ewc-burgundy/20"
        >
          {showNewDM ? <X className="w-4 h-4" /> : <Plus className="w-5 h-5" />}
        </button>
      </div>

      {/* New DM search — slide down */}
      {showNewDM && (
        <div className="p-4 border-b border-white/10 bg-white/5 scale-in">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ewc-silver/50" />
            <input
              type="text"
              value={search}
              onChange={(e) => searchMembers(e.target.value)}
              placeholder="Search members..."
              autoFocus
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] placeholder:text-ewc-silver/50 focus:outline-none focus:border-ewc-burgundy transition-colors"
            />
          </div>
          {searching && (
            <div className="flex items-center gap-2 mt-3">
              <div className="w-4 h-4 border-2 border-ewc-burgundy border-t-transparent rounded-full animate-spin" />
              <p className="text-ewc-silver text-xs">Searching...</p>
            </div>
          )}
          {searchResults.length > 0 && (
            <div className="mt-3 space-y-0.5">
              {searchResults.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => startConversation(m.id)}
                  disabled={starting}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-left disabled:opacity-50 press-effect list-press fade-in-up"
                  style={{ animationDelay: `${idx * 40}ms`, animationFillMode: "both" }}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-ewc-burgundy/30 flex items-center justify-center text-white text-xs font-bold">
                      {m.displayName?.charAt(0).toUpperCase()}
                    </div>
                    {m.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-ewc-navy" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{m.displayName}</p>
                    <p className="text-ewc-silver/50 text-xs">
                      {m.firstName} {m.lastName}
                    </p>
                  </div>
                  <MessageCircle className="w-4 h-4 text-ewc-burgundy-light flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
          {search.length >= 2 && searchResults.length === 0 && !searching && (
            <p className="text-ewc-silver/60 text-xs mt-3">No members found</p>
          )}
        </div>
      )}

      {/* Conversation list */}
      <div className="p-3 md:p-6">
        {/* Skeleton loading */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3.5 p-3.5 rounded-xl">
                <div className="w-12 h-12 skeleton rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-28 h-4 skeleton rounded" />
                  <div className="w-44 h-3 skeleton rounded" />
                </div>
                <div className="w-8 h-3 skeleton rounded flex-shrink-0" />
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-20 fade-in">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-ewc-silver/30" />
            </div>
            <p className="text-ewc-silver text-sm font-medium">No conversations yet</p>
            <p className="text-ewc-silver/50 text-xs mt-1">
              Start a new DM to chat privately
            </p>
            <button
              onClick={() => setShowNewDM(true)}
              className="mt-4 px-5 py-2.5 bg-ewc-burgundy text-white text-sm font-semibold rounded-xl press-effect hover:bg-ewc-burgundy-hover transition-colors"
            >
              New Message
            </button>
          </div>
        ) : (
          <div className="space-y-0.5">
            {conversations.map((conv, idx) => (
              <Link
                key={conv.id}
                href={`/community/dm/${conv.id}`}
                className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-white/5 transition-all press-effect list-press fade-in-up"
                style={{ animationDelay: `${idx * 50}ms`, animationFillMode: "both" }}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-ewc-burgundy/30 flex items-center justify-center text-white text-sm font-bold">
                    {conv.otherMember.avatar ? (
                      <img
                        src={conv.otherMember.avatar}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      conv.otherMember.displayName?.charAt(0).toUpperCase()
                    )}
                  </div>
                  {conv.otherMember.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-[2.5px] border-ewc-navy" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-[15px] truncate ${
                      conv.unreadCount > 0 ? "text-white font-semibold" : "text-white font-medium"
                    }`}>
                      {conv.otherMember.displayName}
                    </h3>
                    {conv.unreadCount > 0 && (
                      <span className="bg-ewc-burgundy text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center flex-shrink-0 badge-pulse">
                        {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${
                    conv.unreadCount > 0 ? "text-ewc-silver" : "text-ewc-silver/60"
                  }`}>
                    {conv.lastMessage ? (
                      <>
                        {conv.lastMessage.senderId === member?.id ? "You: " : ""}
                        {conv.lastMessage.content}
                      </>
                    ) : (
                      "No messages yet"
                    )}
                  </p>
                </div>

                {/* Timestamp */}
                {conv.lastMessage && (
                  <span className="text-ewc-silver/40 text-[11px] flex-shrink-0">
                    {timeAgo(conv.lastMessage.createdAt)}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
