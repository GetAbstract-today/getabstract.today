import { type LucideIcon } from "lucide-react";
import { ArticleCard } from "./ArticleCard";
import type { ArticleCardProps } from "./ArticleCard";

export interface ArticleCardRowProps {
  categoryIcon?: LucideIcon;
  categoryEmoji?: string;
  categoryLabel: string;
  cards: ArticleCardProps[];
  className?: string;
}

export function ArticleCardRow({
  categoryIcon: Icon,
  categoryEmoji,
  categoryLabel,
  cards,
  className = "",
}: ArticleCardRowProps) {
  return (
    <div className={className || "mb-12"}>
      <div className="px-6 lg:px-12 mb-4 font-tech text-xs uppercase tracking-widest text-[#FF3300] flex items-center gap-2">
        {Icon ? (
          <Icon strokeWidth={1.5} className="text-lg w-5 h-5" />
        ) : (
          <span className="text-lg">{categoryEmoji}</span>
        )}
        {" "}/// {categoryLabel}
      </div>
      <div className="flex overflow-x-auto gap-6 px-6 lg:px-12 pb-6 snap-x hide-scroll">
        {cards.map((card) => (
          <ArticleCard key={card.href ?? card.title} {...card} />
        ))}
      </div>
    </div>
  );
}
