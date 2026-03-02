import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  sectionsArraySchema,
  containsInjection,
} from "@/lib/prompt-composer";

// ── Virtual AI topic profile (hardcoded, not stored in DB) ──
const AI_VIRTUAL_PROFILE = {
  slug: "ai",
  name: "AI",
  icon: "🧠",
  description: "Daily digest of the most important artificial intelligence news, research, and launches.",
  tagline: "Your daily AI briefing — no fluff, just signal.",
  role: "expert AI News Curator and Technical Writer",
  topicScope: "artificial intelligence, machine learning, and AI industry",
  titlePrefix: "AI DAILY",
  sections: JSON.stringify([
    { emoji: "🏆", title: "Hero Feature", description: "The single most important story of the day", sentenceGuide: ["What happened (The core news)", "Key detail, metric, or technical specific", "Why it matters to the industry", "Broader societal or economic impact (optional)"], itemCount: 1, wordRange: [80, 150] },
    { emoji: "🚀", title: "Headlines & Launches", description: "New products, funding rounds, or major announcements", sentenceGuide: ["The launch or update", "The immediate significance"], itemCount: [3, 5], wordRange: [40, 70] },
    { emoji: "🧠", title: "Deep Dives & Analysis", description: "In-depth analysis and opinion pieces", sentenceGuide: ["What the study or article analyzes", "The key finding or argument", "The long-term implication for the field"], itemCount: [2, 3], wordRange: [60, 120] },
    { emoji: "👨‍💻", title: "Engineering & Research", description: "Technical systems, papers, or methods", sentenceGuide: ["The technical system, paper, or method proposed", "How it works (the under the hood explanation)", "Why this is a technical milestone or useful for devs"], itemCount: [2, 3], wordRange: [60, 100] },
    { emoji: "🎁", title: "Miscellaneous", description: "Interesting side-news, policy updates, or tools", sentenceGuide: ["Interesting side-news, policy update, or tool", "Why it's worth a quick look"], itemCount: [1, 2], wordRange: [40, 80] },
  ]),
  prioritySources: ["ArXiv", "TechCrunch", "Reuters", "The Verge", "Ars Technica"],
  toneNotes: null,
  exampleSubjects: ["OpenAI launches GPT-5 — and it can reason", "Google DeepMind cracks protein folding for drug design", "EU passes sweeping AI Act: what it means for builders"],
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
  _hardcoded: true,
};

// ── GET /api/topics/[slug] — get a single topic profile ──
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Return virtual AI profile for the hardcoded topic
    if (slug === "ai") {
      return NextResponse.json(AI_VIRTUAL_PROFILE);
    }

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
