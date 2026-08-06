"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { inquiryTypes, type InquiryValue } from "@/content/contact";
import { contactSchema, type ContactFieldErrors } from "@/lib/contact-schema";
import { cn } from "@/lib/cn";

type Values = {
  subject: InquiryValue;
  name: string;
  email: string;
  phone: string;
  message: string;
};

const SUBJECTS = inquiryTypes.map((t) => t.value) as InquiryValue[];

function isSubject(v: string | null): v is InquiryValue {
  return v != null && (SUBJECTS as string[]).includes(v);
}

const fieldBase =
  "mt-1.5 w-full rounded-[var(--radius-sm)] border bg-surface px-3.5 py-2.5 text-fg " +
  "outline-none transition-colors placeholder:text-muted/70 focus:border-action-500 " +
  "focus:ring-2 focus:ring-action-200";

export function ContactForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>({
    subject: "general",
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [formError, setFormError] = useState<string | null>(null);

  // Preselect the subject from a ?subject= query (set by service-page CTAs)
  // without useSearchParams, so the page need not be wrapped in Suspense.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("subject");
    if (isSubject(q)) setValues((v) => ({ ...v, subject: q }));
  }, []);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function validateField(key: keyof ContactInputShape) {
    const result = contactSchema.shape[key].safeParse(values[key]);
    setErrors((e) => ({
      ...e,
      [key]: result.success ? undefined : result.error.issues.map((i) => i.message),
    }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors as ContactFieldErrors;
      setErrors(fieldErrors);
      setStatus("error");
      // Focus the first invalid field.
      const firstKey = Object.keys(fieldErrors)[0];
      if (firstKey) formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const honeypot = (formRef.current?.elements.namedItem("company") as HTMLInputElement)?.value;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, company: honeypot ?? "" }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }
      router.push("/contact/thank-you");
    } catch (err) {
      setStatus("error");
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const submitting = status === "submitting";

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      className="rounded-[var(--radius-xl)] border border-line bg-surface p-6 shadow-card sm:p-8"
    >
      {/* honeypot, visually hidden, off the tab order */}
      <div aria-hidden className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company (leave blank)</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Field label="What's this about?" htmlFor="subject" error={errors.subject}>
        <select
          id="subject"
          name="subject"
          value={values.subject}
          onChange={(e) => set("subject", e.target.value as InquiryValue)}
          className={cn(fieldBase, errors.subject ? "border-red-500" : "border-line")}
        >
          {inquiryTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            onBlur={() => validateField("name")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={cn(fieldBase, errors.name ? "border-red-500" : "border-line")}
          />
        </Field>

        <Field label="Business email" htmlFor="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            onBlur={() => validateField("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(fieldBase, errors.email ? "border-red-500" : "border-line")}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Phone" htmlFor="phone" optional error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            onBlur={() => validateField("phone")}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={cn(fieldBase, errors.phone ? "border-red-500" : "border-line")}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Message" htmlFor="message" error={errors.message}>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            onBlur={() => validateField("message")}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={cn(
              fieldBase,
              "resize-y",
              errors.message ? "border-red-500" : "border-line",
            )}
          />
        </Field>
      </div>

      {formError && (
        <p role="alert" className="mt-5 rounded-[var(--radius-sm)] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className={cn(
          "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-medium text-white transition-all duration-300 ease-[var(--ease-quint)] active:scale-[0.99]",
          submitting
            ? "cursor-not-allowed bg-action-400"
            : "bg-action-500 hover:-translate-y-0.5 hover:bg-action-600 hover:shadow-lift",
        )}
      >
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

type ContactInputShape = Omit<Values, never>;

function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string[];
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-heading">
        {label}
        {optional && <span className="ml-1.5 font-normal text-muted">(optional)</span>}
      </label>
      {children}
      {error?.[0] && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-sm text-red-400">
          {error[0]}
        </p>
      )}
    </div>
  );
}
