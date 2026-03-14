"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { NoiseOverlay } from "@/components/landing-website";

function UnsubscribeForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const category = searchParams.get("category") ?? "";
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleUnsubscribe() {
    setLoading(true);
    try {
      await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, category }),
      });
    } catch {
      // Best-effort
    }
    setDone(true);
    setLoading(false);
  }

  if (done || (!email && !category)) {
    return (
      <>
        <h1 className="text-3xl lg:text-4xl font-extrabold uppercase tracking-tight-custom mb-4">
          Unsubscribed
        </h1>
        <p className="text-sm text-[#1A1A1A] leading-relaxed mb-8">
          You&apos;ve been removed from this newsletter. You can re-subscribe
          at any time from our newsletters page.
        </p>
        <Link
          href="/newsletters"
          className="inline-block border-2 border-black bg-black text-white font-bold uppercase px-8 py-4 hover:bg-[#FF3300] transition-colors duration-0"
        >
          Browse newsletters
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="text-3xl lg:text-4xl font-extrabold uppercase tracking-tight-custom mb-4">
        Unsubscribe
      </h1>
      <p className="text-sm text-[#1A1A1A] leading-relaxed mb-8">
        Click the button below to unsubscribe <strong>{email}</strong> from
        the <strong>{category}</strong> newsletter.
      </p>
      <button
        onClick={handleUnsubscribe}
        disabled={loading}
        className="inline-block border-2 border-black bg-black text-white font-bold uppercase px-8 py-4 hover:bg-[#FF3300] transition-colors duration-0 disabled:opacity-50"
      >
        {loading ? "Unsubscribing…" : "Confirm unsubscribe"}
      </button>
    </>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="landing-page selection:bg-[#FF3300] selection:text-white min-h-screen flex flex-col">
      <NoiseOverlay />
      <main className="flex-1 w-full border-b-2 border-black bg-[#E6E6E6] flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-xl relative z-10 bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          <Suspense fallback={<p className="text-sm text-gray-500">Loading…</p>}>
            <UnsubscribeForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
