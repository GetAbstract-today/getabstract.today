import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const urls = await prisma.url.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(urls);
  } catch (error) {
    console.error("GET /api/urls error:", error);
    return NextResponse.json(
      { error: "Failed to fetch URLs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, date, category } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'url'" },
        { status: 400 }
      );
    }
    if (!category || typeof category !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'category'" },
        { status: 400 }
      );
    }

    const dateValue = date ? new Date(date) : new Date();
    if (Number.isNaN(dateValue.getTime())) {
      return NextResponse.json(
        { error: "Invalid 'date'" },
        { status: 400 }
      );
    }

    const created = await prisma.url.create({
      data: {
        url: url.trim(),
        date: dateValue,
        category: category.trim(),
      },
    });
    return NextResponse.json(created);
  } catch (error) {
    console.error("POST /api/urls error:", error);
    return NextResponse.json(
      { error: "Failed to create URL" },
      { status: 500 }
    );
  }
}
