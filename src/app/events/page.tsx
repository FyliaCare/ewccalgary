"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight, Sparkles } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string | null;
  location: string | null;
  type: string;
  isRecurring: boolean;
  imageUrl: string | null;
}

const serviceSchedule = [
  { day: "Sunday", title: "Sunday Worship Service", time: "10:00 AM - 12:30 PM", emoji: "🙏" },
  { day: "Tuesday", title: "Community Circle Meeting", time: "7:00 PM", emoji: "🤝" },
  { day: "Friday", title: "All Night Prayer (Last Friday)", time: "10:00 PM - 4:00 AM", emoji: "🔥" },
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
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ewc-gold-50 via-white to-ewc-cream" />
        <div className="absolute top-10 left-10 w-56 h-56 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="relative section-container text-center">
          <span className="section-label">Events & Services</span>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-ewc-charcoal mb-6 mt-3">
            Gather, Worship &
            <span className="block text-ewc-gold">Grow Together</span>
          </h1>
          <p className="max-w-2xl mx-auto text-ewc-slate text-lg leading-relaxed">
            Weekly services, special events, and community gatherings — there&apos;s always
            something happening at EWC Calgary.
          </p>
        </div>
      </section>

      {/* Service Schedule */}
      <section className="bg-white section-padding">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="section-label">Weekly Schedule</span>
            <h2 className="section-title mt-3">Regular Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {serviceSchedule.map((service) => (
              <div key={service.day} className="card text-center group hover:border-ewc-gold/30">
                <div className="text-4xl mb-4">{service.emoji}</div>
                <p className="text-xs text-ewc-gold font-heading font-bold uppercase tracking-wider mb-1">
                  {service.day}
                </p>
                <h3 className="font-heading text-lg font-bold text-ewc-charcoal mb-2">{service.title}</h3>
                <div className="flex items-center justify-center gap-2 text-sm text-ewc-silver">
                  <Clock size={14} />
                  <span>{service.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ewc-light text-ewc-slate text-sm">
              <MapPin size={14} className="text-ewc-gold" />
              225 Chaparral Drive SE, Calgary, AB
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-ewc-snow section-padding">
        <div className="section-container">
          <div className="text-center mb-14">
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
              <Calendar size={48} className="mx-auto text-ewc-gold/40 mb-4" />
              <h3 className="font-heading font-bold text-ewc-charcoal text-lg mb-2">No Upcoming Events</h3>
              <p className="text-ewc-silver text-sm">
                Check back soon for upcoming events and special services.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="card group hover:border-ewc-gold/30">
                  {event.imageUrl && (
                    <div className="relative h-44 bg-ewc-light rounded-xl mb-4 overflow-hidden">
                      <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="bg-ewc-gold-50 rounded-xl p-3 text-center flex-shrink-0">
                      <p className="text-ewc-gold font-heading font-bold text-xs uppercase">
                        {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                      </p>
                      <p className="text-2xl font-bold text-ewc-charcoal leading-none">
                        {new Date(event.date).getDate()}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-ewc-light text-ewc-silver text-[11px] uppercase tracking-wider font-heading mb-1.5">
                        {event.type}
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
                    </div>
                  </div>
                </div>
              ))}
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
                <div key={event.id} className="card opacity-80 hover:opacity-100 transition-opacity">
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
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gold-gradient" />
        <div className="relative section-container py-20 text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-4">
            Don&apos;t Miss Out
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-10 text-lg">
            Join us for our next service or special event — there&apos;s always a place for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn-navy px-8 py-4">
              Plan Your Visit <ArrowRight size={16} className="ml-2" />
            </Link>
            <Link href="/live" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-heading font-semibold rounded-lg transition-all duration-300 hover:bg-white hover:text-ewc-charcoal text-sm uppercase tracking-wider">
              Watch Online <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
