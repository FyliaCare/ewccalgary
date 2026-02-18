"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function CommunityRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!/[a-z]/.test(form.password)) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }
    if (!/[A-Z]/.test(form.password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }
    if (!/[0-9]/.test(form.password)) {
      setError("Password must contain at least one number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/member/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          displayName: form.displayName || `${form.firstName} ${form.lastName}`,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      router.push("/community");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 safe-area-top safe-area-bottom">
      <div className="w-full max-w-md fade-in-up" style={{ animationFillMode: "both" }}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-ewc-silver hover:text-white text-sm mb-8 transition-colors press-effect"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Website
        </Link>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-ewc-burgundy rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-ewc-burgundy/30">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-white">
            Join EWC Community
          </h1>
          <p className="text-ewc-silver text-sm mt-1.5">
            Connect with your church family
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl scale-in">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-ewc-silver mb-1.5 font-medium">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] placeholder:text-ewc-silver/40 focus:outline-none focus:border-ewc-burgundy focus:ring-1 focus:ring-ewc-burgundy transition-all"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm text-ewc-silver mb-1.5 font-medium">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] placeholder:text-ewc-silver/40 focus:outline-none focus:border-ewc-burgundy focus:ring-1 focus:ring-ewc-burgundy transition-all"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-ewc-silver mb-1.5 font-medium">
              Display Name{" "}
              <span className="text-ewc-silver/50 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] placeholder:text-ewc-silver/40 focus:outline-none focus:border-ewc-burgundy focus:ring-1 focus:ring-ewc-burgundy transition-all"
              placeholder="How others will see you"
            />
          </div>

          <div>
            <label className="block text-sm text-ewc-silver mb-1.5 font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] placeholder:text-ewc-silver/40 focus:outline-none focus:border-ewc-burgundy focus:ring-1 focus:ring-ewc-burgundy transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm text-ewc-silver mb-1.5 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] placeholder:text-ewc-silver/40 focus:outline-none focus:border-ewc-burgundy focus:ring-1 focus:ring-ewc-burgundy transition-all pr-12"
                placeholder="Min. 8 characters, mixed case + number"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ewc-silver hover:text-white p-1 press-effect rounded-lg"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-ewc-silver mb-1.5 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] placeholder:text-ewc-silver/40 focus:outline-none focus:border-ewc-burgundy focus:ring-1 focus:ring-ewc-burgundy transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-ewc-burgundy hover:bg-ewc-burgundy-hover text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed press-effect text-[15px] shadow-lg shadow-ewc-burgundy/20 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </span>
            ) : (
              "Join Community"
            )}
          </button>
        </form>

        <p className="text-center text-ewc-silver text-sm mt-8">
          Already have an account?{" "}
          <Link
            href="/community/login"
            className="text-ewc-burgundy-light hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
