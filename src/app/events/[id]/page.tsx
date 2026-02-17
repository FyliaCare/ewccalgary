"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Ticket,
  Users,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Minus,
  Plus,
  Share2,
  Copy,
  Check,
} from "lucide-react";

interface TicketType {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  quantity: number | null;
  maxPerOrder: number;
  isFree: boolean;
  _count: { registrations: number };
}

interface EventData {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  endTime: string | null;
  location: string | null;
  image: string | null;
  category: string;
  featured: boolean;
  registrationOpen: boolean;
  registrationDeadline: string | null;
  maxCapacity: number | null;
  requireApproval: boolean;
  ticketTypes: TicketType[];
  _count: { registrations: number };
}

interface RegResult {
  ticketCode: string;
  status: string;
  numberOfTickets: number;
  ticketType: { name: string };
}

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Registration form
  const [selectedTicket, setSelectedTicket] = useState("");
  const [qty, setQty] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [regResult, setRegResult] = useState<RegResult | null>(null);
  const [regError, setRegError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setEvent(data);
      })
      .catch(() => setError("Failed to load event"))
      .finally(() => setLoading(false));
  }, [id]);

  function getTicketAvailable(t: TicketType): number | null {
    if (t.quantity === null) return null;
    return Math.max(0, t.quantity - (t._count?.registrations || 0));
  }

  function getMaxQty(): number {
    if (!event || !selectedTicket) return 1;
    const t = event.ticketTypes.find((tt) => tt.id === selectedTicket);
    if (!t) return 1;
    const avail = getTicketAvailable(t);
    const max = Math.min(t.maxPerOrder, avail ?? t.maxPerOrder);
    return Math.max(1, max);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTicket || !firstName || !lastName || !email) return;

    setSubmitting(true);
    setRegError("");

    try {
      const res = await fetch(`/api/events/${id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketTypeId: selectedTicket,
          firstName,
          lastName,
          email,
          phone,
          numberOfTickets: qty,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRegError(data.error || "Registration failed");
      } else {
        setRegResult(data);
      }
    } catch {
      setRegError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleShare() {
    if (navigator.share && event) {
      navigator.share({
        title: event.title,
        text: `Check out ${event.title} at EWC Calgary!`,
        url: window.location.href,
      });
    }
  }

  function handleCopyTicket() {
    if (regResult) {
      navigator.clipboard.writeText(regResult.ticketCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="animate-spin text-ewc-burgundy" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h1 className="font-heading font-bold text-2xl text-ewc-charcoal mb-2">
            Event Not Found
          </h1>
          <p className="text-ewc-silver mb-6">{error || "This event doesn't exist."}</p>
          <Link href="/events" className="btn-burgundy">
            <ArrowLeft size={16} className="mr-2" /> Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();
  const deadlinePassed =
    event.registrationDeadline &&
    new Date() > new Date(event.registrationDeadline);
  const canRegister =
    event.registrationOpen && !isPast && !deadlinePassed && !regResult;

  // Calculate total remaining
  let totalSold = 0;
  const totalCapacity: number | null = event.maxCapacity;
  event.ticketTypes.forEach((t) => {
    totalSold += t._count?.registrations || 0;
  });

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ewc-burgundy-50 via-white to-ewc-cream" />
        <div className="relative section-container">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-ewc-burgundy font-heading text-sm mb-6 hover:gap-3 transition-all"
          >
            <ArrowLeft size={16} /> Back to Events
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Event Info — 3 cols */}
            <div className="lg:col-span-3">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-ewc-burgundy/10 text-ewc-burgundy text-xs font-heading font-bold uppercase tracking-wider">
                  {event.category}
                </span>
                {event.featured && (
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-heading font-bold uppercase tracking-wider">
                    ★ Featured
                  </span>
                )}
                {isPast && (
                  <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-heading font-bold uppercase tracking-wider">
                    Past Event
                  </span>
                )}
              </div>

              <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-ewc-charcoal mb-6 leading-tight">
                {event.title}
              </h1>

              <div className="flex flex-wrap gap-6 text-ewc-slate mb-8">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-ewc-burgundy" />
                  <span className="font-medium">
                    {eventDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {event.time && (
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-ewc-burgundy" />
                    <span>
                      {event.time}
                      {event.endTime && ` — ${event.endTime}`}
                    </span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-ewc-burgundy" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>

              {event.image && (
                <div className="relative rounded-2xl overflow-hidden mb-8 aspect-video">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                </div>
              )}

              {event.description && (
                <div className="prose max-w-none text-ewc-slate leading-relaxed whitespace-pre-line">
                  {event.description}
                </div>
              )}

              {/* Share */}
              <button
                onClick={handleShare}
                className="mt-8 inline-flex items-center gap-2 text-ewc-burgundy font-heading text-sm hover:underline"
              >
                <Share2 size={16} /> Share This Event
              </button>
            </div>

            {/* Registration Panel — 2 cols */}
            <div className="lg:col-span-2">
              <div className="sticky top-28">
                {/* Ticket / Registration Card */}
                <div className="card border-2 border-ewc-mist shadow-soft-lg">
                  <div className="border-b border-ewc-mist pb-4 mb-5">
                    <div className="flex items-center gap-2 mb-1">
                      <Ticket size={18} className="text-ewc-burgundy" />
                      <h2 className="font-heading font-bold text-lg text-ewc-charcoal">
                        {event.registrationOpen ? "Get Tickets" : "Event Info"}
                      </h2>
                    </div>
                    {totalCapacity !== null && (
                      <div className="flex items-center gap-2 text-xs text-ewc-silver mt-1">
                        <Users size={14} />
                        <span>
                          {totalSold} / {totalCapacity} registered
                        </span>
                        <div className="flex-1 h-1.5 bg-ewc-light rounded-full overflow-hidden">
                          <div
                            className="h-full bg-ewc-burgundy rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, (totalSold / totalCapacity) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Registration Success */}
                  {regResult ? (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} className="text-green-600" />
                      </div>
                      <h3 className="font-heading font-bold text-xl text-ewc-charcoal mb-1">
                        {regResult.status === "confirmed"
                          ? "You're Registered!"
                          : "Registration Pending"}
                      </h3>
                      <p className="text-ewc-silver text-sm mb-4">
                        {regResult.status === "confirmed"
                          ? "A confirmation email has been sent."
                          : "Your registration is pending approval."}
                      </p>

                      {/* Ticket Code */}
                      <div className="bg-ewc-burgundy-50 rounded-xl p-4 mb-4">
                        <p className="text-xs text-ewc-burgundy font-heading font-bold uppercase tracking-wider mb-1">
                          Your Ticket Code
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-heading font-bold text-2xl text-ewc-charcoal tracking-wider">
                            {regResult.ticketCode}
                          </span>
                          <button
                            onClick={handleCopyTicket}
                            className="p-1.5 rounded-lg bg-white hover:bg-ewc-mist transition-colors"
                          >
                            {copied ? (
                              <Check size={16} className="text-green-600" />
                            ) : (
                              <Copy size={16} className="text-ewc-silver" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-ewc-silver mt-1">
                          {regResult.numberOfTickets} × {regResult.ticketType.name}
                        </p>
                      </div>

                      <Link
                        href={`/events/ticket/${regResult.ticketCode}`}
                        className="btn-burgundy w-full text-center"
                      >
                        <Ticket size={16} className="mr-2" />
                        View Ticket
                      </Link>
                    </div>
                  ) : !canRegister ? (
                    <div className="text-center py-6">
                      <AlertCircle
                        size={36}
                        className="mx-auto text-ewc-silver/50 mb-3"
                      />
                      <p className="text-ewc-silver text-sm">
                        {isPast
                          ? "This event has already passed."
                          : deadlinePassed
                          ? "Registration deadline has passed."
                          : "Registration is not currently open."}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleRegister} className="space-y-4">
                      {/* Ticket Selection */}
                      <div>
                        <label className="label-text">Select Ticket</label>
                        <div className="space-y-2">
                          {event.ticketTypes.map((t) => {
                            const avail = getTicketAvailable(t);
                            const soldOut = avail !== null && avail <= 0;
                            return (
                              <button
                                key={t.id}
                                type="button"
                                disabled={soldOut}
                                onClick={() => {
                                  setSelectedTicket(t.id);
                                  setQty(1);
                                }}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                  selectedTicket === t.id
                                    ? "border-ewc-burgundy bg-ewc-burgundy-50"
                                    : soldOut
                                    ? "border-ewc-mist bg-ewc-light opacity-60 cursor-not-allowed"
                                    : "border-ewc-mist hover:border-ewc-burgundy/30"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-heading font-bold text-ewc-charcoal text-sm">
                                      {t.name}
                                    </p>
                                    {t.description && (
                                      <p className="text-ewc-silver text-xs mt-0.5">
                                        {t.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className="font-heading font-bold text-ewc-charcoal">
                                      {t.isFree
                                        ? "Free"
                                        : `$${t.price.toFixed(2)}`}
                                    </p>
                                    {avail !== null && (
                                      <p
                                        className={`text-xs ${
                                          soldOut
                                            ? "text-red-500 font-bold"
                                            : "text-ewc-silver"
                                        }`}
                                      >
                                        {soldOut
                                          ? "Sold Out"
                                          : `${avail} left`}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Quantity */}
                      {selectedTicket && (
                        <div>
                          <label className="label-text">Quantity</label>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setQty(Math.max(1, qty - 1))}
                              className="w-10 h-10 rounded-lg border border-ewc-mist flex items-center justify-center hover:bg-ewc-light transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center font-heading font-bold text-lg">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setQty(Math.min(getMaxQty(), qty + 1))
                              }
                              className="w-10 h-10 rounded-lg border border-ewc-mist flex items-center justify-center hover:bg-ewc-light transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Contact Info */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="label-text">First Name *</label>
                          <input
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="input-field"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label className="label-text">Last Name *</label>
                          <input
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="input-field"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="label-text">Email *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input-field"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="label-text">Phone (optional)</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="input-field"
                          placeholder="+1 (403) 555-0123"
                        />
                      </div>

                      {/* Price Summary */}
                      {selectedTicket && (
                        <div className="bg-ewc-burgundy-50 rounded-xl p-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-ewc-slate">
                              {
                                event.ticketTypes.find(
                                  (t) => t.id === selectedTicket
                                )?.name
                              }{" "}
                              × {qty}
                            </span>
                            <span className="font-heading font-bold text-ewc-charcoal">
                              {event.ticketTypes.find(
                                (t) => t.id === selectedTicket
                              )?.isFree
                                ? "Free"
                                : `$${(
                                    (event.ticketTypes.find(
                                      (t) => t.id === selectedTicket
                                    )?.price || 0) * qty
                                  ).toFixed(2)}`}
                            </span>
                          </div>
                        </div>
                      )}

                      {regError && (
                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                          <AlertCircle size={16} />
                          {regError}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submitting || !selectedTicket}
                        className="btn-burgundy w-full py-3.5 disabled:opacity-50"
                      >
                        {submitting ? (
                          <Loader2 size={18} className="animate-spin mr-2" />
                        ) : (
                          <Ticket size={16} className="mr-2" />
                        )}
                        {submitting
                          ? "Registering..."
                          : event.ticketTypes.find(
                              (t) => t.id === selectedTicket
                            )?.isFree
                          ? "Register (Free)"
                          : "Get Ticket"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
