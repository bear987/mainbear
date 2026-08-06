"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@repo/ui/cn";

const fieldBase =
  "mt-1.5 w-full rounded-[var(--radius-sm)] border bg-surface px-3.5 py-2.5 text-fg " +
  "outline-none transition-colors placeholder:text-muted/70 focus:border-action-500";

type Status = "idle" | "sending" | "sent" | "error";

/** Simple inquiry form for the Visit page. Posts to /api/contact. */
export function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState({ name: "", contact: "", message: "" });

  const invalid =
    values.name.trim().length < 2 ||
    values.contact.trim().length < 5 ||
    values.message.trim().length < 10;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (invalid) {
      setError("Add your name, a phone number or email, and a short message.");
      return;
    }
    setStatus("sending");
    try {
      const honeypot = (e.currentTarget.elements.namedItem("company") as HTMLInputElement)?.value;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company: honeypot ?? "" }),
      });
      if (!res.ok) throw new Error("We couldn't send that. Please call us instead.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-[var(--radius-xl)] border border-line bg-surface p-8 text-center shadow-card">
        <p className="font-display text-xl font-semibold text-heading">
          Message received.
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
          We reply within a business day. For anything urgent, call us, it is
          faster.
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="rounded-[var(--radius-xl)] border border-line bg-surface p-6 shadow-card sm:p-8"
    >
      <div aria-hidden className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company (leave blank)</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-heading">
          Your name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          className={cn(fieldBase, "border-line")}
        />
      </div>
      <div className="mt-5">
        <label htmlFor="contact" className="block text-sm font-medium text-heading">
          Phone or email
        </label>
        <input
          id="contact"
          name="contact"
          type="text"
          autoComplete="tel"
          value={values.contact}
          onChange={(e) => setValues((v) => ({ ...v, contact: e.target.value }))}
          className={cn(fieldBase, "border-line")}
        />
      </div>
      <div className="mt-5">
        <label htmlFor="message" className="block text-sm font-medium text-heading">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          className={cn(fieldBase, "resize-y border-line")}
        />
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-[var(--radius-sm)] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className={cn(
          "mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 font-medium text-white transition-all duration-300 ease-[var(--ease-quint)] active:scale-[0.99]",
          status === "sending"
            ? "cursor-not-allowed bg-action-400"
            : "bg-action-500 shadow-glow hover:-translate-y-0.5 hover:bg-action-400",
        )}
      >
        {status === "sending" ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
