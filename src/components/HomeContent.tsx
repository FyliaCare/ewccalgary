"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  ArrowRight,
  Play,
  Users,
  Heart,
  BookOpen,
  ChevronRight,
  Youtube,
  Instagram,
  Sparkles,
  Globe,
} from "lucide-react";
import Image from "next/image";
import VolunteerModal from "@/components/VolunteerModal";

const serviceTimes = [
  { day: "Sunday", time: "10:00 AM", label: "Family Service", icon: "🙏" },
  { day: "Friday", time: "7:00 PM", label: "WILDFIRE", icon: "🔥" },
];

const communities = [
  { name: "Love", color: "bg-rose-500", lightBg: "bg-rose-50", textColor: "text-rose-600" },
  { name: "Faith", color: "bg-blue-500", lightBg: "bg-blue-50", textColor: "text-blue-600" },
  { name: "Hope", color: "bg-emerald-500", lightBg: "bg-emerald-50", textColor: "text-emerald-600" },
  { name: "Grace", color: "bg-purple-500", lightBg: "bg-purple-50", textColor: "text-purple-600" },
  { name: "Favour", color: "bg-amber-500", lightBg: "bg-amber-50", textColor: "text-amber-600" },
];

const quickLinks = [
  { title: "Watch Live", description: "Stream our services online", href: "/live", icon: Play, color: "bg-red-50 text-red-500", isModal: false },
  { title: "Volunteer", description: "Serve with your gifts", href: "#", icon: Users, color: "bg-blue-50 text-blue-500", isModal: true },
  { title: "Give / Seeds", description: "Support the ministry", href: "/give", icon: Heart, color: "bg-emerald-50 text-emerald-500", isModal: false },
  { title: "Sermons", description: "Watch past messages", href: "/sermons", icon: BookOpen, color: "bg-purple-50 text-purple-500", isModal: false },
];

export default function HomeContent() {
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [showVolunteerPrompt, setShowVolunteerPrompt] = useState(false);

  // Show the volunteer prompt after 8 seconds, but only once per session
  useEffect(() => {
    const hasSeenPrompt = sessionStorage.getItem("ewc-volunteer-prompt");
    if (!hasSeenPrompt) {
      const timer = setTimeout(() => {
        setShowVolunteerPrompt(true);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  function dismissPrompt() {
    setShowVolunteerPrompt(false);
    sessionStorage.setItem("ewc-volunteer-prompt", "true");
  }

  function openVolunteerModal() {
    dismissPrompt();
    setShowVolunteerModal(true);
  }

  return (
    <>
      {/* Volunteer Prompt Banner — slides in from bottom */}
      {showVolunteerPrompt && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] w-[95%] max-w-lg animate-slide-up">
          <div className="relative bg-white rounded-2xl shadow-2xl border border-ewc-gold-light overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 gold-gradient" />
            <button
              onClick={dismissPrompt}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors text-sm"
            >
              ✕
            </button>
            <div className="p-5 flex items-center gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-ewc-gold-50 flex items-center justify-center">
                <Users size={26} className="text-ewc-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-heading font-bold text-ewc-charcoal text-base mb-0.5">
                  Ready to Make a Difference?
                </h4>
                <p className="text-ewc-silver text-xs leading-snug">
                  Join our volunteer team and serve with your gifts. Sign up takes less than 2 minutes!
                </p>
              </div>
            </div>
            <div className="px-5 pb-4 flex gap-3">
              <button
                onClick={openVolunteerModal}
                className="btn-gold flex-1 py-2.5 text-xs"
              >
                <Sparkles size={14} className="mr-1.5" />
                Sign Up Now
              </button>
              <button
                onClick={dismissPrompt}
                className="px-4 py-2.5 rounded-lg text-ewc-silver hover:text-ewc-charcoal text-xs font-heading font-semibold transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Volunteer Modal */}
      <VolunteerModal
        isOpen={showVolunteerModal}
        onClose={() => setShowVolunteerModal(false)}
      />

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ewc-gold-50 via-white to-ewc-cream" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-ewc-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-ewc-gold/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-ewc-gold/5" />

        <div className="relative section-container py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ewc-gold/10 border border-ewc-gold/20 text-ewc-gold font-heading text-xs font-bold uppercase tracking-[0.2em] mb-8">
                <Sparkles size={14} />
                Empowerment Worship Centre — Calgary Campus
              </span>
            </div>

            <h1 className="font-heading font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-ewc-charcoal leading-[0.95] mb-8 animate-slide-up">
              Welcome{" "}
              <span className="relative inline-block">
                <span className="text-ewc-gold">Home</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8C50 2 150 2 198 8" stroke="#d4a017" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
                </svg>
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-ewc-slate text-lg sm:text-xl leading-relaxed mb-4 animate-slide-up">
              A Bible-believing church with a mandate to win souls and prepare
              them for the soon coming of Christ.
            </p>

            <p className="max-w-xl mx-auto text-ewc-silver text-sm mb-12 animate-slide-up">
              Global Lead Pastor: Prophet Gideon Danso &bull; Campus Pastor: Humphrey Lomotey
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
              <Link href="/about" className="btn-gold px-8 py-4 text-sm shadow-warm-lg">
                Discover EWC Calgary
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <button onClick={openVolunteerModal} className="btn-outline px-8 py-4 text-sm">
                <Users size={16} className="mr-2" />
                Volunteer With Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="bg-white section-padding border-t border-ewc-mist/50">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="section-label">Join Us</span>
            <h2 className="section-title mt-3">Service Times</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {serviceTimes.map((service) => (
              <div key={service.day} className="card text-center group">
                <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">{service.icon}</span>
                <h3 className="font-heading font-bold text-xl text-ewc-charcoal mb-2">{service.day}</h3>
                <p className="text-ewc-gold text-2xl font-heading font-bold mb-1">{service.time}</p>
                <p className="text-ewc-silver text-sm">{service.label}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ewc-light text-ewc-slate text-sm">
              <MapPin size={16} className="text-ewc-gold" />
              <span>225 Chaparral Drive SE, Calgary, Alberta</span>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer CTA Section — moved up! */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ewc-navy via-ewc-navy to-gray-900 section-padding">
        <div className="absolute top-0 right-0 w-96 h-96 bg-ewc-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-ewc-gold/5 rounded-full blur-3xl" />
        <div className="relative section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-ewc-gold-hover font-heading text-xs font-bold uppercase tracking-[0.25em] mb-4">
                <Users size={14} /> Join the Team
              </span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6 leading-tight">
                Your Gifts Were Made to{" "}
                <span className="text-ewc-gold-hover">Serve</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                The body of Christ functions best when every member contributes their
                unique gifts. Whether it&apos;s worship, media, hospitality, or kids ministry —
                there&apos;s a place for you here.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["Media / Creative", "Worship Team", "Ushering", "Kidz Church", "Technical", "Hospitality"].map((dept) => (
                  <span
                    key={dept}
                    className="px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-heading font-medium"
                  >
                    {dept}
                  </span>
                ))}
              </div>
              <button
                onClick={openVolunteerModal}
                className="btn-gold px-8 py-4 text-sm shadow-warm-lg"
              >
                <Heart size={16} className="mr-2" />
                Sign Up to Volunteer
              </button>
            </div>

            {/* Instagram Reel Embed */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <a
                  href="https://www.instagram.com/reel/DTLd5GvCEKk/?igsh=MTFmdmZoY21tbXM4Mw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-amber-400 p-[2px]">
                    <div className="rounded-2xl overflow-hidden bg-gray-900">
                      <div className="aspect-[9/16] max-h-[420px] w-full flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                          <Instagram size={36} className="text-white" />
                        </div>
                        <p className="text-white font-heading font-bold text-lg mb-2">
                          Watch on Instagram
                        </p>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                          See what volunteering at EWC Calgary looks like! Tap to watch our latest reel.
                        </p>
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 text-white text-xs font-heading font-bold uppercase tracking-wider group-hover:shadow-lg transition-shadow">
                          <Play size={14} />
                          Watch Reel
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
                <p className="text-center mt-4">
                  <a
                    href="https://www.instagram.com/ewccalgary"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-xs font-heading font-semibold transition-colors"
                  >
                    <Instagram size={14} />
                    @ewccalgary
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Message */}
      <section className="bg-ewc-snow section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-label">From Our Campus Pastor</span>
              <h2 className="section-title mt-3 mb-6">You Belong Here</h2>
              <div className="space-y-4 text-ewc-slate leading-relaxed text-[15px]">
                <p>
                  Welcome to Empowerment Worship Centre, Calgary. We are a family of
                  believers passionate about the presence of God, rooted in His Word,
                  and committed to building a community where every person can discover
                  Jesus in a new and exciting way.
                </p>
                <p>
                  Under the global leadership of Prophet Gideon Danso, EWC Calgary
                  is a place where faith comes alive, lives are transformed, and
                  purpose is discovered. Whether you&apos;re a long-time believer or
                  exploring faith for the first time, there is a place for you here.
                </p>
                <p>
                  Our Community Circles — Love, Faith, Hope, Grace, and Favour —
                  provide intimate spaces for deep connection, accountability, and
                  spiritual growth. We invite you to come experience the warmth of
                  our family.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center shadow-warm">
                  <span className="font-heading font-bold text-white text-lg">HL</span>
                </div>
                <div>
                  <p className="font-heading font-bold text-ewc-charcoal">Pastor Humphrey Lomotey</p>
                  <p className="text-ewc-gold text-sm font-medium">Campus Pastor, EWC Calgary</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-soft-lg">
                <Image
                  src="/Homepage photo of Pastor Humphrey.jpeg"
                  alt="Pastor Humphrey Lomotey — Campus Pastor, EWC Calgary"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="absolute -bottom-3 -right-3 w-full h-full rounded-3xl border-2 border-ewc-gold/15 -z-10" />
              <div className="absolute -top-3 -left-3 w-20 h-20 rounded-2xl bg-ewc-gold/10 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-white section-padding">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="section-label">Get Connected</span>
            <h2 className="section-title mt-3">How Can We Help You?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link) =>
              link.isModal ? (
                <button
                  key={link.title}
                  onClick={openVolunteerModal}
                  className="card group text-center"
                >
                  <div className={`w-16 h-16 rounded-2xl ${link.color} mx-auto mb-5 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <link.icon size={28} />
                  </div>
                  <h3 className="font-heading font-bold text-ewc-charcoal text-lg mb-2">{link.title}</h3>
                  <p className="text-ewc-silver text-sm mb-4">{link.description}</p>
                  <span className="text-ewc-gold text-sm font-heading font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Sign Up <ChevronRight size={14} />
                  </span>
                </button>
              ) : (
                <Link key={link.title} href={link.href} className="card group text-center">
                  <div className={`w-16 h-16 rounded-2xl ${link.color} mx-auto mb-5 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <link.icon size={28} />
                  </div>
                  <h3 className="font-heading font-bold text-ewc-charcoal text-lg mb-2">{link.title}</h3>
                  <p className="text-ewc-silver text-sm mb-4">{link.description}</p>
                  <span className="text-ewc-gold text-sm font-heading font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn More <ChevronRight size={14} />
                  </span>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Community Circles */}
      <section className="bg-ewc-gold-50 section-padding">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="section-label">Community Circles</span>
            <h2 className="section-title mt-3 mb-4">Find Your Circle</h2>
            <p className="section-subtitle mx-auto">
              The community system ensures the mission and vision of EWC is
              transported into practical daily living. Connection. Conversation.
              Care. Accountability.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-5">
            {communities.map((community) => (
              <div key={community.name} className="group cursor-pointer">
                <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-3xl ${community.lightBg} border-2 border-white/80 flex items-center justify-center shadow-soft group-hover:scale-110 group-hover:shadow-soft-lg transition-all duration-300`}>
                  <div className="text-center">
                    <div className={`w-8 h-8 rounded-full ${community.color} mx-auto mb-2`} />
                    <span className={`font-heading font-bold text-base sm:text-lg ${community.textColor}`}>{community.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/about#community-circles" className="btn-outline">
              Learn About Circles
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Global Connection */}
      <section className="bg-ewc-navy section-padding">
        <div className="section-container text-center">
          <span className="inline-flex items-center gap-2 text-ewc-gold-hover font-heading text-xs font-bold uppercase tracking-[0.25em] mb-3">
            <Globe size={14} /> A Global Family
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
            Connected to EWC Worldwide
          </h2>
          <p className="max-w-3xl mx-auto text-gray-400 leading-relaxed mb-12">
            EWC Calgary is part of the global Empowerment Worship Centre family,
            founded by Prophet Gideon Danso in Accra, Ghana. With campuses across
            Ghana, London, New Jersey, Berlin, and now Calgary — we are one
            family, one vision, one mandate.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { value: "20+", label: "Campuses" },
              { value: "5", label: "Countries" },
              { value: "66K+", label: "YouTube Family" },
              { value: "68K+", label: "Facebook Family" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading font-bold text-4xl text-ewc-gold-hover">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-2">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-12">
            <a href="https://www.youtube.com/c/EmpowermentWorshipCentre" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-heading font-semibold uppercase tracking-wider hover:bg-white/20 transition-colors">
              <Youtube size={16} /> YouTube
            </a>
            <a href="https://www.instagram.com/reel/DTLd5GvCEKk/?igsh=MTFmdmZoY21tbXM4Mw==" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-400/20 text-white text-xs font-heading font-semibold uppercase tracking-wider hover:from-purple-500/30 hover:via-pink-500/30 hover:to-amber-400/30 transition-colors border border-pink-500/20">
              <Instagram size={16} /> Instagram
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gold-gradient" />
        <div className="relative section-container py-20 text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-4">
            Ready to Get Involved?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-10 text-lg">
            Whether you want to volunteer, join a community circle, or simply
            visit us this Sunday — we&apos;d love to welcome you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={openVolunteerModal} className="btn-navy px-8 py-4">
              Sign Up to Volunteer
            </button>
            <Link href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-heading font-semibold rounded-lg transition-all duration-300 hover:bg-white hover:text-ewc-charcoal text-sm uppercase tracking-wider">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
