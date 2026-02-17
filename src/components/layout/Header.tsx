"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
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

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-area-top",
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-soft border-b border-ewc-mist/50"
          : "bg-white/70 backdrop-blur-md"
      )}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" onClick={closeMenu}>
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
              <span className="text-[10px] uppercase tracking-[0.2em] text-ewc-burgundy font-heading font-semibold">
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
                    ? "text-ewc-burgundy"
                    : "text-ewc-slate hover:text-ewc-burgundy"
                )}
              >
                {item.name}
                {pathname === item.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-ewc-burgundy rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/volunteer" className="btn-outline text-xs py-2 px-4">
              Volunteer
            </Link>
            <Link href="/give" className="btn-burgundy text-xs py-2 px-4">
              Give
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-11 h-11 flex items-center justify-center text-ewc-charcoal hover:text-ewc-burgundy transition-colors rounded-xl hover:bg-ewc-light active:scale-90"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu — full-screen overlay */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 top-[72px] z-40 transition-all duration-300",
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={closeMenu}
        />

        {/* Menu Panel */}
        <div
          className={cn(
            "relative bg-white shadow-soft-lg transition-transform duration-300 ease-out max-h-[calc(100vh-72px)] overflow-y-auto",
            mobileMenuOpen ? "translate-y-0" : "-translate-y-4"
          )}
        >
          <div className="section-container py-4 space-y-1">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className={cn(
                  "flex items-center px-4 py-3.5 text-[15px] font-heading font-semibold uppercase tracking-wider rounded-xl transition-all",
                  pathname === item.href
                    ? "text-ewc-burgundy bg-ewc-burgundy-50"
                    : "text-ewc-slate active:bg-ewc-light"
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {item.name}
                {pathname === item.href && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-ewc-burgundy" />
                )}
              </Link>
            ))}
            <div className="flex gap-3 pt-5 px-4 pb-2">
              <Link
                href="/volunteer"
                onClick={closeMenu}
                className="btn-outline text-xs py-3 px-4 flex-1 text-center"
              >
                Volunteer
              </Link>
              <Link
                href="/give"
                onClick={closeMenu}
                className="btn-burgundy text-xs py-3 px-4 flex-1 text-center"
              >
                Give
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
