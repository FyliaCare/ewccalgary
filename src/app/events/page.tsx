"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MapPin, ArrowRight, Sparkles, Ticket, Users } from "lucide-react";

interface TicketType {
  id: string;
  name: string;
  price: number;
  isFree: boolean;
  quantity: number | null;
  _count: { registrations: number };
}

interface Event {
  id: string;
  title: string;
  description: string;
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
  ticketTypes: TicketType[];
  _count: { registrations: number };
}

const serviceSchedule = [
  { day: "Sunday", title: "Sunday Worship Service", time: "10:00 AM - 12:30 PM", emoji: "🙏" },
  { day: "Friday", title: "WILDFIRE", time: "7:00 PM", emoji: "🔥" },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date());
  const pastEvents = events.filter((e) => new Date(e.date) < new Date());

  return (
    <>
      {/* Hero */}
      <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ewc-burgundy-50 via-white to-ewc-cream" />
        <div className="absolute top-10 left-10 w-40 sm:w-56 h-40 sm:h-56 bg-rose-200/20 rounded-full blur-3xl" />
        <div className="relative section-container text-center">
          <span className="section-label">Events & Services</span>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl lg:text-6xl text-ewc-charcoal mb-4 sm:mb-6 mt-3 px-2">
            Gather, Worship &
            <span className="block text-ewc-burgundy">Grow Together</span>
          </h1>
          <p className="max-w-2xl mx-auto text-ewc-slate text-base sm:text-lg leading-relaxed px-2">
            Weekly services, special events, and community gatherings — there&apos;s always
            something happening at EWC Calgary.
          </p>
        </div>
      </section>

      {/* Service Schedule */}
      <section className="bg-white section-padding">
        <div className="section-container">
          <div className="text-center mb-10 sm:mb-14">
            <span className="section-label">Weekly Schedule</span>
            <h2 className="section-title mt-3">Regular Services</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {serviceSchedule.map((service) => (
              <div key={service.day} className="card text-center group hover:border-ewc-burgundy/30 p-4 sm:p-6">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{service.emoji}</div>
                <p className="text-xs text-ewc-burgundy font-heading font-bold uppercase tracking-wider mb-1">
                  {service.day}
                </p>
                <h3 className="font-heading text-base sm:text-lg font-bold text-ewc-charcoal mb-1 sm:mb-2">{service.title}</h3>
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-ewc-silver">
                  <Clock size={14} />
                  <span>{service.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6 sm:mt-8">
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-ewc-light text-ewc-slate text-xs sm:text-sm">
              <MapPin size={14} className="text-ewc-burgundy" />
              225 Chaparral Drive SE, Calgary, AB
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-ewc-snow section-padding">
        <div className="section-container">
          <div className="text-center mb-10 sm:mb-14">
            <span className="section-label">
              <Sparkles size={14} className="inline mr-1" />
              Upcoming
            </span>
            <h2 className="section-title mt-3">Upcoming Events</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-40 bg-ewc-mist rounded-xl mb-4" />
                  <div className="h-4 bg-ewc-mist rounded w-3/4 mb-2" />
                  <div className="h-3 bg-ewc-mist rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="card-warm text-center max-w-lg mx-auto py-12">
              <Calendar size={48} className="mx-auto text-ewc-burgundy/40 mb-4" />
              <h3 className="font-heading font-bold text-ewc-charcoal text-lg mb-2">No Upcoming Events</h3>
              <p className="text-ewc-silver text-sm">
                Check back soon for upcoming events and special services.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => {
                const lowestPrice = event.ticketTypes.length > 0
                  ? Math.min(...event.ticketTypes.map((t) => t.price))
                  : null;
                const allFree = event.ticketTypes.every((t) => t.isFree);
                const hasTickets = event.ticketTypes.length > 0;

                return (
                <Link href={`/events/${event.id}`} key={event.id} className="card group hover:border-ewc-burgundy/30 block">
                  {event.image && (
                    <div className="relative h-44 bg-ewc-light rounded-xl mb-4 overflow-hidden">
                      <Image src={event.image} alt={event.title} fill className="object-cover" />
                      {event.featured && (
                        <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-heading font-bold uppercase tracking-wider">
                          ★ Featured
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="bg-ewc-burgundy-50 rounded-xl p-3 text-center flex-shrink-0">
                      <p className="text-ewc-burgundy font-heading font-bold text-xs uppercase">
                        {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                      </p>
                      <p className="text-2xl font-bold text-ewc-charcoal leading-none">
                        {new Date(event.date).getDate()}
                      </p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-ewc-light text-ewc-silver text-[11px] uppercase tracking-wider font-heading mb-1.5">
                        {event.category}
                      </span>
                      <h3 className="font-heading font-bold text-ewc-charcoal mb-1 truncate">{event.title}</h3>
                      <p className="text-ewc-silver text-sm line-clamp-2">{event.description}</p>
                      {event.time && (
                        <p className="flex items-center gap-1.5 text-xs text-ewc-slate mt-2">
                          <Clock size={12} /> {event.time}
                        </p>
                      )}
                      {event.location && (
                        <p className="flex items-center gap-1.5 text-xs text-ewc-slate mt-1">
                          <MapPin size={12} /> {event.location}
                        </p>
                      )}

                      {/* Ticket Info */}
                      {hasTickets && (
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-ewc-mist">
                          <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-ewc-burgundy">
                            <Ticket size={13} />
                            {allFree ? "Free" : `From $${lowestPrice?.toFixed(2)}`}
                          </div>
                          {event.registrationOpen && (
                            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-heading font-bold uppercase tracking-wider">
                              Open
                            </span>
                          )}
                          {event.maxCapacity && (
                            <div className="flex items-center gap-1 text-[11px] text-ewc-silver ml-auto">
                              <Users size={11} />
                              {event._count.registrations}/{event.maxCapacity}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="bg-white section-padding">
          <div className="section-container">
            <div className="text-center mb-14">
              <h2 className="section-title">Past Events</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <Link href={`/events/${event.id}`} key={event.id} className="card opacity-80 hover:opacity-100 transition-opacity block">
                  <div className="flex items-start gap-4">
                    <div className="bg-ewc-light rounded-xl p-3 text-center flex-shrink-0">
                      <p className="text-ewc-silver font-heading font-bold text-xs uppercase">
                        {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                      </p>
                      <p className="text-2xl font-bold text-ewc-silver/70 leading-none">
                        {new Date(event.date).getDate()}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-heading font-bold text-ewc-charcoal mb-1 truncate">{event.title}</h3>
                      <p className="text-ewc-silver text-sm line-clamp-2">{event.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 burgundy-gradient" />
        <div className="relative section-container py-20 text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-4">
            Don&apos;t Miss Out
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-10 text-lg">
            Join us for our next service or special event — there&apos;s always a place for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <Link href="/contact" className="btn-navy w-full sm:w-auto px-8 py-4">
              Plan Your Visit <ArrowRight size={16} className="ml-2" />
            </Link>
            <Link href="/live" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-heading font-semibold rounded-lg transition-all duration-300 hover:bg-white hover:text-ewc-charcoal text-sm uppercase tracking-wider active:scale-95">
              Watch Online <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
