import Link from "next/link";
import { NoiseOverlay } from "@/components/landing-website";
import { Newspaper, Construction, ArrowRight, Palette } from "lucide-react";

export const metadata = {
  title: "Admin | Abstract.",
  description: "Admin dashboard for Abstract.",
};

const ADMIN_TOOLS = [
  {
    href: "/admin/generate",
    icon: Newspaper,
    title: "Generate Newsletter",
    description: "Pick a date and category, generate a newsletter with AI, and send it to subscribers.",
    ready: true,
  },
  {
    href: "/admin/studio",
    icon: Palette,
    title: "Newsletter Studio",
    description: "Create, edit, and manage topic profiles for rapid newsletter category expansion.",
    ready: true,
  },
] as const;

export default function AdminPage() {
  return (
    <div className="landing-page selection:bg-[#FF3300] selection:text-white min-h-screen flex flex-col">
      <NoiseOverlay />
      <main className="flex-1 w-full border-b-2 border-black bg-[#E6E6E6] p-6 lg:p-12">
        <div className="mx-auto max-w-4xl relative z-10">
          {/* Header */}
          <div className="mb-8 bg-white border-2 border-black p-6 lg:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 border-b-2 border-black pb-4 mb-4">
              <div className="w-3 h-3 bg-[#FF3300]" />
              <h1 className="text-2xl font-extrabold uppercase tracking-tight-custom">
                Admin Dashboard
              </h1>
            </div>
            <p className="font-tech text-xs uppercase text-gray-600">
              Manage newsletters, subscribers, and content.
            </p>
          </div>

          {/* Tool cards */}
          <div className="grid gap-6 sm:grid-cols-2">
            {ADMIN_TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-150 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 border-2 border-black flex items-center justify-center bg-[#E6E6E6] group-hover:bg-[#FF3300] group-hover:text-white transition-colors duration-150">
                    <tool.icon strokeWidth={1.5} className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-extrabold uppercase tracking-tight-custom">
                    {tool.title}
                  </h2>
                </div>
                <p className="font-tech text-xs uppercase text-gray-600 mb-6 flex-1">
                  {tool.description}
                </p>
                <div className="flex items-center gap-2 font-tech text-xs uppercase font-bold text-[#FF3300] group-hover:text-black transition-colors duration-150">
                  Open <ArrowRight strokeWidth={2} className="w-4 h-4" />
                </div>
              </Link>
            ))}

            {/* Placeholder for future tools */}
            <div className="bg-white/50 border-2 border-dashed border-gray-400 p-6 flex flex-col items-center justify-center text-center min-h-[180px]">
              <Construction strokeWidth={1.5} className="w-8 h-8 text-gray-400 mb-3" />
              <p className="font-tech text-xs uppercase text-gray-400">
                More tools coming soon
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="mt-8 inline-block font-tech text-xs uppercase text-gray-500 hover:text-black transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
