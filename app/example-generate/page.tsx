"use client";

import { useState } from "react";
import Link from "next/link";
import { Streamdown } from "streamdown";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NEWSLETTER_TYPES = [
  { id: "ai", label: "AI" },
  { id: "startups", label: "Startups, Tech & Programming" },
  { id: "dev", label: "Dev" },
  { id: "infosec", label: "Information Security" },
  { id: "product", label: "Product Management" },
  { id: "devops", label: "DevOps" },
  { id: "founders", label: "Founders" },
  { id: "design", label: "Design" },
  { id: "marketing", label: "Marketing" },
  { id: "crypto", label: "Crypto" },
  { id: "fintech", label: "Fintech" },
  { id: "it", label: "IT" },
  { id: "data", label: "Data" },
  { id: "hardware", label: "Hardware" },
];

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setError(null);
    setResult("");
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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-white/6 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-white transition hover:text-neutral-300"
          >
            abstract
          </Link>
          <Link
            href="/newsletters"
            className="text-sm font-medium text-neutral-400 transition hover:text-white"
          >
            Newsletters
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-2 text-xl font-semibold">
          Newsletter generation (example)
        </h1>
        <p className="mb-6 text-sm text-neutral-500">
          Pick a date and newsletter type, then generate. Result is saved to the
          database and shown below.
        </p>

        <div className="mb-6 flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Select value={date} onValueChange={setDate}>
              <SelectTrigger id="date" className="w-[180px]">
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                {DATE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Newsletter type</Label>
            <Select value={newsletterType} onValueChange={setNewsletterType}>
              <SelectTrigger id="type" className="w-[220px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {NEWSLETTER_TYPES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? "Generating…" : "Generate"}
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label>Result</Label>
          <div
            className="min-h-[320px] overflow-auto rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm dark:bg-input/30"
            style={{ minHeight: "320px" }}
          >
            {result ? (
              <Streamdown className="prose prose-invert max-w-none dark:prose-invert">
                {result}
              </Streamdown>
            ) : (
              <p className="text-muted-foreground">
                Generated newsletter will appear here.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
