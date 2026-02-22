"use client";

import { useState } from "react";
import Link from "next/link";
import { Streamdown } from "streamdown";
import { NoiseOverlay } from "@/components/landing-website";
import { newsletterCategories } from "@/lib/newsletter-categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function getDateOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const value = d.toISOString().slice(0, 10);
    options.push({ value, label: value });
  }
  return options;
}

const DATE_OPTIONS = getDateOptions();

export default function ExampleGeneratePage() {
  const [date, setDate] = useState(DATE_OPTIONS[0]?.value ?? "");
  const [newsletterType, setNewsletterType] = useState("ai");
  const [result, setResult] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setError(null);
    setResult("");
    setTitle("");
    setLoading(true);
    try {
      const res = await fetch("/api/newsletters/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, newsletterType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Generation failed");
        return;
      }
      setResult(data.content ?? "");
      setTitle(data.title ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="landing-page selection:bg-[#FF3300] selection:text-white min-h-screen flex flex-col">
      <NoiseOverlay />
      <main className="flex-1 w-full border-b-2 border-black bg-[#E6E6E6] p-6 lg:p-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 bg-white border-2 border-black p-6 lg:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-4 border-b-2 border-black pb-4">
              <div className="w-3 h-3 bg-[#FF3300] animate-pulse" />
              <h1 className="text-2xl font-extrabold uppercase tracking-tight-custom">
                Newsletter generation
              </h1>
            </div>
            <p className="font-tech text-xs uppercase text-gray-600 mb-6">
              Pick a date and newsletter type, then generate. Result is saved to
              the database and shown below.
            </p>

            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="date"
                  className="font-tech text-xs uppercase tracking-widest text-gray-600 block"
                >
                  Date
                </label>
                <Select value={date} onValueChange={setDate}>
                  <SelectTrigger
                    id="date"
                    className="w-[180px] h-12 rounded-none border-2 border-black bg-[#E6E6E6] font-tech text-sm focus:bg-white focus:ring-0 focus:ring-offset-0"
                  >
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-2 border-black bg-white">
                    {DATE_OPTIONS.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="font-tech text-sm focus:bg-[#FF3300]/10 focus:text-[#1A1A1A]"
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="type"
                  className="font-tech text-xs uppercase tracking-widest text-gray-600 block"
                >
                  Newsletter type
                </label>
                <Select value={newsletterType} onValueChange={setNewsletterType}>
                  <SelectTrigger
                    id="type"
                    className="w-[220px] h-12 rounded-none border-2 border-black bg-[#E6E6E6] font-tech text-sm focus:bg-white focus:ring-0 focus:ring-offset-0"
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-2 border-black bg-white">
                    {newsletterCategories.map((t) => (
                      <SelectItem
                        key={t.id}
                        value={t.id}
                        className="font-tech text-sm focus:bg-[#FF3300]/10 focus:text-[#1A1A1A]"
                      >
                        {t.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="h-12 px-8 bg-black text-white font-bold uppercase border-2 border-black hover:bg-[#FF3300] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Generating…" : "Generate"}
              </button>
            </div>

            {error && (
              <p
                className="mt-4 font-tech text-xs uppercase text-[#FF3300]"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>

          <div className="bg-white border-2 border-black p-6 lg:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="font-tech text-xs uppercase tracking-widest text-gray-600 mb-4">
              Result
            </div>
            {title && (
              <div className="mb-4 p-3 border-2 border-black bg-[#FFF8E1]">
                <span className="font-tech text-xs uppercase tracking-widest text-gray-600">Email subject: </span>
                <span className="font-bold text-sm">{title}</span>
              </div>
            )}
            <div className="min-h-[320px] overflow-auto border-2 border-black bg-[#E6E6E6] p-4">
              {result ? (
                <Streamdown className="prose prose-neutral max-w-none">
                  {result}
                </Streamdown>
              ) : (
                <p className="font-tech text-sm text-gray-500 uppercase">
                  Generated newsletter will appear here.
                </p>
              )}
            </div>
          </div>

          <Link
            href="/"
            className="mt-6 inline-block font-tech text-xs uppercase text-gray-500 hover:text-black transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
