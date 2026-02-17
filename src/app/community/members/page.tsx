"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async (query?: string) => {
    try {
      const res = await fetch(
        `/api/chat/members?search=${encodeURIComponent(query || "")}`
      );
      if (res.ok) setMembers(await res.json());
    } catch { /* silent */ }
    setLoading(false);
  };

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
    <div className="min-h-screen pb-20 md:pb-0">
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ewc-silver/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-ewc-silver/50 focus:outline-none focus:border-ewc-burgundy"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-ewc-burgundy border-t-transparent rounded-full animate-spin" />
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-ewc-silver/30 mx-auto mb-3" />
          <p className="text-ewc-silver text-sm">No members found</p>
        </div>
      ) : (
        <div className="px-4 md:px-6 space-y-6 pb-6">
          {/* Online members */}
          {onlineMembers.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Wifi className="w-3 h-3" />
                Online — {onlineMembers.length}
              </h2>
              <div className="space-y-1">
                {onlineMembers.map((m) => (
                  <MemberCard
                    key={m.id}
                    member={m}
                    isMe={m.id === member?.id}
                    starting={starting === m.id}
                    onDM={() => startDM(m.id)}
                    timeAgo={timeAgo}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Offline members */}
          {offlineMembers.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-ewc-silver/60 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <WifiOff className="w-3 h-3" />
                Offline — {offlineMembers.length}
              </h2>
              <div className="space-y-1">
                {offlineMembers.map((m) => (
                  <MemberCard
                    key={m.id}
                    member={m}
                    isMe={m.id === member?.id}
                    starting={starting === m.id}
                    onDM={() => startDM(m.id)}
                    timeAgo={timeAgo}
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
}: {
  member: MemberInfo;
  isMe: boolean;
  starting: boolean;
  onDM: () => void;
  timeAgo: (d: string) => string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-ewc-burgundy/30 flex items-center justify-center text-white text-sm font-bold">
          {m.avatar ? (
            <img
              src={m.avatar}
              alt={m.displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            m.displayName?.charAt(0).toUpperCase()
          )}
        </div>
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-ewc-navy ${
            m.isOnline ? "bg-green-500" : "bg-ewc-silver/30"
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-white text-sm font-medium truncate">
            {m.displayName}
          </p>
          {isMe && (
            <span className="text-[10px] bg-ewc-burgundy/20 text-ewc-burgundy-light px-1.5 py-0.5 rounded font-bold">
              You
            </span>
          )}
        </div>
        <p className="text-ewc-silver/60 text-xs truncate">
          {m.bio || (m.isOnline ? "Online" : `Last seen ${timeAgo(m.lastSeen)}`)}
        </p>
      </div>
      {!isMe && (
        <button
          onClick={onDM}
          disabled={starting}
          className="px-3 py-1.5 bg-ewc-burgundy/10 text-ewc-burgundy-light text-xs font-medium rounded-lg hover:bg-ewc-burgundy/20 transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          <MessageCircle className="w-3 h-3" />
          Message
        </button>
      )}
    </div>
  );
}
