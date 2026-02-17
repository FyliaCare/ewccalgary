"use client";

import { useState } from "react";
import { useCommunity } from "../layout";
import {
  User,
  Mail,
  Save,
  LogOut,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { member, refreshMember } = useCommunity();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: member?.firstName || "",
    lastName: member?.lastName || "",
    displayName: member?.displayName || "",
    bio: member?.bio || "",
    avatar: member?.avatar || "",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/auth/member/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        refreshMember();
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch { /* silent */ }
    setSaving(false);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/member/logout", { method: "POST" });
    router.push("/community/login");
  };

  if (!member) return null;

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Profile header */}
      <div className="bg-gradient-to-br from-ewc-burgundy-dark to-ewc-burgundy p-6 md:p-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.displayName}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                member.displayName?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-3 border-ewc-burgundy-dark" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold text-white">
              {member.displayName}
            </h1>
            <p className="text-white/60 text-sm">{member.email}</p>
            {member.bio && (
              <p className="text-white/80 text-sm mt-1">{member.bio}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-lg mx-auto">
        {saved && (
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-lg mb-4">
            <CheckCircle className="w-4 h-4" />
            Profile updated successfully!
          </div>
        )}

        {!editing ? (
          <>
            {/* Profile details */}
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
                <h3 className="text-white font-medium text-sm mb-3">
                  Profile Information
                </h3>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-ewc-silver flex-shrink-0" />
                  <div>
                    <p className="text-ewc-silver text-xs">Full Name</p>
                    <p className="text-white text-sm">
                      {member.firstName} {member.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-ewc-silver flex-shrink-0" />
                  <div>
                    <p className="text-ewc-silver text-xs">Display Name</p>
                    <p className="text-white text-sm">{member.displayName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-ewc-silver flex-shrink-0" />
                  <div>
                    <p className="text-ewc-silver text-xs">Email</p>
                    <p className="text-white text-sm">{member.email}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="w-full py-2.5 bg-ewc-burgundy hover:bg-ewc-burgundy-hover text-white font-semibold text-sm rounded-lg transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </>
        ) : (
          /* Edit form */
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
              <h3 className="text-white font-medium text-sm mb-3">
                Edit Profile
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ewc-silver text-xs mb-1 block">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-ewc-burgundy"
                  />
                </div>
                <div>
                  <label className="text-ewc-silver text-xs mb-1 block">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-ewc-burgundy"
                  />
                </div>
              </div>
              <div>
                <label className="text-ewc-silver text-xs mb-1 block">
                  Display Name
                </label>
                <input
                  type="text"
                  value={form.displayName}
                  onChange={(e) =>
                    setForm({ ...form, displayName: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-ewc-burgundy"
                />
              </div>
              <div>
                <label className="text-ewc-silver text-xs mb-1 block">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={form.avatar}
                  onChange={(e) =>
                    setForm({ ...form, avatar: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-ewc-burgundy placeholder:text-ewc-silver/30"
                />
              </div>
              <div>
                <label className="text-ewc-silver text-xs mb-1 block">
                  Bio
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  placeholder="Tell others about yourself..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-ewc-burgundy placeholder:text-ewc-silver/30 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-ewc-burgundy hover:bg-ewc-burgundy-hover text-white font-semibold text-sm rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-5 py-2.5 bg-white/5 text-ewc-silver text-sm rounded-lg hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
