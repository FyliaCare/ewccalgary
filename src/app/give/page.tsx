"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Gift, BookOpen, DollarSign, ArrowRight, CheckCircle, AlertCircle, Shield } from "lucide-react";

const categories = [
  { name: "Tithe", icon: BookOpen, description: "Honour the Lord with your wealth", color: "bg-amber-50 text-amber-500" },
  { name: "Offering", icon: Gift, description: "A cheerful gift to the Lord", color: "bg-blue-50 text-blue-500" },
  { name: "Missions", icon: Heart, description: "Support global outreach", color: "bg-rose-50 text-rose-500" },
  { name: "Building Fund", icon: DollarSign, description: "Invest in our physical home", color: "bg-emerald-50 text-emerald-500" },
];

export default function GivePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    amount: "",
    category: "Tithe",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit donation");
      }

      setStatus("success");
      setForm({ name: "", email: "", amount: "", category: "Tithe", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/Seed In the soil .jpeg"
            alt="Seed in the soil — Sowing into the Kingdom"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
        <div className="relative section-container text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-heading text-xs font-bold uppercase tracking-[0.2em] mb-4">Give</span>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl lg:text-6xl text-white mb-4 sm:mb-6 mt-3 px-2">
            Generosity Changes
            <span className="block text-ewc-burgundy-hover">Everything</span>
          </h1>
          <p className="max-w-2xl mx-auto text-white/90 text-base sm:text-lg leading-relaxed px-2">
            &ldquo;Each of you should give what you have decided in your heart to give,
            not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
            <span className="block text-ewc-burgundy-hover mt-1 text-sm font-heading">— 2 Corinthians 9:7</span>
          </p>
        </div>
      </section>

      {/* Category Cards */}
      <section className="bg-white section-padding">
        <div className="section-container">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto mb-10 sm:mb-14">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setForm({ ...form, category: cat.name })}
                className={`card p-4 sm:p-6 text-center transition-all ${
                  form.category === cat.name
                    ? "border-ewc-burgundy shadow-warm ring-2 ring-ewc-burgundy/20"
                    : "hover:border-ewc-burgundy/30"
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl ${cat.color} mx-auto mb-3 flex items-center justify-center`}>
                  <cat.icon size={22} />
                </div>
                <h3 className="font-heading font-bold text-ewc-charcoal text-sm mb-0.5">{cat.name}</h3>
                <p className="text-ewc-silver text-xs">{cat.description}</p>
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="max-w-xl mx-auto">
            <div className="card p-5 sm:p-8">
              <h2 className="font-heading font-bold text-2xl text-ewc-charcoal mb-6 text-center">
                Make a Donation
              </h2>

              {status === "success" ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-emerald-500" />
                  </div>
                  <h3 className="font-heading font-bold text-ewc-charcoal text-lg mb-2">Thank You!</h3>
                  <p className="text-ewc-silver text-sm mb-6">
                    Your generous donation has been recorded. God bless you!
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="btn-outline px-6 py-2.5"
                  >
                    Give Again
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {status === "error" && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-heading text-ewc-charcoal mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-heading text-ewc-charcoal mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-field"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-heading text-ewc-charcoal mb-1.5">Amount ($CAD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ewc-silver font-heading">$</span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        required
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        className="input-field pl-8"
                        placeholder="0.00"
                      />
                    </div>
                    {/* Quick amounts */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["25", "50", "100", "250"].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setForm({ ...form, amount: amt })}
                          className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg text-xs font-heading transition-all ${
                            form.amount === amt
                              ? "bg-ewc-burgundy text-white"
                              : "bg-ewc-light text-ewc-slate hover:bg-ewc-mist"
                          }`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-heading text-ewc-charcoal mb-1.5">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="input-field"
                    >
                      {categories.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-heading text-ewc-charcoal mb-1.5">
                      Message <span className="text-ewc-silver">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="input-field resize-none"
                      placeholder="Any notes or prayer requests..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="btn-burgundy w-full py-3.5 disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Heart size={16} /> Give ${form.amount || "0"}
                      </span>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-ewc-silver mt-2">
                    <Shield size={12} />
                    Secure and confidential
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Give */}
      <section className="bg-ewc-snow section-padding">
        <div className="section-container">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="section-title">Why We Give</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {[
              { title: "Community Impact", desc: "Your giving supports local outreach, food drives, and community support programs in Calgary." },
              { title: "Ministry Growth", desc: "Funds help sustain our worship services, children and youth programs, and community circles." },
              { title: "Global Missions", desc: "Part of every offering goes toward EWC's global mission work across multiple countries." },
            ].map((item) => (
              <div key={item.title} className="card-warm text-center">
                <h3 className="font-heading font-bold text-ewc-charcoal mb-2">{item.title}</h3>
                <p className="text-ewc-silver text-sm sm:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 burgundy-gradient" />
        <div className="relative section-container py-16 sm:py-20 text-center">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-4 px-2">
            Every Gift Makes a Difference
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8 sm:mb-10 text-base sm:text-lg px-4">
            No amount is too small. Every seed sown in faith produces a harvest.
          </p>
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="btn-navy px-8 py-4 w-full sm:w-auto">
            Give Now <ArrowRight size={16} className="ml-2" />
          </a>
        </div>
      </section>
    </>
  );
}
