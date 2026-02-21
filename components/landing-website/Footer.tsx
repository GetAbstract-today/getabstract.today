"use client";

import { SubscribeForm } from "@/components/subscribe-form";

export function Footer() {
  return (
    <footer className="bg-black text-[#E6E6E6] w-full border-t-2 border-black">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-8 lg:p-16 border-b lg:border-b-0 lg:border-r border-[#333]">
          <h2 className="text-5xl lg:text-7xl font-extrabold uppercase tracking-tight-custom leading-none mb-8">
            Curated
            <br />
            for you.
          </h2>

          <div className="space-y-4">
            <label className="font-tech text-xs uppercase tracking-widest text-gray-400">
              Newsletter & Partner Inquiries
            </label>
            <SubscribeForm
              mode="landing"
              placeholder="OFFICIAL EMAIL"
              buttonText="Submit"
              className="w-full"
              formClassName="flex w-full flex-col sm:flex-row border border-[#555]"
              inputClassName="bg-transparent flex-1 w-full p-4 font-tech text-white outline-none placeholder:text-gray-600 focus:bg-[#1A1A1A] rounded-none border-0 min-h-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              buttonClassName="bg-white text-black font-bold uppercase px-8 py-4 hover:bg-[#FF3300] hover:text-white transition-colors duration-0 rounded-none min-h-0 shrink-0 border-0 sm:border-l border-[#555]"
              successClassName="text-emerald-400"
            />
          </div>
        </div>

        <div className="p-8 lg:p-16 flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-8 mb-16">
            <div>
              <h4 className="font-tech text-xs text-gray-400 uppercase mb-4">
                Headquarters
              </h4>
              <p className="uppercase font-bold text-sm leading-relaxed">
                Industrial Sector 4
                <br />
                Alexanderplatz 1
                <br />
                10178 Berlin, DE
              </p>
            </div>
            <div>
              <h4 className="font-tech text-xs text-gray-400 uppercase mb-4">
                Direct Line
              </h4>
              <p className="uppercase font-bold text-sm leading-relaxed">
                +49 30 555 0123
                <br />
                INFO@ABSTRACT.ED
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end md:items-center pt-8 border-t border-[#333] font-tech text-[10px] uppercase text-gray-500">
            <div>© 2024 ABSTRACT. ALL RIGHTS RESERVED.</div>
            <div className="mt-2 md:mt-0">DESIGN: BUREAU OF WORKS</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
