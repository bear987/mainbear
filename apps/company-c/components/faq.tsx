export type Faq = { question: string; answer: string };

/**
 * Objection handling as a ruled ledger. Built on <details> so it works
 * with the keyboard, with a screen reader, and with JavaScript disabled.
 */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="border-t border-line">
      {faqs.map((faq) => (
        <details key={faq.question} className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 transition-colors duration-150 hover:text-heading">
            <h3 className="text-[1.05rem] font-medium normal-case tracking-[-0.01em]">
              {faq.question}
            </h3>
            <span
              aria-hidden
              className="mt-1 shrink-0 font-mono text-lg leading-none text-action-600 transition-transform duration-200 ease-[var(--ease-quint)] group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="max-w-[62ch] pb-6 text-fg">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}

/** FAQPage structured data for the same list. */
export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
