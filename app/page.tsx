import {
  NoiseOverlay,
  HeroSection,
  SectionTitle,
  ArticleCardRow,
} from "@/components/landing-website";
import { getLatestArticlesByCategory } from "@/lib/articles-from-newsletters";
import { getCategoryById } from "@/lib/newsletter-categories";
import { prisma } from "@/lib/db";
import type { LucideIcon } from "lucide-react";

export default async function HomePage() {
  const categoriesWithArticles = await getLatestArticlesByCategory();

  // Resolve icons: use hardcoded LucideIcon if available, otherwise look up emoji from DB
  const categoryIcons = new Map<string, { Icon?: LucideIcon; emoji?: string }>();
  const dbSlugs: string[] = [];
  for (const { categoryId } of categoriesWithArticles) {
    const hardcoded = getCategoryById(categoryId);
    if (hardcoded) {
      categoryIcons.set(categoryId, { Icon: hardcoded.Icon });
    } else {
      dbSlugs.push(categoryId);
    }
  }
  if (dbSlugs.length > 0) {
    const profiles = await prisma.topicProfile.findMany({
      where: { slug: { in: dbSlugs } },
      select: { slug: true, icon: true },
    });
    const profileMap = new Map(profiles.map((p) => [p.slug, p.icon]));
    for (const slug of dbSlugs) {
      categoryIcons.set(slug, { emoji: profileMap.get(slug) ?? "📰" });
    }
  }

  return (
    <div className="landing-page selection:bg-[#FF3300] selection:text-white">
      <NoiseOverlay />
      <HeroSection />

      <section
        id="articles"
        className="w-full border-beam-b bg-[#E6E6E6] pt-12 pb-12"
      >
        <SectionTitle
          title={
            <>
              Latest
              <br />
              Articles.
            </>
          }
          indexLabel={
            categoriesWithArticles.length > 0
              ? `INDEX: 01-${String(categoriesWithArticles.length).padStart(2, "0")}`
              : undefined
          }
        />

        {categoriesWithArticles.length === 0 ? (
          <div className="px-6 lg:px-12 pb-12 font-tech text-sm uppercase text-gray-500">
            No articles yet. Check back soon.
          </div>
        ) : (
          categoriesWithArticles.map(({ categoryId, categoryLabel, cards }, i) => {
            const iconData = categoryIcons.get(categoryId);
            const Icon = iconData?.Icon;
            const isLast = i === categoriesWithArticles.length - 1;

            if (!Icon) {
              // DB-only category — use emoji fallback
              return (
                <ArticleCardRow
                  key={categoryId}
                  categoryEmoji={iconData?.emoji ?? "📰"}
                  categoryLabel={categoryLabel}
                  cards={cards.slice(0, 7)}
                  className={isLast ? "mb-4" : undefined}
                />
              );
            }

            return (
              <ArticleCardRow
                key={categoryId}
                categoryIcon={Icon}
                categoryLabel={categoryLabel}
                cards={cards.slice(0, 7)}
                className={isLast ? "mb-4" : undefined}
              />
            );
          })
        )}
      </section>
    </div>
  );
}
