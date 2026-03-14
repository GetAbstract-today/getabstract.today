"use client";

import { useState } from "react";
import { NoiseOverlay } from "@/components/landing-website";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isValidEmail } from "@/lib/validate-email";

// metadata must be in a separate file for client components — see layout or use generateMetadata in a server wrapper
// For now, the page title is set via the parent layout's defaults

export default function AdvertisePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const res = await fetch("/api/advertise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="landing-page selection:bg-[#FF3300] selection:text-white min-h-screen flex flex-col">
      <NoiseOverlay />
      <main className="flex-1 w-full border-b-2 border-black bg-[#E6E6E6] flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-xl relative z-10 bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-3xl lg:text-4xl font-extrabold uppercase tracking-tight-custom mb-4">
            Advertise with us
          </h1>
          <p className="font-tech text-xs uppercase text-gray-600 mb-2 tracking-widest">
            Reach engaged tech professionals daily
          </p>
          <p className="text-sm text-[#1A1A1A] leading-relaxed mb-8">
            Our newsletters reach engaged readers in AI, startups, cybersecurity,
            fintech, and more. Leave your email and we&apos;ll get in touch to
            discuss sponsorship options.
          </p>

          {submitted ? (
            <div className="border-2 border-black bg-[#E6E6E6] p-6 text-center">
              <p className="font-bold uppercase text-lg mb-1">Thank you!</p>
              <p className="text-sm text-gray-600">
                We&apos;ll be in touch shortly to discuss advertising options.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="advertise-email"
                  className="font-tech text-xs uppercase tracking-widest text-gray-500 mb-2 block"
                >
                  Your email address
                </label>
                <div className="flex flex-col sm:flex-row border-2 border-black">
                  <Input
                    id="advertise-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    disabled={loading}
                    aria-label="Email address for advertising enquiry"
                    className="bg-[#E6E6E6] w-full p-4 font-tech text-sm text-black outline-none placeholder:text-gray-500 focus:bg-white transition-colors rounded-none border-0 min-h-12 flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white font-bold uppercase px-8 py-4 hover:bg-[#FF3300] transition-colors duration-0 sm:border-l-2 border-black rounded-none min-h-12 shrink-0"
                  >
                    {loading ? "Sending…" : "Get in touch"}
                  </Button>
                </div>
              </div>
              {error && (
                <p className="text-xs text-[#FF3300] font-tech uppercase" role="alert">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
