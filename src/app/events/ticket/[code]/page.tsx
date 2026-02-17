"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Copy,
  Check,
  HourglassIcon,
} from "lucide-react";

interface TicketData {
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
  event: {
    id: string;
    title: string;
    date: string;
    time: string | null;
    endTime: string | null;
    location: string | null;
    image: string | null;
    category: string;
  };
  ticketType: {
    name: string;
    price: number;
    isFree: boolean;
    currency: string;
  };
}

export default function TicketViewPage() {
  const { code } = useParams();
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/tickets/${code}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setTicket(data);
      })
      .catch(() => setError("Failed to load ticket"))
      .finally(() => setLoading(false));
  }, [code]);

  function handleCopy() {
    if (ticket) {
      navigator.clipboard.writeText(ticket.ticketCode);
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

  if (error || !ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h1 className="font-heading font-bold text-2xl text-ewc-charcoal mb-2">
            Ticket Not Found
          </h1>
          <p className="text-ewc-silver mb-6">{error || "Invalid ticket code."}</p>
          <Link href="/events" className="btn-burgundy">
            <ArrowLeft size={16} className="mr-2" /> Browse Events
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(ticket.event.date);
  const statusConfig = {
    confirmed: {
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-100",
      label: "Confirmed",
    },
    pending: {
      icon: HourglassIcon,
      color: "text-amber-600",
      bg: "bg-amber-100",
      label: "Pending Approval",
    },
    cancelled: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100",
      label: "Cancelled",
    },
  };
  const st = statusConfig[ticket.status as keyof typeof statusConfig] || statusConfig.confirmed;
  const StatusIcon = st.icon;

  return (
    <section className="min-h-screen bg-gradient-to-br from-ewc-burgundy-50 via-white to-ewc-cream py-20 sm:py-28">
      <div className="section-container max-w-lg">
        <Link
          href={`/events/${ticket.event.id}`}
          className="inline-flex items-center gap-2 text-ewc-burgundy font-heading text-sm mb-6 hover:gap-3 transition-all"
        >
          <ArrowLeft size={16} /> Back to Event
        </Link>

        {/* Ticket Card */}
        <div className="bg-white rounded-2xl shadow-soft-lg overflow-hidden border border-ewc-mist">
          {/* Top Colored strip */}
          <div className="burgundy-gradient h-3" />

          {/* Header */}
          <div className="p-6 pb-4 border-b border-dashed border-ewc-mist relative">
            {/* Circular cutouts on sides */}
            <div className="absolute -left-3 bottom-0 translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-ewc-burgundy-50 to-ewc-cream" />
            <div className="absolute -right-3 bottom-0 translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-ewc-burgundy-50 to-ewc-cream" />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-heading font-bold uppercase tracking-wider text-ewc-burgundy mb-1">
                  {ticket.event.category}
                </p>
                <h1 className="font-heading font-bold text-xl text-ewc-charcoal">
                  {ticket.event.title}
                </h1>
              </div>
              <div className={`${st.bg} ${st.color} px-3 py-1 rounded-full flex items-center gap-1.5`}>
                <StatusIcon size={14} />
                <span className="text-xs font-heading font-bold">{st.label}</span>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5">
                <Calendar size={16} className="text-ewc-burgundy mt-0.5" />
                <div>
                  <p className="text-xs text-ewc-silver font-heading">Date</p>
                  <p className="text-sm font-medium text-ewc-charcoal">
                    {eventDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              {ticket.event.time && (
                <div className="flex items-start gap-2.5">
                  <Clock size={16} className="text-ewc-burgundy mt-0.5" />
                  <div>
                    <p className="text-xs text-ewc-silver font-heading">Time</p>
                    <p className="text-sm font-medium text-ewc-charcoal">
                      {ticket.event.time}
                      {ticket.event.endTime && ` — ${ticket.event.endTime}`}
                    </p>
                  </div>
                </div>
              )}
              {ticket.event.location && (
                <div className="flex items-start gap-2.5 col-span-2">
                  <MapPin size={16} className="text-ewc-burgundy mt-0.5" />
                  <div>
                    <p className="text-xs text-ewc-silver font-heading">Location</p>
                    <p className="text-sm font-medium text-ewc-charcoal">
                      {ticket.event.location}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Attendee */}
            <div className="bg-ewc-light rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-ewc-burgundy" />
                <p className="text-xs text-ewc-silver font-heading uppercase tracking-wider">
                  Attendee
                </p>
              </div>
              <p className="font-heading font-bold text-ewc-charcoal">
                {ticket.firstName} {ticket.lastName}
              </p>
              <p className="text-sm text-ewc-silver">{ticket.email}</p>
            </div>

            {/* Ticket Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-ewc-light rounded-xl p-3">
                <p className="text-xs text-ewc-silver font-heading mb-0.5">Ticket Type</p>
                <p className="font-heading font-bold text-sm text-ewc-charcoal">
                  {ticket.ticketType.name}
                </p>
              </div>
              <div className="bg-ewc-light rounded-xl p-3">
                <p className="text-xs text-ewc-silver font-heading mb-0.5">Qty</p>
                <p className="font-heading font-bold text-sm text-ewc-charcoal">
                  {ticket.numberOfTickets}
                </p>
              </div>
              <div className="bg-ewc-light rounded-xl p-3">
                <p className="text-xs text-ewc-silver font-heading mb-0.5">Price</p>
                <p className="font-heading font-bold text-sm text-ewc-charcoal">
                  {ticket.ticketType.isFree
                    ? "Free"
                    : `${ticket.ticketType.currency} $${(ticket.ticketType.price * ticket.numberOfTickets).toFixed(2)}`}
                </p>
              </div>
              <div className="bg-ewc-light rounded-xl p-3">
                <p className="text-xs text-ewc-silver font-heading mb-0.5">Check-In</p>
                <p className="font-heading font-bold text-sm text-ewc-charcoal">
                  {ticket.checkedIn ? (
                    <span className="text-green-600">✓ Checked In</span>
                  ) : (
                    <span className="text-ewc-silver">Not Yet</span>
                  )}
                </p>
              </div>
            </div>

            {/* Ticket Code */}
            <div className="border-t border-dashed border-ewc-mist pt-5">
              <div className="bg-ewc-burgundy-50 rounded-2xl p-6 text-center">
                <p className="text-xs font-heading font-bold uppercase tracking-wider text-ewc-burgundy mb-2">
                  Ticket Code
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-heading font-bold text-3xl text-ewc-charcoal tracking-[0.2em]">
                    {ticket.ticketCode}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-white hover:bg-ewc-mist transition-colors shadow-sm"
                    title="Copy ticket code"
                  >
                    {copied ? (
                      <Check size={18} className="text-green-600" />
                    ) : (
                      <Copy size={18} className="text-ewc-silver" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-ewc-silver mt-2">
                  Present this code at the event for check-in
                </p>
              </div>
            </div>

            {/* Booked On */}
            <p className="text-xs text-ewc-silver text-center pt-2">
              Registered on{" "}
              {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
