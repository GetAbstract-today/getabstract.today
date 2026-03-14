import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/validate-email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    // For now, log the enquiry. In production, this could send a notification
    // email to the sales team or store in a leads table.
    console.log(`[Advertise enquiry] ${email} at ${new Date().toISOString()}`);

    return NextResponse.json(
      { message: "Thanks! We'll be in touch." },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
