import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Mail,
  Clock,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Leadership", href: "/leadership" },
  { name: "Ministries", href: "/ministries" },
  { name: "Events", href: "/events" },
  { name: "Sermons", href: "/sermons" },
  { name: "Contact", href: "/contact" },
];

const getInvolved = [
  { name: "Volunteer", href: "/volunteer" },
  { name: "Give / Seeds", href: "/give" },
  { name: "Watch Live", href: "/live" },
  { name: "WILDFIRE (Fridays)", href: "/events" },
  { name: "Events", href: "/events" },
];

const socialLinks = [
  { name: "YouTube", href: "https://www.youtube.com/c/EmpowermentWorshipCentre", icon: Youtube },
  { name: "Instagram", href: "https://www.instagram.com/empowermentworshipcentre", icon: Instagram },
  { name: "Facebook", href: "https://www.facebook.com/ewclife/", icon: Facebook },
  { name: "Twitter", href: "https://twitter.com/ewclife", icon: Twitter },
];

export default function Footer() {
  return (
    <footer className="bg-ewc-navy text-white">
      {/* Main Footer */}
      <div className="section-container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Church Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/Ewc Calgary Logo.jpeg"
                alt="EWC Calgary Logo"
                width={44}
                height={44}
                className="rounded-xl object-cover"
              />
              <div className="flex flex-col">
                <span className="font-heading font-bold text-white text-lg leading-tight">
                  EWC Calgary
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-ewc-gold-hover font-heading font-semibold">
                  Empowerment Worship Centre
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              A Bible-believing church with a mandate to win souls and prepare
              them for the soon coming of Christ. Calgary Campus of Empowerment
              Worship Centre.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-gray-400 hover:text-ewc-gold-hover hover:bg-white/15 transition-all"
                  aria-label={link.name}
                >
                  <link.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white uppercase tracking-wider text-sm mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-ewc-gold-hover transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="font-heading font-semibold text-white uppercase tracking-wider text-sm mb-6">
              Get Involved
            </h4>
            <ul className="space-y-3">
              {getInvolved.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-ewc-gold-hover transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-white uppercase tracking-wider text-sm mb-6">
              Visit Us
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm">
                <MapPin size={18} className="text-ewc-gold-hover shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  225 Chaparral Drive SE,
                  <br />
                  Calgary, Alberta, Canada
                </span>
              </li>
              <li className="flex gap-3 text-sm">
                <Clock size={18} className="text-ewc-gold-hover shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  Sunday Service: 10:00 AM
                </span>
              </li>
              <li className="flex gap-3 text-sm">
                <Mail size={18} className="text-ewc-gold-hover shrink-0 mt-0.5" />
                <a
                  href="mailto:info@ewccalgary.ca"
                  className="text-gray-400 hover:text-ewc-gold-hover transition-colors"
                >
                  info@ewccalgary.ca
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="section-container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Empowerment Worship Centre — Calgary
            Campus. All Rights Reserved.
          </p>
          <p className="text-gray-500 text-xs">
            Global Lead Pastor: Prophet Gideon Danso
          </p>
        </div>
      </div>
    </footer>
  );
}
