import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/unsubscribe
 * Removes a subscription. Used from the unsubscribe confirmation page.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const category = typeof body?.category === "string" ? body.category.trim() : "";

    if (!email || !category) {
      return NextResponse.json(
        { error: "Missing email or category." },
        { status: 400 },
      );
    }

    await prisma.subscription.deleteMany({
      where: { email, category },
    });

    return NextResponse.json({ message: "Unsubscribed successfully." });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}

/**
 * GET /api/unsubscribe?email=...&category=...
 * Shows the unsubscribe confirmation page (redirects there).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") ?? "";
  const category = searchParams.get("category") ?? "";

  const url = new URL("/unsubscribe", request.url);
  if (email) url.searchParams.set("email", email);
  if (category) url.searchParams.set("category", category);
  return NextResponse.redirect(url.toString(), 302);
}
