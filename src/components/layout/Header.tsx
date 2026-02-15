"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Leadership", href: "/leadership" },
  { name: "Ministries", href: "/ministries" },
  { name: "Events", href: "/events" },
  { name: "Sermons", href: "/sermons" },
  { name: "Live", href: "/live" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-soft border-b border-ewc-mist/50"
          : "bg-white/70 backdrop-blur-md"
      )}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/Ewc Calgary Logo.jpeg"
              alt="EWC Calgary Logo"
              width={44}
              height={44}
              className="rounded-xl shadow-warm object-cover"
            />
            <div className="flex flex-col">
              <span className="font-heading font-bold text-ewc-charcoal text-lg leading-tight tracking-wide">
                EWC
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-ewc-gold font-heading font-semibold">
                Calgary
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-[13px] font-heading font-semibold uppercase tracking-wider transition-all duration-200 rounded-lg relative",
                  pathname === item.href
                    ? "text-ewc-gold"
                    : "text-ewc-slate hover:text-ewc-gold"
                )}
              >
                {item.name}
                {pathname === item.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-ewc-gold rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/volunteer" className="btn-outline text-xs py-2 px-4">
              Volunteer
            </Link>
            <Link href="/give" className="btn-gold text-xs py-2 px-4">
              Give
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-ewc-charcoal hover:text-ewc-gold transition-colors rounded-lg hover:bg-ewc-light"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-ewc-mist animate-slide-down shadow-soft-lg">
          <div className="section-container py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 text-sm font-heading font-semibold uppercase tracking-wider rounded-xl transition-colors",
                  pathname === item.href
                    ? "text-ewc-gold bg-ewc-gold-50"
                    : "text-ewc-slate hover:text-ewc-gold hover:bg-ewc-light"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex gap-3 pt-4 px-4">
              <Link
                href="/volunteer"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-outline text-xs py-2.5 px-4 flex-1 text-center"
              >
                Volunteer
              </Link>
              <Link
                href="/give"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-gold text-xs py-2.5 px-4 flex-1 text-center"
              >
                Give
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
