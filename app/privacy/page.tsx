import Link from "next/link";
import { NoiseOverlay } from "@/components/landing-website";

export const metadata = {
  title: "Privacy Policy | Abstract",
  description: "Privacy Policy for Abstract newsletter platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="landing-page selection:bg-[#FF3300] selection:text-white min-h-screen flex flex-col">
      <NoiseOverlay />
      <main className="flex-1 w-full border-b-2 border-black bg-[#E6E6E6] p-6 lg:p-12">
        <div className="mx-auto max-w-3xl relative z-10">
          <div className="bg-white border-2 border-black p-8 lg:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl lg:text-4xl font-extrabold uppercase tracking-tight-custom mb-8 border-b-2 border-black pb-4">
              Privacy Policy
            </h1>
            <div className="prose prose-sm max-w-none space-y-6 text-[#1A1A1A]">
              <p className="font-tech text-xs uppercase text-gray-500">
                Last updated: March 2026
              </p>

              <h2 className="text-lg font-bold uppercase mt-8">1. Introduction</h2>
              <p>
                Abstract (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the website{" "}
                <a href="https://getabstract.today" className="text-[#FF3300] underline">
                  getabstract.today
                </a>{" "}
                and delivers email newsletters. This Privacy Policy explains how we collect,
                use, and protect your personal information.
              </p>

              <h2 className="text-lg font-bold uppercase mt-8">2. Information We Collect</h2>
              <p>
                We collect the following information when you subscribe to our newsletters:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Email address</li>
                <li>Newsletter category preferences</li>
                <li>Subscription date</li>
              </ul>
              <p>
                We do not collect names, payment information, or other personal data beyond
                what is listed above.
              </p>

              <h2 className="text-lg font-bold uppercase mt-8">3. How We Use Your Information</h2>
              <p>Your email address is used exclusively to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Send you the newsletters you subscribed to</li>
                <li>Communicate important updates about our service</li>
              </ul>
              <p>We do not sell, rent, or share your email address with third parties for marketing purposes.</p>

              <h2 className="text-lg font-bold uppercase mt-8">4. Email Service Provider</h2>
              <p>
                We use Resend as our email delivery service. Your email address is shared with
                Resend solely for the purpose of delivering newsletters. Resend&apos;s privacy
                policy can be found on their website.
              </p>

              <h2 className="text-lg font-bold uppercase mt-8">5. Data Retention</h2>
              <p>
                We retain your email address and subscription preferences for as long as you
                remain subscribed. If you unsubscribe, your data will be removed from our
                active mailing lists.
              </p>

              <h2 className="text-lg font-bold uppercase mt-8">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Unsubscribe from any or all newsletters at any time</li>
                <li>Request access to the personal data we hold about you</li>
                <li>Request deletion of your personal data</li>
                <li>Withdraw your consent to data processing</li>
              </ul>
              <p>
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:info@getabstract.today" className="text-[#FF3300] underline">
                  info@getabstract.today
                </a>
                .
              </p>

              <h2 className="text-lg font-bold uppercase mt-8">7. Cookies</h2>
              <p>
                Our website does not use tracking cookies or third-party analytics. We may use
                essential cookies required for the website to function properly.
              </p>

              <h2 className="text-lg font-bold uppercase mt-8">8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on
                this page with an updated revision date.
              </p>

              <h2 className="text-lg font-bold uppercase mt-8">9. Contact</h2>
              <p>
                If you have questions about this Privacy Policy, contact us at:{" "}
                <a href="mailto:info@getabstract.today" className="text-[#FF3300] underline">
                  info@getabstract.today
                </a>
              </p>
              <p>Abstract — London, UK</p>
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
