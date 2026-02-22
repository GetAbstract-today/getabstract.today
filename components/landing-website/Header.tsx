"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";

const MOBILE_LINKS: Array<{
  href: string;
  label: string;
  highlight?: boolean;
}> = [
  { href: "/newsletters", label: "Newsletters" },
  { href: "/coming-soon", label: "Advertise" },
  { href: "/newsletters", label: "Subscribe", highlight: true },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#E6E6E6] border-b-2 border-black">
        <div className="flex flex-col lg:flex-row justify-between lg:items-stretch h-auto lg:h-28">
          <div className="flex items-center justify-between p-4 lg:p-0 lg:w-[30%] lg:border-r-2 lg:border-black bg-[#E6E6E6] relative z-20">
            <Link href="/" className="block pl-4 lg:pl-6">
              <Image
                src="/logo.png"
                alt="Abstract"
                width={255}
                height={112}
                className="h-24 lg:h-28 w-[128px] lg:w-[255px]"
                priority
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden p-2 border-2 border-black bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X strokeWidth={1.5} className="w-6 h-6" />
              ) : (
                <Menu strokeWidth={1.5} className="w-6 h-6" />
              )}
            </button>
          </div>

          <div className="hidden lg:flex flex-1 justify-end items-center font-tech text-xs tracking-widest uppercase divide-x-2 divide-black">
            <Link
              href="/newsletters"
              className="h-full flex items-center px-8 hover:bg-black hover:text-white transition-colors duration-0 border-l-2 border-black"
            >
              Newsletters
            </Link>
            <Link
              href="/coming-soon"
              className="h-full flex items-center px-8 hover:bg-black hover:text-white transition-colors duration-0"
            >
              Advertise
            </Link>
            <Link
              href="/newsletters"
              className="h-full flex items-center px-8 bg-[#FF3300] text-white hover:bg-black transition-colors duration-0 font-bold border-l-2 border-black gap-2"
            >
              Subscribe{" "}
              <ArrowRight strokeWidth={1.5} className="text-lg w-5 h-5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" aria-hidden>
          <button
            type="button"
            onClick={closeMobile}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-label="Close menu"
          />
          <div className="absolute top-[72px] left-0 right-0 bg-white border-b-2 border-x-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mx-2">
            <div className="flex flex-col font-tech text-xs tracking-widest uppercase">
              {MOBILE_LINKS.map(({ href, label, highlight }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={closeMobile}
                  className={`flex items-center justify-between px-6 py-4 border-b-2 border-black last:border-b-0 transition-colors ${
                    highlight
                      ? "bg-[#FF3300] text-white font-bold hover:bg-black"
                      : "text-[#1A1A1A] hover:bg-[#E6E6E6]"
                  }`}
                >
                  {label}
                  {highlight && (
                    <ArrowRight strokeWidth={1.5} className="w-5 h-5" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
