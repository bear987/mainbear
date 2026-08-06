import { tickerItems } from "../content/site";

/**
 * Monospace capability ticker — a machine readout running under the hero.
 * Pure CSS marquee: the list is rendered twice and translated -50%, so the
 * loop is seamless with no JavaScript. Stops under reduced motion.
 */
export function Ticker() {
  const items = [...tickerItems];

  return (
    <div className="relative overflow-hidden border-y border-line bg-ink py-3">
      <div className="ticker-track flex w-max">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {items.map((item) => (
              <li
                key={`${copy}-${item}`}
                className="flex items-center whitespace-nowrap px-6 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[#cfcdc7]"
              >
                <span className="mr-6 text-action-500">■</span>
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
