import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateNewsletter } from "@/lib/newsletter-generation";

/** Parse YYYY-MM-DD to Date at noon UTC to avoid timezone shifts. */
function parseDateOnly(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, newsletterType } = body;

    if (!date || typeof date !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'date' (e.g. YYYY-MM-DD)" },
        { status: 400 }
      );
    }
    if (!newsletterType || typeof newsletterType !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'newsletterType'" },
        { status: 400 }
      );
    }

    const trimmedDate = date.trim();
    const trimmedType = newsletterType.trim();
    const { urls, newsletter, title } = await generateNewsletter({
      date: trimmedDate,
      newsletterType: trimmedType,
    });

    const dateForDb = parseDateOnly(trimmedDate);

    if (urls.length > 0) {
      await prisma.url.createMany({
        data: urls.map((url) => ({
          url,
          date: dateForDb,
          category: trimmedType,
        })),
        skipDuplicates: true,
      });
    }

    const created = await prisma.newsletter.create({
      data: {
        title: title || undefined,
        content: newsletter,
        category: trimmedType,
      },
    });
    return NextResponse.json(created);
  } catch (error) {
    console.error("POST /api/newsletters/generate error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Newsletter generation failed",
      },
      { status: 500 }
    );
  }
}
