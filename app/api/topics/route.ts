import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  sectionsArraySchema,
  containsInjection,
} from "@/lib/prompt-composer";

// ── GET /api/topics — list all topic profiles ──
export async function GET() {
  try {
    const topics = await prisma.topicProfile.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(topics);
  } catch (error) {
    console.error("GET /api/topics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}

// ── POST /api/topics — create a new topic profile ──
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      slug,
      name,
      icon,
      description,
      tagline,
      role,
      topicScope,
      titlePrefix,
      sections,
      prioritySources,
      toneNotes,
      exampleSubjects,
    } = body;

    // Required field validation
    const requiredStrings = { slug, name, icon, description, tagline, role, topicScope, titlePrefix };
    for (const [key, val] of Object.entries(requiredStrings)) {
      if (!val || typeof val !== "string" || val.trim().length === 0) {
        return NextResponse.json(
          { error: `Missing or invalid '${key}'` },
          { status: 400 }
        );
      }
    }

    // Slug format: lowercase alphanumeric + hyphens
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: "Slug must be lowercase alphanumeric with hyphens only" },
        { status: 400 }
      );
    }

    // Reserved slug — "ai" is hardcoded
    if (slug === "ai") {
      return NextResponse.json(
        { error: "The 'ai' topic is managed internally and cannot be created here" },
        { status: 400 }
      );
    }

    // Injection check on all user-provided text fields
    const textFields = [role, topicScope, titlePrefix, toneNotes, description, tagline, name];
    for (const field of textFields) {
      if (field && containsInjection(field)) {
        return NextResponse.json(
          { error: "Input contains disallowed patterns" },
          { status: 400 }
        );
      }
    }

    // Validate sections JSON
    let parsedSections;
    try {
      parsedSections = typeof sections === "string" ? JSON.parse(sections) : sections;
    } catch {
      return NextResponse.json({ error: "Invalid sections JSON" }, { status: 400 });
    }

    const sectionsResult = sectionsArraySchema.safeParse(parsedSections);
    if (!sectionsResult.success) {
      return NextResponse.json(
        { error: "Invalid sections format", details: sectionsResult.error.flatten() },
        { status: 400 }
      );
    }

    // Validate arrays
    const sourcesArr = Array.isArray(prioritySources) ? prioritySources.filter((s: unknown) => typeof s === "string") : [];
    const examplesArr = Array.isArray(exampleSubjects) ? exampleSubjects.filter((s: unknown) => typeof s === "string") : [];

    // Check injection in array items
    for (const item of [...sourcesArr, ...examplesArr]) {
      if (containsInjection(item)) {
        return NextResponse.json(
          { error: "Input contains disallowed patterns" },
          { status: 400 }
        );
      }
    }

    const created = await prisma.topicProfile.create({
      data: {
        slug: slug.trim(),
        name: name.trim(),
        icon: icon.trim(),
        description: description.trim(),
        tagline: tagline.trim(),
        role: role.trim(),
        topicScope: topicScope.trim(),
        titlePrefix: titlePrefix.trim(),
        sections: JSON.stringify(sectionsResult.data),
        prioritySources: sourcesArr,
        toneNotes: toneNotes?.trim() || null,
        exampleSubjects: examplesArr,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/topics error:", error);
    const msg =
      error instanceof Error && error.message.includes("Unique constraint")
        ? "A topic with this slug already exists"
        : "Failed to create topic";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
