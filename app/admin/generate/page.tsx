"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { Streamdown } from "streamdown";
import { NoiseOverlay } from "@/components/landing-website";
import { Undo2, Redo2, Check, Loader2, Pencil, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TopicOption {
  slug: string;
  name: string;
  icon: string;
}

// AI is always first — it's hardcoded
const AI_TOPIC: TopicOption = { slug: "ai", name: "AI", icon: "🧠" };

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

interface NewsletterHistoryItem {
  id: string;
  title: string | null;
  createdAt: string;
  date: string; // YYYY-MM-DD derived from createdAt
}

const AUTOSAVE_DELAY = 1500; // ms

// ── Undo / Redo history hook ──────────────────────────────────────────
function useHistory(initial: string) {
  const [stack, setStack] = useState<string[]>([initial]);
  const [pointer, setPointer] = useState(0);

  const current = stack[pointer] ?? "";

  const push = useCallback(
    (value: string) => {
      setStack((prev) => {
        const next = prev.slice(0, pointer + 1);
        next.push(value);
        // keep max 100 entries
        if (next.length > 100) next.shift();
        return next;
        });
      setPointer((p) => Math.min(p + 1, 99));
    },
    [pointer]
  );

  const undo = useCallback(() => {
    setPointer((p) => Math.max(0, p - 1));
  }, []);

  const redo = useCallback(() => {
    setPointer((p) => Math.min(stack.length - 1, p + 1));
  }, [stack.length]);

  const canUndo = pointer > 0;
  const canRedo = pointer < stack.length - 1;

  const reset = useCallback((value: string) => {
    setStack([value]);
    setPointer(0);
  }, []);

  return { current, push, undo, redo, canUndo, canRedo, reset };
}

export default function AdminGeneratePage() {
  const today = todayStr();

  // ── All state ──
  const [date, setDate] = useState(today);
  const [newsletterType, setNewsletterType] = useState("ai");
  const [topics, setTopics] = useState<TopicOption[]>([AI_TOPIC]);
  const [title, setTitle] = useState("");
  const [newsletterId, setNewsletterId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history_items, setHistoryItems] = useState<NewsletterHistoryItem[]>([]);
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const history = useHistory("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>("");

  const isToday = date === today;

  // ── Helpers ──
  function clearResult() {
    history.reset("");
    setTitle("");
    setNewsletterId(null);
    setSaveStatus("idle");
    setEditMode(false);
    lastSavedRef.current = "";
  }

  // Auto-save function
  const saveToServer = useCallback(
    async (content: string) => {
      if (!newsletterId) return;
      if (content === lastSavedRef.current) return;
      setSaveStatus("saving");
      try {
        const res = await fetch(`/api/newsletters/${newsletterId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        if (res.ok) {
          lastSavedRef.current = content;
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        }
      } catch {
        setSaveStatus("idle");
      }
    },
    [newsletterId]
  );

  // Schedule auto-save on content change
  const handleContentChange = useCallback(
    (value: string) => {
      history.push(value);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(
        () => saveToServer(value),
        AUTOSAVE_DELAY
      );
    },
    [history, saveToServer]
  );

  // ── Effects ──

  // Fetch DB topic profiles on mount
  useEffect(() => {
    fetch("/api/topics")
      .then((r) => r.json())
      .then((data: Array<{ slug: string; name: string; icon: string }>) => {
        const dbTopics = data.map((t) => ({
          slug: t.slug,
          name: t.name,
          icon: t.icon,
        }));
        setTopics([AI_TOPIC, ...dbTopics]);
      })
      .catch(() => {});
  }, []);

  // Fetch newsletter history when category changes
  useEffect(() => {
    setHistoryLoading(true);
    fetch(`/api/newsletters?category=${encodeURIComponent(newsletterType)}`)
      .then((r) => r.json())
      .then(
        (
          data: Array<{
            id: string;
            title: string | null;
            createdAt: string;
          }>
        ) => {
          setHistoryItems(
            data.map((n) => ({
              id: n.id,
              title: n.title,
              createdAt: n.createdAt,
              date: n.createdAt.slice(0, 10),
            }))
          );
        }
      )
      .catch(() => setHistoryItems([]))
      .finally(() => setHistoryLoading(false));
    setDate(today);
    clearResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsletterType]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (editMode && textareaRef.current) {
      const ta = textareaRef.current;
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    }
  }, [editMode, history.current]);

  // ── Derived state ──

  // Build date options: today first, then unique history dates
  const dateOptions = (() => {
    const opts: { value: string; label: string; historyId?: string }[] = [];
    const todayItem = history_items.find((h) => h.date === today);
    opts.push({
      value: today,
      label: `Today — ${today}`,
      historyId: todayItem?.id,
    });
    const seen = new Set<string>();
    seen.add(today);
    for (const item of history_items) {
      if (seen.has(item.date)) continue;
      seen.add(item.date);
      opts.push({ value: item.date, label: item.date, historyId: item.id });
    }
    return opts;
  })();

  // ── Handlers ──

  async function handleDateChange(newDate: string) {
    setDate(newDate);
    setError(null);
    setSendStatus(null);

    if (newDate === today) {
      clearResult();
      return;
    }

    const item = history_items.find((h) => h.date === newDate);
    if (!item) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/newsletters/${item.id}`);
      if (!res.ok) {
        setError("Failed to load newsletter");
        return;
      }
      const data = await res.json();
      history.reset(data.content ?? "");
      lastSavedRef.current = data.content ?? "";
      setTitle(data.title ?? "");
      setNewsletterId(data.id);
      setEditMode(false);
    } catch {
      setError("Failed to load newsletter");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    setError(null);
    clearResult();
    setSendStatus(null);
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
      const content = data.content ?? "";
      history.reset(content);
      lastSavedRef.current = content;
      setTitle(data.title ?? "");
      setNewsletterId(data.id ?? null);

      // Refresh history
      fetch(`/api/newsletters?category=${encodeURIComponent(newsletterType)}`)
        .then((r) => r.json())
        .then(
          (
            items: Array<{
              id: string;
              title: string | null;
              createdAt: string;
            }>
          ) => {
            setHistoryItems(
              items.map((n) => ({
                id: n.id,
                title: n.title,
                createdAt: n.createdAt,
                date: n.createdAt.slice(0, 10),
              }))
            );
          }
        )
        .catch(() => {});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  const result = history.current;

  return (
    <div className="landing-page selection:bg-[#FF3300] selection:text-white min-h-screen flex flex-col">
      <NoiseOverlay />
      <main className="flex-1 w-full border-b-2 border-black bg-[#E6E6E6] p-6 lg:p-12">
        <div className="mx-auto max-w-4xl">
          {/* ── Generation controls ── */}
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
                <Select value={date} onValueChange={handleDateChange}>
                  <SelectTrigger
                    id="date"
                    className="w-[340px] h-12 rounded-none border-2 border-black bg-[#E6E6E6] font-tech text-sm focus:bg-white focus:ring-0 focus:ring-offset-0"
                  >
                    <SelectValue placeholder={historyLoading ? "Loading…" : "Select date"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-2 border-black bg-white max-h-[300px]">
                    {dateOptions.map((opt, i) => (
                      <SelectItem
                        key={opt.value + (opt.historyId ?? "")}
                        value={opt.value}
                        className={`font-tech text-sm focus:bg-[#FF3300]/10 focus:text-[#1A1A1A] ${
                          i === 0
                            ? "border-b border-gray-200 font-bold"
                            : ""
                        }`}
                      >
                        <span className="truncate block max-w-[300px]">
                          {opt.label}
                        </span>
                      </SelectItem>
                    ))}
                    {dateOptions.length === 1 && (
                      <div className="px-3 py-2 font-tech text-xs text-gray-400 uppercase">
                        No previous newsletters
                      </div>
                    )}
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
                    {topics.map((t) => (
                      <SelectItem
                        key={t.slug}
                        value={t.slug}
                        className="font-tech text-sm focus:bg-[#FF3300]/10 focus:text-[#1A1A1A]"
                      >
                        {t.icon} {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading || !isToday}
                className="h-12 px-8 bg-black text-white font-bold uppercase border-2 border-black hover:bg-[#FF3300] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (isToday ? "Generating…" : "Loading…") : "Generate"}
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

          {/* ── Result with edit / undo-redo / auto-save ── */}
          <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-3 border-b-2 border-black bg-[#F5F5F5]">
              <div className="font-tech text-xs uppercase tracking-widest text-gray-600">
                Result
              </div>
              {result && (
                <div className="flex items-center gap-2">
                  {/* Save status */}
                  <span className="font-tech text-xs uppercase text-gray-400 mr-2">
                    {saveStatus === "saving" && (
                      <span className="inline-flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Saving…
                      </span>
                    )}
                    {saveStatus === "saved" && (
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <Check className="w-3 h-3" /> Saved
                      </span>
                    )}
                  </span>

                  {/* Undo */}
                  <button
                    type="button"
                    onClick={history.undo}
                    disabled={!history.canUndo}
                    className="w-8 h-8 flex items-center justify-center border-2 border-black bg-white hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black transition-colors"
                    title="Undo"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>

                  {/* Redo */}
                  <button
                    type="button"
                    onClick={history.redo}
                    disabled={!history.canRedo}
                    className="w-8 h-8 flex items-center justify-center border-2 border-black bg-white hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black transition-colors"
                    title="Redo"
                  >
                    <Redo2 className="w-4 h-4" />
                  </button>

                  {/* Toggle edit / preview */}
                  <button
                    type="button"
                    onClick={() => setEditMode((v) => !v)}
                    className="h-8 px-3 flex items-center gap-1.5 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors font-tech text-xs uppercase"
                    title={editMode ? "Preview" : "Edit"}
                  >
                    {editMode ? (
                      <>
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </>
                    ) : (
                      <>
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Content area */}
            <div className="p-6 lg:p-8">
              {title && (
                <div className="mb-4 p-3 border-2 border-black bg-[#FFF8E1]">
                  <span className="font-tech text-xs uppercase tracking-widest text-gray-600">
                    Email subject:{" "}
                  </span>
                  <span className="font-bold text-sm">{title}</span>
                </div>
              )}
              <div className="min-h-[320px] overflow-auto border-2 border-black bg-[#E6E6E6] p-4">
                {result ? (
                  editMode ? (
                    <textarea
                      ref={textareaRef}
                      value={result}
                      onChange={(e) => handleContentChange(e.target.value)}
                      className="w-full min-h-[320px] bg-transparent font-mono text-sm leading-relaxed resize-none outline-none"
                      spellCheck={false}
                    />
                  ) : (
                    <Streamdown className="prose prose-neutral max-w-none">
                      {result}
                    </Streamdown>
                  )
                ) : (
                  <p className="font-tech text-sm text-gray-500 uppercase">
                    Generated newsletter will appear here.
                  </p>
                )}
              </div>
            </div>
          </div>

          {result && newsletterId && (
            <div className="mt-6 bg-white border-2 border-black p-6 lg:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-tech text-xs uppercase tracking-widest text-gray-600 mb-1">
                    Send to subscribers
                  </div>
                  <p className="font-tech text-xs text-gray-500">
                    Send this newsletter to all subscribers of the selected category.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    // Flush any pending auto-save before sending
                    if (saveTimerRef.current) {
                      clearTimeout(saveTimerRef.current);
                      saveTimerRef.current = null;
                    }
                    await saveToServer(result);

                    setSending(true);
                    setSendStatus(null);
                    try {
                      const res = await fetch("/api/newsletters/send", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ newsletterId, date }),
                      });
                      const data = await res.json();
                      if (!res.ok) {
                        setSendStatus(`Error: ${data.error ?? "Send failed"}`);
                        return;
                      }
                      setSendStatus(
                        `Sent: ${data.sent} · Failed: ${data.failed}${data.errors ? " · " + data.errors.join(", ") : ""}`
                      );
                    } catch (e) {
                      setSendStatus(`Error: ${e instanceof Error ? e.message : "Request failed"}`);
                    } finally {
                      setSending(false);
                    }
                  }}
                  disabled={sending}
                  className="h-12 px-8 bg-[#FF3300] text-white font-bold uppercase border-2 border-black hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {sending ? "Sending…" : "Send email"}
                </button>
              </div>
              {sendStatus && (
                <p
                  className={`mt-4 font-tech text-xs uppercase ${
                    sendStatus.startsWith("Error") ? "text-[#FF3300]" : "text-green-700"
                  }`}
                >
                  {sendStatus}
                </p>
              )}
            </div>
          )}

          <Link
            href="/admin"
            className="mt-6 inline-block font-tech text-xs uppercase text-gray-500 hover:text-black transition-colors"
          >
            ← Back to admin
          </Link>
        </div>
      </main>
    </div>
  );
}
