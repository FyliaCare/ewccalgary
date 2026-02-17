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
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
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
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-ewc-silver hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Website
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-ewc-burgundy rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-white">
            Join EWC Community
          </h1>
          <p className="text-ewc-silver text-sm mt-1">
            Connect with your church family
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-ewc-silver mb-1.5">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-ewc-silver/50 focus:outline-none focus:border-ewc-burgundy focus:ring-1 focus:ring-ewc-burgundy transition-colors"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm text-ewc-silver mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-ewc-silver/50 focus:outline-none focus:border-ewc-burgundy focus:ring-1 focus:ring-ewc-burgundy transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-ewc-silver mb-1.5">
              Display Name{" "}
              <span className="text-ewc-silver/50">(optional)</span>
            </label>
            <input
              type="text"
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-ewc-silver/50 focus:outline-none focus:border-ewc-burgundy focus:ring-1 focus:ring-ewc-burgundy transition-colors"
              placeholder="How others will see you"
            />
          </div>

          <div>
            <label className="block text-sm text-ewc-silver mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-ewc-silver/50 focus:outline-none focus:border-ewc-burgundy focus:ring-1 focus:ring-ewc-burgundy transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm text-ewc-silver mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-ewc-silver/50 focus:outline-none focus:border-ewc-burgundy focus:ring-1 focus:ring-ewc-burgundy transition-colors pr-11"
                placeholder="Min. 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ewc-silver hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-ewc-silver mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-ewc-silver/50 focus:outline-none focus:border-ewc-burgundy focus:ring-1 focus:ring-ewc-burgundy transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-ewc-burgundy hover:bg-ewc-burgundy-hover text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Join Community"}
          </button>
        </form>

        <p className="text-center text-ewc-silver text-sm mt-6">
          Already have an account?{" "}
          <Link
            href="/community/login"
            className="text-ewc-burgundy-light hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
