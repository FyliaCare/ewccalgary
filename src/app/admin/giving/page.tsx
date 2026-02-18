"use client";

import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, ArrowUp, Download, Calendar, Loader2 } from "lucide-react";

interface DonationData {
  id: string;
  amount: number;
  category: string;
  donorName: string;
  donorEmail: string | null;
  status: string;
  createdAt: string;
}

export default function AdminGivingPage() {
  const [donations, setDonations] = useState<DonationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/give");
        if (res.ok) setDonations(await res.json());
      } catch (err) {
        console.error("Failed to fetch donations:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const avgGift = donations.length > 0 ? Math.round(totalAmount / donations.length) : 0;
  const uniqueDonors = new Set(donations.map((d) => d.donorName)).size;

  const byCategory = donations.reduce((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + d.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleExport = () => {
    const headers = ["Donor", "Category", "Amount", "Date", "Status"];
    const rows = donations.map((d) => [
      d.donorName,
      d.category,
      `$${d.amount}`,
      new Date(d.createdAt).toLocaleDateString(),
      d.status,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ewc-giving-report.csv";
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
          <h1 className="font-heading font-bold text-2xl text-gray-900">Giving</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track tithes, offerings, seeds, and all giving categories.
          </p>
        </div>
        <button onClick={handleExport} className="btn-burgundy px-4 py-2 flex items-center gap-2 text-sm">
          <Download size={16} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-xs font-heading uppercase">Total</span>
            <div className="w-9 h-9 rounded-xl bg-ewc-burgundy/10 flex items-center justify-center"><DollarSign size={18} className="text-ewc-burgundy" /></div>
          </div>
          <p className="font-heading font-bold text-2xl text-gray-900">${totalAmount.toLocaleString()}</p>
          <p className="text-emerald-600 text-xs flex items-center gap-1 mt-1">
            <ArrowUp size={12} /> {donations.length} transactions
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-xs font-heading uppercase">Transactions</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center"><TrendingUp size={18} className="text-blue-600" /></div>
          </div>
          <p className="font-heading font-bold text-2xl text-gray-900">{donations.length}</p>
          <p className="text-gray-400 text-xs mt-1">Total recorded</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-xs font-heading uppercase">Avg. Gift</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center"><DollarSign size={18} className="text-emerald-600" /></div>
          </div>
          <p className="font-heading font-bold text-2xl text-gray-900">${avgGift.toLocaleString()}</p>
          <p className="text-gray-400 text-xs mt-1">Per transaction</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-xs font-heading uppercase">Donors</span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center"><Calendar size={18} className="text-violet-600" /></div>
          </div>
          <p className="font-heading font-bold text-2xl text-gray-900">{uniqueDonors}</p>
          <p className="text-gray-400 text-xs mt-1">Unique donors</p>
        </div>
      </div>

      {Object.keys(byCategory).length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-heading font-bold text-lg text-gray-900 mb-4">By Category</h2>
          <div className="space-y-3">
            {Object.entries(byCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amt]) => (
                <div key={cat} className="flex items-center gap-4">
                  <span className="text-gray-600 text-sm w-32">{cat}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ewc-burgundy rounded-full"
                      style={{ width: `${totalAmount > 0 ? (amt / totalAmount) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-gray-900 font-heading font-bold text-sm w-20 text-right">
                    ${amt.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {donations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <p className="text-gray-400">No donations recorded yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-gray-500 font-heading text-xs uppercase tracking-wider">Donor</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-heading text-xs uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-heading text-xs uppercase tracking-wider">Amount</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-heading text-xs uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-heading text-xs uppercase tracking-wider hidden md:table-cell">Status</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-900 font-semibold">{row.donorName}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-ewc-burgundy/10 text-ewc-burgundy font-heading">
                        {row.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ewc-burgundy font-heading font-bold">${row.amount}</td>
                    <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden md:table-cell capitalize">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
