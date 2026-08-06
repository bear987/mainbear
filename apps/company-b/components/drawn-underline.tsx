/**
 * Signature: a hand-drawn underline that draws itself in when the surrounding
 * Reveal becomes visible (CSS animates .draw-path via pathLength math).
 * Place directly under a heading, inside a <Reveal>.
 */
export function DrawnUnderline({ className = "w-40" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 220 14"
      fill="none"
      className={`${className} mt-3 text-action-500`}
    >
      <path
        className="draw-path"
        d="M4 10 C 42 4, 78 12, 118 7 S 186 4, 216 9"
        pathLength={1}
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
