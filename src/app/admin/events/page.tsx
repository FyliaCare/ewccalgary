"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Loader2,
  Plus,
  X,
  Ticket,
  Users,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  ToggleLeft,
  ToggleRight,
  Copy,
  Check,
  Download,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────── */
interface TicketTypeData {
  id?: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  quantity: number | null;
  maxPerOrder: number;
  isFree: boolean;
  _count?: { registrations: number };
}

interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  numberOfTickets: number;
  ticketCode: string;
  status: string;
  checkedIn: boolean;
  checkedInAt: string | null;
  createdAt: string;
  ticketType: { name: string; price: number; isFree: boolean };
}

interface EventData {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  endTime: string | null;
  location: string | null;
  category: string;
  image: string | null;
  featured: boolean;
  registrationOpen: boolean;
  registrationDeadline: string | null;
  maxCapacity: number | null;
  requireApproval: boolean;
  ticketTypes: TicketTypeData[];
  _count: { registrations: number };
}

const CATEGORIES = [
  "service",
  "community",
  "prayer",
  "youth",
  "conference",
  "outreach",
  "worship",
  "other",
];

const EMPTY_TICKET: TicketTypeData = {
  name: "",
  description: "",
  price: 0,
  currency: "CAD",
  quantity: null,
  maxPerOrder: 5,
  isFree: true,
};

/* ─── Component ──────────────────────────────────── */
export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [regs, setRegs] = useState<Record<string, Registration[]>>({});
  const [regsLoading, setRegsLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    endTime: "",
    location: "",
    category: "service",
    image: "",
    featured: false,
    registrationOpen: false,
    registrationDeadline: "",
    maxCapacity: "",
    requireApproval: false,
  });
  const [ticketTypes, setTicketTypes] = useState<TicketTypeData[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const res = await fetch("/api/events");
      if (res.ok) setEvents(await res.json());
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingEvent(null);
    setForm({
      title: "",
      description: "",
      date: "",
      time: "",
      endTime: "",
      location: "",
      category: "service",
      image: "",
      featured: false,
      registrationOpen: false,
      registrationDeadline: "",
      maxCapacity: "",
      requireApproval: false,
    });
    setTicketTypes([]);
    setShowModal(true);
  }

  function openEdit(ev: EventData) {
    setEditingEvent(ev);
    setForm({
      title: ev.title,
      description: ev.description || "",
      date: ev.date.split("T")[0],
      time: ev.time || "",
      endTime: ev.endTime || "",
      location: ev.location || "",
      category: ev.category,
      image: ev.image || "",
      featured: ev.featured,
      registrationOpen: ev.registrationOpen,
      registrationDeadline: ev.registrationDeadline
        ? ev.registrationDeadline.split("T")[0]
        : "",
      maxCapacity: ev.maxCapacity ? String(ev.maxCapacity) : "",
      requireApproval: ev.requireApproval,
    });
    setTicketTypes(
      ev.ticketTypes.map((t) => ({
        ...t,
        description: t.description || "",
      }))
    );
    setShowModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const body = {
      title: form.title,
      description: form.description || null,
      date: new Date(form.date).toISOString(),
      time: form.time || null,
      endTime: form.endTime || null,
      location: form.location || null,
      category: form.category,
      image: form.image || null,
      featured: form.featured,
      registrationOpen: form.registrationOpen,
      registrationDeadline: form.registrationDeadline
        ? new Date(form.registrationDeadline).toISOString()
        : null,
      maxCapacity: form.maxCapacity ? parseInt(form.maxCapacity) : null,
      requireApproval: form.requireApproval,
      ticketTypes: ticketTypes.map((t) => ({
        name: t.name,
        description: t.description || null,
        price: t.isFree ? 0 : t.price,
        currency: t.currency,
        quantity: t.quantity,
        maxPerOrder: t.maxPerOrder,
        isFree: t.isFree,
      })),
    };

    try {
      const url = editingEvent
        ? `/api/events/${editingEvent.id}`
        : "/api/events";
      const method = editingEvent ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowModal(false);
        fetchEvents();
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event? All registrations will be lost.")) return;
    try {
      await fetch(`/api/events/${id}`, { method: "DELETE" });
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  async function toggleRegistration(ev: EventData) {
    try {
      const res = await fetch(`/api/events/${ev.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationOpen: !ev.registrationOpen }),
      });
      if (res.ok) fetchEvents();
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  }

  async function loadRegistrations(eventId: string) {
    if (regs[eventId]) return;
    setRegsLoading(eventId);
    try {
      const res = await fetch(`/api/events/${eventId}/register`);
      if (res.ok) {
        const data = await res.json();
        setRegs((prev) => ({ ...prev, [eventId]: data }));
      }
    } catch (err) {
      console.error("Failed to load registrations:", err);
    } finally {
      setRegsLoading(null);
    }
  }

  function toggleExpand(eventId: string) {
    if (expandedEvent === eventId) {
      setExpandedEvent(null);
    } else {
      setExpandedEvent(eventId);
      loadRegistrations(eventId);
    }
  }

  async function handleCheckin(eventId: string, regId: string) {
    try {
      await fetch(`/api/events/${eventId}/registrations/${regId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkedIn: true }),
      });
      const res = await fetch(`/api/events/${eventId}/register`);
      if (res.ok) {
        const data = await res.json();
        setRegs((prev) => ({ ...prev, [eventId]: data }));
      }
    } catch (err) {
      console.error("Check-in failed:", err);
    }
  }

  async function handleRegStatus(
    eventId: string,
    regId: string,
    status: string
  ) {
    try {
      await fetch(`/api/events/${eventId}/registrations/${regId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const res = await fetch(`/api/events/${eventId}/register`);
      if (res.ok) {
        const data = await res.json();
        setRegs((prev) => ({ ...prev, [eventId]: data }));
      }
    } catch (err) {
      console.error("Status update failed:", err);
    }
  }

  function addTicketType() {
    setTicketTypes([...ticketTypes, { ...EMPTY_TICKET }]);
  }

  function removeTicketType(idx: number) {
    setTicketTypes(ticketTypes.filter((_, i) => i !== idx));
  }

  function updateTicketType(idx: number, field: string, value: unknown) {
    setTicketTypes(
      ticketTypes.map((t, i) =>
        i === idx ? { ...t, [field]: value } : t
      )
    );
  }

  function getCategoryColor(cat: string): string {
    const colors: Record<string, string> = {
      service: "bg-blue-500/10 text-blue-400",
      community: "bg-green-500/10 text-green-400",
      prayer: "bg-orange-500/10 text-orange-400",
      youth: "bg-purple-500/10 text-purple-400",
      conference: "bg-pink-500/10 text-pink-400",
      outreach: "bg-teal-500/10 text-teal-400",
      worship: "bg-indigo-500/10 text-indigo-400",
    };
    return colors[cat] || "bg-ewc-burgundy/10 text-ewc-burgundy";
  }

  function exportCSV(eventId: string, eventTitle: string) {
    const eventRegs = regs[eventId];
    if (!eventRegs) return;

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Ticket Type",
      "Qty",
      "Ticket Code",
      "Status",
      "Checked In",
      "Registered At",
    ];
    const rows = eventRegs.map((r) => [
      `${r.firstName} ${r.lastName}`,
      r.email,
      r.phone || "",
      r.ticketType.name,
      r.numberOfTickets,
      r.ticketCode,
      r.status,
      r.checkedIn ? "Yes" : "No",
      new Date(r.createdAt).toLocaleString(),
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventTitle.replace(/\s+/g, "_")}_registrations.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">
            Events & Ticketing
          </h1>
          <p className="text-ewc-gray text-sm mt-1">
            Manage events, ticket types, and registrations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="card-dark px-4 py-2 text-sm text-ewc-cream/70">
            {events.length} events
          </div>
          <button
            onClick={openCreate}
            className="bg-ewc-burgundy hover:bg-ewc-burgundy-hover text-white px-4 py-2 rounded-lg font-heading text-sm flex items-center gap-2 transition-colors"
          >
            <Plus size={16} /> New Event
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ewc-gray"
        />
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-ewc-darker border border-ewc-dark rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-ewc-gray focus:border-ewc-burgundy focus:outline-none transition-colors"
        />
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="card-dark p-12 text-center">
          <Calendar size={40} className="mx-auto text-ewc-gray mb-4" />
          <p className="text-ewc-gray mb-4">No events yet.</p>
          <button onClick={openCreate} className="bg-ewc-burgundy hover:bg-ewc-burgundy-hover text-white px-4 py-2 rounded-lg text-sm">
            <Plus size={14} className="inline mr-1" /> Create First Event
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {events
            .filter(
              (ev) =>
                !searchTerm ||
                ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ev.category.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((ev) => {
              const isExpanded = expandedEvent === ev.id;
              const isPast = new Date(ev.date) < new Date();
              const eventRegs = regs[ev.id] || [];
              const totalSold = ev._count?.registrations || 0;

              return (
                <div key={ev.id} className="card-dark overflow-hidden">
                  {/* Event Row */}
                  <div className="flex items-center gap-4 p-4">
                    {/* Date box */}
                    <div
                      className={`rounded-xl p-3 text-center flex-shrink-0 min-w-[56px] ${
                        isPast ? "bg-ewc-dark" : "bg-ewc-burgundy/10"
                      }`}
                    >
                      <p
                        className={`font-heading font-bold text-xs uppercase ${
                          isPast ? "text-ewc-gray" : "text-ewc-burgundy"
                        }`}
                      >
                        {new Date(ev.date).toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </p>
                      <p
                        className={`text-xl font-bold leading-none ${
                          isPast ? "text-ewc-gray" : "text-white"
                        }`}
                      >
                        {new Date(ev.date).getDate()}
                      </p>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className={`font-heading font-bold truncate ${
                            isPast ? "text-ewc-gray" : "text-white"
                          }`}
                        >
                          {ev.title}
                        </h3>
                        {ev.featured && (
                          <span className="text-amber-400 text-xs">★</span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-heading uppercase tracking-wider ${getCategoryColor(
                            ev.category
                          )}`}
                        >
                          {ev.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-ewc-gray mt-1 flex-wrap">
                        {ev.time && (
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> {ev.time}
                            {ev.endTime && ` — ${ev.endTime}`}
                          </span>
                        )}
                        {ev.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {ev.location}
                          </span>
                        )}
                        {ev.ticketTypes.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Ticket size={11} className="text-ewc-burgundy" />{" "}
                            {ev.ticketTypes.length} ticket type
                            {ev.ticketTypes.length > 1 ? "s" : ""}
                          </span>
                        )}
                        {totalSold > 0 && (
                          <span className="flex items-center gap-1">
                            <Users size={11} className="text-ewc-burgundy" />{" "}
                            {totalSold} registered
                            {ev.maxCapacity && ` / ${ev.maxCapacity}`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleRegistration(ev)}
                        className="p-1.5"
                        title={
                          ev.registrationOpen
                            ? "Close registration"
                            : "Open registration"
                        }
                      >
                        {ev.registrationOpen ? (
                          <ToggleRight
                            size={22}
                            className="text-green-500"
                          />
                        ) : (
                          <ToggleLeft size={22} className="text-ewc-gray" />
                        )}
                      </button>
                      <button
                        onClick={() => openEdit(ev)}
                        className="p-1.5 text-ewc-gray hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(ev.id)}
                        className="p-1.5 text-ewc-gray hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                      <button
                        onClick={() => toggleExpand(ev.id)}
                        className="p-1.5 text-ewc-gray hover:text-white transition-colors"
                        title="View Registrations"
                      >
                        {isExpanded ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded — Registrations */}
                  {isExpanded && (
                    <div className="border-t border-ewc-dark">
                      {/* Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4">
                        <div className="bg-ewc-dark rounded-lg p-3 text-center">
                          <p className="text-xs text-ewc-gray font-heading">
                            Total
                          </p>
                          <p className="text-xl font-bold text-white">
                            {totalSold}
                          </p>
                        </div>
                        <div className="bg-ewc-dark rounded-lg p-3 text-center">
                          <p className="text-xs text-ewc-gray font-heading">
                            Checked In
                          </p>
                          <p className="text-xl font-bold text-green-400">
                            {eventRegs.filter((r) => r.checkedIn).length}
                          </p>
                        </div>
                        <div className="bg-ewc-dark rounded-lg p-3 text-center">
                          <p className="text-xs text-ewc-gray font-heading">
                            Pending
                          </p>
                          <p className="text-xl font-bold text-amber-400">
                            {
                              eventRegs.filter((r) => r.status === "pending")
                                .length
                            }
                          </p>
                        </div>
                        <div className="bg-ewc-dark rounded-lg p-3 text-center">
                          <p className="text-xs text-ewc-gray font-heading">
                            Capacity
                          </p>
                          <p className="text-xl font-bold text-white">
                            {ev.maxCapacity
                              ? `${totalSold}/${ev.maxCapacity}`
                              : "∞"}
                          </p>
                        </div>
                      </div>

                      {/* Ticket Types Summary */}
                      {ev.ticketTypes.length > 0 && (
                        <div className="px-4 pb-3">
                          <p className="text-xs text-ewc-gray font-heading uppercase tracking-wider mb-2">
                            Ticket Types
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {ev.ticketTypes.map((t) => (
                              <div
                                key={t.id || t.name}
                                className="bg-ewc-dark rounded-lg px-3 py-2 text-xs"
                              >
                                <span className="text-white font-semibold">
                                  {t.name}
                                </span>
                                <span className="text-ewc-gray ml-2">
                                  {t.isFree
                                    ? "Free"
                                    : `$${t.price.toFixed(2)}`}
                                </span>
                                <span className="text-ewc-gray ml-2">
                                  {t._count?.registrations || 0}
                                  {t.quantity !== null && `/${t.quantity}`} sold
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Registration Table */}
                      <div className="px-4 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-ewc-gray font-heading uppercase tracking-wider">
                            Registrations
                          </p>
                          {eventRegs.length > 0 && (
                            <button
                              onClick={() => exportCSV(ev.id, ev.title)}
                              className="text-xs text-ewc-burgundy hover:text-ewc-burgundy-hover flex items-center gap-1 transition-colors"
                            >
                              <Download size={12} /> Export CSV
                            </button>
                          )}
                        </div>

                        {regsLoading === ev.id ? (
                          <div className="flex items-center justify-center py-6">
                            <Loader2
                              size={20}
                              className="animate-spin text-ewc-burgundy"
                            />
                          </div>
                        ) : eventRegs.length === 0 ? (
                          <p className="text-ewc-gray text-sm text-center py-4">
                            No registrations yet.
                          </p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-ewc-dark">
                                  <th className="text-left px-3 py-2 text-ewc-gray font-heading">
                                    Name
                                  </th>
                                  <th className="text-left px-3 py-2 text-ewc-gray font-heading hidden sm:table-cell">
                                    Email
                                  </th>
                                  <th className="text-left px-3 py-2 text-ewc-gray font-heading">
                                    Ticket
                                  </th>
                                  <th className="text-left px-3 py-2 text-ewc-gray font-heading">
                                    Code
                                  </th>
                                  <th className="text-left px-3 py-2 text-ewc-gray font-heading">
                                    Status
                                  </th>
                                  <th className="text-left px-3 py-2 text-ewc-gray font-heading">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {eventRegs.map((reg) => (
                                  <tr
                                    key={reg.id}
                                    className="border-b border-ewc-dark/50 hover:bg-ewc-dark/30"
                                  >
                                    <td className="px-3 py-2">
                                      <span className="text-white font-medium">
                                        {reg.firstName} {reg.lastName}
                                      </span>
                                      <span className="block text-ewc-gray sm:hidden">
                                        {reg.email}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 text-ewc-gray hidden sm:table-cell">
                                      {reg.email}
                                    </td>
                                    <td className="px-3 py-2 text-ewc-cream/70">
                                      {reg.ticketType.name} × {reg.numberOfTickets}
                                    </td>
                                    <td className="px-3 py-2">
                                      <div className="flex items-center gap-1">
                                        <code className="text-ewc-burgundy text-[11px]">
                                          {reg.ticketCode}
                                        </code>
                                        <button
                                          onClick={() => {
                                            navigator.clipboard.writeText(
                                              reg.ticketCode
                                            );
                                            setCopiedCode(reg.id);
                                            setTimeout(
                                              () => setCopiedCode(null),
                                              1500
                                            );
                                          }}
                                          className="p-0.5"
                                        >
                                          {copiedCode === reg.id ? (
                                            <Check
                                              size={11}
                                              className="text-green-400"
                                            />
                                          ) : (
                                            <Copy
                                              size={11}
                                              className="text-ewc-gray"
                                            />
                                          )}
                                        </button>
                                      </div>
                                    </td>
                                    <td className="px-3 py-2">
                                      <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-heading ${
                                          reg.status === "confirmed"
                                            ? "bg-green-500/10 text-green-400"
                                            : reg.status === "pending"
                                            ? "bg-amber-500/10 text-amber-400"
                                            : "bg-red-500/10 text-red-400"
                                        }`}
                                      >
                                        {reg.checkedIn
                                          ? "✓ In"
                                          : reg.status}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2">
                                      <div className="flex items-center gap-1">
                                        {!reg.checkedIn &&
                                          reg.status === "confirmed" && (
                                            <button
                                              onClick={() =>
                                                handleCheckin(ev.id, reg.id)
                                              }
                                              className="text-green-400 hover:text-green-300 p-0.5"
                                              title="Check In"
                                            >
                                              <CheckCircle2 size={14} />
                                            </button>
                                          )}
                                        {reg.status === "pending" && (
                                          <button
                                            onClick={() =>
                                              handleRegStatus(
                                                ev.id,
                                                reg.id,
                                                "confirmed"
                                              )
                                            }
                                            className="text-green-400 hover:text-green-300 p-0.5"
                                            title="Approve"
                                          >
                                            <CheckCircle2 size={14} />
                                          </button>
                                        )}
                                        {reg.status !== "cancelled" && (
                                          <button
                                            onClick={() =>
                                              handleRegStatus(
                                                ev.id,
                                                reg.id,
                                                "cancelled"
                                              )
                                            }
                                            className="text-red-400 hover:text-red-300 p-0.5"
                                            title="Cancel"
                                          >
                                            <XCircle size={14} />
                                          </button>
                                        )}
                                        <a
                                          href={`/events/ticket/${reg.ticketCode}`}
                                          target="_blank"
                                          className="text-ewc-gray hover:text-white p-0.5"
                                          title="View Ticket"
                                        >
                                          <Eye size={14} />
                                        </a>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* ─── Create / Edit Modal ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 px-4 overflow-y-auto">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-2xl bg-ewc-darker rounded-2xl shadow-2xl mb-10">
            <div className="flex items-center justify-between p-5 border-b border-ewc-dark">
              <h2 className="font-heading font-bold text-lg text-white">
                {editingEvent ? "Edit Event" : "Create Event"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-ewc-gray hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="p-5 space-y-5 max-h-[75vh] overflow-y-auto"
            >
              {/* Title */}
              <div>
                <label className="text-xs text-ewc-gray font-heading uppercase tracking-wider block mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="w-full bg-ewc-dark border border-ewc-dark rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-ewc-gray focus:border-ewc-burgundy focus:outline-none"
                  placeholder="Event title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-ewc-gray font-heading uppercase tracking-wider block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full bg-ewc-dark border border-ewc-dark rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-ewc-gray focus:border-ewc-burgundy focus:outline-none resize-none"
                  placeholder="Event description..."
                />
              </div>

              {/* Date / Time Row */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-ewc-gray font-heading uppercase tracking-wider block mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                    className="w-full bg-ewc-dark border border-ewc-dark rounded-lg px-3 py-2.5 text-sm text-white focus:border-ewc-burgundy focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-ewc-gray font-heading uppercase tracking-wider block mb-1">
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={form.time}
                    onChange={(e) =>
                      setForm({ ...form, time: e.target.value })
                    }
                    className="w-full bg-ewc-dark border border-ewc-dark rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-ewc-gray focus:border-ewc-burgundy focus:outline-none"
                    placeholder="10:00 AM"
                  />
                </div>
                <div>
                  <label className="text-xs text-ewc-gray font-heading uppercase tracking-wider block mb-1">
                    End Time
                  </label>
                  <input
                    type="text"
                    value={form.endTime}
                    onChange={(e) =>
                      setForm({ ...form, endTime: e.target.value })
                    }
                    className="w-full bg-ewc-dark border border-ewc-dark rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-ewc-gray focus:border-ewc-burgundy focus:outline-none"
                    placeholder="12:00 PM"
                  />
                </div>
              </div>

              {/* Location / Category / Image */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-ewc-gray font-heading uppercase tracking-wider block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    className="w-full bg-ewc-dark border border-ewc-dark rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-ewc-gray focus:border-ewc-burgundy focus:outline-none"
                    placeholder="Venue address"
                  />
                </div>
                <div>
                  <label className="text-xs text-ewc-gray font-heading uppercase tracking-wider block mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full bg-ewc-dark border border-ewc-dark rounded-lg px-3 py-2.5 text-sm text-white focus:border-ewc-burgundy focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-ewc-gray font-heading uppercase tracking-wider block mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.value })
                  }
                  className="w-full bg-ewc-dark border border-ewc-dark rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-ewc-gray focus:border-ewc-burgundy focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                    className="rounded border-ewc-dark bg-ewc-dark text-ewc-burgundy focus:ring-ewc-burgundy"
                  />
                  <span className="text-sm text-ewc-cream/70">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.registrationOpen}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        registrationOpen: e.target.checked,
                      })
                    }
                    className="rounded border-ewc-dark bg-ewc-dark text-ewc-burgundy focus:ring-ewc-burgundy"
                  />
                  <span className="text-sm text-ewc-cream/70">
                    Registration Open
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.requireApproval}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        requireApproval: e.target.checked,
                      })
                    }
                    className="rounded border-ewc-dark bg-ewc-dark text-ewc-burgundy focus:ring-ewc-burgundy"
                  />
                  <span className="text-sm text-ewc-cream/70">
                    Require Approval
                  </span>
                </label>
              </div>

              {/* Registration Settings */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-ewc-gray font-heading uppercase tracking-wider block mb-1">
                    Registration Deadline
                  </label>
                  <input
                    type="date"
                    value={form.registrationDeadline}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        registrationDeadline: e.target.value,
                      })
                    }
                    className="w-full bg-ewc-dark border border-ewc-dark rounded-lg px-3 py-2.5 text-sm text-white focus:border-ewc-burgundy focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-ewc-gray font-heading uppercase tracking-wider block mb-1">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    value={form.maxCapacity}
                    onChange={(e) =>
                      setForm({ ...form, maxCapacity: e.target.value })
                    }
                    className="w-full bg-ewc-dark border border-ewc-dark rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-ewc-gray focus:border-ewc-burgundy focus:outline-none"
                    placeholder="Unlimited"
                    min="1"
                  />
                </div>
              </div>

              {/* ─── Ticket Types ─── */}
              <div className="border-t border-ewc-dark pt-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-bold text-white text-sm flex items-center gap-2">
                    <Ticket size={14} className="text-ewc-burgundy" /> Ticket
                    Types
                  </h3>
                  <button
                    type="button"
                    onClick={addTicketType}
                    className="text-xs text-ewc-burgundy hover:text-ewc-burgundy-hover flex items-center gap-1 transition-colors"
                  >
                    <Plus size={14} /> Add Ticket
                  </button>
                </div>

                {ticketTypes.length === 0 ? (
                  <div className="bg-ewc-dark rounded-lg p-6 text-center">
                    <Ticket
                      size={24}
                      className="mx-auto text-ewc-gray mb-2"
                    />
                    <p className="text-ewc-gray text-xs mb-2">
                      No ticket types. Add one to enable registration.
                    </p>
                    <button
                      type="button"
                      onClick={addTicketType}
                      className="text-xs text-ewc-burgundy"
                    >
                      + Add Ticket Type
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ticketTypes.map((t, idx) => (
                      <div
                        key={idx}
                        className="bg-ewc-dark p-4 rounded-lg space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-ewc-gray font-heading uppercase">
                            Ticket #{idx + 1}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeTicketType(idx)}
                            className="text-ewc-gray hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <input
                              type="text"
                              required
                              value={t.name}
                              onChange={(e) =>
                                updateTicketType(idx, "name", e.target.value)
                              }
                              className="w-full bg-ewc-darker border border-ewc-dark/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-ewc-gray focus:border-ewc-burgundy focus:outline-none"
                              placeholder="Ticket name"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={t.description}
                              onChange={(e) =>
                                updateTicketType(
                                  idx,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="w-full bg-ewc-darker border border-ewc-dark/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-ewc-gray focus:border-ewc-burgundy focus:outline-none"
                              placeholder="Description (optional)"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          <label className="flex items-center gap-2 col-span-1">
                            <input
                              type="checkbox"
                              checked={t.isFree}
                              onChange={(e) =>
                                updateTicketType(
                                  idx,
                                  "isFree",
                                  e.target.checked
                                )
                              }
                              className="rounded border-ewc-dark bg-ewc-darker text-ewc-burgundy focus:ring-ewc-burgundy"
                            />
                            <span className="text-xs text-ewc-cream/70">
                              Free
                            </span>
                          </label>
                          {!t.isFree && (
                            <div>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={t.price}
                                onChange={(e) =>
                                  updateTicketType(
                                    idx,
                                    "price",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full bg-ewc-darker border border-ewc-dark/50 rounded-lg px-3 py-2 text-sm text-white focus:border-ewc-burgundy focus:outline-none"
                                placeholder="Price"
                              />
                            </div>
                          )}
                          <div>
                            <input
                              type="number"
                              min="1"
                              value={t.quantity ?? ""}
                              onChange={(e) =>
                                updateTicketType(
                                  idx,
                                  "quantity",
                                  e.target.value
                                    ? parseInt(e.target.value)
                                    : null
                                )
                              }
                              className="w-full bg-ewc-darker border border-ewc-dark/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-ewc-gray focus:border-ewc-burgundy focus:outline-none"
                              placeholder="Qty (∞)"
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={t.maxPerOrder}
                              onChange={(e) =>
                                updateTicketType(
                                  idx,
                                  "maxPerOrder",
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-full bg-ewc-darker border border-ewc-dark/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-ewc-gray focus:border-ewc-burgundy focus:outline-none"
                              placeholder="Max/Order"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm text-ewc-gray hover:text-white border border-ewc-dark rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-ewc-burgundy hover:bg-ewc-burgundy-hover text-white px-6 py-2.5 rounded-lg text-sm font-heading flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {saving && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  {editingEvent ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
