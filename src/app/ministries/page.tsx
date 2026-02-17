import type { Metadata } from "next";
import Link from "next/link";
import { Music, BookOpen, Heart, Users, Palette, Baby, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Ministries",
  description:
    "Explore the ministries at EWC Calgary — worship, children, youth, prayer, media, and community outreach.",
};

const ministries = [
  {
    name: "Worship & Music",
    icon: Music,
    description:
      "Our worship team leads the congregation into dynamic praise and worship. We welcome singers, musicians, and sound technicians who are passionate about using their gifts for God's glory.",
    bg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    name: "Children's Ministry",
    icon: Baby,
    description:
      "We provide a safe, fun, and faith-building environment for children ages 3–12. Through creative lessons, activities, and worship, we help kids develop a strong foundation of faith.",
    bg: "bg-pink-50",
    iconColor: "text-pink-500",
  },
  {
    name: "Youth Ministry",
    icon: Users,
    description:
      "Our youth ministry equips teenagers and young adults (ages 13–25) with the Word, mentorship, and community to navigate life with boldness and purpose.",
    bg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    name: "Prayer Ministry",
    icon: BookOpen,
    description:
      "The backbone of our church. Our prayer warriors intercede for the church, city, and nations through weekly prayer meetings and special all-night prayer services.",
    bg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    name: "Media & Creative Arts",
    icon: Palette,
    description:
      "From live streaming to graphic design, our media team captures and shares the EWC experience with the world. We welcome photographers, videographers, editors, and designers.",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    name: "Community Outreach",
    icon: Heart,
    description:
      "We serve our surrounding community through food drives, charitable giving, and acts of kindness. Our outreach team is driven by a heart to meet practical needs and share the love of Christ.",
    bg: "bg-rose-50",
    iconColor: "text-rose-500",
  },
];

export default function MinistriesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ewc-burgundy-50 via-white to-ewc-cream" />
        <div className="absolute bottom-10 left-20 w-48 sm:w-72 h-48 sm:h-72 bg-emerald-100/20 rounded-full blur-3xl" />
        <div className="relative section-container text-center">
          <span className="section-label">Ministries</span>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl lg:text-6xl text-ewc-charcoal mb-4 sm:mb-6 mt-3 px-2">
            Get Plugged In &
            <span className="block text-ewc-burgundy">Serve With Purpose</span>
          </h1>
          <p className="max-w-2xl mx-auto text-ewc-slate text-base sm:text-lg leading-relaxed px-2">
            Our ministries are the heartbeat of EWC Calgary — find your place,
            use your gifts, and make a difference.
          </p>
        </div>
      </section>

      {/* Ministry Cards */}
      <section className="bg-white section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {ministries.map((ministry) => (
              <div key={ministry.name} className="card group hover:border-ewc-burgundy/30">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${ministry.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <ministry.icon size={22} className={ministry.iconColor} />
                </div>
                <h3 className="font-heading font-bold text-lg text-ewc-charcoal mb-2">
                  {ministry.name}
                </h3>
                <p className="text-ewc-silver text-sm leading-relaxed">
                  {ministry.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="bg-ewc-burgundy-50 section-padding">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <Sparkles size={32} className="text-ewc-burgundy mx-auto mb-4" />
            <h2 className="section-title mb-4">Discover Your Calling</h2>
            <p className="text-ewc-slate leading-relaxed mb-8">
              Everyone has a unique gift and role to play in the body of Christ.
              Whether you&apos;re a seasoned servant or just exploring, we&apos;ll help
              you find the right ministry to serve in. Join us and make an
              impact that matters.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
              <Link href="/volunteer" className="btn-burgundy px-8 py-4 w-full sm:w-auto">
                Volunteer Today <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link href="/contact" className="btn-outline px-8 py-4 w-full sm:w-auto">
                Ask a Question
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 burgundy-gradient" />
        <div className="relative section-container py-16 sm:py-20 text-center">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-4 px-2">
            Serve Together, Grow Together
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8 sm:mb-10 text-base sm:text-lg px-4">
            Ministry is not just about serving — it&apos;s about growing in faith,
            building friendships, and becoming who God created you to be.
          </p>
          <Link href="/volunteer" className="btn-navy px-8 py-4 w-full sm:w-auto">
            Join a Ministry <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </section>
    </>
  );
}
