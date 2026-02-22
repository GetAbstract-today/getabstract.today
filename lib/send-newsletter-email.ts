import { marked } from "marked";
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import { getCategoryById } from "@/lib/newsletter-categories";

const RESEND_BATCH_SIZE = 100;
const DEFAULT_FROM_EMAIL = "onboarding@resend.dev";

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

  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;
  const categoryLabel = getCategoryById(category)?.title ?? category;
  const from = `Abstract ${categoryLabel} <${fromEmail}>`;
  // Strip any leading bracket tags like "[AI]" or "[AI Daily]" from the title
  const cleanTitle = title?.replace(/^\[.*?\]\s*/g, "").trim();
  const subject = cleanTitle
    ? cleanTitle
    : `${categoryLabel} – Your digest for ${date}`;
  const html = wrapEmailBody(markdownToHtml(contentMarkdown), categoryLabel, date);

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

function wrapEmailBody(html: string, categoryLabel: string, date: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Abstract ${categoryLabel} – ${date}</title>
  <style>
    /* Reset */
    body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    body { margin: 0; padding: 0; width: 100%; }
    img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }

    /* Base */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 1.7;
      color: #1a1a1a;
      background-color: #f5f5f5;
    }

    /* Wrapper */
    .email-wrapper {
      max-width: 620px;
      margin: 0 auto;
      background-color: #ffffff;
    }

    /* Header */
    .email-header {
      text-align: center;
      padding: 32px 24px 24px;
      border-bottom: 1px solid #e5e5e5;
    }
    .email-header .brand {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #1a1a1a;
      text-decoration: none;
    }
    .email-header .brand span {
      color: #2563eb;
    }
    .email-header .edition {
      display: block;
      margin-top: 4px;
      font-size: 13px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    .email-header .date-line {
      display: block;
      margin-top: 16px;
      font-size: 22px;
      font-weight: 700;
      color: #1a1a1a;
    }

    /* Content area */
    .email-content {
      padding: 24px 28px 32px;
    }

    /* Section dividers – emoji centered above bold title */
    .email-content h2 {
      text-align: center;
      font-size: 22px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 40px 0 20px;
      padding-top: 24px;
      border-top: 1px solid #e5e5e5;
    }

    /* First h2 – no top border */
    .email-content h2:first-child {
      border-top: none;
      margin-top: 8px;
      padding-top: 0;
    }

    .email-content h1 {
      text-align: center;
      font-size: 22px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 20px;
    }

    /* Article titles (bold linked titles) */
    .email-content p strong a,
    .email-content strong a {
      color: #1a1a1a;
      text-decoration: underline;
      text-decoration-color: #2563eb;
      text-underline-offset: 2px;
      font-size: 16px;
      font-weight: 700;
    }
    .email-content p strong a:hover,
    .email-content strong a:hover {
      color: #2563eb;
    }

    /* Regular links */
    .email-content a {
      color: #2563eb;
      text-decoration: underline;
    }

    /* Paragraphs */
    .email-content p {
      margin: 12px 0;
      font-size: 15px;
      line-height: 1.7;
      color: #374151;
    }

    /* Lists */
    .email-content ul {
      margin: 8px 0 16px;
      padding-left: 20px;
    }
    .email-content li {
      margin: 6px 0;
      font-size: 15px;
      line-height: 1.6;
      color: #374151;
    }
    .email-content li strong {
      color: #1a1a1a;
    }

    /* TL;DR highlight */
    .email-content p strong:first-child {
      color: #1a1a1a;
    }

    /* Footer */
    .email-footer {
      text-align: center;
      padding: 24px;
      border-top: 1px solid #e5e5e5;
      font-size: 13px;
      color: #9ca3af;
      line-height: 1.6;
    }
    .email-footer a {
      color: #6b7280;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <!-- Header -->
    <div class="email-header">
      <a href="https://getabstract.today" class="brand">Abstract<span>.</span></a>
      <span class="edition">${categoryLabel} Edition</span>
      <span class="date-line">Abstract ${categoryLabel} ${date}</span>
    </div>

    <!-- Content -->
    <div class="email-content">
      ${html}
    </div>

    <!-- Footer -->
    <div class="email-footer">
      <p>You're receiving this because you subscribed to Abstract ${categoryLabel}.</p>
      <p>
        <a href="https://getabstract.today">Visit website</a>
      </p>
      <p>&copy; ${new Date().getFullYear()} Abstract. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}
