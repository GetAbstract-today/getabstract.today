import { prisma } from "@/lib/db";
import { isCategoryId } from "@/lib/newsletter-categories";

export interface ArticleCardData {
  imageSrc: string;
  imageAlt: string;
  dateRead: string;
  title: string;
  description: string;
  href: string;
}

/** Extract title from first markdown heading (# ...), fallback to "Newsletter" */
function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "Newsletter";
}

/** Extract description from first paragraph (non-heading line), max ~120 chars */
function extractDescription(content: string): string {
  const lines = content.split(/\r?\n/).filter((line) => {
    const t = line.trim();
    return t.length > 0 && !t.startsWith("#");
  });
  const first = lines[0] ?? "";
  const plain = first.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();
  if (plain.length <= 120) return plain;
  return plain.slice(0, 117) + "...";
}

function formatDateRead(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Default image per category for article cards (optional placeholder) */
const DEFAULT_IMAGE_BY_CATEGORY: Record<string, string> = {
  ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
  dev: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
  infosec: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop",
  product: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop",
  devops: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
  startups: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
  founders: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
  design: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
  marketing: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
  crypto: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2070&auto=format&fit=crop",
  fintech: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop",
  it: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
  data: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
  hardware: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?q=80&w=2070&auto=format&fit=crop",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop";

export interface CategoryWithArticles {
  categoryId: string;
  categoryLabel: string;
  cards: ArticleCardData[];
}

/**
 * Fetches newsletters from the database, groups by category, and returns
 * only categories that have at least one newsletter. Each item is shaped
 * for ArticleCardRow / ArticleCard.
 */
export async function getLatestArticlesByCategory(): Promise<
  CategoryWithArticles[]
> {
  const newsletters = await prisma.newsletter.findMany({
    orderBy: { createdAt: "desc" },
  });

  const byCategory = new Map<string, ArticleCardData[]>();

  for (const n of newsletters) {
    if (!isCategoryId(n.category)) continue;
    const title = extractTitle(n.content);
    const description = extractDescription(n.content);
    const dateRead = `${formatDateRead(n.createdAt)} // 5 Min Read`;
    const imageSrc =
      DEFAULT_IMAGE_BY_CATEGORY[n.category] ?? FALLBACK_IMAGE;
    const card: ArticleCardData = {
      imageSrc,
      imageAlt: n.category,
      dateRead,
      title,
      description,
      href: `/newsletters/${n.id}`,
    };
    const list = byCategory.get(n.category) ?? [];
    list.push(card);
    byCategory.set(n.category, list);
  }

  const categoryOrder = [
    "ai",
    "dev",
    "infosec",
    "product",
    "devops",
    "startups",
    "founders",
    "design",
    "marketing",
    "crypto",
    "fintech",
    "it",
    "data",
    "hardware",
  ] as const;

  const result: CategoryWithArticles[] = [];
  for (const categoryId of categoryOrder) {
    const cards = byCategory.get(categoryId);
    if (!cards || cards.length === 0) continue;
    const label =
      categoryId === "infosec"
        ? "Information Security"
        : categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
    result.push({
      categoryId,
      categoryLabel: label,
      cards,
    });
  }
  return result;
}
