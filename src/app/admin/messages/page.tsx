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
          <h1 className="font-heading font-bold text-2xl text-gray-900">Messages</h1>
          <p className="text-gray-500 text-sm mt-1">
            {messages.length} total &middot; {unreadCount} unread
          </p>
        </div>
        <div className="flex gap-2 text-xs font-heading">
          {(["all", "unread", "read"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md capitalize transition-colors ${filter === f ? "bg-ewc-burgundy text-white" : "bg-gray-100 text-gray-500 hover:text-gray-900"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Inbox size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">No messages yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message list */}
          <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-400 text-sm">
                No {filter} messages.
              </div>
            ) : (
              filtered.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => handleSelect(msg)}
                  className={`w-full text-left bg-white rounded-2xl border shadow-sm p-4 transition-all ${selectedId === msg.id ? "border-ewc-burgundy ring-1 ring-ewc-burgundy/20" : "border-gray-100 hover:border-gray-200 hover:shadow-md"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-ewc-burgundy flex-shrink-0" />}
                    <span className={`font-heading font-bold text-sm truncate ${!msg.read ? "text-gray-900" : "text-gray-400"}`}>
                      {msg.name}
                    </span>
                  </div>
                  <p className="text-gray-700 text-xs font-semibold truncate">{msg.subject}</p>
                  <p className="text-gray-400 text-xs truncate mt-1">{msg.message}</p>
                  <p className="text-gray-300 text-[10px] mt-2">{new Date(msg.createdAt).toLocaleDateString()}</p>
                </button>
              ))
            )}
          </div>

          {/* Detail view */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-heading font-bold text-lg text-gray-900">{selected.subject}</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      From <span className="text-gray-900 font-medium">{selected.name}</span> &middot; {new Date(selected.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {!selected.read && (
                      <span className="text-[10px] bg-ewc-burgundy/10 text-ewc-burgundy px-2 py-0.5 rounded-full font-heading">Unread</span>
                    )}
                    {selected.read && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-heading flex items-center gap-1">
                        <CheckCircle size={10} /> Read
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 text-xs text-gray-500 border-b border-gray-100 pb-4">
                  <span className="flex items-center gap-1"><Mail size={12} /> {selected.email}</span>
                  {selected.phone && <span>{selected.phone}</span>}
                </div>

                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
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
                    className="px-4 py-2 text-sm flex items-center gap-2 bg-gray-100 text-gray-500 hover:text-gray-900 rounded-md transition-colors"
                  >
                    <Eye size={14} /> Mark Read
                  </button>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="px-4 py-2 text-sm flex items-center gap-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-md transition-colors ml-auto"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-gray-400 h-64">
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
