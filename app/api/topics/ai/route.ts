import { NextResponse } from "next/server";

// Virtual AI topic profile — read-only, not stored in DB
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
      sentenceGuide: [
        "The launch or update",
        "The immediate significance",
      ],
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
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
  _hardcoded: true,
};

// ── GET /api/topics/ai — return the virtual AI profile ──
export async function GET() {
  return NextResponse.json(AI_VIRTUAL_PROFILE);
}
