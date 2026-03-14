import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { NEWSLETTER_CATEGORY_IDS } from "@/lib/newsletter-categories";

const BASE_URL = "https://getabstract.today";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/newsletters`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/advertise`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic newsletter pages + category landing pages
  let newsletterPages: MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const newsletters = await prisma.newsletter.findMany({
      select: { id: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    newsletterPages = newsletters.map((nl) => ({
      url: `${BASE_URL}/newsletters/${nl.id}`,
      lastModified: nl.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Hardcoded category pages
    const hardcodedPages = NEWSLETTER_CATEGORY_IDS.map((id) => ({
      url: `${BASE_URL}/newsletters/${id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // DB-driven topic profile pages
    const profiles = await prisma.topicProfile.findMany({
      select: { slug: true, updatedAt: true },
    });
    const dbPages = profiles
      .filter((p) => !NEWSLETTER_CATEGORY_IDS.includes(p.slug as typeof NEWSLETTER_CATEGORY_IDS[number]))
      .map((p) => ({
        url: `${BASE_URL}/newsletters/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    categoryPages = [...hardcodedPages, ...dbPages];
  } catch {
    // DB not available — return static pages only
  }

  return [...staticPages, ...categoryPages, ...newsletterPages];
}
