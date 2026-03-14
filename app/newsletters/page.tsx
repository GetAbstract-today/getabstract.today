import {
  NoiseOverlay,
  NewsletterBentoCard,
} from "@/components/landing-website";
import { newsletterCategories } from "@/lib/newsletter-categories";
import { Radio } from "lucide-react";
import type { Metadata } from "next";
import { SubscribeForm } from "@/components/subscribe-form";

export const metadata: Metadata = {
  title: "Newsletters | Abstract",
  description:
    "Browse all Abstract newsletters — AI, startups, cybersecurity, fintech, and more. Subscribe to the topics that matter to you.",
};

export default function NewslettersPage() {
  return (
    <div className="landing-page selection:bg-[#FF3300] selection:text-white">
      <NoiseOverlay />
      <section className="w-full border-beam-b bg-[#E6E6E6] pt-16 pb-16 px-6 lg:px-12 flex flex-col md:flex-row justify-between items-start md:items-end relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(var(--beam-black) 1px, transparent 1px), linear-gradient(90deg, var(--beam-black) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            opacity: 0.04,
          }}
        />
        <div className="relative z-10">
          <div className="font-tech text-xs text-[#FF3300] mb-4 flex items-center gap-2 uppercase tracking-widest">
            <Radio strokeWidth={1.5} className="animate-pulse text-sm w-4 h-4" /> Newsletter Directory
          </div>
          <h1 className="text-6xl lg:text-8xl font-extrabold uppercase tracking-tight-custom leading-[0.85]">
            News
            <br />
            letters.
          </h1>
        </div>
        <div className="relative z-10 max-w-sm mt-12 md:mt-0 bg-white border-beam p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
          <p className="font-tech text-xs uppercase text-gray-600 leading-relaxed mb-6">
            Curated daily digests on the topics that matter to you — AI,
            tech, startups, and more. One email per topic, delivered daily.
          </p>
          <SubscribeForm
            mode="landing"
            placeholder="Email Address"
            buttonText="Subscribe"
            className="w-full"
            formClassName="flex w-full flex-col sm:flex-row border-2 border-black"
            inputClassName="bg-[#E6E6E6] w-full p-3 font-tech text-sm text-black outline-none placeholder:text-gray-500 focus:bg-white transition-colors rounded-none border-0 min-h-0 flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
            buttonClassName="bg-black text-white font-bold uppercase px-6 py-3 hover:bg-[#FF3300] transition-colors duration-0 sm:border-l-2 border-black rounded-none min-h-0 shrink-0"
            successClassName="text-[#1A1A1A]"
          />
        </div>
      </section>

      <section className="w-full bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
          {newsletterCategories.map((category, i) => (
            <NewsletterBentoCard
              key={category.id}
              icon={category.Icon}
              title={category.title}
              description={category.description}
              status="active"
              className={i === 0 ? "col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2" : "col-span-1"}
              size={i === 0 ? "feature" : "default"}
              href={`/newsletters/${category.id}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
