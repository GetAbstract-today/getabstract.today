import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

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
  ];

  // Dynamic newsletter pages
  let newsletterPages: MetadataRoute.Sitemap = [];
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
  } catch {
    // DB not available — return static pages only
  }

  return [...staticPages, ...newsletterPages];
}
