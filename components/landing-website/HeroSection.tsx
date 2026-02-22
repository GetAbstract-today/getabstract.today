import Link from "next/link";
import { RefreshCw, ArrowDownRight } from "lucide-react";
import { SubscribeForm } from "@/components/subscribe-form";

export function HeroSection() {
  return (
    <section className="w-full border-beam-b grid grid-cols-1 lg:grid-cols-12 min-h-[90vh]">
      <div className="lg:col-span-8 border-beam-r relative overflow-hidden bg-[#E6E6E6] flex items-center justify-center p-6 lg:p-12 group">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(var(--beam-black) 1px, transparent 1px), linear-gradient(90deg, var(--beam-black) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            opacity: 0.05,
          }}
        />
        <div className="w-full max-w-2xl relative z-10 bg-white border-beam p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-6 border-beam-b pb-4">
            <div className="w-3 h-3 bg-[#FF3300] animate-pulse" />
            <h2 className="text-2xl font-extrabold uppercase tracking-tight-custom">
              Read Less. Know More.
            </h2>
          </div>
          <p className="font-tech text-xs uppercase mb-8 text-gray-600 leading-relaxed">
            Get the free daily email with summaries of the most interesting
            stories in startups 🚀, tech, AI and more!
          </p>
          <SubscribeForm
            mode="landing"
            placeholder="Email Address"
            buttonText="Subscribe"
            className="w-full"
            formClassName="flex flex-col sm:flex-row w-full border-2 border-black"
            inputClassName="bg-[#E6E6E6] w-full p-4 font-tech text-sm text-black outline-none placeholder:text-gray-500 focus:bg-white transition-colors rounded-none border-0 min-h-12 flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
            buttonClassName="bg-black text-white font-bold uppercase px-8 py-4 hover:bg-[#FF3300] transition-colors duration-0 sm:border-l-2 border-black rounded-none min-h-12 shrink-0"
            successClassName="text-[#1A1A1A]"
          />
          <p className="mt-4 font-tech text-[10px] text-gray-400 uppercase text-center">
            Join 12,000 readers for one daily email
          </p>
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col justify-between bg-[#E6E6E6] p-6 lg:p-10 relative">
        <div
          className="absolute top-0 left-0 w-full h-[2px] bg-black animate-[width_1s_ease-out]"
          style={{ animation: "width 1s ease-out" }}
        />
        <div>
          <div className="font-tech text-xs text-[#FF3300] mb-4 flex items-center gap-2">
            <RefreshCw
              strokeWidth={1.5}
              className="animate-spin text-sm w-4 h-4"
            />{" "}
            UPDATED DAILY
          </div>
          <h1 className="text-6xl lg:text-7xl font-extrabold uppercase tracking-tight-custom leading-[0.85] mb-6">
            Never
            <br />
            Miss a
            <br />
            Trend.
          </h1>
          <div className="w-12 h-2 bg-[#FF3300] mb-6" />
          <p className="font-medium text-lg leading-snug max-w-sm">
            We read 100+ sources daily so you don&apos;t have to. The top
            stories in AI, startups, and tech etc delivered in a quick
            2-minute read.
          </p>
        </div>

        <div className="mt-12 lg:mt-0">
          <div className="font-tech text-[10px] mb-2 text-gray-500 uppercase">
            Browse by topic
          </div>
          <Link
            href="/newsletters"
            className="group block w-full border-beam bg-transparent hover:bg-black hover:text-white transition-all duration-0 p-4 text-center uppercase font-bold tracking-wider flex justify-between items-center"
          >
            <span>Browse Newsletters</span>
            <ArrowDownRight strokeWidth={1.5} className="text-xl w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
