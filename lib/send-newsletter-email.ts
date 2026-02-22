import { marked } from "marked";
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import { getCategoryById } from "@/lib/newsletter-categories";

const RESEND_BATCH_SIZE = 100;
const DEFAULT_FROM = "GetAbstract Today <onboarding@resend.dev>";

/**
 * Converts markdown to HTML for the email body. Uses safe options (no raw HTML by default).
 */
export function markdownToHtml(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}

export type SendNewsletterResult = {
  sent: number;
  failed: number;
  errors?: string[];
};

export type SendNewsletterParams = {
  newsletterId: string;
  category: string;
  contentMarkdown: string;
  date: string;
  title?: string;
};

/**
 * Fetches subscribers for the category, converts newsletter to HTML, and sends via Resend batch API.
 * Chunks recipients in groups of 100. Does not throw; returns sent/failed counts and optional errors.
 */
export async function sendNewsletterToSubscribers(
  params: SendNewsletterParams,
): Promise<SendNewsletterResult> {
  const { category, contentMarkdown, date, title } = params;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("sendNewsletterToSubscribers: RESEND_API_KEY is not set");
    return { sent: 0, failed: 0, errors: ["RESEND_API_KEY is not set"] };
  }

  const subscriptions = await prisma.subscription.findMany({
    where: { category },
    select: { email: true },
  });

  if (subscriptions.length === 0) {
    return { sent: 0, failed: 0 };
  }

  const from = process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM;
  const categoryLabel = getCategoryById(category)?.title ?? category;
  const subject = title
    ? `[${categoryLabel}] ${title}`
    : `[${categoryLabel}] Your digest – ${date}`;
  const html = wrapEmailBody(markdownToHtml(contentMarkdown));

  const resend = new Resend(apiKey);
  const emails = subscriptions.map((s) => s.email);
  const errors: string[] = [];
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < emails.length; i += RESEND_BATCH_SIZE) {
    const chunk = emails.slice(i, i + RESEND_BATCH_SIZE);
    const batch = chunk.map((email) => ({
      from,
      to: email,
      subject,
      html,
    }));

    try {
      const { error } = await resend.batch.send(batch);
      if (error) {
        failed += chunk.length;
        errors.push(
          `Batch ${Math.floor(i / RESEND_BATCH_SIZE) + 1}: ${typeof error === "object" && error !== null && "message" in error ? (error as { message?: string }).message : String(error)}`,
        );
      } else {
        sent += chunk.length;
      }
    } catch (err) {
      failed += chunk.length;
      errors.push(
        `Batch ${Math.floor(i / RESEND_BATCH_SIZE) + 1}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  return errors.length > 0 ? { sent, failed, errors } : { sent, failed };
}

function wrapEmailBody(html: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 640px; margin: 0 auto; padding: 1rem; }
    a { color: #2563eb; }
    .prose h1 { font-size: 1.5rem; margin-top: 1.5rem; margin-bottom: 0.5rem; }
    .prose h2 { font-size: 1.25rem; margin-top: 1.25rem; margin-bottom: 0.5rem; }
    .prose ul { margin: 0.5rem 0; padding-left: 1.5rem; }
    .prose li { margin: 0.25rem 0; }
    .prose p { margin: 0.5rem 0; }
  </style>
</head>
<body class="prose">
${html}
</body>
</html>`;
}
