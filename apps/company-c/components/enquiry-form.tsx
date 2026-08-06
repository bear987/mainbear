"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { track } from "../lib/analytics";

type Variant = "general" | "wholesale";
type Errors = Record<string, string>;

const labelClass = "stamp block text-ink";
const fieldClass =
  "mt-2 w-full border border-line bg-paper px-3 py-3 text-[0.95rem] text-ink " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-500";

function validate(variant: Variant, data: FormData): Errors {
  const errors: Errors = {};
  const value = (key: string) => String(data.get(key) ?? "").trim();

  if (value("name").length < 2) errors.name = "Enter the name we should ask for.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("email")))
    errors.email = "Enter an email we can reply to, like name@company.com.";
  if (value("phone").replace(/\D/g, "").length < 10)
    errors.phone = "Enter a phone number with at least 10 digits.";
  if (value("message").length < 10)
    errors.message = "Tell us a little more so we can answer properly.";

  if (variant === "wholesale") {
    if (value("company").length < 2) errors.company = "Enter your company or fleet name.";
    const quantity = Number(value("quantity"));
    if (!Number.isFinite(quantity) || quantity < 2)
      errors.quantity = "Wholesale starts at 2 units. Enter how many you need.";
  }

  return errors;
}

/**
 * Enquiry form. Visible labels, validation on blur with a specific message
 * per field, a shake on a failed submit, and a success state on the button
 * itself before the thank-you page loads. The honeypot field is invisible
 * to people and irresistible to bots.
 */
export function EnquiryForm({ variant = "general" }: { variant?: Variant }) {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [shake, setShake] = useState(false);

  const isWholesale = variant === "wholesale";

  const onBlur = (event: React.FocusEvent<HTMLFormElement>) => {
    // The blur bubbles from a field, so the event target is the field.
    const target = event.target as unknown as HTMLInputElement | HTMLTextAreaElement;
    if (!target.name || target.name === "website" || !target.form) return;
    const data = new FormData(target.form);
    const found = validate(variant, data);
    setErrors((current) => ({ ...current, [target.name]: found[target.name] ?? "" }));
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const found = validate(variant, data);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setShake(true);
      window.setTimeout(() => setShake(false), 420);
      const firstField = Object.keys(found)[0];
      form.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus();
      return;
    }

    setState("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(data), enquiryType: variant }),
      });
      if (!response.ok) throw new Error("Request failed");

      setState("sent");
      track("enquiry_submit", {
        form_name: isWholesale ? "wholesale_enquiry" : "general_enquiry",
        enquiry_type: isWholesale ? "wholesale" : "general",
      });
      window.setTimeout(() => router.push("/contact/thank-you"), 600);
    } catch {
      setState("failed");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      onBlur={onBlur}
      noValidate
      className={`border border-line bg-surface p-6 sm:p-8 ${shake ? "animate-shake" : ""}`}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {isWholesale && (
          <Field
            name="company"
            label="Company or fleet name"
            error={errors.company}
            className="sm:col-span-2"
          />
        )}

        <Field name="name" label="Your name" error={errors.name} />
        <Field name="phone" label="Phone number" type="tel" error={errors.phone} />
        <Field
          name="email"
          label="Email address"
          type="email"
          error={errors.email}
          className={isWholesale ? "" : "sm:col-span-2"}
        />

        {isWholesale && (
          <>
            <Field
              name="quantity"
              label="How many units"
              type="number"
              error={errors.quantity}
              inputMode="numeric"
            />
            <Field
              name="models"
              label="Preferred models (optional)"
              error={errors.models}
              className="sm:col-span-2"
            />
          </>
        )}

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="message">
            {isWholesale ? "What do you need, and by when" : "How can we help"}
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={fieldClass}
          />
          {errors.message && (
            <p id="message-error" className="stamp mt-2 text-action-600">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      {/* Honeypot. Hidden from people, left in the DOM for bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Do not fill this in</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state === "sending" || state === "sent"}
          className="border border-ink bg-ink px-6 py-3.5 text-sm font-medium uppercase tracking-[0.08em] text-paper transition-all duration-150 ease-[var(--ease-quint)] hover:-translate-y-0.5 hover:shadow-lift disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {state === "sending" && "Sending…"}
          {state === "sent" && "Enquiry sent"}
          {(state === "idle" || state === "failed") &&
            (isWholesale ? "Send wholesale enquiry" : "Send enquiry")}
        </button>
        <p className="stamp max-w-[32ch]">
          Or call us directly. We reply to WhatsApp the same working day.
        </p>
      </div>

      {state === "failed" && (
        <p role="alert" className="mt-4 border border-action-500 px-4 py-3 text-sm text-action-600">
          That did not send. Check your connection and try again, or reach us on WhatsApp and we
          will pick it up there.
        </p>
      )}
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  error,
  className = "",
  inputMode,
}: {
  name: string;
  label: string;
  type?: string;
  error?: string;
  className?: string;
  inputMode?: "numeric" | "tel" | "email" | "text";
}) {
  return (
    <div className={className}>
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={fieldClass}
      />
      {error && (
        <p id={`${name}-error`} className="stamp mt-2 text-action-600">
          {error}
        </p>
      )}
    </div>
  );
}
