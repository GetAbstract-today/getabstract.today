import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ── POST /api/topics/[slug]/duplicate — duplicate a topic profile ──
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const source = await prisma.topicProfile.findUnique({ where: { slug } });
    if (!source) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Find a unique slug: try -copy, -copy-2, -copy-3, etc.
    let copySlug = `${slug}-copy`;
    let attempt = 1;
    while (await prisma.topicProfile.findUnique({ where: { slug: copySlug } })) {
      attempt++;
      copySlug = `${slug}-copy-${attempt}`;
    }

    const created = await prisma.topicProfile.create({
      data: {
        slug: copySlug,
        name: `${source.name} (Copy)`,
        icon: source.icon,
        description: source.description,
        tagline: source.tagline,
        role: source.role,
        topicScope: source.topicScope,
        titlePrefix: source.titlePrefix,
        sections: source.sections,
        prioritySources: source.prioritySources,
        toneNotes: source.toneNotes,
        exampleSubjects: source.exampleSubjects,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/topics/[slug]/duplicate error:", error);
    return NextResponse.json(
      { error: "Failed to duplicate topic" },
      { status: 500 }
    );
  }
}
