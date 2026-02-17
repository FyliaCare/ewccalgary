import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Target, Eye, BookOpen, Heart, Shield, Users, Gem, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Empowerment Worship Centre Calgary — our vision, mission, community circles, and connection to EWC Global under Prophet Gideon Danso.",
};

const coreValues = [
  { name: "Holiness", icon: Shield, description: "Pursuing a life set apart for God's purpose", color: "bg-indigo-50 text-indigo-500" },
  { name: "Prayer", icon: BookOpen, description: "The foundation of our relationship with God", color: "bg-amber-50 text-amber-500" },
  { name: "Grace", icon: Heart, description: "Extending God's unmerited favour to all", color: "bg-rose-50 text-rose-500" },
  { name: "Integrity", icon: Gem, description: "Walking in truth and transparency", color: "bg-emerald-50 text-emerald-500" },
  { name: "Service", icon: Users, description: "Serving one another with love and humility", color: "bg-blue-50 text-blue-500" },
  { name: "Community", icon: Users, description: "Building genuine relationships rooted in Christ", color: "bg-purple-50 text-purple-500" },
];

const communities = [
  {
    name: "Love", lightBg: "bg-rose-50", textColor: "text-rose-600", dotColor: "bg-rose-500",
    verse: "1 Corinthians 13:4-7",
    description: "Love is patient, love is kind. It always protects, always trusts, always hopes, always perseveres.",
  },
  {
    name: "Faith", lightBg: "bg-blue-50", textColor: "text-blue-600", dotColor: "bg-blue-500",
    verse: "Hebrews 11:1",
    description: "Now faith is confidence in what we hope for and assurance about what we do not see.",
  },
  {
    name: "Hope", lightBg: "bg-emerald-50", textColor: "text-emerald-600", dotColor: "bg-emerald-500",
    verse: "Romans 15:13",
    description: "May the God of hope fill you with all joy and peace as you trust in Him.",
  },
  {
    name: "Grace", lightBg: "bg-purple-50", textColor: "text-purple-600", dotColor: "bg-purple-500",
    verse: "Ephesians 2:8",
    description: "For it is by grace you have been saved, through faith — and this is not from yourselves.",
  },
  {
    name: "Favour", lightBg: "bg-amber-50", textColor: "text-amber-600", dotColor: "bg-amber-500",
    verse: "Psalm 5:12",
    description: "Surely, LORD, you bless the righteous; you surround them with your favour as with a shield.",
  },
];

const timeline = [
  { year: "2022", event: "Empowerment Worship Centre official website launched globally" },
  { year: "2024", event: "EWC celebrates global expansion with 20+ campuses across 5 countries" },
  { year: "2025", event: "Canada Campus established under Pastor Humphrey Lomotey" },
  { year: "2026", event: "EWC Calgary moves to physical location at 225 Chaparral Drive SE" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ewc-burgundy-50 via-white to-ewc-cream" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-ewc-burgundy/5 rounded-full blur-3xl" />
        <div className="relative section-container text-center">
          <span className="section-label">About Us</span>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-ewc-charcoal mb-6 mt-3">
            Empowerment Worship Centre
            <span className="block text-ewc-burgundy mt-2">Calgary</span>
          </h1>
          <p className="max-w-2xl mx-auto text-ewc-slate text-lg leading-relaxed">
            A Bible-believing church with a mandate to win souls and prepare them
            for the soon coming of Christ.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-white section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-8 border-l-4 border-l-ewc-burgundy">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                  <Eye size={24} className="text-ewc-burgundy" />
                </div>
                <h2 className="font-heading font-bold text-2xl text-ewc-charcoal">Our Vision</h2>
              </div>
              <p className="text-ewc-slate leading-relaxed">
                To create an atmosphere where today&apos;s person is born, grows,
                serves, and leads others to partake in the EWC Mandate. We
                envision a vibrant community in Calgary where every member
                discovers their God-given purpose and walks boldly in it.
              </p>
            </div>
            <div className="card p-8 border-l-4 border-l-ewc-burgundy">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                  <Target size={24} className="text-ewc-burgundy" />
                </div>
                <h2 className="font-heading font-bold text-2xl text-ewc-charcoal">Our Mandate</h2>
              </div>
              <p className="text-ewc-slate leading-relaxed">
                To win souls and prepare them for the soon coming of Christ.
                Through the preaching of the Gospel, discipleship, community
                circles, and compassionate outreach, we are raising a generation
                of Spirit-filled leaders who transform their world through
                faith, excellence, and purpose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-ewc-snow section-padding">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="section-label">Our Story</span>
              <h2 className="section-title mt-3">From Accra to Calgary</h2>
            </div>
            <div className="space-y-5 text-ewc-slate leading-relaxed text-[15px]">
              <p>
                Empowerment Worship Centre was founded by Prophet Gideon Danso in
                Accra, Ghana. What began as a vision to raise Spirit-filled
                leaders has grown into a global movement with campuses across
                Ghana, London, New Jersey, Berlin, and Canada.
              </p>
              <p>
                Prophet Danso is a visionary leader, teacher, and the Lead Pastor
                of EWC. He is also the Founder of Empowerment Ministries
                Worldwide — a vibrant movement dedicated to raising a new
                generation of Spirit-filled leaders who transform their world
                through faith, excellence, and purpose.
              </p>
              <p>
                The Calgary Campus was established under the pastoral leadership
                of Humphrey Lomotey, extending the EWC family into the heart of
                Alberta, Canada. Located at 225 Chaparral Drive SE, EWC Calgary
                is committed to building a community and a safe space for people
                from all walks of life to discover Jesus in a new and exciting way.
              </p>
              <p>
                Our messages are centred on holiness, prayer, Grace, integrity,
                service, community, and order — knowing the will of God for your
                life and pursuing it. We are focused on building a family where
                everyone belongs.
              </p>
            </div>

            {/* Timeline */}
            <div className="mt-16">
              <h3 className="font-heading font-bold text-xl text-ewc-charcoal mb-8 text-center">Our Journey</h3>
              <div className="relative">
                <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-ewc-burgundy/30" />
                <div className="space-y-8">
                  {timeline.map((item, index) => (
                    <div key={item.year} className={`relative flex items-start gap-6 ${index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                      <div className="hidden sm:block sm:w-1/2" />
                      <div className="absolute left-4 sm:left-1/2 w-3 h-3 rounded-full bg-ewc-burgundy -translate-x-1.5 mt-2 z-10 shadow-warm" />
                      <div className="pl-10 sm:pl-0 sm:w-1/2">
                        <span className="font-heading font-bold text-ewc-burgundy text-lg">{item.year}</span>
                        <p className="text-ewc-slate text-sm mt-1">{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white section-padding">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="section-label">What We Stand For</span>
            <h2 className="section-title mt-3">Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {coreValues.map((value) => (
              <div key={value.name} className="card text-center group">
                <div className={`w-14 h-14 rounded-2xl ${value.color} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <value.icon size={24} />
                </div>
                <h3 className="font-heading font-bold text-ewc-charcoal text-lg mb-2">{value.name}</h3>
                <p className="text-ewc-silver text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Circles */}
      <section id="community-circles" className="bg-ewc-burgundy-50 section-padding">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="section-label">Community Circles</span>
            <h2 className="section-title mt-3 mb-4">Find Your Circle</h2>
            <p className="section-subtitle mx-auto">
              The community system is designed to ensure that the mission and
              vision of Empowerment Worship Centre is transported into practical
              daily living for members.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
            {["Connection", "Conversation", "Care", "Accountability"].map((obj) => (
              <div key={obj} className="text-center p-4 bg-white rounded-2xl shadow-elevation">
                <p className="font-heading font-bold text-ewc-burgundy text-sm uppercase tracking-wider">{obj}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {communities.map((c) => (
              <div key={c.name} className="bg-white rounded-2xl p-6 text-center shadow-soft hover:shadow-soft-lg transition-all group">
                <div className={`w-16 h-16 rounded-2xl ${c.lightBg} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <div className={`w-8 h-8 rounded-full ${c.dotColor}`} />
                </div>
                <h3 className={`font-heading font-bold text-lg mb-1 ${c.textColor}`}>{c.name}</h3>
                <p className="text-ewc-burgundy text-xs font-heading mb-2">{c.verse}</p>
                <p className="text-ewc-silver text-xs leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-ewc-slate text-sm mb-1">Weekly Community Circle Meetings</p>
            <p className="text-ewc-burgundy font-heading font-bold flex items-center justify-center gap-2">
              <Sparkles size={16} /> Every Tuesday at 7:00 PM
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 burgundy-gradient" />
        <div className="relative section-container py-20 text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-4">
            Ready to Join the Family?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-10 text-lg">
            Visit us this Sunday at 225 Chaparral Drive SE, Calgary. We&apos;d
            love to welcome you home.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn-navy px-8 py-4">
              Plan Your Visit <ArrowRight size={16} className="ml-2" />
            </Link>
            <Link href="/volunteer" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-heading font-semibold rounded-lg transition-all duration-300 hover:bg-white hover:text-ewc-charcoal text-sm uppercase tracking-wider">
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
