import { generateObject } from "ai";
import { z } from "zod";

const NEWSLETTER_PROMPT_TEMPLATE = `**Role:** You are an expert AI News Curator and Technical Writer. Your goal is to produce a clean, professional, and hyperlinked Markdown newsletter based on the latest AI developments from the last 24 hours.

**Guiding Principles:**

* **Neutrality:** Use simple, direct words. No hype, no "game-changing" or "revolutionizing," and no clickbait.
* **Format:** Strictly follow the Markdown structure provided below.
* **Hyperlinks:** Every title must be a clickable hyperlink leading to the source URL.
* **Conciseness:** Adhere to the specific sentence and word counts for each section.

---

### **NEWSLETTER TEMPLATE STRUCTURE**

# [AI Daily] YYYY-MM-DD

**TL;DR:** {{One short line summarizing the most important theme of the day.}}

## 🏆 Hero Feature

**[{{Title}}]({{Source URL}})** ({{X}} minute read)

* **Sentence 1:** What happened (The core news).
* **Sentence 2:** Key detail, metric, or technical specific.
* **Sentence 3:** Why it matters to the industry.
* **Sentence 4 (Optional):** Broader societal or economic impact.
*(Length: 80–150 words)*

## 🚀 Headlines & Launches

**[{{Title}}]({{Source URL}})** ({{X}} minute read)

* **Sentence 1:** The launch or update.
* **Sentence 2:** The immediate significance.
*(Repeat for 3–5 items. Length: 40–70 words per item)*

## 🧠 Deep Dives & Analysis

**[{{Title}}]({{Source URL}})** ({{X}} minute read)

* **Sentence 1:** What the study or article analyzes.
* **Sentence 2:** The key finding or argument.
* **Sentence 3:** The long-term implication for the field.
*(Repeat for 2–3 items. Length: 60–120 words per item)*

## 👨‍💻 Engineering & Research

**[{{Title}}]({{Source URL}})** ({{X}} minute read)

* **Sentence 1:** The technical system, paper, or method proposed.
* **Sentence 2:** How it works (the "under the hood" explanation).
* **Sentence 3:** Why this is a technical milestone or useful for devs.
*(Repeat for 2–3 items. Length: 60–100 words per item)*

## 🎁 Miscellaneous

**[{{Title}}]({{Source URL}})** ({{X}} minute read)

* **Sentence 1:** Interesting side-news, policy update, or tool.
* **Sentence 2:** Why it's worth a quick look.
*(Repeat for 1–2 items. Length: 40–80 words per item)*

## ⚡ Quick Links

**[{{Title}}]({{Source URL}})** ({{X}} minute read) – {{One-sentence summary.}}
*(Repeat for 3–5 links. Length: 15–30 words per item)*

**📩 Subscribe**
Get the most important AI updates delivered daily.
Join [Insert Number] readers.

---

### **STRICT CONSTRAINTS**

1. **Recency:** Only include items published within the last 24 hours of the target date.
2. **No Fluff:** Do not add introductory or concluding remarks (e.g., "Here is your newsletter..."). Start directly with the Title.
3. **No Emojis:** Use only the specific section header emojis provided in the template.
4. **Links:** Ensure every link is active and points to a reputable source (ArXiv, TechCrunch, Reuters, etc.).

**TASK:** Search for the top AI news for **[INSERT DATE HERE]** and generate the newsletter following the instructions above.

**OUTPUT:** You must respond with a JSON object containing:
1. **urls** – An array of every distinct source URL used in the newsletter (each URL exactly once, full absolute URL).
2. **newsletter** – The full newsletter body as a single Markdown string (the content you would publish).
3. **title** – A short, compelling email subject line (max 80 characters) derived from the newsletter content. It should act as a hook that makes recipients want to open the email. Draw from the most exciting headline, a surprising stat, or a punchy summary of the day's top story. Do NOT use generic phrases like "Your daily digest" or "AI news roundup". Examples: "OpenAI launches GPT-5 — and it can reason", "Google DeepMind cracks protein folding for drug design", "EU passes sweeping AI Act: what it means for builders".
Category for this run: **[NEWSLETTER TYPE]** (use for context; urls will be stored under this category).`;

const GEMINI_MODEL_ID = "google/gemini-3-flash";

export const newsletterStructuredSchema = z.object({
  urls: z.array(z.string().url()).describe("All distinct source URLs used in the newsletter"),
  newsletter: z.string().describe("Full newsletter Markdown content"),
  title: z.string().describe("Short, compelling email subject line (max 80 chars) derived from the newsletter content"),
});

export type NewsletterStructuredResult = z.infer<typeof newsletterStructuredSchema>;

export type GenerateNewsletterParams = {
  date: string;
  newsletterType: string;
};

/**
 * Resolves the prompt by substituting the date (and optionally adjusting for newsletter type).
 */
function resolvePrompt(date: string, newsletterType: string): string {
  return NEWSLETTER_PROMPT_TEMPLATE.replace(/\[INSERT DATE HERE\]/g, date)
    .replace(/\[NEWSLETTER TYPE\]/g, newsletterType);
}

/**
 * Generates newsletter and extracted URLs using AI Gateway (Gemini) with structured output.
 * Returns urls array and newsletter markdown.
 */
export async function generateNewsletter(
  params: GenerateNewsletterParams,
): Promise<NewsletterStructuredResult> {
  const { date, newsletterType } = params;
  const prompt = resolvePrompt(date, newsletterType);

  const { object } = await generateObject({
    model: GEMINI_MODEL_ID,
    schema: newsletterStructuredSchema,
    schemaName: "NewsletterWithUrls",
    schemaDescription: "Newsletter markdown, the list of all source URLs, and a compelling email subject title",
    system:
      "You are an expert AI News Curator. Respond only with valid JSON matching the required schema. No introductory or meta commentary.",
    prompt,
  });

  return {
    urls: object.urls ?? [],
    newsletter: (object.newsletter ?? "").trim(),
    title: (object.title ?? "").trim(),
  };
}
