"use client";

import { useState, useEffect } from "react";
import { Play, Eye, Loader2 } from "lucide-react";

interface SermonData {
  id: string;
  title: string;
  speaker: string;
  date: string;
  youtubeUrl: string | null;
  series: string | null;
  published: boolean;
}

export default function AdminSermonsPage() {
  const [sermons, setSermons] = useState<SermonData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/sermons");
        if (res.ok) setSermons(await res.json());
      } catch (err) {
        console.error("Failed to fetch sermons:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
          <h1 className="font-heading font-bold text-2xl text-white">Sermons</h1>
          <p className="text-ewc-gray text-sm mt-1">
            Manage sermon library, YouTube links, and series.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card-dark p-4 text-center">
          <p className="text-2xl font-heading font-bold text-white">{sermons.length}</p>
          <p className="text-ewc-gray text-xs">Total Sermons</p>
        </div>
        <div className="card-dark p-4 text-center">
          <p className="text-2xl font-heading font-bold text-green-400">
            {sermons.filter((s) => s.published).length}
          </p>
          <p className="text-ewc-gray text-xs">Published</p>
        </div>
        <div className="card-dark p-4 text-center">
          <p className="text-2xl font-heading font-bold text-yellow-400">
            {sermons.filter((s) => !s.published).length}
          </p>
          <p className="text-ewc-gray text-xs">Drafts</p>
        </div>
      </div>

      {sermons.length === 0 ? (
        <div className="card-dark p-12 text-center">
          <p className="text-ewc-gray">No sermons found.</p>
        </div>
      ) : (
        <div className="card-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ewc-dark">
                  <th className="text-left px-4 py-3 text-ewc-gray font-heading text-xs uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-3 text-ewc-gray font-heading text-xs uppercase tracking-wider hidden md:table-cell">Speaker</th>
                  <th className="text-left px-4 py-3 text-ewc-gray font-heading text-xs uppercase tracking-wider">Series</th>
                  <th className="text-left px-4 py-3 text-ewc-gray font-heading text-xs uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-ewc-gray font-heading text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-ewc-gray font-heading text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sermons.map((sermon) => (
                  <tr key={sermon.id} className="border-b border-ewc-dark/50 hover:bg-ewc-dark/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white font-semibold">{sermon.title}</p>
                      <p className="text-ewc-gray text-xs md:hidden">{sermon.speaker}</p>
                    </td>
                    <td className="px-4 py-3 text-ewc-cream/70 hidden md:table-cell">{sermon.speaker}</td>
                    <td className="px-4 py-3">
                      {sermon.series && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-ewc-burgundy/10 text-ewc-burgundy font-heading">
                          {sermon.series}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ewc-gray hidden sm:table-cell">
                      {new Date(sermon.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-heading ${
                        sermon.published
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}>
                        {sermon.published ? "published" : "draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {sermon.youtubeUrl && (
                          <a
                            href={sermon.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ewc-gray hover:text-ewc-burgundy transition-colors"
                          >
                            <Play size={14} />
                          </a>
                        )}
                        <button className="text-ewc-gray hover:text-ewc-burgundy transition-colors">
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
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
