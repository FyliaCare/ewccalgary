"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchRooms();
    fetchOnlineMembers();
    const interval = setInterval(fetchRooms, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/chat/rooms");
      if (res.ok) setRooms(await res.json());
    } catch { /* silent */ }
  };

  const fetchOnlineMembers = async () => {
    try {
      const res = await fetch("/api/chat/members?search=");
      if (res.ok) {
        const members = await res.json();
        setOnlineMembers(members.filter((m: OnlineMember) => m.isOnline).slice(0, 12));
      }
    } catch { /* silent */ }
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

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-ewc-burgundy-dark to-ewc-burgundy p-6 md:p-8">
        <h1 className="text-xl md:text-2xl font-heading font-bold text-white">
          Welcome, {member?.displayName?.split(" ")[0]}! 👋
        </h1>
        <p className="text-white/70 text-sm mt-1">
          Stay connected with your church family
        </p>

        {/* Quick stats */}
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
            <MessageCircle className="w-4 h-4 text-white/80" />
            <span className="text-white text-sm font-medium">{rooms.length} Rooms</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-white text-sm font-medium">{onlineMembers.length} Online</span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Online members */}
        {onlineMembers.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-heading font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Online Now
              </h2>
              <Link
                href="/community/members"
                className="text-ewc-burgundy-light text-xs hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {onlineMembers.map((m) => (
                <Link
                  key={m.id}
                  href={`/community/members`}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0"
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-ewc-burgundy/30 flex items-center justify-center text-white font-bold text-sm">
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
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-ewc-navy rounded-full" />
                  </div>
                  <span className="text-ewc-silver text-[11px] max-w-[60px] truncate">
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
          className="w-full flex items-center gap-3 p-3 bg-ewc-burgundy/10 border border-ewc-burgundy/20 rounded-lg text-ewc-burgundy-light hover:bg-ewc-burgundy/20 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">Create New Room</span>
        </button>

        {/* Create room form */}
        {showCreateRoom && (
          <form
            onSubmit={createRoom}
            className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3"
          >
            <input
              type="text"
              placeholder="Room name"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              required
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-ewc-silver/50 focus:outline-none focus:border-ewc-burgundy"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newRoom.description}
              onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-ewc-silver/50 focus:outline-none focus:border-ewc-burgundy"
            />
            <select
              value={newRoom.type}
              onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-ewc-burgundy"
            >
              <option value="public" className="bg-ewc-navy">Public</option>
              <option value="private" className="bg-ewc-navy">Private</option>
              <option value="announcement" className="bg-ewc-navy">Announcement</option>
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={creating}
                className="flex-1 py-2.5 bg-ewc-burgundy text-white text-sm font-semibold rounded-lg hover:bg-ewc-burgundy-hover transition-colors disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Room"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateRoom(false)}
                className="px-4 py-2.5 bg-white/5 text-ewc-silver text-sm rounded-lg hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Pinned rooms */}
        {pinnedRooms.length > 0 && (
          <div>
            <h2 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-3">
              📌 Pinned Rooms
            </h2>
            <div className="space-y-1">
              {pinnedRooms.map((room) => (
                <RoomCard key={room.id} room={room} timeAgo={timeAgo} getRoomIcon={getRoomIcon} />
              ))}
            </div>
          </div>
        )}

        {/* All rooms */}
        <div>
          <h2 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Chat Rooms
          </h2>
          {otherRooms.length === 0 && pinnedRooms.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-ewc-silver/30 mx-auto mb-3" />
              <p className="text-ewc-silver text-sm">
                No chat rooms yet. Create one to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-1">
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
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
    >
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
        {getRoomIcon(room.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-white text-sm font-medium truncate">{room.name}</h3>
          {room.unreadCount > 0 && (
            <span className="bg-ewc-burgundy text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center flex-shrink-0">
              {room.unreadCount > 99 ? "99+" : room.unreadCount}
            </span>
          )}
        </div>
        <p className="text-ewc-silver text-xs truncate">
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
      <ChevronRight className="w-4 h-4 text-ewc-silver/30 group-hover:text-ewc-silver transition-colors flex-shrink-0" />
    </Link>
  );
}
