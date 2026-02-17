"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  MessageCircle,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useCommunity } from "../layout";

interface MemberInfo {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  bio: string | null;
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
}

export default function MembersDirectoryPage() {
  const { member } = useCommunity();
  const router = useRouter();
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState<string | null>(null);

  const fetchMembers = useCallback(async (query?: string) => {
    try {
      const res = await fetch(
        `/api/chat/members?search=${encodeURIComponent(query || "")}`
      );
      if (res.ok) setMembers(await res.json());
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleSearch = (q: string) => {
    setSearch(q);
    fetchMembers(q);
  };

  const startDM = async (otherMemberId: string) => {
    if (otherMemberId === member?.id) return;
    setStarting(otherMemberId);
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
    setStarting(null);
  };

  const onlineMembers = members.filter((m) => m.isOnline);
  const offlineMembers = members.filter((m) => !m.isOnline);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-white/10">
        <h1 className="text-xl font-heading font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5" />
          Members
        </h1>
        <p className="text-ewc-silver text-sm mt-0.5">
          {members.length} member{members.length !== 1 ? "s" : ""} •{" "}
          {onlineMembers.length} online
        </p>
      </div>

      {/* Search */}
      <div className="p-4 md:px-6">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ewc-silver/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] placeholder:text-ewc-silver/50 focus:outline-none focus:border-ewc-burgundy transition-colors"
          />
        </div>
      </div>

      {/* Skeleton loading */}
      {loading ? (
        <div className="px-4 md:px-6 space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-3.5 p-3.5 rounded-xl">
              <div className="w-12 h-12 skeleton rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="w-28 h-4 skeleton rounded" />
                <div className="w-40 h-3 skeleton rounded" />
              </div>
              <div className="w-20 h-8 skeleton rounded-xl flex-shrink-0" />
            </div>
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-20 fade-in">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-ewc-silver/30" />
          </div>
          <p className="text-ewc-silver text-sm font-medium">No members found</p>
        </div>
      ) : (
        <div className="px-3 md:px-6 space-y-6 pb-6">
          {/* Online members */}
          {onlineMembers.length > 0 && (
            <div className="fade-in">
              <h2 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1">
                <Wifi className="w-3 h-3" />
                Online — {onlineMembers.length}
              </h2>
              <div className="space-y-0.5">
                {onlineMembers.map((m, idx) => (
                  <MemberCard
                    key={m.id}
                    member={m}
                    isMe={m.id === member?.id}
                    starting={starting === m.id}
                    onDM={() => startDM(m.id)}
                    timeAgo={timeAgo}
                    delay={idx * 40}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Offline members */}
          {offlineMembers.length > 0 && (
            <div className="fade-in">
              <h2 className="text-xs font-bold text-ewc-silver/60 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1">
                <WifiOff className="w-3 h-3" />
                Offline — {offlineMembers.length}
              </h2>
              <div className="space-y-0.5">
                {offlineMembers.map((m, idx) => (
                  <MemberCard
                    key={m.id}
                    member={m}
                    isMe={m.id === member?.id}
                    starting={starting === m.id}
                    onDM={() => startDM(m.id)}
                    timeAgo={timeAgo}
                    delay={idx * 40}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MemberCard({
  member: m,
  isMe,
  starting,
  onDM,
  timeAgo,
  delay,
}: {
  member: MemberInfo;
  isMe: boolean;
  starting: boolean;
  onDM: () => void;
  timeAgo: (d: string) => string;
  delay: number;
}) {
  return (
    <div
      className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-white/5 transition-all list-press fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-ewc-burgundy/30 flex items-center justify-center text-white text-sm font-bold">
          {m.avatar ? (
            <img
              src={m.avatar}
              alt={m.displayName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            m.displayName?.charAt(0).toUpperCase()
          )}
        </div>
        <div
          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-[2.5px] border-ewc-navy ${
            m.isOnline ? "bg-green-500" : "bg-ewc-silver/30"
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-white text-[15px] font-medium truncate">
            {m.displayName}
          </p>
          {isMe && (
            <span className="text-[10px] bg-ewc-burgundy/20 text-ewc-burgundy-light px-1.5 py-0.5 rounded-full font-bold">
              You
            </span>
          )}
        </div>
        <p className="text-ewc-silver/60 text-xs truncate mt-0.5">
          {m.bio || (m.isOnline ? "Online" : `Last seen ${timeAgo(m.lastSeen)}`)}
        </p>
      </div>
      {!isMe && (
        <button
          onClick={onDM}
          disabled={starting}
          className="px-3.5 py-2 bg-ewc-burgundy/10 text-ewc-burgundy-light text-xs font-semibold rounded-xl hover:bg-ewc-burgundy/20 transition-colors disabled:opacity-50 flex items-center gap-1.5 press-effect"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Message
        </button>
      )}
    </div>
  );
}
