import Image from "next/image";
import type { Realisation } from "@/lib/content/realisations";

/** Carte d'une réalisation : photo, prestation, type de client, ville. */
export function RealisationCard({ r }: { r: Realisation }) {
  return (
    <article className="overflow-hidden rounded-xl border border-white/10 bg-graphite">
      <div className="relative aspect-[4/3] bg-graphite-2">
        {r.image && (
          <Image
            src={r.image.src}
            alt={r.image.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        <span className="absolute top-3 left-3 rounded-full bg-ink/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {r.serviceLabel}
        </span>
      </div>
      <div className="p-6">
        <p className="text-sm font-medium text-brand-bright">
          {r.clientType} · {r.city}
        </p>
        <h3 className="mt-2 font-display text-lg font-semibold">{r.title}</h3>
        <p className="mt-2 text-muted">{r.description}</p>
      </div>
    </article>
  );
}
