import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import { inquiryTypes } from "@/content/contact";
import { site } from "@/content/site";

export const runtime = "nodejs";

// Lightweight in-memory rate limit. Good enough as a spam guard for a single
// instance; swap for a durable store (Upstash/Redis) if traffic grows.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function subjectLabel(value: string): string {
  return inquiryTypes.find((t) => t.value === value)?.label ?? value;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never fill the hidden "company" field. Silently accept
  // and drop so bots get no signal.
  const honeypot = (body as Record<string, unknown>)?.company;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const data = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      const to = process.env.CONTACT_TO_EMAIL || site.email;
      const from =
        process.env.CONTACT_FROM_EMAIL || "GG BEARERS <onboarding@resend.dev>";

      const lines = [
        `Subject area: ${subjectLabel(data.subject)}`,
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone || "Not provided"}`,
        "",
        data.message,
      ];

      const { error } = await resend.emails.send({
        from,
        to,
        replyTo: data.email,
        subject: `New ${subjectLabel(data.subject)} enquiry, ${data.name}`,
        text: lines.join("\n"),
      });

      if (error) throw error;
    } catch (err) {
      console.error("contact: email send failed", err);
      return NextResponse.json(
        { error: "We couldn't send your message. Please email us directly." },
        { status: 502 },
      );
    }
  } else {
    // No key wired yet, log so a submission is never silently lost in dev.
    console.info("[contact] submission received (RESEND_API_KEY not set):", {
      ...data,
      ip,
    });
  }

  return NextResponse.json({ ok: true });
}
