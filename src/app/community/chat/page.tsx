"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Users } from "lucide-react";

export default function ChatRoomsListPage() {
  const [rooms, setRooms] = useState<{
    id: string;
    name: string;
    description: string | null;
    type: string;
    unreadCount: number;
    _count: { members: number; messages: number };
    lastMessage?: {
      content: string;
      sender: { displayName: string };
      createdAt: string;
    };
  }[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("/api/chat/rooms");
        if (res.ok) setRooms(await res.json());
      } catch { /* silent */ }
    };
    fetchRooms();
    const i = setInterval(fetchRooms, 8000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="p-4 md:p-6 border-b border-white/10">
        <h1 className="text-xl font-heading font-bold text-white">Chat Rooms</h1>
        <p className="text-ewc-silver text-sm mt-0.5">
          {rooms.length} room{rooms.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="p-4 md:p-6 space-y-1">
        {rooms.length === 0 ? (
          <div className="text-center py-16">
            <MessageCircle className="w-12 h-12 text-ewc-silver/30 mx-auto mb-3" />
            <p className="text-ewc-silver text-sm">No rooms available</p>
          </div>
        ) : (
          rooms.map((room) => (
            <Link
              key={room.id}
              href={`/community/chat/${room.id}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-ewc-burgundy/20 flex items-center justify-center text-ewc-burgundy-light font-bold text-sm flex-shrink-0">
                {room.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white text-sm font-medium truncate">
                    {room.name}
                  </h3>
                  {room.unreadCount > 0 && (
                    <span className="bg-ewc-burgundy text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-ewc-silver text-xs truncate">
                  {room.lastMessage
                    ? `${room.lastMessage.sender.displayName}: ${room.lastMessage.content}`
                    : room.description || "No messages yet"}
                </p>
              </div>
              <div className="flex items-center gap-1 text-ewc-silver/50 text-xs flex-shrink-0">
                <Users className="w-3 h-3" />
                {room._count.members}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
