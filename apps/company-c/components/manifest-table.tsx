import Link from "next/link";
import type { Vehicle } from "../content/vehicles";
import { bodyTypeLabels, capacityOf, statusLabels } from "../content/vehicles";
import { formatNaira } from "../lib/format";

/**
 * The range as a hard ledger rather than a card carousel. One markup path:
 * a ruled table on desktop, stacked rows on a phone. Every figure is
 * tabular so the column reads as a column.
 */
export function ManifestTable({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <div className="border border-line bg-surface">
      <div className="hidden border-b border-line bg-elevated px-4 py-2 md:grid md:grid-cols-[minmax(0,1fr)_7rem_8rem_9rem_6rem] md:gap-4">
        {["Model", "Type", "Capacity", "Price from", "Status"].map((head) => (
          <span key={head} className="stamp">
            {head}
          </span>
        ))}
      </div>

      <ul>
        {vehicles.map((vehicle) => (
          <li key={vehicle.slug} className="border-b border-line last:border-b-0">
            <Link
              href={`/inventory/${vehicle.slug}`}
              className="group grid gap-2 px-4 py-4 transition-colors duration-150 hover:bg-elevated md:grid-cols-[minmax(0,1fr)_7rem_8rem_9rem_6rem] md:items-center md:gap-4"
            >
              <span className="flex items-baseline gap-2">
                <span className="stamp text-action-600">{vehicle.brand}</span>
                <span className="text-[1.05rem] font-medium uppercase leading-tight tracking-[-0.02em] text-heading">
                  {vehicle.name}
                </span>
              </span>

              <span className="stamp">
                {bodyTypeLabels[vehicle.bodyType]}
                <span className="md:hidden"> · {capacityOf(vehicle)}</span>
              </span>

              <span className="stamp tnum hidden md:block">{capacityOf(vehicle)}</span>

              <span
                className={`tnum font-mono text-[0.95rem] font-semibold ${
                  vehicle.status === "available" ? "text-action-600" : "text-muted"
                }`}
              >
                {vehicle.status === "available" ? formatNaira(vehicle.priceFromNGN) : "Coming soon"}
              </span>

              <span
                className={`stamp justify-self-start px-2 py-1 md:justify-self-end ${
                  vehicle.status === "available"
                    ? "border border-line text-ink"
                    : "bg-elevated text-muted"
                }`}
              >
                {statusLabels[vehicle.status]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
