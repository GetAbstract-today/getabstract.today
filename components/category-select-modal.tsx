"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { newsletterCategories } from "@/lib/newsletter-categories";
import { isValidEmail } from "@/lib/validate-email";
import { X } from "lucide-react";

const INITIAL_VISIBLE = 5;

type ModalCategory = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type CategorySelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  onSuccess: () => void;
};

export function CategorySelectModal({
  isOpen,
  onClose,
  email: emailProp = "",
  onSuccess,
}: CategorySelectModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(["ai"]));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ModalCategory[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [inlineEmail, setInlineEmail] = useState("");

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Fetch DB topics and merge with hardcoded active categories
  useEffect(() => {
    if (!isOpen) return;
    setSelected(new Set(["ai"]));
    setExpanded(false);
    setError(null);
    setInlineEmail("");
    setLoadingTopics(true);

    fetch("/api/topics")
      .then((r) => (r.ok ? r.json() : []))
      .then((dbTopics: Array<{ slug: string; name: string; description: string; icon: string }>) => {
        // Start with hardcoded active categories
        const seen = new Set<string>();
        const merged: ModalCategory[] = [];

        for (const c of newsletterCategories) {
          if (c.comingSoon) continue;
          seen.add(c.id);
          merged.push({ id: c.id, title: c.title, description: c.description, icon: c.icon });
        }

        // Add DB topics not already in hardcoded list
        for (const t of dbTopics) {
          if (seen.has(t.slug)) continue;
          seen.add(t.slug);
          merged.push({ id: t.slug, title: t.name, description: t.description, icon: t.icon });
        }

        // Ensure AI is first
        merged.sort((a, b) => (a.id === "ai" ? -1 : b.id === "ai" ? 1 : 0));

        setCategories(merged);
      })
      .catch(() => {
        // Fallback: just show hardcoded active categories
        setCategories(
          newsletterCategories
            .filter((c) => !c.comingSoon)
            .map((c) => ({ id: c.id, title: c.title, description: c.description, icon: c.icon })),
        );
      })
      .finally(() => setLoadingTopics(false));
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  async function handleSave() {
    if (selected.size === 0) {
      setError("Select at least one newsletter.");
      return;
    }
    const finalEmail = (emailProp || inlineEmail).trim().toLowerCase();
    if (!finalEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!isValidEmail(finalEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const results = await Promise.allSettled(
        Array.from(selected).map((category) =>
          fetch("/api/subscribers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: finalEmail,
              category,
            }),
          }),
        ),
      );
      const failed = results.filter(
        (r) =>
          r.status === "rejected" ||
          (r.status === "fulfilled" && !(r.value as Response).ok),
      );
      if (failed.length > 0) {
        setError("Some subscriptions failed. Please try again.");
        return;
      }
      onSuccess();
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-modal-title"
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] flex flex-col bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 lg:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-[#E6E6E6] transition-colors border-2 border-transparent hover:border-black"
          aria-label="Close"
        >
          <X strokeWidth={2} className="w-5 h-5" />
        </button>
        <div className="mb-4 border-b-2 border-black pb-4">
          <h2
            id="category-modal-title"
            className="text-xl font-extrabold uppercase tracking-tight text-[#1A1A1A]"
          >
            Choose your newsletters
          </h2>
          <p className="mt-1 font-tech text-xs uppercase text-gray-600">
            Sign up for the topics you care about. One email, two minutes.
          </p>
        </div>
        <div className={`${expanded ? "overflow-y-auto" : ""} flex-1 min-h-0 space-y-2 pr-1`}>
          {loadingTopics ? (
            <p className="font-tech text-xs uppercase text-gray-500 text-center py-8">
              Loading topics…
            </p>
          ) : (
            <>
              {(expanded ? categories : categories.slice(0, INITIAL_VISIBLE)).map((cat) => {
                const isSelected = selected.has(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggle(cat.id)}
                    aria-pressed={isSelected}
                    className={`w-full flex items-center gap-3 text-left border-2 px-3 py-2.5 transition-colors ${
                      isSelected
                        ? "border-black bg-[#FF3300]/10"
                        : "border-black bg-white hover:bg-[#E6E6E6]"
                    }`}
                  >
                    <span className="text-lg shrink-0 w-8 text-center">{cat.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold uppercase text-sm text-[#1A1A1A] leading-tight">
                        {cat.title}
                      </p>
                    </div>
                    <div
                      className={`flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-black transition-colors ${
                        isSelected
                          ? "bg-[#FF3300] justify-end pl-1 pr-1"
                          : "bg-[#E6E6E6] justify-start pl-1 pr-1"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 rounded-full border-2 border-black ${
                          isSelected ? "bg-white" : "bg-[#E6E6E6]"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
              {!expanded && categories.length > INITIAL_VISIBLE && (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="w-full text-center font-tech text-xs uppercase text-[#FF3300] hover:text-black transition-colors py-2"
                >
                  See more ({categories.length - INITIAL_VISIBLE} more topics)
                </button>
              )}
            </>
          )}
        </div>
        {error && (
          <p
            className="mt-3 font-tech text-xs text-[#FF3300] uppercase"
            role="alert"
          >
            {error}
          </p>
        )}
        <div className="mt-6 flex flex-col gap-3">
          {!emailProp && (
            <div className="flex w-full border-2 border-black">
              <input
                type="email"
                value={inlineEmail}
                onChange={(e) => setInlineEmail(e.target.value)}
                placeholder="Email Address"
                aria-label="Email address"
                className="flex-1 bg-[#E6E6E6] p-3 font-tech text-sm text-black outline-none placeholder:text-gray-500 focus:bg-white transition-colors border-0"
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || selected.size === 0}
                className="bg-black text-white font-bold uppercase px-6 py-3 hover:bg-[#FF3300] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 font-tech text-xs tracking-widest"
              >
                {saving ? "Subscribing…" : "Subscribe"}
              </button>
            </div>
          )}
          {emailProp && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || selected.size === 0}
                className="bg-black text-white font-bold uppercase px-8 py-3 hover:bg-[#FF3300] transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black"
              >
                {saving ? "Subscribing…" : "Subscribe"}
              </button>
            </div>
          )}
          <p className="text-[10px] text-gray-400 w-full">
            By subscribing you agree to our{" "}
            <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a>.
            Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(content, document.body)
    : null;
}
