import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPublishedRealisations } from "@/lib/content/queries";
import type { ServiceKey } from "@/lib/content/services";
import { RealisationCard } from "./RealisationCard";
import { RealisationsFilter } from "./RealisationsFilter";

/**
 * Grille des réalisations publiées depuis le dashboard.
 * - `service` : n'affiche que les chantiers d'une prestation (pages de service) ;
 * - `hideWhenEmpty` : la section disparaît tant qu'aucun chantier n'est publié (aucun chantier fictif) ;
 * - `filterable` : filtres par prestation (page Réalisations).
 */
export async function RealisationsGrid({
  limit,
  service,
  withHeading = true,
  hideWhenEmpty = false,
  filterable = false,
  title = "Nos derniers chantiers",
  intro = "Bornes de recharge, éclairage LED, électricité : quelques chantiers réalisés par nos équipes.",
}: {
  limit?: number;
  service?: ServiceKey;
  withHeading?: boolean;
  hideWhenEmpty?: boolean;
  filterable?: boolean;
  title?: string;
  intro?: string;
}) {
  const items = await getPublishedRealisations(limit, service);
  if (!items.length && hideWhenEmpty) return null;

  return (
    <Section tone="dark" labelledBy={withHeading ? "realisations" : undefined}>
      {withHeading && (
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="realisations" eyebrow="Réalisations" title={title} intro={intro} />
          {items.length > 0 && limit && (
            <Link href="/realisations" className="inline-flex items-center gap-1.5 font-semibold text-brand-bright hover:text-white">
              Voir toutes les réalisations <ArrowRight aria-hidden className="size-4" />
            </Link>
          )}
        </div>
      )}
      {items.length > 0 ? (
        filterable ? (
          <RealisationsFilter items={items} />
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((r) => (
              <RealisationCard key={r.slug} r={r} />
            ))}
          </div>
        )
      ) : (
        <div className="mt-12 flex flex-col items-center rounded-xl border border-dashed border-white/20 px-6 py-14 text-center">
          <Camera aria-hidden className="size-10 text-brand" />
          <p className="mt-4 max-w-md text-lg text-white/85">Nos premières réalisations seront publiées ici très prochainement.</p>
          <p className="mt-2 max-w-md text-muted">
            Vous souhaitez voir des exemples de chantiers proches de votre projet ? Demandez-les lors de notre échange.
          </p>
        </div>
      )}
    </Section>
  );
}
