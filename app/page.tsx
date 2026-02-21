import {
  NoiseOverlay,
  HeroSection,
  SectionTitle,
  ArticleCardRow,
} from "@/components/landing-website";
import { getLatestArticlesByCategory } from "@/lib/articles-from-newsletters";
import { getCategoryById } from "@/lib/newsletter-categories";

export default async function HomePage() {
  const categoriesWithArticles = await getLatestArticlesByCategory();

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
            const category = getCategoryById(categoryId);
            const Icon = category?.Icon;
            if (!Icon) return null;
            const isLast = i === categoriesWithArticles.length - 1;
            return (
              <ArticleCardRow
                key={categoryId}
                categoryIcon={Icon}
                categoryLabel={categoryLabel}
                cards={cards}
                className={isLast ? "mb-4" : undefined}
              />
            );
          })
        )}
      </section>
    </div>
  );
}
