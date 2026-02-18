"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  TrendingUp,
  UserPlus,
  Mail,
  Video,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface VolunteerData {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
  createdAt: string;
  department?: { name: string } | null;
}

interface MessageData {
  id: string;
  name: string;
  subject: string;
  read: boolean;
  createdAt: string;
}

interface DonationData {
  id: string;
  amount: number;
}

export default function AdminDashboardPage() {
  const [volunteers, setVolunteers] = useState<VolunteerData[]>([]);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [donations, setDonations] = useState<DonationData[]>([]);
  const [deptCount, setDeptCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [volRes, msgRes, donRes, deptRes] = await Promise.all([
          fetch("/api/volunteers"),
          fetch("/api/contact"),
          fetch("/api/give"),
          fetch("/api/departments"),
        ]);
        if (volRes.ok) setVolunteers(await volRes.json());
        if (msgRes.ok) setMessages(await msgRes.json());
        if (donRes.ok) setDonations(await donRes.json());
        if (deptRes.ok) {
          const depts = await deptRes.json();
          setDeptCount(depts.length);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalGiving = donations.reduce((sum, d) => sum + d.amount, 0);
  const pendingCount = volunteers.filter((v) => v.status === "pending").length;
  const unreadCount = messages.filter((m) => !m.read).length;

  const stats = [
    { label: "Total Volunteers", value: volunteers.length.toString(), change: `${pendingCount} pending`, icon: Users, color: "text-blue-600", bg: "bg-blue-50", href: "/admin/volunteers" },
    { label: "Departments", value: deptCount.toString(), change: "All active", icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50", href: "/admin/departments" },
    { label: "Messages", value: messages.length.toString(), change: `${unreadCount} unread`, icon: Mail, color: "text-violet-600", bg: "bg-violet-50", href: "/admin/messages" },
    { label: "Total Giving", value: `$${totalGiving.toLocaleString()}`, change: `${donations.length} transactions`, icon: DollarSign, color: "text-ewc-burgundy", bg: "bg-ewc-burgundy-50", href: "/admin/giving" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-ewc-burgundy" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-bold text-2xl text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back. Here&apos;s an overview of EWC Calgary.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-ewc-burgundy/20 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-xs font-heading uppercase tracking-wider">{stat.label}</span>
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon size={18} className={stat.color} />
                </div>
              </div>
              <p className="font-heading font-bold text-2xl text-gray-900">{stat.value}</p>
              <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                <TrendingUp size={12} className="text-emerald-500" />
                {stat.change}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-lg text-gray-900 flex items-center gap-2">
              <UserPlus size={18} className="text-ewc-burgundy" /> Recent Volunteers
            </h2>
            <Link href="/admin/volunteers" className="text-ewc-burgundy text-xs font-heading uppercase tracking-wider hover:underline">View All</Link>
          </div>
          {volunteers.length === 0 ? (
            <p className="text-gray-400 text-sm">No volunteer applications yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-gray-500 font-heading text-xs uppercase tracking-wider">Name</th>
                    <th className="text-left py-2 text-gray-500 font-heading text-xs uppercase tracking-wider">Department</th>
                    <th className="text-left py-2 text-gray-500 font-heading text-xs uppercase tracking-wider">Date</th>
                    <th className="text-left py-2 text-gray-500 font-heading text-xs uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteers.slice(0, 5).map((vol) => (
                    <tr key={vol.id} className="border-b border-gray-50">
                      <td className="py-3 text-gray-900 font-medium">{vol.firstName} {vol.lastName}</td>
                      <td className="py-3 text-gray-600">{vol.department?.name || "—"}</td>
                      <td className="py-3 text-gray-400">{new Date(vol.createdAt).toLocaleDateString()}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${vol.status === "approved" ? "bg-emerald-50 text-emerald-600" : vol.status === "rejected" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"}`}>{vol.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-lg text-gray-900 flex items-center gap-2">
              <Mail size={18} className="text-ewc-burgundy" /> Messages
            </h2>
            <Link href="/admin/messages" className="text-ewc-burgundy text-xs font-heading uppercase tracking-wider hover:underline">View All</Link>
          </div>
          {messages.length === 0 ? (
            <p className="text-gray-400 text-sm">No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {messages.slice(0, 3).map((msg) => (
                <div key={msg.id} className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-gray-900 text-sm font-semibold">{msg.name}</p>
                    <span className="text-gray-400 text-xs">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-500 text-xs">{msg.subject}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="font-heading font-bold text-lg text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Manage Volunteers", icon: Users, href: "/admin/volunteers", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Schedule Events", icon: Calendar, href: "/admin/events", color: "text-violet-600", bg: "bg-violet-50" },
            { label: "Upload Sermon", icon: Video, href: "/admin/sermons", color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "View Messages", icon: Mail, href: "/admin/messages", color: "text-ewc-burgundy", bg: "bg-ewc-burgundy-50" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm hover:shadow-md hover:border-ewc-burgundy/20 transition-all">
                <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center`}>
                  <Icon size={18} className={action.color} />
                </div>
                <span className="text-gray-900 text-sm font-heading font-medium">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
