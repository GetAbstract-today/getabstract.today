import Link from "next/link";
import { NoiseOverlay } from "@/components/landing-website";

export const metadata = {
  title: "Terms of Service | Abstract",
  description: "Terms of Service for Abstract newsletter platform.",
};

export default function TermsPage() {
  return (
    <div className="landing-page selection:bg-[#FF3300] selection:text-white min-h-screen flex flex-col">
      <NoiseOverlay />
      <main className="flex-1 w-full border-b-2 border-black bg-[#E6E6E6] p-6 lg:p-12">
        <div className="mx-auto max-w-3xl relative z-10">
          <div className="bg-white border-2 border-black p-8 lg:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl lg:text-4xl font-extrabold uppercase tracking-tight-custom mb-8 border-b-2 border-black pb-4">
              Terms of Service
            </h1>
            <div className="prose prose-sm max-w-none space-y-6 text-[#1A1A1A]">
              <p className="font-tech text-xs uppercase text-gray-500">
                Last updated: March 2026
              </p>

              <h2 className="text-lg font-bold uppercase mt-8">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the Abstract website at{" "}
                <a href="https://getabstract.today" className="text-[#FF3300] underline">
                  getabstract.today
                </a>{" "}
                and subscribing to our newsletters, you agree to be bound by these Terms of
                Service. If you do not agree, please do not use our services.
              </p>

              <h2 className="text-lg font-bold uppercase mt-8">2. Description of Service</h2>
              <p>
                Abstract provides free daily email newsletters covering topics in technology,
                AI, startups, and related fields. Our content is curated and summarised using
                a combination of AI and editorial processes.
              </p>

              <h2 className="text-lg font-bold uppercase mt-8">3. Newsletter Subscriptions</h2>
              <p>
                By subscribing, you consent to receive emails from Abstract at the frequency
                associated with your chosen newsletter categories. You may unsubscribe at any
                time.
              </p>

              <h2 className="text-lg font-bold uppercase mt-8">4. Content and Accuracy</h2>
              <p>
                Our newsletters contain summaries of publicly available news and information.
                While we strive for accuracy, we do not guarantee that all content is complete,
                current, or error-free. Abstract newsletters are for informational purposes
                only and do not constitute professional advice.
              </p>

              <h2 className="text-lg font-bold uppercase mt-8">5. Intellectual Property</h2>
              <p>
                All original content, design, and branding on this website and in our
                newsletters is the property of Abstract. You may not reproduce, distribute, or
                create derivative works without our written permission. Links to third-party
                content remain the property of their respective owners.
              </p>

              <h2 className="text-lg font-bold uppercase mt-8">6. User Conduct</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Use our service for any unlawful purpose</li>
                <li>Attempt to gain unauthorised access to our systems</li>
                <li>Subscribe with fraudulent or disposable email addresses at scale</li>
                <li>Redistribute our newsletter content commercially without permission</li>
              </ul>

              <h2 className="text-lg font-bold uppercase mt-8">7. Advertising and Sponsorship</h2>
              <p>
                Our newsletters may contain sponsored content or advertisements. Sponsored
                content will be clearly identified. We are not responsible for the products or
                services offered by advertisers.
              </p>

              <h2 className="text-lg font-bold uppercase mt-8">8. Limitation of Liability</h2>
              <p>
                Abstract is provided &quot;as is&quot; without warranties of any kind. We are
                not liable for any damages arising from your use of our website or newsletters,
                including but not limited to direct, indirect, incidental, or consequential
                damages.
              </p>

              <h2 className="text-lg font-bold uppercase mt-8">9. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of our
                service after changes constitutes acceptance of the updated terms.
              </p>

              <h2 className="text-lg font-bold uppercase mt-8">10. Governing Law</h2>
              <p>
                These terms are governed by the laws of England and Wales. Any disputes will be
                subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>

              <h2 className="text-lg font-bold uppercase mt-8">11. Contact</h2>
              <p>
                For questions about these Terms, contact us at:{" "}
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
