"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Loader2 } from "lucide-react";

interface EventData {
  id: string;
  title: string;
  date: string;
  time: string | null;
  location: string | null;
  category: string;
  featured: boolean;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/events");
        if (res.ok) setEvents(await res.json());
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/events/${id}`, { method: "DELETE" });
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  function getCategoryColor(cat: string): string {
    const colors: Record<string, string> = {
      service: "bg-blue-500/10 text-blue-400",
      community: "bg-green-500/10 text-green-400",
      prayer: "bg-orange-500/10 text-orange-400",
      youth: "bg-purple-500/10 text-purple-400",
      conference: "bg-pink-500/10 text-pink-400",
    };
    return colors[cat] || "bg-ewc-burgundy/10 text-ewc-burgundy";
  }

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
          <h1 className="font-heading font-bold text-2xl text-white">Events</h1>
          <p className="text-ewc-gray text-sm mt-1">
            Upcoming events and recurring services.
          </p>
        </div>
        <div className="card-dark px-4 py-2 text-sm text-ewc-cream/70">
          {events.length} events
        </div>
      </div>

      {events.length === 0 ? (
        <div className="card-dark p-12 text-center">
          <p className="text-ewc-gray">No events found.</p>
        </div>
      ) : (
        <div className="card-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ewc-dark">
                  <th className="text-left px-4 py-3 text-ewc-gray font-heading text-xs uppercase tracking-wider">Event</th>
                  <th className="text-left px-4 py-3 text-ewc-gray font-heading text-xs uppercase tracking-wider">Date & Time</th>
                  <th className="text-left px-4 py-3 text-ewc-gray font-heading text-xs uppercase tracking-wider hidden sm:table-cell">Location</th>
                  <th className="text-left px-4 py-3 text-ewc-gray font-heading text-xs uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-3 text-ewc-gray font-heading text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-ewc-dark/50 hover:bg-ewc-dark/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white font-semibold">{event.title}</p>
                      {event.featured && (
                        <span className="text-ewc-burgundy text-xs">★ Featured</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-ewc-cream/70">
                        <Calendar size={12} className="text-ewc-burgundy" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-1.5 text-ewc-gray text-xs mt-0.5">
                          <Clock size={12} />
                          {event.time}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ewc-gray hidden sm:table-cell">
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="text-ewc-burgundy" />
                          {event.location}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-heading ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-ewc-gray hover:text-red-400 transition-colors text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
