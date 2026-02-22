import { ArrowRight } from "lucide-react";

export function SubscribeForm() {
  return (
    <div className="w-full max-w-2xl relative z-10 bg-white border-beam p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-3 mb-6 border-beam-b pb-4">
        <div className="w-3 h-3 bg-[#FF3300] animate-pulse" />
        <h2 className="text-2xl font-extrabold uppercase tracking-tight-custom">
          Keep up with tech in 2 minutes
        </h2>
      </div>
      <p className="font-tech text-xs uppercase mb-8 text-gray-600 leading-relaxed">
        Get the free daily email with summaries of the most interesting
        stories in startups 🚀, tech, AI and more!
      </p>
      <div className="flex flex-col sm:flex-row border-beam">
        <input
          type="email"
          placeholder="Email Address"
          className="bg-[#E6E6E6] w-full p-4 font-tech text-sm text-black outline-none placeholder:text-gray-500 focus:bg-white transition-colors"
        />
        <button
          type="button"
          className="bg-black text-white font-bold uppercase px-8 py-4 hover:bg-[#FF3300] transition-colors duration-0 sm:border-l-2 border-black whitespace-nowrap flex items-center justify-center gap-2"
        >
          Subscribe{" "}
          <ArrowRight strokeWidth={1.5} className="text-lg w-5 h-5" />
        </button>
      </div>
      <p className="mt-4 font-tech text-[10px] text-gray-400 uppercase text-center">
        Join 12,000 readers for one daily email
      </p>
    </div>
  );
}
