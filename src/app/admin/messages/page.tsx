"use client";

import { useState, useEffect } from "react";
import { Mail, Trash2, Eye, ExternalLink, Loader2, Inbox, CheckCircle } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/contact");
        if (res.ok) setMessages(await res.json());
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/contact/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: true }) });
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await fetch(`/api/contact/${id}`, { method: "DELETE" });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedId === id) setSelectedId(null);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleSelect = (msg: Message) => {
    setSelectedId(msg.id);
    if (!msg.read) markAsRead(msg.id);
  };

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.read;
    if (filter === "read") return m.read;
    return true;
  });

  const selected = messages.find((m) => m.id === selectedId);
  const unreadCount = messages.filter((m) => !m.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-ewc-burgundy" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">Messages</h1>
          <p className="text-ewc-gray text-sm mt-1">
            {messages.length} total &middot; {unreadCount} unread
          </p>
        </div>
        <div className="flex gap-2 text-xs font-heading">
          {(["all", "unread", "read"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md capitalize transition-colors ${filter === f ? "bg-ewc-burgundy text-ewc-black" : "bg-ewc-dark text-ewc-gray hover:text-white"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="card-dark p-12 text-center">
          <Inbox size={48} className="text-ewc-gray mx-auto mb-4" />
          <p className="text-ewc-gray">No messages yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message list */}
          <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <div className="card-dark p-8 text-center text-ewc-gray text-sm">
                No {filter} messages.
              </div>
            ) : (
              filtered.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => handleSelect(msg)}
                  className={`w-full text-left card-dark p-4 transition-all ${selectedId === msg.id ? "ring-1 ring-ewc-burgundy" : "hover:bg-ewc-dark/50"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-ewc-burgundy flex-shrink-0" />}
                    <span className={`font-heading font-bold text-sm truncate ${!msg.read ? "text-white" : "text-ewc-gray"}`}>
                      {msg.name}
                    </span>
                  </div>
                  <p className="text-ewc-cream/80 text-xs font-semibold truncate">{msg.subject}</p>
                  <p className="text-ewc-gray text-xs truncate mt-1">{msg.message}</p>
                  <p className="text-ewc-gray/50 text-[10px] mt-2">{new Date(msg.createdAt).toLocaleDateString()}</p>
                </button>
              ))
            )}
          </div>

          {/* Detail view */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="card-dark p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-heading font-bold text-lg text-white">{selected.subject}</h2>
                    <p className="text-ewc-gray text-sm mt-1">
                      From <span className="text-ewc-cream">{selected.name}</span> &middot; {new Date(selected.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {!selected.read && (
                      <span className="text-[10px] bg-ewc-burgundy/20 text-ewc-burgundy px-2 py-0.5 rounded-full font-heading">Unread</span>
                    )}
                    {selected.read && (
                      <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-heading flex items-center gap-1">
                        <CheckCircle size={10} /> Read
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 text-xs text-ewc-gray border-b border-ewc-dark pb-4">
                  <span className="flex items-center gap-1"><Mail size={12} /> {selected.email}</span>
                  {selected.phone && <span>{selected.phone}</span>}
                </div>

                <div className="text-ewc-cream/80 text-sm leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-ewc-dark">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    className="btn-burgundy px-4 py-2 text-sm flex items-center gap-2"
                  >
                    <ExternalLink size={14} /> Reply via Email
                  </a>
                  <button
                    onClick={() => {
                      if (!selected.read) markAsRead(selected.id);
                    }}
                    className="px-4 py-2 text-sm flex items-center gap-2 bg-ewc-dark text-ewc-gray hover:text-white rounded-md transition-colors"
                  >
                    <Eye size={14} /> Mark Read
                  </button>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="px-4 py-2 text-sm flex items-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-md transition-colors ml-auto"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="card-dark p-12 flex flex-col items-center justify-center text-ewc-gray h-64">
                <Mail size={48} className="mb-4 opacity-30" />
                <p className="text-sm">Select a message to view</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
