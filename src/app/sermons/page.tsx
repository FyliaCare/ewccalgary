"use client";

import { useState, useEffect } from "react";
import { Play, BookOpen, Clock, Search, Filter, ExternalLink } from "lucide-react";

interface Sermon {
  id: string;
  title: string;
  description: string | null;
  speaker: string;
  date: string;
  youtubeUrl: string | null;
  category: string;
  imageUrl: string | null;
}

const categories = ["All", "Sunday Service", "Midweek", "Special", "Conference"];

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/sermons")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSermons(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = sermons.filter((s) => {
    const matchCategory = activeCategory === "All" || s.category === activeCategory;
    const matchSearch =
      searchQuery === "" ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  function getYouTubeVideoId(url: string): string | null {
    try {
      const u = new URL(url);
      if (u.hostname === "youtu.be") return u.pathname.slice(1);
      return u.searchParams.get("v");
    } catch {
      return null;
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ewc-gold-50 via-white to-ewc-cream" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-ewc-gold/5 rounded-full blur-3xl" />
        <div className="relative section-container text-center">
          <span className="section-label">Sermons</span>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-ewc-charcoal mb-6 mt-3">
            The Word of
            <span className="block text-ewc-gold">God for You</span>
          </h1>
          <p className="max-w-2xl mx-auto text-ewc-slate text-lg leading-relaxed">
            Browse and watch powerful sermons from EWC Calgary. Let the Word build
            your faith and transform your life.
          </p>
        </div>
      </section>

      {/* Filter & Search */}
      <section className="bg-white border-b border-ewc-mist sticky top-[72px] z-20">
        <div className="section-container py-5">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ewc-silver" />
              <input
                type="text"
                placeholder="Search sermons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-ewc-silver" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-heading transition-all ${
                    activeCategory === cat
                      ? "bg-ewc-gold text-white shadow-warm"
                      : "bg-ewc-light text-ewc-slate hover:bg-ewc-mist"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sermon Grid */}
      <section className="bg-ewc-snow section-padding">
        <div className="section-container">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-44 bg-ewc-mist rounded-xl mb-4" />
                  <div className="h-4 bg-ewc-mist rounded w-3/4 mb-2" />
                  <div className="h-3 bg-ewc-mist rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card-warm text-center max-w-lg mx-auto py-12">
              <BookOpen size={48} className="mx-auto text-ewc-gold/40 mb-4" />
              <h3 className="font-heading font-bold text-ewc-charcoal text-lg mb-2">
                {sermons.length === 0 ? "No Sermons Yet" : "No Results"}
              </h3>
              <p className="text-ewc-silver text-sm">
                {sermons.length === 0
                  ? "Sermons will appear here once added. Check back soon!"
                  : "Try adjusting your search or filter."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((sermon) => {
                const videoId = sermon.youtubeUrl
                  ? getYouTubeVideoId(sermon.youtubeUrl)
                  : null;
                const thumb = videoId
                  ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                  : sermon.imageUrl;

                return (
                  <div key={sermon.id} className="card group hover:border-ewc-gold/30 overflow-hidden">
                    {/* Thumbnail */}
                    <div className="relative h-44 bg-ewc-mist rounded-xl mb-4 overflow-hidden">
                      {thumb ? (
                        <img src={thumb} alt={sermon.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ewc-gold-50 to-ewc-cream">
                          <BookOpen size={40} className="text-ewc-gold/30" />
                        </div>
                      )}
                      {sermon.youtubeUrl && (
                        <a
                          href={sermon.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <div className="w-14 h-14 rounded-full bg-ewc-gold flex items-center justify-center shadow-warm">
                            <Play size={24} className="text-white ml-1" />
                          </div>
                        </a>
                      )}
                    </div>

                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-ewc-gold-50 text-ewc-gold text-[11px] uppercase tracking-wider font-heading">
                          {sermon.category}
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-ewc-charcoal mb-1 line-clamp-2">
                        {sermon.title}
                      </h3>
                      <p className="text-ewc-silver text-sm mb-2">{sermon.speaker}</p>
                      {sermon.description && (
                        <p className="text-ewc-silver text-xs line-clamp-2 mb-3">{sermon.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs text-ewc-slate">
                          <Clock size={12} />
                          {new Date(sermon.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        {sermon.youtubeUrl && (
                          <a
                            href={sermon.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ewc-gold text-xs font-heading flex items-center gap-1 hover:text-ewc-gold-hover transition-colors"
                          >
                            Watch <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* YouTube Channel CTA */}
      <section className="bg-ewc-navy section-padding">
        <div className="section-container text-center">
          <h2 className="font-heading font-bold text-3xl text-white mb-4">
            Subscribe to Our Channel
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Never miss a sermon. Subscribe to EWC on YouTube for weekly messages,
            worship sessions, and special events.
          </p>
          <a
            href="https://www.youtube.com/@empowermentworshipcentre"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-8 py-4"
          >
            Visit YouTube Channel <ExternalLink size={14} className="ml-2" />
          </a>
        </div>
      </section>
    </>
  );
}
