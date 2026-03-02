"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NoiseOverlay } from "@/components/landing-website";
import {
  Plus,
  Pencil,
  Trash2,
  Copy,
  ArrowLeft,
  Loader2,
} from "lucide-react";

interface TopicProfile {
  slug: string;
  name: string;
  icon: string;
  description: string;
  tagline: string;
  updatedAt: string;
}

export default function StudioPage() {
  const [topics, setTopics] = useState<TopicProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [duplicating, setDuplicating] = useState<string | null>(null);

  const fetchTopics = async () => {
    try {
      const res = await fetch("/api/topics");
      if (res.ok) setTopics(await res.json());
    } catch (err) {
      console.error("Failed to fetch topics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(slug);
    try {
      const res = await fetch(`/api/topics/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setTopics((prev) => prev.filter((t) => t.slug !== slug));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete topic");
      }
    } catch {
      alert("Failed to delete topic");
    } finally {
      setDeleting(null);
    }
  };

  const handleDuplicate = async (slug: string) => {
    setDuplicating(slug);
    try {
      const res = await fetch(`/api/topics/${slug}/duplicate`, { method: "POST" });
      if (res.ok) {
        const created = await res.json();
        setTopics((prev) => [created, ...prev]);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to duplicate topic");
      }
    } catch {
      alert("Failed to duplicate topic");
    } finally {
      setDuplicating(null);
    }
  };

  return (
    <div className="landing-page selection:bg-[#FF3300] selection:text-white min-h-screen flex flex-col">
      <NoiseOverlay />
      <main className="flex-1 w-full border-b-2 border-black bg-[#E6E6E6] p-6 lg:p-12">
        <div className="mx-auto max-w-4xl relative z-10">
          {/* Header */}
          <div className="mb-8 bg-white border-2 border-black p-6 lg:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#FF3300]" />
                <h1 className="text-2xl font-extrabold uppercase tracking-tight-custom">
                  Newsletter Studio
                </h1>
              </div>
              <Link
                href="/admin/studio/new"
                className="flex items-center gap-2 h-10 px-5 bg-black text-white font-bold uppercase text-xs border-2 border-black hover:bg-[#FF3300] transition-colors"
              >
                <Plus strokeWidth={2} className="w-4 h-4" />
                New Topic
              </Link>
            </div>
            <p className="font-tech text-xs uppercase text-gray-600">
              Create and manage newsletter topic profiles for rapid category
              expansion.
            </p>
          </div>

          {/* Topics list */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* AI — hardcoded, view-only + duplicate */}
              <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
                <Link
                  href="/admin/studio/ai"
                  className="flex items-center gap-4 flex-1 min-w-0 p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 border-2 border-black flex items-center justify-center bg-[#E6E6E6] text-xl flex-shrink-0">
                    🧠
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-extrabold uppercase tracking-tight-custom truncate">
                        AI
                      </h2>
                      <span className="font-tech text-[10px] uppercase text-gray-400 flex-shrink-0">
                        /ai
                      </span>
                      <span className="font-tech text-[10px] uppercase text-[#FF3300] border border-[#FF3300] px-1.5 py-0.5 flex-shrink-0">
                        Hardcoded
                      </span>
                    </div>
                    <p className="font-tech text-xs text-gray-600 truncate">
                      Daily digest of the most important AI news, research, and launches.
                    </p>
                  </div>
                </Link>
                <div className="flex items-center gap-2 flex-shrink-0 pr-5">
                  <button
                    type="button"
                    onClick={() => handleDuplicate("ai")}
                    disabled={duplicating === "ai"}
                    className="w-10 h-10 border-2 border-black flex items-center justify-center bg-[#E6E6E6] hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50"
                    title="Duplicate"
                  >
                    {duplicating === "ai" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Copy strokeWidth={1.5} className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* DB topics */}
              {topics.map((topic) => (
                <div
                  key={topic.slug}
                  className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4"
                >
                  {/* Clickable area → view page */}
                  <Link
                    href={`/admin/studio/${topic.slug}`}
                    className="flex items-center gap-4 flex-1 min-w-0 p-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 border-2 border-black flex items-center justify-center bg-[#E6E6E6] text-xl flex-shrink-0">
                      {topic.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-extrabold uppercase tracking-tight-custom truncate">
                          {topic.name}
                        </h2>
                        <span className="font-tech text-[10px] uppercase text-gray-400 flex-shrink-0">
                          /{topic.slug}
                        </span>
                      </div>
                      <p className="font-tech text-xs text-gray-600 truncate">
                        {topic.description}
                      </p>
                    </div>
                  </Link>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 pr-5">
                    <button
                      type="button"
                      onClick={() => handleDuplicate(topic.slug)}
                      disabled={duplicating === topic.slug}
                      className="w-10 h-10 border-2 border-black flex items-center justify-center bg-[#E6E6E6] hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50"
                      title="Duplicate"
                    >
                      {duplicating === topic.slug ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Copy strokeWidth={1.5} className="w-4 h-4" />
                      )}
                    </button>
                    <Link
                      href={`/admin/studio/${topic.slug}/edit`}
                      className="w-10 h-10 border-2 border-black flex items-center justify-center bg-[#E6E6E6] hover:bg-[#FF3300] hover:text-white transition-colors"
                      title="Edit"
                    >
                      <Pencil strokeWidth={1.5} className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(topic.slug, topic.name)}
                      disabled={deleting === topic.slug}
                      className="w-10 h-10 border-2 border-black flex items-center justify-center bg-[#E6E6E6] hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deleting === topic.slug ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 strokeWidth={1.5} className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            href="/admin"
            className="mt-8 inline-flex items-center gap-1 font-tech text-xs uppercase text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft strokeWidth={2} className="w-3 h-3" />
            Back to dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
