"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Users,
  Hash,
  Lock,
  Megaphone,
  Plus,
  TrendingUp,
  Wifi,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useCommunity } from "./layout";

interface Room {
  id: string;
  name: string;
  description: string | null;
  type: "public" | "private" | "announcement";
  icon: string | null;
  pinned: boolean;
  unreadCount: number;
  _count: { members: number; messages: number };
  lastMessage?: {
    content: string;
    sender: { displayName: string };
    createdAt: string;
  };
}

interface OnlineMember {
  id: string;
  displayName: string;
  avatar: string | null;
  isOnline: boolean;
}

export default function CommunityHubPage() {
  const { member } = useCommunity();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [onlineMembers, setOnlineMembers] = useState<OnlineMember[]>([]);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: "", description: "", type: "public" });
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/rooms");
      if (res.ok) setRooms(await res.json());
    } catch { /* silent */ }
  }, []);

  const fetchOnlineMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/members?search=");
      if (res.ok) {
        const members = await res.json();
        setOnlineMembers(members.filter((m: OnlineMember) => m.isOnline).slice(0, 12));
      }
    } catch { /* silent */ }
  }, []);

  const loadData = useCallback(async () => {
    await Promise.all([fetchRooms(), fetchOnlineMembers()]);
    setLoading(false);
  }, [fetchRooms, fetchOnlineMembers]);

  useEffect(() => {
    loadData();
    const interval = setInterval(fetchRooms, 10000);
    return () => clearInterval(interval);
  }, [loadData, fetchRooms]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setTimeout(() => setRefreshing(false), 500);
  };

  const createRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/chat/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom),
      });
      if (res.ok) {
        setNewRoom({ name: "", description: "", type: "public" });
        setShowCreateRoom(false);
        fetchRooms();
      }
    } catch { /* silent */ }
    setCreating(false);
  };

  const getRoomIcon = (type: string) => {
    switch (type) {
      case "announcement": return <Megaphone className="w-4 h-4 text-ewc-burgundy" />;
      case "private": return <Lock className="w-4 h-4 text-ewc-silver" />;
      default: return <Hash className="w-4 h-4 text-ewc-silver" />;
    }
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

  const pinnedRooms = rooms.filter((r) => r.pinned);
  const otherRooms = rooms.filter((r) => !r.pinned);

  // Skeleton loading
  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Skeleton header */}
        <div className="bg-gradient-to-r from-ewc-burgundy-dark to-ewc-burgundy p-6">
          <div className="w-48 h-6 skeleton rounded mb-2" />
          <div className="w-64 h-4 skeleton rounded" />
          <div className="flex gap-4 mt-4">
            <div className="w-28 h-9 skeleton rounded-lg" />
            <div className="w-28 h-9 skeleton rounded-lg" />
          </div>
        </div>
        <div className="p-4 space-y-4">
          {/* Skeleton online members */}
          <div className="flex gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 skeleton rounded-full" />
                <div className="w-10 h-3 skeleton" />
              </div>
            ))}
          </div>
          {/* Skeleton rooms */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <div className="w-10 h-10 skeleton rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="w-32 h-4 skeleton" />
                <div className="w-48 h-3 skeleton" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-ewc-burgundy-dark to-ewc-burgundy p-6 md:p-8 fade-in">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-heading font-bold text-white">
              Welcome, {member?.displayName?.split(" ")[0]}! 👋
            </h1>
            <p className="text-white/70 text-sm mt-1">
              Stay connected with your church family
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className={`text-white/60 p-2 rounded-xl hover:bg-white/10 press-effect transition-all ${
              refreshing ? "animate-spin" : ""
            }`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Quick stats */}
        <div className="flex gap-3 mt-4">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 press-effect">
            <MessageCircle className="w-4 h-4 text-white/80" />
            <span className="text-white text-sm font-medium">{rooms.length} Rooms</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 press-effect">
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-white text-sm font-medium">{onlineMembers.length} Online</span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Online members — horizontal scroll */}
        {onlineMembers.length > 0 && (
          <div className="fade-in-up">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-heading font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Online Now
              </h2>
              <Link href="/community/members" className="text-ewc-burgundy-light text-xs press-effect px-2 py-1 rounded-lg">
                View All
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
              {onlineMembers.map((m) => (
                <Link
                  key={m.id}
                  href="/community/members"
                  className="flex flex-col items-center gap-1.5 flex-shrink-0 press-effect"
                >
                  <div className="relative">
                    <div className="w-13 h-13 rounded-full bg-ewc-burgundy/30 flex items-center justify-center text-white font-bold text-sm" style={{ width: 52, height: 52 }}>
                      {m.avatar ? (
                        <img src={m.avatar} alt={m.displayName} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        m.displayName?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-ewc-navy rounded-full" />
                  </div>
                  <span className="text-ewc-silver text-[11px] max-w-[60px] truncate text-center">
                    {m.displayName?.split(" ")[0]}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Create room button */}
        <button
          onClick={() => setShowCreateRoom(!showCreateRoom)}
          className="w-full flex items-center gap-3 p-3.5 bg-ewc-burgundy/10 border border-ewc-burgundy/20 rounded-xl text-ewc-burgundy-light hover:bg-ewc-burgundy/20 transition-colors press-effect"
        >
          <div className="w-9 h-9 rounded-xl bg-ewc-burgundy/20 flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium">Create New Room</span>
        </button>

        {/* Create room form */}
        {showCreateRoom && (
          <form
            onSubmit={createRoom}
            className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 scale-in"
          >
            <input
              type="text"
              placeholder="Room name"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-ewc-silver/50 focus:outline-none focus:border-ewc-burgundy transition-colors"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newRoom.description}
              onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-ewc-silver/50 focus:outline-none focus:border-ewc-burgundy transition-colors"
            />
            <select
              value={newRoom.type}
              onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-ewc-burgundy"
            >
              <option value="public" className="bg-ewc-navy">Public</option>
              <option value="private" className="bg-ewc-navy">Private</option>
              <option value="announcement" className="bg-ewc-navy">Announcement</option>
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={creating}
                className="flex-1 py-3 bg-ewc-burgundy text-white text-sm font-semibold rounded-xl hover:bg-ewc-burgundy-hover transition-colors disabled:opacity-50 press-effect"
              >
                {creating ? "Creating..." : "Create Room"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateRoom(false)}
                className="px-4 py-3 bg-white/5 text-ewc-silver text-sm rounded-xl hover:text-white transition-colors press-effect"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Pinned rooms */}
        {pinnedRooms.length > 0 && (
          <div className="fade-in-up">
            <h2 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-3">
              📌 Pinned Rooms
            </h2>
            <div className="space-y-0.5">
              {pinnedRooms.map((room) => (
                <RoomCard key={room.id} room={room} timeAgo={timeAgo} getRoomIcon={getRoomIcon} />
              ))}
            </div>
          </div>
        )}

        {/* All rooms */}
        <div className="fade-in-up">
          <h2 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Chat Rooms
          </h2>
          {otherRooms.length === 0 && pinnedRooms.length === 0 ? (
            <div className="text-center py-12 fade-in">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-8 h-8 text-ewc-silver/30" />
              </div>
              <p className="text-ewc-silver text-sm">
                No chat rooms yet. Create one to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {otherRooms.map((room) => (
                <RoomCard key={room.id} room={room} timeAgo={timeAgo} getRoomIcon={getRoomIcon} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RoomCard({
  room,
  timeAgo,
  getRoomIcon,
}: {
  room: Room;
  timeAgo: (d: string) => string;
  getRoomIcon: (t: string) => React.ReactNode;
}) {
  return (
    <Link
      href={`/community/chat/${room.id}`}
      className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-white/5 transition-all list-press group"
    >
      <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
        {getRoomIcon(room.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-white text-[15px] font-medium truncate">{room.name}</h3>
          {room.unreadCount > 0 && (
            <span className="bg-ewc-burgundy text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center flex-shrink-0 badge-pulse">
              {room.unreadCount > 99 ? "99+" : room.unreadCount}
            </span>
          )}
        </div>
        <p className="text-ewc-silver text-xs truncate mt-0.5">
          {room.lastMessage ? (
            <>
              <span className="text-ewc-silver/80">{room.lastMessage.sender.displayName}:</span>{" "}
              {room.lastMessage.content}
            </>
          ) : (
            room.description || "No messages yet"
          )}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {room.lastMessage && (
          <span className="text-ewc-silver/50 text-[11px]">
            {timeAgo(room.lastMessage.createdAt)}
          </span>
        )}
        <div className="flex items-center gap-1 text-ewc-silver/40 text-[11px]">
          <Users className="w-3 h-3" />
          {room._count.members}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-ewc-silver/20 group-hover:text-ewc-silver/40 transition-colors flex-shrink-0" />
    </Link>
  );
}
