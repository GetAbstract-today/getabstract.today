import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const newsletter = await prisma.newsletter.findUnique({ where: { id } });
    if (!newsletter) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(newsletter);
  } catch (error) {
    console.error("GET /api/newsletters/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch newsletter" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, title } = body;

    const data: Record<string, string> = {};
    if (typeof content === "string") data.content = content;
    if (typeof title === "string") data.title = title;

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "Nothing to update" },
        { status: 400 }
      );
    }

    const updated = await prisma.newsletter.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/newsletters/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update newsletter" },
      { status: 500 }
    );
  }
}
