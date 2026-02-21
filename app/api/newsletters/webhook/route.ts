import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateNewsletter } from "@/lib/newsletter-generation";
import { sendNewsletterToSubscribers } from "@/lib/send-newsletter-email";

function getDefaultDate(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

/** Parse YYYY-MM-DD to Date at noon UTC to avoid timezone shifts. */
function parseDateOnly(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}

export async function POST(request: Request) {
  try {
    let date = getDefaultDate();
    let newsletterType = "ai";

    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      try {
        const body = await request.json();
        if (body.date && typeof body.date === "string") date = body.date.trim();
        if (body.newsletterType && typeof body.newsletterType === "string")
          newsletterType = body.newsletterType.trim();
      } catch {
        // ignore invalid JSON, use defaults
      }
    }

    const { urls, newsletter } = await generateNewsletter({ date, newsletterType });
    const dateForDb = parseDateOnly(date);

    if (urls.length > 0) {
      await prisma.url.createMany({
        data: urls.map((url) => ({
          url,
          date: dateForDb,
          category: newsletterType,
        })),
        skipDuplicates: true,
      });
    }

    const created = await prisma.newsletter.create({
      data: { content: newsletter, category: newsletterType },
    });

    const sendResult = await sendNewsletterToSubscribers({
      newsletterId: created.id,
      category: newsletterType,
      contentMarkdown: newsletter,
      date,
    });

    return NextResponse.json(
      {
        id: created.id,
        createdAt: created.createdAt,
        sent: sendResult.sent,
        failed: sendResult.failed,
        ...(sendResult.errors && sendResult.errors.length > 0 && { errors: sendResult.errors }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/newsletters/webhook error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Newsletter generation failed",
      },
      { status: 500 }
    );
  }
}
