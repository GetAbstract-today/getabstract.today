import Link from "next/link";
import { NoiseOverlay } from "@/components/landing-website";
import { Construction } from "lucide-react";

export const metadata = {
  title: "Coming Soon | Abstract.",
  description: "This page is under construction.",
};

export default function ComingSoonPage() {
  return (
    <div className="landing-page selection:bg-[#FF3300] selection:text-white min-h-screen flex flex-col">
      <NoiseOverlay />
      <main className="flex-1 w-full border-b-2 border-black bg-[#E6E6E6] flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-xl relative z-10 bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 border-2 border-black rounded-full flex items-center justify-center bg-[#E6E6E6]">
              <Construction strokeWidth={1.5} className="text-4xl text-[#FF3300] w-10 h-10" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold uppercase tracking-tight-custom mb-4">
            Coming Soon
          </h1>
          <p className="font-tech text-sm uppercase text-gray-600 mb-8">
            We're building something new. Check back later.
          </p>
          <Link
            href="/"
            className="inline-block border-2 border-black bg-black text-white font-bold uppercase px-8 py-4 hover:bg-[#FF3300] transition-colors duration-0"
          >
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
