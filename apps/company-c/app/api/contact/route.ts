import { NextResponse } from "next/server";
import { z } from "zod";

/* Enquiry intake. There is no database — this validates, rate-limits and
   hands off to email. Until RESEND_API_KEY / CONTACT_TO_EMAIL are set it
   logs the enquiry server-side and still answers 200, so the form works
   end to end in every environment. */

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(7).max(40),
  message: z.string().trim().min(10).max(4000),
  enquiryType: z.enum(["general", "wholesale"]).default("general"),
  company: z.string().trim().max(160).optional(),
  quantity: z.coerce.number().int().min(1).max(1000).optional(),
  models: z.string().trim().max(300).optional(),
  /* Honeypot. Accepted by the schema on purpose so a filled one reaches
     the check below and gets a 200, rather than a 400 that tells the bot
     exactly which field gave it away. */
  website: z.string().max(500).optional(),
});

/* Simple in-memory limit. Enough for a single-instance deploy; swap for a
   shared store if this ever runs on more than one node. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many enquiries. Please try again shortly." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Some details were missing or invalid." },
      { status: 400 },
    );
  }

  const enquiry = parsed.data;

  // Bot caught by the honeypot. Answer 200 so it learns nothing.
  if (enquiry.website) return NextResponse.json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.info(
      `[enquiry:${enquiry.enquiryType}] ${enquiry.name} <${enquiry.email}> ${enquiry.phone}` +
        (enquiry.company ? ` | ${enquiry.company} x${enquiry.quantity ?? "?"}` : ""),
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  const subject =
    enquiry.enquiryType === "wholesale"
      ? `Wholesale enquiry — ${enquiry.company ?? enquiry.name} (${enquiry.quantity ?? "?"} units)`
      : `Website enquiry — ${enquiry.name}`;

  const lines = [
    `Type: ${enquiry.enquiryType}`,
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone}`,
    enquiry.company ? `Company: ${enquiry.company}` : null,
    enquiry.quantity ? `Quantity: ${enquiry.quantity}` : null,
    enquiry.models ? `Preferred models: ${enquiry.models}` : null,
    "",
    enquiry.message,
  ].filter(Boolean);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: enquiry.email,
        subject,
        text: lines.join("\n"),
      }),
    });
    if (!response.ok) throw new Error(`Resend responded ${response.status}`);
  } catch (error) {
    console.error("[enquiry] delivery failed", error);
    return NextResponse.json(
      { ok: false, error: "We could not send that. Please try WhatsApp." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, delivered: true });
}
