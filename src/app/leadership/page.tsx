import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Leadership",
  description:
    "Meet the leaders of Empowerment Worship Centre — Prophet Gideon Danso, Lady Gina Danso, and Pastor Humphrey Lomotey.",
};

const leaders = [
  {
    name: "Prophet Gideon Danso",
    role: "Lead Pastor & Founder",
    bio: "Prophet Gideon Danso is the visionary founder of Empowerment Worship Centre and Empowerment Ministries Worldwide. A dynamic teacher and prophetic voice, he has a mandate to raise Spirit-filled leaders who transform their world through faith, excellence, and purpose. Under his leadership, EWC has grown from a single campus in Accra, Ghana to a global movement spanning multiple countries.",
    color: "bg-amber-50",
    accent: "text-amber-600",
    borderColor: "border-l-ewc-gold",
    image: "/Prophet Gideon Danso.jpeg",
  },
  {
    name: "Lady Gina Danso",
    role: "Co-Pastor & Women's Ministry Lead",
    bio: "Lady Gina Danso serves alongside Prophet Danso as co-pastor of EWC. She has a heart for women's empowerment and discipleship, leading the women's ministry with grace and wisdom. Her passion for nurturing families and building strong communities has been instrumental in shaping the culture of love and excellence at EWC.",
    color: "bg-rose-50",
    accent: "text-rose-600",
    borderColor: "border-l-rose-400",
  },
  {
    name: "Pastor Humphrey Lomotey",
    role: "Campus Pastor — EWC Calgary",
    bio: "Pastor Humphrey Lomotey leads the EWC Calgary campus with dedication and pastoral care. Called to extend the EWC vision to Canada, he shepherds the Calgary community with a focus on discipleship, community building, and making the Gospel accessible to all. Under his leadership, EWC Calgary has become a welcoming home for believers from diverse backgrounds.",
    color: "bg-blue-50",
    accent: "text-blue-600",
    borderColor: "border-l-blue-400",
    image: "/Homepage photo of Pastor Humphrey.jpeg",
  },
];

export default function LeadershipPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ewc-gold-50 via-white to-ewc-cream" />
        <div className="absolute top-20 left-10 w-56 h-56 bg-purple-100/20 rounded-full blur-3xl" />
        <div className="relative section-container text-center">
          <span className="section-label">Leadership</span>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-ewc-charcoal mb-6 mt-3">
            Meet Our
            <span className="block text-ewc-gold">Leadership</span>
          </h1>
          <p className="max-w-2xl mx-auto text-ewc-slate text-lg leading-relaxed">
            Servant leaders committed to the Gospel, community, and raising
            the next generation of believers.
          </p>
        </div>
      </section>

      {/* Leadership Cards */}
      <section className="bg-white section-padding">
        <div className="section-container">
          <div className="space-y-10 max-w-4xl mx-auto">
            {leaders.map((leader) => (
              <div
                key={leader.name}
                className={`card p-0 overflow-hidden border-l-4 ${leader.borderColor}`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Avatar area */}
                  <div className={`${leader.color} flex items-center justify-center p-8 md:p-12 md:w-64 flex-shrink-0`}>
                    {leader.image ? (
                      <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-soft relative">
                        <Image
                          src={leader.image}
                          alt={leader.name}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      </div>
                    ) : (
                      <div className="w-28 h-28 rounded-2xl bg-white/60 flex items-center justify-center shadow-soft">
                        <span className="font-heading font-bold text-4xl text-ewc-charcoal/30">
                          {leader.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Content */}
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <span className={`text-xs font-heading font-bold uppercase tracking-wider ${leader.accent} mb-1`}>
                      {leader.role}
                    </span>
                    <h3 className="font-heading font-bold text-xl md:text-2xl text-ewc-charcoal mb-3">
                      {leader.name}
                    </h3>
                    <p className="text-ewc-slate text-sm leading-relaxed">{leader.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Connection */}
      <section className="bg-ewc-navy section-padding">
        <div className="section-container text-center">
          <h2 className="font-heading font-bold text-3xl text-white mb-4">
            Part of a Global Family
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            EWC Calgary is part of Empowerment Worship Centre&apos;s global
            network, with campuses across Ghana, London, New Jersey, Berlin, and
            Canada — all united under one vision and mandate.
          </p>
          <a
            href="https://ewcglobal.org"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-8 py-4"
          >
            Visit EWC Global <ArrowRight size={16} className="ml-2" />
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gold-gradient" />
        <div className="relative section-container py-20 text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-4">
            Join Us This Sunday
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
            Come worship with us and experience the warmth of the EWC family.
          </p>
          <Link href="/contact" className="btn-navy px-8 py-4">
            Plan Your Visit <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </section>
    </>
  );
}
