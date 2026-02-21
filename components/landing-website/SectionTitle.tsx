import type { ReactNode } from "react";

export interface SectionTitleProps {
  title: ReactNode;
  indexLabel?: string;
}

export function SectionTitle({ title, indexLabel }: SectionTitleProps) {
  return (
    <div className="px-6 lg:px-12 flex flex-col md:flex-row justify-between items-start md:items-end border-beam-b pb-6 mb-8 border-black">
      <h2 className="text-5xl lg:text-6xl font-extrabold uppercase tracking-tight-custom leading-none">
        {title}
      </h2>
      {indexLabel && (
        <div className="font-tech text-xs border border-black px-2 py-1 bg-white hidden md:block mt-4 md:mt-0">
          {indexLabel}
        </div>
      )}
    </div>
  );
}
