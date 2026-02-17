"use client";

import { useState, useEffect } from "react";
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
  const [showNewDM, setShowNewDM] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<MemberResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 8000);
    return () => clearInterval(interval);
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/chat/dm");
      if (res.ok) setConversations(await res.json());
    } catch { /* silent */ }
  };

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
    <div className="min-h-screen pb-20 md:pb-0">
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
          className="w-9 h-9 bg-ewc-burgundy rounded-full flex items-center justify-center text-white hover:bg-ewc-burgundy-hover transition-colors"
        >
          {showNewDM ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {/* New DM search */}
      {showNewDM && (
        <div className="p-4 border-b border-white/10 bg-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ewc-silver/50" />
            <input
              type="text"
              value={search}
              onChange={(e) => searchMembers(e.target.value)}
              placeholder="Search members..."
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-ewc-silver/50 focus:outline-none focus:border-ewc-burgundy"
            />
          </div>
          {searching && (
            <p className="text-ewc-silver text-xs mt-2">Searching...</p>
          )}
          {searchResults.length > 0 && (
            <div className="mt-2 space-y-1">
              {searchResults.map((m) => (
                <button
                  key={m.id}
                  onClick={() => startConversation(m.id)}
                  disabled={starting}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left disabled:opacity-50"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-ewc-burgundy/30 flex items-center justify-center text-white text-xs font-bold">
                      {m.displayName?.charAt(0).toUpperCase()}
                    </div>
                    {m.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-ewc-navy" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{m.displayName}</p>
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
            <p className="text-ewc-silver text-xs mt-2">No members found</p>
          )}
        </div>
      )}

      {/* conversation list */}
      <div className="p-4 md:p-6 space-y-1">
        {conversations.length === 0 ? (
          <div className="text-center py-16">
            <Mail className="w-12 h-12 text-ewc-silver/30 mx-auto mb-3" />
            <p className="text-ewc-silver text-sm">No conversations yet</p>
            <p className="text-ewc-silver/50 text-xs mt-1">
              Start a new DM to chat privately
            </p>
          </div>
        ) : (
          conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/community/dm/${conv.id}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-ewc-burgundy/30 flex items-center justify-center text-white text-sm font-bold">
                  {conv.otherMember.avatar ? (
                    <img
                      src={conv.otherMember.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    conv.otherMember.displayName?.charAt(0).toUpperCase()
                  )}
                </div>
                {conv.otherMember.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-ewc-navy" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white text-sm font-medium truncate">
                    {conv.otherMember.displayName}
                  </h3>
                  {conv.unreadCount > 0 && (
                    <span className="bg-ewc-burgundy text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center flex-shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-ewc-silver text-xs truncate">
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
              {conv.lastMessage && (
                <span className="text-ewc-silver/40 text-[11px] flex-shrink-0">
                  {timeAgo(conv.lastMessage.createdAt)}
                </span>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
