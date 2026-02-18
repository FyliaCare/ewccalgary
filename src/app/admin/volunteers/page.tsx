"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Loader2,
} from "lucide-react";

interface VolunteerData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  availability: string | null;
  notes: string;
  department?: { name: string } | null;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-heading bg-emerald-50 text-emerald-600">
          <CheckCircle size={12} /> Approved
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-heading bg-amber-50 text-amber-600">
          <Clock size={12} /> Pending
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-heading bg-red-50 text-red-500">
          <XCircle size={12} /> Rejected
        </span>
      );
    default:
      return null;
  }
}

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<VolunteerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedVolunteer, setSelectedVolunteer] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchVolunteers = useCallback(async () => {
    try {
      const res = await fetch("/api/volunteers");
      if (res.ok) setVolunteers(await res.json());
    } catch (err) {
      console.error("Failed to fetch volunteers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  const filtered = volunteers.filter((v) => {
    const fullName = `${v.firstName} ${v.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase()) ||
      (v.department?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === "all" || v.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const selected = selectedVolunteer
    ? volunteers.find((v) => v.id === selectedVolunteer)
    : null;

  const handleAction = async (id: string, status: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/volunteers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setVolunteers((prev) =>
          prev.map((v) => (v.id === id ? { ...v, status } : v))
        );
        setSelectedVolunteer(null);
      }
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Department", "Status", "Date"];
    const rows = volunteers.map((v) => [
      `${v.firstName} ${v.lastName}`,
      v.email,
      v.phone,
      v.department?.name || "—",
      v.status,
      new Date(v.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ewc-volunteers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-ewc-burgundy" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-900">Volunteers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage volunteer applications and assignments.</p>
        </div>
        <button onClick={handleExportCSV} className="btn-burgundy px-4 py-2 flex items-center gap-2 text-sm">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-ewc-burgundy focus:outline-none transition-colors"
            placeholder="Search by name, email, or department..."
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:border-ewc-burgundy focus:outline-none">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-heading font-bold text-gray-900">{volunteers.length}</p>
          <p className="text-gray-500 text-xs">Total</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-heading font-bold text-amber-600">
            {volunteers.filter((v) => v.status === "pending").length}
          </p>
          <p className="text-gray-500 text-xs">Pending</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-heading font-bold text-emerald-600">
            {volunteers.filter((v) => v.status === "approved").length}
          </p>
          <p className="text-gray-500 text-xs">Approved</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-gray-500 font-heading text-xs uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-gray-500 font-heading text-xs uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-gray-500 font-heading text-xs uppercase tracking-wider">Department</th>
                <th className="text-left px-4 py-3 text-gray-500 font-heading text-xs uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-gray-500 font-heading text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-gray-500 font-heading text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((vol) => (
                <tr key={vol.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-gray-900 font-semibold">{vol.firstName} {vol.lastName}</p>
                    <p className="text-gray-400 text-xs md:hidden">{vol.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{vol.email}</td>
                  <td className="px-4 py-3 text-gray-600">{vol.department?.name || "—"}</td>
                  <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{new Date(vol.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{getStatusBadge(vol.status)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedVolunteer(vol.id)} className="text-ewc-burgundy hover:text-ewc-burgundy/80 transition-colors">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No volunteers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 sm:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-xl text-gray-900">Volunteer Details</h2>
              <button onClick={() => setSelectedVolunteer(null)} className="text-gray-400 hover:text-gray-900">
                <XCircle size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <span className="text-gray-500">Name:</span>
                <span className="text-gray-900">{selected.firstName} {selected.lastName}</span>
                <span className="text-gray-500">Email:</span>
                <span className="text-gray-900">{selected.email}</span>
                <span className="text-gray-500">Phone:</span>
                <span className="text-gray-900">{selected.phone}</span>
                <span className="text-gray-500">Department:</span>
                <span className="text-gray-900">{selected.department?.name || "—"}</span>
                <span className="text-gray-500">Availability:</span>
                <span className="text-gray-900">{selected.availability || "—"}</span>
                <span className="text-gray-500">Applied:</span>
                <span className="text-gray-900">{new Date(selected.createdAt).toLocaleDateString()}</span>
                <span className="text-gray-500">Status:</span>
                <span>{getStatusBadge(selected.status)}</span>
              </div>
              {selected.notes && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <p className="text-gray-500 text-xs mb-1">Notes:</p>
                  <p className="text-gray-700">{selected.notes}</p>
                </div>
              )}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleAction(selected.id, "approved")}
                  disabled={actionLoading}
                  className="btn-burgundy px-4 py-2 text-xs flex items-center gap-1 disabled:opacity-60"
                >
                  <CheckCircle size={14} /> Approve
                </button>
                <button
                  onClick={() => handleAction(selected.id, "rejected")}
                  disabled={actionLoading}
                  className="px-4 py-2 text-xs rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1 disabled:opacity-60"
                >
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
