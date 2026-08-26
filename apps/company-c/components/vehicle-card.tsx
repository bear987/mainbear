import Link from "next/link";
import type { Vehicle } from "../content/vehicles";
import { bodyTypeLabels, capacityOf, statusLabels } from "../content/vehicles";
import { VehicleImage } from "./vehicle-image";

/**
 * One model as a boxed cell on the exposed grid. Used where a compact
 * card reads better than the ledger, such as related models at the foot
 * of a model page. Hover lifts the cell onto a hard stamped shadow.
 */
export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <article className="group relative flex flex-col border border-line bg-surface transition-all duration-200 ease-[var(--ease-quint)] hover:-translate-x-1 hover:-translate-y-1 hover:border-line-strong hover:shadow-lift">
      <VehicleImage
        slug={vehicle.slug}
        alt={`${vehicle.brand} ${vehicle.name}, ${vehicle.variant}`}
        sizes="(max-width: 640px) 100vw, 33vw"
        className="aspect-[4/3] border-b border-line"
      />

      <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-2.5">
        <span className="stamp">
          {vehicle.brand} / {bodyTypeLabels[vehicle.bodyType]}
        </span>
        <span
          className={`stamp px-2 py-1 ${
            vehicle.status === "available"
              ? "border border-line text-ink"
              : "bg-elevated text-muted"
          }`}
        >
          {statusLabels[vehicle.status]}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-5">
        <h3 className="text-[1.3rem] leading-[1.05]">
          <Link href={`/inventory/${vehicle.slug}`} className="before:absolute before:inset-0">
            {vehicle.name}
          </Link>
        </h3>

        <p className="stamp mt-2">
          {vehicle.variant} / <span className="tnum">{capacityOf(vehicle)}</span>
        </p>

        <p className="stamp mt-auto pt-5 text-action-600">Price on enquiry</p>
      </div>
    </article>
  );
}
