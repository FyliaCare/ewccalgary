"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Heart, ArrowRight, AlertCircle } from "lucide-react";

export default function VolunteerPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    experience: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit application");
      }

      router.push("/volunteer/success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  const updateForm = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <>
      {/* Hero */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ewc-gold-50 via-white to-ewc-cream" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-100/20 rounded-full blur-3xl" />
        <div className="relative section-container text-center">
          <span className="section-label">Volunteer</span>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-ewc-charcoal mb-6 mt-3">
            Make a Difference
            <span className="block text-ewc-gold">With Us</span>
          </h1>
          <p className="max-w-2xl mx-auto text-ewc-slate text-lg leading-relaxed">
            Use your gifts and talents to serve the body of Christ. Join one of
            our ministry teams and help us impact Calgary for the Kingdom.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="bg-white section-padding">
        <div className="section-container">
          <div className="max-w-2xl mx-auto">
            <div className="card p-8">
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-ewc-gold-50 flex items-center justify-center mx-auto mb-4">
                  <Users size={26} className="text-ewc-gold" />
                </div>
                <h2 className="font-heading font-bold text-2xl text-ewc-charcoal mb-2">
                  Volunteer Application
                </h2>
                <p className="text-ewc-silver text-sm">
                  Fill out the form below and a ministry leader will be in touch.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {status === "error" && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-heading text-ewc-charcoal mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => updateForm("firstName", e.target.value)}
                      className="input-field"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-heading text-ewc-charcoal mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.lastName}
                      onChange={(e) => updateForm("lastName", e.target.value)}
                      className="input-field"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-heading text-ewc-charcoal mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      className="input-field"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-heading text-ewc-charcoal mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      className="input-field"
                      placeholder="+1 (403) 000-0000"
                    />
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-heading text-ewc-charcoal mb-1.5">
                    Tell us about yourself <span className="text-ewc-silver">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={form.experience}
                    onChange={(e) => updateForm("experience", e.target.value)}
                    className="input-field resize-none"
                    placeholder="Share any relevant skills, experience, or anything you'd like us to know..."
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-heading text-ewc-charcoal mb-1.5">
                    Additional Message <span className="text-ewc-silver">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => updateForm("message", e.target.value)}
                    className="input-field resize-none"
                    placeholder="Anything else you'd like us to know..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-gold w-full py-3.5 disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Heart size={16} /> Submit Application
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gold-gradient" />
        <div className="relative section-container py-20 text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-4">
            Together We Are Stronger
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
            The body of Christ functions best when every member contributes their
            unique gifts. Your service matters.
          </p>
          <a href="/ministries" className="btn-navy px-8 py-4">
            Explore Ministries <ArrowRight size={16} className="ml-2" />
          </a>
        </div>
      </section>
    </>
  );
}
