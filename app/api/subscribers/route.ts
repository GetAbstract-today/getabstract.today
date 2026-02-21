import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isValidEmail } from "@/lib/validate-email";
import { isCategoryId } from "@/lib/newsletter-categories";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const category =
      typeof body?.category === "string" ? body.category.trim() : "";

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (!category || !isCategoryId(category)) {
      return NextResponse.json(
        { error: "Invalid newsletter category" },
        { status: 400 }
      );
    }

    await prisma.subscription.create({
      data: {
        email: email.toLowerCase(),
        category,
      },
    });

    return NextResponse.json(
      { message: "You're subscribed!", subscribed: true },
      { status: 201 }
    );
  } catch (error: unknown) {
    const isPrisma = error && typeof error === "object" && "code" in error;
    if (isPrisma && (error as { code: string }).code === "P2002") {
      return NextResponse.json(
        { message: "You're already subscribed to this newsletter.", subscribed: true },
        { status: 200 }
      );
    }
    console.error("POST /api/subscribers error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
