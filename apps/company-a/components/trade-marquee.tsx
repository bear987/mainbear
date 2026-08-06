/**
 * Infinite capabilities ticker: the group's real trade vocabulary drifting in
 * one continuous band. Two identical halves + a -50% translate loop make it
 * seamless; the global reduced-motion rule freezes it.
 */
const items = [
  "Importation",
  "Exportation",
  "Wholesale",
  "Retail",
  "Customs clearing",
  "Warehousing",
  "Distribution",
  "Partnerships",
  "Investments",
  "Lagos, Nigeria",
];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-10 pr-10"
    >
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-10 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.22em] text-muted"
        >
          <span aria-hidden className="h-1 w-1 rounded-full bg-action-500/70" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function TradeMarquee() {
  return (
    <div className="overflow-hidden border-y border-line bg-surface py-5">
      <div className="marquee-track flex">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
