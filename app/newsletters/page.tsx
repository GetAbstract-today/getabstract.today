import {
  NoiseOverlay,
  NewsletterBentoCard,
} from "@/components/landing-website";
import { getCategoryById } from "@/lib/newsletter-categories";
import { Radio } from "lucide-react";

const newsletters = [
  {
    id: "ai" as const,
    status: "active" as const,
    className: "col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2",
    size: "feature" as const,
  },
  {
    id: "startups" as const,
    className: "col-span-1 md:col-span-1 lg:col-span-1 lg:row-span-2",
    size: "default" as const,
  },
  {
    id: "dev" as const,
    className: "col-span-1 md:col-span-1 lg:col-span-1",
    size: "default" as const,
  },
  {
    id: "infosec" as const,
    className: "col-span-1 md:col-span-1 lg:col-span-1",
    size: "default" as const,
  },
  {
    id: "product" as const,
    className: "col-span-1 md:col-span-1 lg:col-span-1",
    size: "default" as const,
  },
  {
    id: "devops" as const,
    className: "col-span-1 md:col-span-1 lg:col-span-1",
    size: "default" as const,
  },
  {
    id: "founders" as const,
    className: "col-span-1 md:col-span-2 lg:col-span-2",
    size: "wide" as const,
  },
  {
    id: "design" as const,
    className: "col-span-1 md:col-span-1 lg:col-span-1",
    size: "default" as const,
  },
  {
    id: "marketing" as const,
    className: "col-span-1 md:col-span-1 lg:col-span-1",
    size: "default" as const,
  },
  {
    id: "crypto" as const,
    className: "col-span-1 md:col-span-2 lg:col-span-2",
    size: "wide" as const,
  },
  {
    id: "fintech" as const,
    className: "col-span-1 md:col-span-1 lg:col-span-1",
    size: "default" as const,
  },
  {
    id: "it" as const,
    className: "col-span-1 md:col-span-1 lg:col-span-1",
    size: "default" as const,
  },
  {
    id: "data" as const,
    className: "col-span-1 md:col-span-1 lg:col-span-1",
    size: "default" as const,
  },
  {
    id: "hardware" as const,
    className: "col-span-1 md:col-span-1 lg:col-span-1",
    size: "default" as const,
  },
];

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
            <Radio strokeWidth={1.5} className="animate-pulse text-sm w-4 h-4" /> Data Streams
          </div>
          <h1 className="text-6xl lg:text-8xl font-extrabold uppercase tracking-tight-custom leading-[0.85]">
            Network
            <br />
            Directory.
          </h1>
        </div>
        <div className="relative z-10 max-w-sm mt-12 md:mt-0 bg-white border-beam p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
          <p className="font-tech text-xs uppercase text-gray-600 leading-relaxed mb-6">
            Establish a direct line to specialized knowledge. Subscribe to
            active signals across technology, engineering, and digital
            architecture.
          </p>
          <div className="flex justify-between items-center text-xs font-tech font-bold uppercase tracking-widest border-t-2 border-black pt-4">
            <span>Index: 14 Nodes</span>
            <span className="text-[#FF3300] flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FF3300] rounded-full animate-pulse" />{" "}
              Secure
            </span>
          </div>
        </div>
      </section>

      <section className="w-full bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
          {newsletters.map((item) => {
            const category = getCategoryById(item.id)!;
            return (
              <NewsletterBentoCard
                key={item.id}
                icon={category.Icon}
                title={category.title}
                description={category.description}
                status={item.status ?? "coming-soon"}
                className={item.className}
                size={item.size}
                href={`/newsletters/${item.id}`}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
