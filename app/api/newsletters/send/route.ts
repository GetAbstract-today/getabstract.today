import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendNewsletterToSubscribers } from "@/lib/send-newsletter-email";

/**
 * POST /api/newsletters/send
 * Sends a previously generated newsletter to all subscribers of its category.
 * Body: { newsletterId: string, date?: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { newsletterId, date } = body;

    if (!newsletterId || typeof newsletterId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'newsletterId'" },
        { status: 400 },
      );
    }

    const newsletter = await prisma.newsletter.findUnique({
      where: { id: newsletterId },
    });

    if (!newsletter) {
      return NextResponse.json(
        { error: "Newsletter not found" },
        { status: 404 },
      );
    }

    const sendDate =
      date && typeof date === "string"
        ? date.trim()
        : newsletter.createdAt.toISOString().slice(0, 10);

    const sendResult = await sendNewsletterToSubscribers({
      newsletterId: newsletter.id,
      category: newsletter.category,
      contentMarkdown: newsletter.content,
      date: sendDate,
      title: newsletter.title ?? undefined,
    });

    return NextResponse.json({
      sent: sendResult.sent,
      failed: sendResult.failed,
      ...(sendResult.errors &&
        sendResult.errors.length > 0 && { errors: sendResult.errors }),
    });
  } catch (error) {
    console.error("POST /api/newsletters/send error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Send failed",
      },
      { status: 500 },
    );
  }
}
