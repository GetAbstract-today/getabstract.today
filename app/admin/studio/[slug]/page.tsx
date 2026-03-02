"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { NoiseOverlay } from "@/components/landing-website";
import { ArrowLeft, Pencil, Copy, Loader2 } from "lucide-react";
import type { SectionConfig } from "@/components/topic-form";

interface TopicProfile {
  slug: string;
  name: string;
  icon: string;
  description: string;
  tagline: string;
  role: string;
  topicScope: string;
  titlePrefix: string;
  toneNotes: string | null;
  prioritySources: string[];
  exampleSubjects: string[];
  sections: string;
  createdAt: string;
  updatedAt: string;
  _hardcoded?: boolean;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <span className="font-tech text-[10px] uppercase tracking-widest text-gray-400 block">
        {label}
      </span>
      <div className="font-tech text-sm text-[#1A1A1A]">{children}</div>
    </div>
  );
}

export default function ViewTopicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [topic, setTopic] = useState<TopicProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [duplicating, setDuplicating] = useState(false);

  const handleDuplicate = async () => {
    if (!topic) return;
    setDuplicating(true);
    try {
      const res = await fetch(`/api/topics/${topic.slug}/duplicate`, { method: "POST" });
      if (res.ok) {
        const created = await res.json();
        window.location.href = `/admin/studio/${created.slug}/edit`;
      } else {
        const data = await res.json();
        alert(data.error || "Failed to duplicate");
      }
    } catch {
      alert("Failed to duplicate");
    } finally {
      setDuplicating(false);
    }
  };

  useEffect(() => {
    fetch(`/api/topics/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setTopic)
      .catch(() => setError("Topic not found"));
  }, [slug]);

  if (error) {
    return (
      <div className="landing-page selection:bg-[#FF3300] selection:text-white min-h-screen flex flex-col">
        <NoiseOverlay />
        <main className="flex-1 w-full border-b-2 border-black bg-[#E6E6E6] p-6 lg:p-12 flex items-center justify-center">
          <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
            <p className="font-tech text-sm text-red-600 uppercase">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="landing-page selection:bg-[#FF3300] selection:text-white min-h-screen flex flex-col">
        <NoiseOverlay />
        <main className="flex-1 w-full border-b-2 border-black bg-[#E6E6E6] p-6 lg:p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </main>
      </div>
    );
  }

  let sections: SectionConfig[] = [];
  try {
    sections =
      typeof topic.sections === "string"
        ? JSON.parse(topic.sections)
        : topic.sections;
  } catch {
    sections = [];
  }

  return (
    <div className="landing-page selection:bg-[#FF3300] selection:text-white min-h-screen flex flex-col">
      <NoiseOverlay />
      <main className="flex-1 w-full border-b-2 border-black bg-[#E6E6E6] p-6 lg:p-12">
        <div className="mx-auto max-w-3xl relative z-10">
          {/* Header */}
          <div className="mb-8 bg-white border-2 border-black p-6 lg:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{topic.icon}</span>
                <h1 className="text-2xl font-extrabold uppercase tracking-tight-custom">
                  {topic.name}
                </h1>
                <span className="font-tech text-[10px] uppercase text-gray-400">
                  /{topic.slug}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDuplicate}
                  disabled={duplicating}
                  className="flex items-center gap-2 h-10 px-5 bg-[#E6E6E6] font-bold uppercase text-xs border-2 border-black hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50"
                >
                  {duplicating ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Copy strokeWidth={2} className="w-3 h-3" />
                  )}
                  Duplicate
                </button>
                {!topic._hardcoded && (
                  <Link
                    href={`/admin/studio/${topic.slug}/edit`}
                    className="flex items-center gap-2 h-10 px-5 bg-black text-white font-bold uppercase text-xs border-2 border-black hover:bg-[#FF3300] transition-colors"
                  >
                    <Pencil strokeWidth={2} className="w-3 h-3" />
                    Edit
                  </Link>
                )}
              </div>
            </div>
            <p className="font-tech text-xs text-gray-600">
              {topic.description}
            </p>
          </div>

          {/* Identity */}
          <section className="mb-6 bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-sm font-extrabold uppercase tracking-tight-custom border-b-2 border-black pb-3 mb-5">
              Identity
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">{topic.name}</Field>
              <Field label="Slug">/{topic.slug}</Field>
              <Field label="Icon">
                <span className="text-xl">{topic.icon}</span>
              </Field>
              <Field label="Title Prefix">{topic.titlePrefix}</Field>
              <Field label="Tagline">{topic.tagline}</Field>
              <Field label="Description">{topic.description}</Field>
            </div>
          </section>

          {/* Prompt Configuration */}
          <section className="mb-6 bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-sm font-extrabold uppercase tracking-tight-custom border-b-2 border-black pb-3 mb-5">
              Prompt Configuration
            </h2>
            <div className="space-y-4">
              <Field label="Role">{topic.role}</Field>
              <Field label="Topic Scope">{topic.topicScope}</Field>
              {topic.toneNotes && (
                <Field label="Tone Notes">{topic.toneNotes}</Field>
              )}
            </div>
          </section>

          {/* Priority Sources */}
          {topic.prioritySources.length > 0 && (
            <section className="mb-6 bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-sm font-extrabold uppercase tracking-tight-custom border-b-2 border-black pb-3 mb-5">
                Priority Sources
              </h2>
              <div className="flex flex-wrap gap-2">
                {topic.prioritySources.map((src, i) => (
                  <span
                    key={i}
                    className="inline-block px-3 py-1 border-2 border-black bg-[#E6E6E6] font-tech text-xs"
                  >
                    {src}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Example Subjects */}
          {topic.exampleSubjects.length > 0 && (
            <section className="mb-6 bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-sm font-extrabold uppercase tracking-tight-custom border-b-2 border-black pb-3 mb-5">
                Example Email Subjects
              </h2>
              <ul className="space-y-1">
                {topic.exampleSubjects.map((subj, i) => (
                  <li key={i} className="font-tech text-sm text-gray-700">
                    &ldquo;{subj}&rdquo;
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Sections */}
          {sections.length > 0 && (
            <section className="mb-6 bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-sm font-extrabold uppercase tracking-tight-custom border-b-2 border-black pb-3 mb-5">
                Newsletter Sections ({sections.length})
              </h2>
              <div className="space-y-4">
                {sections.map((section, i) => (
                  <div
                    key={i}
                    className="border-2 border-gray-200 p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{section.emoji}</span>
                      <span className="font-extrabold uppercase tracking-tight-custom text-sm">
                        {section.title}
                      </span>
                      <span className="font-tech text-[10px] text-gray-400 ml-auto">
                        {typeof section.itemCount === "number"
                          ? `${section.itemCount} item`
                          : `${section.itemCount[0]}–${section.itemCount[1]} items`}
                        {" · "}
                        {section.wordRange[0]}–{section.wordRange[1]} words
                      </span>
                    </div>
                    <p className="font-tech text-xs text-gray-500 mb-2">
                      {section.description}
                    </p>
                    <div className="space-y-1">
                      {section.sentenceGuide.map((guide, gi) => (
                        <p
                          key={gi}
                          className="font-tech text-xs text-gray-600"
                        >
                          <span className="text-gray-400">{gi + 1}.</span> {guide}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Footer nav */}
          <div className="flex items-center justify-between mt-2">
            <Link
              href="/admin/studio"
              className="inline-flex items-center gap-1 font-tech text-xs uppercase text-gray-500 hover:text-black transition-colors"
            >
              <ArrowLeft strokeWidth={2} className="w-3 h-3" />
              Back to Studio
            </Link>
            <span className="font-tech text-[10px] text-gray-400">
              Updated {new Date(topic.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
