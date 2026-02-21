import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const newsletters = await prisma.newsletter.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(newsletters);
  } catch (error) {
    console.error("GET /api/newsletters error:", error);
    return NextResponse.json(
      { error: "Failed to fetch newsletters" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, category } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'content' (Markdown)" },
        { status: 400 }
      );
    }
    if (!category || typeof category !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'category'" },
        { status: 400 }
      );
    }

    const created = await prisma.newsletter.create({
      data: {
        content: content.trim(),
        category: category.trim(),
      },
    });
    return NextResponse.json(created);
  } catch (error) {
    console.error("POST /api/newsletters error:", error);
    return NextResponse.json(
      { error: "Failed to create newsletter" },
      { status: 500 }
    );
  }
}
