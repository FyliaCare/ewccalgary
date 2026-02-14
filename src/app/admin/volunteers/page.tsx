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
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-heading bg-green-500/10 text-green-400">
          <CheckCircle size={12} /> Approved
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-heading bg-yellow-500/10 text-yellow-400">
          <Clock size={12} /> Pending
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-heading bg-red-500/10 text-red-400">
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
        <Loader2 size={32} className="animate-spin text-ewc-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">Volunteers</h1>
          <p className="text-ewc-gray text-sm mt-1">Manage volunteer applications and assignments.</p>
        </div>
        <button onClick={handleExportCSV} className="btn-gold px-4 py-2 flex items-center gap-2 text-sm">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="card-dark p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ewc-gray" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-dark w-full pl-10 text-sm"
            placeholder="Search by name, email, or department..."
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-ewc-gray" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-dark text-sm">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card-dark p-4 text-center">
          <p className="text-2xl font-heading font-bold text-white">{volunteers.length}</p>
          <p className="text-ewc-gray text-xs">Total</p>
        </div>
        <div className="card-dark p-4 text-center">
          <p className="text-2xl font-heading font-bold text-yellow-400">
            {volunteers.filter((v) => v.status === "pending").length}
          </p>
          <p className="text-ewc-gray text-xs">Pending</p>
        </div>
        <div className="card-dark p-4 text-center">
          <p className="text-2xl font-heading font-bold text-green-400">
            {volunteers.filter((v) => v.status === "approved").length}
          </p>
          <p className="text-ewc-gray text-xs">Approved</p>
        </div>
      </div>

      <div className="card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ewc-dark">
                <th className="text-left px-4 py-3 text-ewc-gray font-heading text-xs uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-ewc-gray font-heading text-xs uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-ewc-gray font-heading text-xs uppercase tracking-wider">Department</th>
                <th className="text-left px-4 py-3 text-ewc-gray font-heading text-xs uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-ewc-gray font-heading text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-ewc-gray font-heading text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((vol) => (
                <tr key={vol.id} className="border-b border-ewc-dark/50 hover:bg-ewc-dark/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-white font-semibold">{vol.firstName} {vol.lastName}</p>
                    <p className="text-ewc-gray text-xs md:hidden">{vol.email}</p>
                  </td>
                  <td className="px-4 py-3 text-ewc-cream/70 hidden md:table-cell">{vol.email}</td>
                  <td className="px-4 py-3 text-ewc-cream/70">{vol.department?.name || "—"}</td>
                  <td className="px-4 py-3 text-ewc-gray hidden sm:table-cell">{new Date(vol.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{getStatusBadge(vol.status)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedVolunteer(vol.id)} className="text-ewc-gold hover:text-ewc-gold/80 transition-colors">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-ewc-gray">
                    No volunteers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="card-dark p-6 sm:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-xl text-white">Volunteer Details</h2>
              <button onClick={() => setSelectedVolunteer(null)} className="text-ewc-gray hover:text-white">
                <XCircle size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <span className="text-ewc-gray">Name:</span>
                <span className="text-white">{selected.firstName} {selected.lastName}</span>
                <span className="text-ewc-gray">Email:</span>
                <span className="text-white">{selected.email}</span>
                <span className="text-ewc-gray">Phone:</span>
                <span className="text-white">{selected.phone}</span>
                <span className="text-ewc-gray">Department:</span>
                <span className="text-white">{selected.department?.name || "—"}</span>
                <span className="text-ewc-gray">Availability:</span>
                <span className="text-white">{selected.availability || "—"}</span>
                <span className="text-ewc-gray">Applied:</span>
                <span className="text-white">{new Date(selected.createdAt).toLocaleDateString()}</span>
                <span className="text-ewc-gray">Status:</span>
                <span>{getStatusBadge(selected.status)}</span>
              </div>
              {selected.notes && (
                <div className="bg-ewc-dark rounded-lg p-3 text-sm">
                  <p className="text-ewc-gray text-xs mb-1">Notes:</p>
                  <p className="text-ewc-cream/80">{selected.notes}</p>
                </div>
              )}
              <div className="flex items-center gap-3 pt-4 border-t border-ewc-dark">
                <button
                  onClick={() => handleAction(selected.id, "approved")}
                  disabled={actionLoading}
                  className="btn-gold px-4 py-2 text-xs flex items-center gap-1 disabled:opacity-60"
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
