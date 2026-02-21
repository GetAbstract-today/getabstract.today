"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { newsletterCategories } from "@/lib/newsletter-categories";

const MODAL_CATEGORY_IDS = [
  "ai",
  "devops",
  "product",
  "infosec",
  "dev",
] as const;

const modalCategories = MODAL_CATEGORY_IDS.map((id) => {
  const c = newsletterCategories.find((cat) => cat.id === id);
  return c
    ? {
        id: c.id,
        title: id === "infosec" ? "InfoSec" : c.title,
        description: c.description,
        Icon: c.Icon,
      }
    : null;
}).filter(Boolean) as Array<{
  id: string;
  title: string;
  description: string;
  Icon: (typeof newsletterCategories)[0]["Icon"];
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
            body: JSON.stringify({
              email: email.trim().toLowerCase(),
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden />
      <div className="relative z-10 w-full max-w-lg bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 lg:p-8">
        <div className="mb-6 border-b-2 border-black pb-4">
          <h2
            id="category-modal-title"
            className="text-xl font-extrabold uppercase tracking-tight text-[#1A1A1A]"
          >
            Choose your newsletters
          </h2>
          <p className="mt-1 font-tech text-xs uppercase text-gray-600">
            Sign up for the topics you care about. One email, five minutes.
          </p>
        </div>
        <div className="space-y-3">
          {modalCategories.map((cat) => {
            const isSelected = selected.has(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggle(cat.id)}
                aria-pressed={isSelected}
                className={`w-full flex items-start gap-4 text-left border-2 p-4 transition-colors ${
                  isSelected
                    ? "border-black bg-[#FF3300]/10"
                    : "border-black bg-white hover:bg-[#E6E6E6]"
                }`}
              >
                <div className="w-10 h-10 shrink-0 border-2 border-black rounded-full flex items-center justify-center bg-white">
                  <cat.Icon
                    strokeWidth={1.5}
                    className={`w-5 h-5 ${isSelected ? "text-[#FF3300]" : "text-black"}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold uppercase text-sm text-[#1A1A1A]">
                    {cat.title}
                  </p>
                  <p className="mt-0.5 font-tech text-xs text-gray-600">
                    {cat.description}
                  </p>
                </div>
                <div
                  className={`flex h-8 w-14 shrink-0 items-center rounded-full border-2 border-black transition-colors ${
                    isSelected
                      ? "bg-[#FF3300] justify-end pl-1 pr-2"
                      : "bg-[#E6E6E6] justify-start pl-2 pr-1"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 rounded-full border-2 border-black ${
                      isSelected ? "bg-white" : "bg-[#E6E6E6]"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
        {error && (
          <p
            className="mt-3 font-tech text-xs text-[#FF3300] uppercase"
            role="alert"
          >
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || selected.size === 0}
            className="bg-black text-white font-bold uppercase px-8 py-3 hover:bg-[#FF3300] transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black"
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
