"use client";

import { useState } from "react";
import type { Realisation } from "@/lib/content/realisations";
import { services, type ServiceKey } from "@/lib/content/services";
import { cn } from "@/lib/utils";
import { RealisationCard } from "./RealisationCard";

/** Filtre des réalisations par prestation (page Réalisations). Seules les prestations présentes sont proposées. */
export function RealisationsFilter({ items }: { items: Realisation[] }) {
  const [active, setActive] = useState<ServiceKey | "ALL">("ALL");
  const available = services.filter((s) => items.some((r) => r.service === s.key));
  const shown = active === "ALL" ? items : items.filter((r) => r.service === active);

  return (
    <>
      {available.length > 1 && (
        <div role="group" aria-label="Filtrer par prestation" className="mt-12 flex flex-wrap gap-2">
          {[{ key: "ALL" as const, label: "Toutes" }, ...available].map((s) => (
            <button
              key={s.key}
              type="button"
              aria-pressed={active === s.key}
              onClick={() => setActive(s.key)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active === s.key ? "border-brand bg-brand text-white" : "border-white/15 text-white/85 hover:border-white/40",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {shown.length} réalisation{shown.length > 1 ? "s" : ""} affichée{shown.length > 1 ? "s" : ""}
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((r) => (
          <RealisationCard key={r.slug} r={r} />
        ))}
      </div>
    </>
  );
}
