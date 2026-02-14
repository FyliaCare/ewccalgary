"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Heart, AlertCircle, Sparkles } from "lucide-react";

interface Department {
  id: string;
  name: string;
  description: string | null;
}

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VolunteerModal({ isOpen, onClose }: VolunteerModalProps) {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    departmentId: "",
    secondaryDepartmentId: "",
    experience: "",
    availability: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetch("/api/departments")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setDepartments(data);
        })
        .catch(() => {});

      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

      onClose();
      router.push("/volunteer/success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  const updateForm = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl animate-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>

        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-ewc-gold-50 to-ewc-cream border-b border-ewc-gold-light">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-ewc-gold" />
            <span className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-ewc-gold">
              Serve With Us
            </span>
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ewc-charcoal mb-2">
            Volunteer Sign Up
          </h2>
          <p className="text-ewc-silver text-sm max-w-md">
            Use your gifts and talents to serve the body of Christ. Fill out the form below and a ministry leader will be in touch.
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === "error" && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
                <AlertCircle size={16} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {/* Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-heading text-ewc-charcoal mb-1.5">
                  Primary Department
                </label>
                <select
                  required
                  value={form.departmentId}
                  onChange={(e) => updateForm("departmentId", e.target.value)}
                  className="input-field"
                >
                  <option value="">Select a department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-heading text-ewc-charcoal mb-1.5">
                  Secondary Dept <span className="text-ewc-silver">(optional)</span>
                </label>
                <select
                  value={form.secondaryDepartmentId}
                  onChange={(e) => updateForm("secondaryDepartmentId", e.target.value)}
                  className="input-field"
                >
                  <option value="">Select (optional)</option>
                  {departments
                    .filter((d) => d.id !== form.departmentId)
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-heading text-ewc-charcoal mb-1.5">
                Availability
              </label>
              <select
                value={form.availability}
                onChange={(e) => updateForm("availability", e.target.value)}
                className="input-field"
              >
                <option value="">Select availability</option>
                <option value="Sundays">Sundays</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Weekends">Weekends</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-heading text-ewc-charcoal mb-1.5">
                Experience / Message <span className="text-ewc-silver">(optional)</span>
              </label>
              <textarea
                rows={2}
                value={form.experience}
                onChange={(e) => updateForm("experience", e.target.value)}
                className="input-field resize-none"
                placeholder="Share any relevant skills or anything you'd like us to know..."
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
  );
}
