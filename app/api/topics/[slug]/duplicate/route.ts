import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Virtual AI topic profile — not stored in DB, used when duplicating the hardcoded AI topic
const AI_PROFILE = {
  name: "AI (Copy)",
  icon: "🧠",
  description: "Daily digest of the most important artificial intelligence news, research, and launches.",
  tagline: "Your daily AI briefing — no fluff, just signal.",
  role: "expert AI News Curator and Technical Writer",
  topicScope: "artificial intelligence, machine learning, and AI industry",
  titlePrefix: "AI DAILY",
  sections: JSON.stringify([
    {
      emoji: "🏆",
      title: "Hero Feature",
      description: "The single most important story of the day",
      sentenceGuide: [
        "What happened (The core news)",
        "Key detail, metric, or technical specific",
        "Why it matters to the industry",
        "Broader societal or economic impact (optional)",
      ],
      itemCount: 1,
      wordRange: [80, 150],
    },
    {
      emoji: "🚀",
      title: "Headlines & Launches",
      description: "New products, funding rounds, or major announcements",
      sentenceGuide: ["The launch or update", "The immediate significance"],
      itemCount: [3, 5],
      wordRange: [40, 70],
    },
    {
      emoji: "🧠",
      title: "Deep Dives & Analysis",
      description: "In-depth analysis and opinion pieces",
      sentenceGuide: [
        "What the study or article analyzes",
        "The key finding or argument",
        "The long-term implication for the field",
      ],
      itemCount: [2, 3],
      wordRange: [60, 120],
    },
    {
      emoji: "👨‍💻",
      title: "Engineering & Research",
      description: "Technical systems, papers, or methods",
      sentenceGuide: [
        "The technical system, paper, or method proposed",
        "How it works (the under the hood explanation)",
        "Why this is a technical milestone or useful for devs",
      ],
      itemCount: [2, 3],
      wordRange: [60, 100],
    },
    {
      emoji: "🎁",
      title: "Miscellaneous",
      description: "Interesting side-news, policy updates, or tools",
      sentenceGuide: [
        "Interesting side-news, policy update, or tool",
        "Why it's worth a quick look",
      ],
      itemCount: [1, 2],
      wordRange: [40, 80],
    },
  ]),
  prioritySources: ["ArXiv", "TechCrunch", "Reuters", "The Verge", "Ars Technica"],
  toneNotes: null,
  exampleSubjects: [
    "OpenAI launches GPT-5 — and it can reason",
    "Google DeepMind cracks protein folding for drug design",
    "EU passes sweeping AI Act: what it means for builders",
  ],
};

// ── POST /api/topics/[slug]/duplicate — duplicate a topic profile ──
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Special case: duplicate the hardcoded AI topic
    if (slug === "ai") {
      let copySlug = "ai-copy";
      let attempt = 1;
      while (await prisma.topicProfile.findUnique({ where: { slug: copySlug } })) {
        attempt++;
        copySlug = `ai-copy-${attempt}`;
      }

      const created = await prisma.topicProfile.create({
        data: {
          ...AI_PROFILE,
          slug: copySlug,
          name: attempt > 1 ? `AI (Copy ${attempt})` : "AI (Copy)",
        },
      });

      return NextResponse.json(created, { status: 201 });
    }

    // Normal case: duplicate a DB topic
    const source = await prisma.topicProfile.findUnique({ where: { slug } });
    if (!source) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

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
