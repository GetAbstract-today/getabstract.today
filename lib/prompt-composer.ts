import { z } from "zod";

// ── Section schema (stored as JSON string in TopicProfile.sections) ──

export const sectionConfigSchema = z.object({
  emoji: z.string().max(4),
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(300),
  sentenceGuide: z.array(z.string().max(200)).min(1).max(6),
  itemCount: z.union([z.number().int().min(1).max(10), z.tuple([z.number().int().min(1), z.number().int().min(1)])]),
  wordRange: z.tuple([z.number().int().min(10), z.number().int().min(10)]),
});

export type SectionConfig = z.infer<typeof sectionConfigSchema>;

export const sectionsArraySchema = z.array(sectionConfigSchema).min(1).max(12);

// ── Validation for TopicProfile prompt fields ──

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous/i,
  /disregard\s+(all\s+)?prior/i,
  /system\s*:/i,
  /\bforget\s+(everything|all|instructions)/i,
  /\bdo\s+not\s+follow/i,
  /\bnew\s+instructions?\s*:/i,
  /\boverride/i,
  /```\s*(system|assistant)/i,
];

export function containsInjection(text: string): boolean {
  return INJECTION_PATTERNS.some((p) => p.test(text));
}

function sanitize(text: string): string {
  // Strip characters that could break prompt delimiters
  return text.replace(/[`{}]/g, "").trim();
}

// ── Prompt composer ──

export interface TopicPromptInput {
  role: string;
  topicScope: string;
  titlePrefix: string;
  sections: SectionConfig[];
  prioritySources: string[];
  toneNotes?: string | null;
  exampleSubjects: string[];
}

function buildSectionsMarkdown(sections: SectionConfig[]): string {
  return sections
    .map((s) => {
      const itemCountStr =
        typeof s.itemCount === "number"
          ? `${s.itemCount}`
          : `${s.itemCount[0]}–${s.itemCount[1]}`;

      const sentenceLines = s.sentenceGuide
        .map((guide, i) => `* **Sentence ${i + 1}:** ${sanitize(guide)}`)
        .join("\n");

      const repeatNote =
        (typeof s.itemCount === "number" ? s.itemCount : s.itemCount[1]) > 1
          ? `*(Repeat for ${itemCountStr} items. Length: ${s.wordRange[0]}–${s.wordRange[1]} words per item)*`
          : `*(Length: ${s.wordRange[0]}–${s.wordRange[1]} words)*`;

      return `## ${sanitize(s.emoji)} ${sanitize(s.title)}

**[{{Title}}]({{Source URL}})** ({{X}} minute read)

${sentenceLines}
${repeatNote}`;
    })
    .join("\n\n");
}

export function composePrompt(topic: TopicPromptInput, date: string): string {
  const role = sanitize(topic.role);
  const scope = sanitize(topic.topicScope);
  const prefix = sanitize(topic.titlePrefix);
  const sources = topic.prioritySources.map(sanitize).filter(Boolean);

  let prompt = `**Role:** You are an ${role}. Your goal is to produce a clean, professional, and hyperlinked Markdown newsletter based on the latest ${scope} developments from the last 24 hours.

**Guiding Principles:**

* **Neutrality:** Use simple, direct words. No hype, no "game-changing" or "revolutionizing," and no clickbait.
* **Format:** Strictly follow the Markdown structure provided below.
* **Hyperlinks:** Every title must be a clickable hyperlink leading to the source URL.
* **Conciseness:** Adhere to the specific sentence and word counts for each section.`;

  if (topic.toneNotes) {
    prompt += `\n* **Tone:** ${sanitize(topic.toneNotes)}`;
  }

  prompt += `

---

### **NEWSLETTER TEMPLATE STRUCTURE**

# [${prefix}] YYYY-MM-DD

${buildSectionsMarkdown(topic.sections)}

## ⚡ Quick Links

**[{{Title}}]({{Source URL}})** ({{X}} minute read) – {{One-sentence summary.}}
*(Repeat for 3–5 links. Length: 15–30 words per item)*

**📩 Subscribe**
Get the most important ${scope} updates delivered daily.

---

### **STRICT CONSTRAINTS**

1. **Recency:** Only include items published within the last 24 hours of the target date.
2. **No Fluff:** Do not add introductory or concluding remarks (e.g., "Here is your newsletter..."). Start directly with the Title.
3. **No Emojis:** Use only the specific section header emojis provided in the template.
4. **Links:** Ensure every link is active and points to a reputable source (${sources.length > 0 ? sources.join(", ") : "major industry publications"}, etc.).

**TASK:** Search for the top ${scope} news for **${date}** and generate the newsletter following the instructions above.

**OUTPUT:** You must respond with a JSON object containing:
1. **urls** – An array of every distinct source URL used in the newsletter (each URL exactly once, full absolute URL).
2. **newsletter** – The full newsletter body as a single Markdown string (the content you would publish).
3. **title** – A short, compelling email subject line (max 80 characters) derived from the newsletter content. It should act as a hook that makes recipients want to open the email. Draw from the most exciting headline, a surprising stat, or a punchy summary of the day's top story. Do NOT include the category name, brackets, tags, or prefixes like "[${prefix}]" — just the plain subject text. Do NOT use generic phrases like "Your daily digest" or "${scope} news roundup".`;

  if (topic.exampleSubjects.length > 0) {
    const examples = topic.exampleSubjects.map(sanitize).filter(Boolean);
    prompt += ` Examples: ${examples.map((e) => `"${e}"`).join(", ")}.`;
  }

  return prompt;
}

export function composeSystemMessage(role: string): string {
  return `You are an ${sanitize(role)}. Respond only with valid JSON matching the required schema. No introductory or meta commentary.`;
}

// ── Default section presets (for the Studio UI) ──

export const DEFAULT_SECTION_PRESETS: Record<string, SectionConfig[]> = {
  general: [
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
  ],
};
