import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const defaultFromEmail =
  process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev";
const defaultFrom = `Abstract AI <${defaultFromEmail}>`;

/**
 * Test/sample send route matching Resend Next.js docs.
 * POST with optional body: { "to": "recipient@example.com" }
 * Uses Resend's emails.send() for a single email.
 */
export async function POST(request: Request) {
  try {
    let to = "delivered@resend.dev";
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      try {
        const body = await request.json();
        if (body.to && typeof body.to === "string") to = body.to.trim();
      } catch {
        // use default to
      }
    }

    const { data, error } = await resend.emails.send({
      from: defaultFrom,
      to: [to],
      subject: "Hello from GetAbstract Today",
      html: "<p><strong>It works!</strong> Resend is configured correctly.</p>",
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("POST /api/send error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Send failed" },
      { status: 500 }
    );
  }
}
