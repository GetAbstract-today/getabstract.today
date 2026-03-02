"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NoiseOverlay } from "@/components/landing-website";
import {
  ArrowLeft,
  Loader2,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
// ── Types ──

export interface SectionConfig {
  emoji: string;
  title: string;
  description: string;
  sentenceGuide: string[];
  itemCount: number | [number, number];
  wordRange: [number, number];
}

export interface TopicFormData {
  slug: string;
  name: string;
  icon: string;
  description: string;
  tagline: string;
  role: string;
  topicScope: string;
  titlePrefix: string;
  toneNotes: string;
  prioritySources: string[];
  exampleSubjects: string[];
}

const DEFAULT_FORM: TopicFormData = {
  slug: "",
  name: "",
  icon: "📰",
  description: "",
  tagline: "",
  role: "",
  topicScope: "",
  titlePrefix: "",
  toneNotes: "",
  prioritySources: [""],
  exampleSubjects: [""],
};

// ── Reusable field components ──

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={htmlFor}
        className="font-tech text-xs uppercase tracking-widest text-gray-600 block"
      >
        {label}
      </label>
      {children}
      {hint && (
        <p className="font-tech text-[10px] text-gray-400">{hint}</p>
      )}
    </div>
  );
}

const inputClass =
  "w-full h-10 px-3 rounded-none border-2 border-black bg-[#E6E6E6] font-tech text-sm focus:bg-white focus:outline-none focus:ring-0";
const textareaClass =
  "w-full px-3 py-2 rounded-none border-2 border-black bg-[#E6E6E6] font-tech text-sm focus:bg-white focus:outline-none focus:ring-0 resize-y min-h-[60px]";

// ── Main component ──

export default function TopicForm({
  initialData,
  mode,
}: {
  initialData?: TopicFormData;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [form, setForm] = useState<TopicFormData>(initialData ?? DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof TopicFormData>(key: K, value: TopicFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ── Array field helpers ──

  const updateArrayItem = (
    key: "prioritySources" | "exampleSubjects",
    index: number,
    value: string
  ) => {
    const arr = [...form[key]];
    arr[index] = value;
    set(key, arr);
  };

  const addArrayItem = (key: "prioritySources" | "exampleSubjects") => {
    set(key, [...form[key], ""]);
  };

  const removeArrayItem = (key: "prioritySources" | "exampleSubjects", index: number) => {
    set(
      key,
      form[key].filter((_, i) => i !== index)
    );
  };

  // ── Submit ──

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const body = {
      ...form,
      prioritySources: form.prioritySources.filter((s) => s.trim()),
      exampleSubjects: form.exampleSubjects.filter((s) => s.trim()),
    };

    try {
      const url =
        mode === "create" ? "/api/topics" : `/api/topics/${initialData?.slug}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        setSaving(false);
        return;
      }

      router.push("/admin/studio");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  };

  const pageTitle = mode === "create" ? "New Topic" : `Edit: ${form.name}`;

  return (
    <div className="landing-page selection:bg-[#FF3300] selection:text-white min-h-screen flex flex-col">
      <NoiseOverlay />
      <main className="flex-1 w-full border-b-2 border-black bg-[#E6E6E6] p-6 lg:p-12">
        <div className="mx-auto max-w-3xl relative z-10">
          {/* Header */}
          <div className="mb-8 bg-white border-2 border-black p-6 lg:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 border-b-2 border-black pb-4 mb-4">
              <div className="w-3 h-3 bg-[#FF3300]" />
              <h1 className="text-2xl font-extrabold uppercase tracking-tight-custom">
                {pageTitle}
              </h1>
            </div>
            <p className="font-tech text-xs uppercase text-gray-600">
              {mode === "create"
                ? "Define a new newsletter topic profile."
                : "Modify this topic profile. Changes take effect on the next generation."}
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-600 p-4">
              <p className="font-tech text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ─── Identity ─── */}
            <section className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-sm font-extrabold uppercase tracking-tight-custom border-b-2 border-black pb-3 mb-5">
                Identity
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Name"
                  htmlFor="name"
                  hint="e.g. Cybersecurity, Climate Tech"
                >
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field
                  label="Slug"
                  htmlFor="slug"
                  hint="Lowercase, hyphens only. Cannot be 'ai'."
                >
                  <input
                    id="slug"
                    type="text"
                    required
                    disabled={mode === "edit"}
                    value={form.slug}
                    onChange={(e) =>
                      set(
                        "slug",
                        e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                      )
                    }
                    className={`${inputClass} ${mode === "edit" ? "opacity-50 cursor-not-allowed" : ""}`}
                  />
                </Field>
                <Field label="Icon" htmlFor="icon" hint="Single emoji">
                  <input
                    id="icon"
                    type="text"
                    required
                    maxLength={4}
                    value={form.icon}
                    onChange={(e) => set("icon", e.target.value)}
                    className={`${inputClass} w-20 text-center text-lg`}
                  />
                </Field>
                <Field label="Title Prefix" htmlFor="titlePrefix" hint="e.g. CYBER BRIEF">
                  <input
                    id="titlePrefix"
                    type="text"
                    required
                    value={form.titlePrefix}
                    onChange={(e) => set("titlePrefix", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="mt-5 space-y-5">
                <Field label="Description" htmlFor="description" hint="Short public description">
                  <textarea
                    id="description"
                    required
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    className={textareaClass}
                  />
                </Field>
                <Field label="Tagline" htmlFor="tagline" hint="Public tagline shown to subscribers">
                  <input
                    id="tagline"
                    type="text"
                    required
                    value={form.tagline}
                    onChange={(e) => set("tagline", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
            </section>

            {/* ─── Prompt Configuration ─── */}
            <section className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-sm font-extrabold uppercase tracking-tight-custom border-b-2 border-black pb-3 mb-5">
                Prompt Configuration
              </h2>
              <div className="space-y-5">
                <Field
                  label="Role"
                  htmlFor="role"
                  hint="How the AI should identify itself. e.g. 'expert cybersecurity analyst and newsletter curator'"
                >
                  <textarea
                    id="role"
                    required
                    value={form.role}
                    onChange={(e) => set("role", e.target.value)}
                    className={textareaClass}
                  />
                </Field>
                <Field
                  label="Topic Scope"
                  htmlFor="topicScope"
                  hint="What the newsletter covers. e.g. 'cybersecurity, threat intelligence, and infosec'"
                >
                  <textarea
                    id="topicScope"
                    required
                    value={form.topicScope}
                    onChange={(e) => set("topicScope", e.target.value)}
                    className={textareaClass}
                  />
                </Field>
                <Field
                  label="Tone Notes"
                  htmlFor="toneNotes"
                  hint="Optional extra tone guidance"
                >
                  <textarea
                    id="toneNotes"
                    value={form.toneNotes}
                    onChange={(e) => set("toneNotes", e.target.value)}
                    className={textareaClass}
                  />
                </Field>
              </div>
            </section>

            {/* ─── Priority Sources ─── */}
            <section className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-5">
                <h2 className="text-sm font-extrabold uppercase tracking-tight-custom">
                  Priority Sources
                </h2>
                <button
                  type="button"
                  onClick={() => addArrayItem("prioritySources")}
                  className="flex items-center gap-1 font-tech text-xs uppercase text-[#FF3300] hover:text-black transition-colors"
                >
                  <Plus strokeWidth={2} className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {form.prioritySources.map((src, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={src}
                      onChange={(e) =>
                        updateArrayItem("prioritySources", i, e.target.value)
                      }
                      placeholder="e.g. TechCrunch, Ars Technica"
                      className={`${inputClass} flex-1`}
                    />
                    {form.prioritySources.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("prioritySources", i)}
                        className="w-10 h-10 border-2 border-black flex items-center justify-center bg-[#E6E6E6] hover:bg-red-600 hover:text-white transition-colors flex-shrink-0"
                      >
                        <Trash2 strokeWidth={1.5} className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ─── Example Subjects ─── */}
            <section className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-5">
                <h2 className="text-sm font-extrabold uppercase tracking-tight-custom">
                  Example Email Subjects
                </h2>
                <button
                  type="button"
                  onClick={() => addArrayItem("exampleSubjects")}
                  className="flex items-center gap-1 font-tech text-xs uppercase text-[#FF3300] hover:text-black transition-colors"
                >
                  <Plus strokeWidth={2} className="w-3 h-3" /> Add
                </button>
              </div>
              <p className="font-tech text-[10px] text-gray-400 mb-3">
                Sample email subject lines the AI can draw inspiration from.
              </p>
              <div className="space-y-2">
                {form.exampleSubjects.map((subj, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={subj}
                      onChange={(e) =>
                        updateArrayItem("exampleSubjects", i, e.target.value)
                      }
                      placeholder="e.g. GPT-5 drops next week"
                      className={`${inputClass} flex-1`}
                    />
                    {form.exampleSubjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("exampleSubjects", i)}
                        className="w-10 h-10 border-2 border-black flex items-center justify-center bg-[#E6E6E6] hover:bg-red-600 hover:text-white transition-colors flex-shrink-0"
                      >
                        <Trash2 strokeWidth={1.5} className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ─── Actions ─── */}
            <div className="flex items-center justify-between">
              <Link
                href="/admin/studio"
                className="font-tech text-xs uppercase text-gray-500 hover:text-black transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 h-12 px-8 bg-black text-white font-bold uppercase border-2 border-black hover:bg-[#FF3300] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save strokeWidth={2} className="w-4 h-4" />
                    {mode === "create" ? "Create Topic" : "Save Changes"}
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 font-tech text-xs uppercase text-gray-500 hover:text-black transition-colors"
            >
              <ArrowLeft strokeWidth={2} className="w-3 h-3" />
              Back to dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
