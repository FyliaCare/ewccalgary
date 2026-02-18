"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MessageCircle, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function CommunityLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const expired = searchParams.get("expired") === "true";
  const verified = searchParams.get("verified");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/member/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      router.push("/community");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 safe-area-top safe-area-bottom">
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
            Welcome Back
          </h1>
          <p className="text-ewc-silver text-sm mt-1.5">
            Sign in to EWC Community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {verified === "true" && (
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl scale-in">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              Email verified successfully! You can now sign in.
            </div>
          )}
          {verified === "already" && (
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm px-4 py-3 rounded-xl scale-in">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              Your email is already verified. Sign in to continue.
            </div>
          )}
          {expired && !error && (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm px-4 py-3 rounded-xl scale-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Your session has expired. Please sign in again.
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl scale-in">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-ewc-silver mb-1.5 font-medium">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] placeholder:text-ewc-silver/40 focus:outline-none focus:border-ewc-burgundy focus:ring-1 focus:ring-ewc-burgundy transition-all pr-12"
                placeholder="••••••••"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-ewc-burgundy hover:bg-ewc-burgundy-hover text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed press-effect text-[15px] shadow-lg shadow-ewc-burgundy/20 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-ewc-silver text-sm mt-8">
          Don&apos;t have an account?{" "}
          <Link
            href="/community/register"
            className="text-ewc-burgundy-light hover:underline font-medium"
          >
            Join the Community
          </Link>
        </p>
      </div>
    </div>
  );
}
