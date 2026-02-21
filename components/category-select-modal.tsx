"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { newsletterCategories } from "@/lib/newsletter-categories";

const MODAL_CATEGORY_IDS = ["ai", "devops", "product", "infosec", "dev"] as const;

const modalCategories = MODAL_CATEGORY_IDS.map((id) => {
  const c = newsletterCategories.find((cat) => cat.id === id);
  return c
    ? {
        id: c.id,
        title: id === "infosec" ? "InfoSec" : c.title,
        description: c.description,
      }
    : null;
}).filter(Boolean) as Array<{
  id: string;
  title: string;
  description: string;
}>;

type CategorySelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onSuccess: () => void;
};

export function CategorySelectModal({
  isOpen,
  onClose,
  email,
  onSuccess,
}: CategorySelectModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(["ai"]));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelected(new Set(["ai"]));
      setError(null);
    }
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
    setError(null);
    setSaving(true);
    try {
      const results = await Promise.allSettled(
        Array.from(selected).map((category) =>
          fetch("/api/subscribers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim().toLowerCase(), category }),
          })
        )
      );
      const failed = results.filter((r) => r.status === "rejected" || (r.status === "fulfilled" && !(r.value as Response).ok));
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
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
        <h2
          id="category-modal-title"
          className="text-xl font-bold text-white"
        >
          Get more Abstract for free
        </h2>
        <p className="mt-1 text-sm text-neutral-400">
          Sign up for Abstract newsletters about specific tech jobs and industries.
        </p>
        <div className="mt-6 space-y-3">
          {modalCategories.map((cat) => {
            const isSelected = selected.has(cat.id);
            return (
              <div
                key={cat.id}
                className="flex items-start gap-4 rounded-xl border border-white/10 bg-neutral-800/80 p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white">
                    Abstract {cat.title}
                  </p>
                  <p className="mt-0.5 text-sm text-neutral-400">
                    {cat.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(cat.id)}
                  aria-pressed={isSelected}
                  className={`flex h-8 w-14 shrink-0 items-center rounded-full transition-colors ${
                    isSelected ? "justify-end bg-violet-600 pl-1 pr-2" : "justify-start bg-neutral-600 pl-2 pr-1"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium ${
                      isSelected ? "bg-white text-violet-600" : "bg-neutral-500"
                    }`}
                  >
                    {isSelected ? "✓" : ""}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || selected.size === 0}
            className="rounded-lg bg-violet-600 px-8 py-2.5 font-medium text-white transition hover:bg-violet-500 disabled:opacity-50"
          >
            {saving ? "Subscribing…" : "Subscribe"}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(content, document.body)
    : null;
}
