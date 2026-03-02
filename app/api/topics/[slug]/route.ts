import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  sectionsArraySchema,
  containsInjection,
} from "@/lib/prompt-composer";

// ── GET /api/topics/[slug] — get a single topic profile ──
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const topic = await prisma.topicProfile.findUnique({ where: { slug } });
    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }
    return NextResponse.json(topic);
  } catch (error) {
    console.error("GET /api/topics/[slug] error:", error);
    return NextResponse.json({ error: "Failed to fetch topic" }, { status: 500 });
  }
}

// ── PATCH /api/topics/[slug] — update a topic profile ──
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (slug === "ai") {
      return NextResponse.json(
        { error: "The 'ai' topic is managed internally" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const data: Record<string, unknown> = {};

    // String fields that can be updated
    const stringFields = [
      "name", "icon", "description", "tagline",
      "role", "topicScope", "titlePrefix", "toneNotes",
    ] as const;

    for (const key of stringFields) {
      if (typeof body[key] === "string") {
        if (containsInjection(body[key])) {
          return NextResponse.json(
            { error: "Input contains disallowed patterns" },
            { status: 400 }
          );
        }
        data[key] = body[key].trim();
      }
    }

    // Sections
    if (body.sections !== undefined) {
      let parsed;
      try {
        parsed = typeof body.sections === "string" ? JSON.parse(body.sections) : body.sections;
      } catch {
        return NextResponse.json({ error: "Invalid sections JSON" }, { status: 400 });
      }
      const result = sectionsArraySchema.safeParse(parsed);
      if (!result.success) {
        return NextResponse.json(
          { error: "Invalid sections format", details: result.error.flatten() },
          { status: 400 }
        );
      }
      data.sections = JSON.stringify(result.data);
    }

    // Array fields
    for (const key of ["prioritySources", "exampleSubjects"] as const) {
      if (Array.isArray(body[key])) {
        const arr = body[key].filter((s: unknown) => typeof s === "string");
        for (const item of arr) {
          if (containsInjection(item)) {
            return NextResponse.json(
              { error: "Input contains disallowed patterns" },
              { status: 400 }
            );
          }
        }
        data[key] = arr;
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const updated = await prisma.topicProfile.update({
      where: { slug },
      data,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/topics/[slug] error:", error);
    return NextResponse.json({ error: "Failed to update topic" }, { status: 500 });
  }
}

// ── DELETE /api/topics/[slug] — delete a topic profile ──
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (slug === "ai") {
      return NextResponse.json(
        { error: "The 'ai' topic cannot be deleted" },
        { status: 400 }
      );
    }

    await prisma.topicProfile.delete({ where: { slug } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/topics/[slug] error:", error);
    return NextResponse.json({ error: "Failed to delete topic" }, { status: 500 });
  }
}
