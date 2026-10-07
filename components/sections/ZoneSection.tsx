import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cities, cityPath, electricianPages, electricianPath, otherTowns } from "@/lib/content/cities";
import { MapFacade } from "./MapFacade";

/** Zone d'intervention : carte (au clic) + liste des villes avec liens vers les pages locales. */
export function ZoneSection({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
  return (
    <Section tone="dark" labelledBy="zone">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            as={headingAs}
            id="zone"
            eyebrow="Zone d'intervention"
            title="Basés à Herblay-sur-Seine, nous intervenons dans le Val-d'Oise et en Île-de-France"
            intro="La proximité compte : pour un dépannage, pour la visite technique, pour les travaux et pour le suivi de votre installation dans le temps."
          />
          <h3 className="mt-10 font-display text-lg font-semibold">Électricien près de chez vous</h3>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {cities
              .filter((c) => electricianPages[c.slug])
              .map((c) => (
                <li key={c.slug}>
                  <Link
                    href={electricianPath(c.slug)}
                    className="group flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-graphite px-4 py-3 transition-colors hover:border-brand/60"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin aria-hidden className="size-4 text-brand-bright" />
                      Électricien {c.name}
                    </span>
                    <ArrowRight aria-hidden className="size-4 text-muted transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
          </ul>
          <h3 className="mt-8 font-display text-lg font-semibold">Bornes de recharge près de chez vous</h3>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {cities.map((c) => (
              <li key={c.slug}>
                <Link
                  href={cityPath(c.slug)}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-graphite px-4 py-3 transition-colors hover:border-brand/60"
                >
                  <span className="flex items-center gap-2">
                    <MapPin aria-hidden className="size-4 text-brand-bright" />
                    Borne de recharge {c.name}
                  </span>
                  <ArrowRight aria-hidden className="size-4 text-muted transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="mt-8 font-display text-lg font-semibold">Nous intervenons aussi à</h3>
          <p className="mt-3 leading-relaxed text-muted">{otherTowns.join(" · ")} et dans toute l&apos;Île-de-France.</p>
          {headingAs === "h2" && (
            <Link href="/zone-intervention" className="mt-6 inline-flex items-center gap-1.5 font-semibold text-brand-bright hover:text-white">
              Voir toute la zone d&apos;intervention <ArrowRight aria-hidden className="size-4" />
            </Link>
          )}
        </div>
        <MapFacade />
      </div>
    </Section>
  );
}
