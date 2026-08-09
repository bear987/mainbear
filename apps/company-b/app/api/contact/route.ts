import { NextResponse } from "next/server";
import { z } from "zod";
import { site } from "@/content/site";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2),
  contact: z.string().trim().min(5),
  message: z.string().trim().min(10).max(4000),
});

// Lightweight in-memory rate limit, single-instance spam guard.
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

  // Honeypot: bots fill the hidden "company" field; accept silently and drop.
  const honeypot = (body as Record<string, unknown>)?.company;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form." }, { status: 422 });
  }

  const data = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;
  /* Reported back to the caller so "it submitted" and "it was actually
     emailed" can never be confused again. */
  let delivered = false;

  if (apiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      const to = process.env.CONTACT_TO_EMAIL || site.email;
      const from = process.env.CONTACT_FROM_EMAIL || "GG FOODS <onboarding@resend.dev>";

      // The form takes one "contact" field, so it may hold a phone number
      // rather than an address. Only set replyTo when replying would work.
      const replyTo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact)
        ? data.contact
        : undefined;

      const lines = [
        `Name: ${data.name}`,
        `Contact: ${data.contact}`,
        "",
        data.message,
      ];

      const { error } = await resend.emails.send({
        from,
        to,
        ...(replyTo ? { replyTo } : {}),
        subject: `New enquiry from the GG Foods site, ${data.name}`,
        text: lines.join("\n"),
      });

      if (error) throw error;
      delivered = true;
    } catch (err) {
      console.error("[gg-foods contact] email send failed", err);
      return NextResponse.json(
        { error: "We couldn't send your message. Please call or WhatsApp us instead." },
        { status: 502 },
      );
    }
  } else {
    // No key wired yet, log so a submission is never silently lost in dev.
    console.info("[gg-foods contact] inquiry received (RESEND_API_KEY not set):", {
      ...data,
      ip,
    });
  }

  return NextResponse.json({ ok: true, delivered });
}
