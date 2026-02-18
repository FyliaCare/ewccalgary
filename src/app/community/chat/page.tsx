"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MessageCircle, Users, Hash, Lock } from "lucide-react";
import { timeAgo } from "@/lib/validation";

export default function ChatRoomsListPage() {
  const [rooms, setRooms] = useState<{
    id: string;
    name: string;
    description: string | null;
    type: string;
    unread: number;
    _count: { members: number; messages: number };
    lastMessage?: {
      content: string;
      sender: { displayName: string };
      createdAt: string;
    };
  }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/rooms");
      if (res.ok) setRooms(await res.json());
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRooms();
    const i = setInterval(fetchRooms, 8000);
    return () => clearInterval(i);
  }, [fetchRooms]);



  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-white/10">
        <h1 className="text-xl font-heading font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Chat Rooms
        </h1>
        <p className="text-ewc-silver text-sm mt-0.5">
          {rooms.length} room{rooms.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="p-3 md:p-6">
        {/* Skeleton loading */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl">
                <div className="w-12 h-12 skeleton rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-32 h-4 skeleton rounded" />
                  <div className="w-48 h-3 skeleton rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20 fade-in">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-ewc-silver/30" />
            </div>
            <p className="text-ewc-silver text-sm font-medium">No rooms available</p>
            <p className="text-ewc-silver/50 text-xs mt-1">Check back later for new rooms</p>
          </div>
        ) : (
          <div className="space-y-1">
            {rooms.map((room, idx) => (
              <Link
                key={room.id}
                href={`/community/chat/${room.id}`}
                className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-white/5 transition-all press-effect list-press fade-in-up"
                style={{ animationDelay: `${idx * 50}ms`, animationFillMode: "both" }}
              >
                {/* Room icon */}
                <div className="w-12 h-12 rounded-xl bg-ewc-burgundy/20 flex items-center justify-center text-ewc-burgundy-light font-bold text-base flex-shrink-0">
                  {room.type === "private" ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    room.name.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Room info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5 text-ewc-silver/50 flex-shrink-0" />
                    <h3 className="text-white text-[15px] font-medium truncate">
                      {room.name}
                    </h3>
                    {room.unread > 0 && (
                      <span className="bg-ewc-burgundy text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center flex-shrink-0 badge-pulse">
                        {room.unread > 99 ? "99+" : room.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-ewc-silver/70 text-xs truncate mt-0.5">
                    {room.lastMessage
                      ? `${room.lastMessage.sender.displayName}: ${room.lastMessage.content}`
                      : room.description || "No messages yet"}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {room.lastMessage && (
                    <span className="text-ewc-silver/40 text-[11px]">
                      {timeAgo(room.lastMessage.createdAt)}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-ewc-silver/40 text-[11px]">
                    <Users className="w-3 h-3" />
                    {room._count.members}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
