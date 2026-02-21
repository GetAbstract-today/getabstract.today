import Link from "next/link";
import { type LucideIcon, ArrowRight } from "lucide-react";

export interface NewsletterBentoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  status?: "active" | "coming-soon";
  className?: string;
  size?: "default" | "feature" | "wide";
  /** When set, the card links to this path (e.g. /newsletters/ai) */
  href?: string;
}

export function NewsletterBentoCard({
  icon: Icon,
  title,
  description,
  status = "coming-soon",
  className = "",
  size = "default",
  href,
}: NewsletterBentoCardProps) {
  const isActive = status === "active";
  const isFeature = size === "feature";
  const isWide = size === "wide";

  const content = (
    <>
      {isActive && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
          style={{
            backgroundImage: `linear-gradient(var(--beam-black) 1px, transparent 1px), linear-gradient(90deg, var(--beam-black) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />
      )}
      <div className="flex justify-between items-start mb-8 lg:mb-12 relative z-10">
        <div
          className={
            isActive
              ? "w-16 h-16 border-2 border-black group-hover:border-white rounded-full flex items-center justify-center bg-white transition-colors duration-200"
              : "flex items-center justify-center"
          }
        >
          <Icon
            strokeWidth={1.5}
            className={
              isActive
                ? "text-3xl text-[#FF3300] group-hover:text-black transition-colors"
                : "text-2xl text-black group-hover:text-[#FF3300] transition-colors"
            }
          />
        </div>
        {isActive ? (
          <div className="font-tech text-xs flex items-center gap-2 uppercase tracking-widest border-2 border-[#FF3300] group-hover:border-white px-3 py-1 bg-[#FF3300]/10 group-hover:bg-black/20 transition-colors duration-200">
            <div className="w-2 h-2 bg-[#FF3300] group-hover:bg-white rounded-full animate-pulse" />{" "}
            Active
          </div>
        ) : (
          <span className="font-tech text-xs text-gray-500 group-hover:text-black uppercase border border-gray-400 group-hover:border-black px-2 py-1 tracking-widest transition-colors whitespace-nowrap">
            Coming Soon
          </span>
        )}
      </div>
      <div className={`relative z-10 ${isWide ? "lg:w-3/4" : ""}`}>
        <h3
          className={[
            "font-extrabold uppercase tracking-tight-custom leading-none mb-2",
            isFeature ? "text-4xl lg:text-5xl mb-4" : "text-xl",
            isWide && !isFeature && "text-2xl",
          ].join(" ")}
        >
          {title}
        </h3>
        <p
          className={[
            "font-medium leading-relaxed text-gray-600 group-hover:text-black transition-colors",
            isFeature ? "text-lg opacity-80 max-w-md group-hover:opacity-100" : "text-sm",
          ].join(" ")}
        >
          {description}
        </p>
        {isActive && (
          <div className="mt-8 flex items-center gap-2 font-tech text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300">
            Subscribe Now <ArrowRight strokeWidth={2} className="w-4 h-4" />
          </div>
        )}
      </div>
    </>
  );

  const articleClassName = [
    "border-beam-r border-beam-b p-6 lg:p-8 flex flex-col justify-between group transition-colors duration-200 cursor-pointer min-h-[200px]",
    isFeature && "lg:p-10 min-h-[300px] lg:min-h-[400px]",
    isActive
      ? "bg-white hover:bg-[#FF3300] hover:text-white min-h-[300px] lg:min-h-[400px] relative overflow-hidden"
      : "bg-transparent hover:bg-white",
    className,
  ].join(" ");

  if (href) {
    return (
      <Link href={href} className={articleClassName} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {content}
      </Link>
    );
  }

  return <article className={articleClassName}>{content}</article>;
}
