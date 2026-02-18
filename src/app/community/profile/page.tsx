"use client";

import { useState, useEffect } from "react";
import { useCommunity } from "../layout";
import {
  User,
  Mail,
  Phone,
  Save,
  LogOut,
  CheckCircle,
  Edit3,
  Camera,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { member, refreshMember } = useCommunity();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    bio: "",
    avatar: "",
    phone: "",
  });
  const [saveError, setSaveError] = useState("");

  // Sync form state when member data loads or changes
  useEffect(() => {
    if (member) {
      setForm({
        firstName: member.firstName || "",
        lastName: member.lastName || "",
        displayName: member.displayName || "",
        bio: member.bio || "",
        avatar: member.avatar || "",
        phone: member.phone || "",
      });
    }
  }, [member]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/auth/member/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        refreshMember();
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        setSaveError(data.error || "Failed to save profile. Please try again.");
      }
    } catch {
      setSaveError("Network error. Please try again.");
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/member/logout", { method: "POST" });
    router.push("/community/login");
  };

  if (!member) return null;

  return (
    <div className="min-h-full">
      {/* Profile header — hero gradient */}
      <div className="bg-gradient-to-br from-ewc-burgundy-dark to-ewc-burgundy p-6 md:p-8 fade-in">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.displayName}
                  className="w-20 h-20 rounded-2xl object-cover"
                />
              ) : (
                member.displayName?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-[3px] border-ewc-burgundy-dark flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="absolute -top-1 -right-1 w-7 h-7 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white press-effect"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-heading font-bold text-white truncate">
              {member.displayName}
            </h1>
            <p className="text-white/60 text-sm truncate">{member.email}</p>
            {member.bio && (
              <p className="text-white/80 text-sm mt-1 line-clamp-2">{member.bio}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-lg mx-auto">
        {/* Success toast */}
        {saved && (
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl mb-4 scale-in">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            Profile updated successfully!
          </div>
        )}

        {!editing ? (
          <div className="space-y-4 fade-in-up" style={{ animationFillMode: "both" }}>
            {/* Profile details card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
              <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-ewc-burgundy-light" />
                Profile Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03]">
                  <div className="w-9 h-9 bg-ewc-burgundy/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-ewc-burgundy-light" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-ewc-silver/60 text-[11px] uppercase tracking-wider">Full Name</p>
                    <p className="text-white text-[15px]">
                      {member.firstName} {member.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03]">
                  <div className="w-9 h-9 bg-ewc-burgundy/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Edit3 className="w-4 h-4 text-ewc-burgundy-light" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-ewc-silver/60 text-[11px] uppercase tracking-wider">Display Name</p>
                    <p className="text-white text-[15px]">{member.displayName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03]">
                  <div className="w-9 h-9 bg-ewc-burgundy/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-ewc-burgundy-light" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-ewc-silver/60 text-[11px] uppercase tracking-wider">Email</p>
                    <p className="text-white text-[15px] truncate">{member.email}</p>
                  </div>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03]">
                    <div className="w-9 h-9 bg-ewc-burgundy/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-ewc-burgundy-light" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-ewc-silver/60 text-[11px] uppercase tracking-wider">Phone</p>
                      <p className="text-white text-[15px] truncate">{member.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="w-full py-3 bg-ewc-burgundy hover:bg-ewc-burgundy-hover text-white font-semibold text-sm rounded-xl transition-colors press-effect flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        ) : (
          /* Edit form */
          <div className="space-y-4 scale-in" style={{ animationFillMode: "both" }}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
              <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-ewc-burgundy-light" />
                Edit Profile
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ewc-silver/60 text-[11px] uppercase tracking-wider mb-1.5 block">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] focus:outline-none focus:border-ewc-burgundy transition-colors"
                  />
                </div>
                <div>
                  <label className="text-ewc-silver/60 text-[11px] uppercase tracking-wider mb-1.5 block">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] focus:outline-none focus:border-ewc-burgundy transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-ewc-silver/60 text-[11px] uppercase tracking-wider mb-1.5 block">
                  Display Name
                </label>
                <input
                  type="text"
                  value={form.displayName}
                  onChange={(e) =>
                    setForm({ ...form, displayName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] focus:outline-none focus:border-ewc-burgundy transition-colors"
                />
              </div>
              <div>
                <label className="text-ewc-silver/60 text-[11px] uppercase tracking-wider mb-1.5 block">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={form.avatar}
                  onChange={(e) =>
                    setForm({ ...form, avatar: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] focus:outline-none focus:border-ewc-burgundy placeholder:text-ewc-silver/30 transition-colors"
                />
              </div>
              <div>
                <label className="text-ewc-silver/60 text-[11px] uppercase tracking-wider mb-1.5 block">
                  Bio
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  placeholder="Tell others about yourself..."
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] focus:outline-none focus:border-ewc-burgundy placeholder:text-ewc-silver/30 resize-none transition-colors"
                />
              </div>
              <div>
                <label className="text-ewc-silver/60 text-[11px] uppercase tracking-wider mb-1.5 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] focus:outline-none focus:border-ewc-burgundy placeholder:text-ewc-silver/30 transition-colors"
                />
              </div>
            </div>

            {saveError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl scale-in">
                {saveError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-ewc-burgundy hover:bg-ewc-burgundy-hover text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-50 press-effect"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-5 py-3 bg-white/5 text-ewc-silver text-sm rounded-xl hover:text-white hover:bg-white/10 transition-colors press-effect"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Sign Out */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold rounded-xl hover:bg-red-500/20 transition-colors press-effect"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
