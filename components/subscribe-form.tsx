"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidEmail } from "@/lib/validate-email";
import { CategorySelectModal } from "@/components/category-select-modal";

type SubscribeFormProps = {
  /** When mode is "landing", clicking Subscribe opens the category modal instead of subscribing to a single category. */
  mode?: "single" | "landing";
  /** Required when mode is "single". Ignored when mode is "landing". */
  category?: string;
  className?: string;
  formClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
  placeholder?: string;
  buttonText?: string;
  /** Optional caption below the form, e.g. "Join thousands of readers..." */
  caption?: string;
  /** Optional class for the success message wrapper */
  successClassName?: string;
  /** Optional class for the error message */
  errorClassName?: string;
};

export function SubscribeForm({
  mode = "single",
  category = "ai",
  className = "",
  formClassName = "",
  inputClassName = "",
  buttonClassName = "",
  placeholder = "Email Address",
  buttonText = "Sign Up",
  caption,
  successClassName = "",
  errorClassName = "",
}: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email address.");
      return;
    }
    if (!isValidEmail(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (mode === "landing") {
      setModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, category }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSuccess(true);
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleModalSuccess() {
    setSuccess(true);
    setEmail("");
    setModalOpen(false);
  }

  if (success) {
    return (
      <div className={className}>
        <p className={`text-sm font-medium text-emerald-600 ${successClassName}`}>
          Thanks! You're subscribed.
        </p>
      </div>
    );
  }

  return (
    <>
      <CategorySelectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        email={email.trim()}
        onSuccess={handleModalSuccess}
      />
      <div className={className}>
      <form
        onSubmit={handleSubmit}
        className={formClassName || "flex w-full max-w-sm flex-col gap-3 sm:flex-row"}
      >
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          disabled={loading}
          aria-label="Email address"
          className={`min-h-11 flex-1 rounded-lg border-black/15 bg-[#E6E6E6] px-4 text-black placeholder:text-gray-500 focus-visible:ring-[#FF3300] ${inputClassName}`}
        />
        <Button
          type="submit"
          disabled={loading}
          className={`min-h-11 shrink-0 rounded-lg bg-black px-6 font-medium text-white hover:bg-[#FF3300] ${buttonClassName}`}
        >
          {loading ? "Subscribing…" : buttonText}
        </Button>
      </form>
      {error && (
        <p className={`mt-2 w-full max-w-sm text-sm text-red-400 ${errorClassName}`.trim()} role="alert">
          {error}
        </p>
      )}
      {caption && !error && (
        <p className="mt-2 w-full max-w-sm text-sm text-neutral-500">
          {caption}
        </p>
      )}
      <p className="mt-2 w-full max-w-sm text-[10px] text-gray-400">
        By subscribing you agree to our{" "}
        <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a>.
        Unsubscribe at any time.
      </p>
    </div>
    </>
  );
}
