"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send message");
      }
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ewc-burgundy-50 via-white to-ewc-cream" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="relative section-container text-center">
          <span className="section-label">Contact Us</span>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-ewc-charcoal mb-6 mt-3">
            Get In
            <span className="block text-ewc-burgundy">Touch</span>
          </h1>
          <p className="max-w-2xl mx-auto text-ewc-slate text-lg leading-relaxed">
            Have a question, prayer request, or want to learn more about EWC Calgary?
            We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="bg-white section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
            {/* Info Column */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="font-heading font-bold text-2xl text-ewc-charcoal mb-6">
                  Contact Information
                </h2>
                <p className="text-ewc-slate text-sm leading-relaxed mb-8">
                  Reach out to us through any of the channels below, or fill out
                  the contact form and we&apos;ll get back to you shortly.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-ewc-charcoal text-sm">Location</p>
                    <p className="text-ewc-silver text-sm">225 Chaparral Drive SE, Calgary, AB</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-ewc-charcoal text-sm">Email</p>
                    <p className="text-ewc-silver text-sm">info@ewccalgary.ca</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-ewc-charcoal text-sm">Phone</p>
                    <p className="text-ewc-silver text-sm">+1 (403) 000-0000</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-ewc-charcoal text-sm">Service Hours</p>
                    <p className="text-ewc-silver text-sm">Sunday: 10:00 AM - 12:30 PM</p>
                    <p className="text-ewc-silver text-sm">Friday: 7:00 PM (WILDFIRE)</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-6 rounded-2xl overflow-hidden border border-ewc-mist shadow-soft">
                <iframe
                  title="EWC Calgary Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2515.0!2d-114.0!3d50.96!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDU3JzM2LjAiTiAxMTTCsDAxJzEyLjAiVw!5e0!3m2!1sen!2sca!4v1"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-3">
              <div className="card p-8">
                <h3 className="font-heading font-bold text-xl text-ewc-charcoal mb-6">Send a Message</h3>

                {status === "success" ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-emerald-500" />
                    </div>
                    <h4 className="font-heading font-bold text-ewc-charcoal text-lg mb-2">Message Sent!</h4>
                    <p className="text-ewc-silver text-sm mb-6">
                      Thank you for reaching out. We&apos;ll get back to you shortly.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="btn-outline px-6 py-2.5"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {status === "error" && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
                        <AlertCircle size={16} />
                        {errorMsg}
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                    </div>
                    <div>
                      <label className="block text-sm font-heading text-ewc-charcoal mb-1.5">Subject</label>
                      <input
                        type="text"
                        required
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="input-field"
                        placeholder="How can we help?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-heading text-ewc-charcoal mb-1.5">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="input-field resize-none"
                        placeholder="Your message..."
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
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Send size={16} /> Send Message
                        </span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
