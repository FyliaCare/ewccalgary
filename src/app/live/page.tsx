import type { Metadata } from "next";
import Link from "next/link";
import { Play, Clock, Calendar, Radio, ArrowRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Watch Live",
  description:
    "Watch EWC Calgary services live on YouTube. Join us for Sunday worship and special events online.",
};

const schedule = [
  { day: "Sunday", service: "Sunday Worship Service", time: "10:00 AM MST", live: true },
  { day: "Tuesday", service: "Community Circle Meeting", time: "7:00 PM MST", live: false },
  { day: "Friday (Last of month)", service: "All Night Prayer", time: "10:00 PM MST", live: true },
];

export default function LivePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ewc-burgundy-50 via-white to-ewc-cream" />
        <div className="absolute top-10 right-20 w-64 h-64 bg-red-100/20 rounded-full blur-3xl" />
        <div className="relative section-container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-500 text-sm font-heading mb-6">
            <Radio size={14} className="animate-pulse" /> Live Stream
          </div>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-ewc-charcoal mb-6">
            Watch
            <span className="block text-ewc-burgundy">Online</span>
          </h1>
          <p className="max-w-2xl mx-auto text-ewc-slate text-lg leading-relaxed">
            Can&apos;t make it in person? Join us live from anywhere in the world.
            Experience powerful worship and the Word of God online.
          </p>
        </div>
      </section>

      {/* YouTube Embed */}
      <section className="bg-white section-padding">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-elevation bg-ewc-charcoal">
              <iframe
                src="https://www.youtube.com/embed/live_stream?channel=UCyour_channel_id"
                title="EWC Calgary Live Stream"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="text-center mt-6">
              <a
                href="https://www.youtube.com/@empowermentworshipcentre"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-ewc-burgundy font-heading text-sm hover:text-ewc-burgundy-hover transition-colors"
              >
                Open in YouTube <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stream Schedule */}
      <section className="bg-ewc-snow section-padding">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="section-label">Stream Schedule</span>
            <h2 className="section-title mt-3">When We Go Live</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {schedule.map((item) => (
                <div key={item.day} className="card flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className={`w-10 h-10 rounded-xl ${item.live ? "bg-red-50" : "bg-ewc-light"} flex items-center justify-center`}>
                      {item.live ? (
                        <Play size={18} className="text-red-500 ml-0.5" />
                      ) : (
                        <Calendar size={18} className="text-ewc-silver" />
                      )}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-ewc-charcoal text-sm">{item.day}</p>
                      {item.live && (
                        <span className="text-[10px] uppercase tracking-wider text-red-500 font-heading">Live Streamed</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-ewc-slate text-sm">{item.service}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-ewc-silver flex-shrink-0">
                    <Clock size={14} />
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How to Watch */}
      <section className="bg-white section-padding">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2 className="section-title">How to Watch</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Visit this page", desc: "Come back to this page during our live service times." },
              { step: "2", title: "Subscribe on YouTube", desc: "Subscribe and hit the bell to get notified when we go live." },
              { step: "3", title: "Join the chat", desc: "Participate in the live chat and engage with the community." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-ewc-burgundy-50 text-ewc-burgundy font-heading font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-heading font-bold text-ewc-charcoal mb-2">{item.title}</h3>
                <p className="text-ewc-silver text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 burgundy-gradient" />
        <div className="relative section-container py-20 text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-4">
            Better Together
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
            While online is great, nothing beats worshipping in person.
            Visit us this Sunday!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn-navy px-8 py-4">
              Plan Your Visit <ArrowRight size={16} className="ml-2" />
            </Link>
            <a
              href="https://www.youtube.com/@empowermentworshipcentre"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-heading font-semibold rounded-lg transition-all duration-300 hover:bg-white hover:text-ewc-charcoal text-sm uppercase tracking-wider"
            >
              YouTube Channel <ExternalLink size={14} className="ml-2" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
