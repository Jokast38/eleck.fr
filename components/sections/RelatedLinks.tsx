import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type RelatedLink = { href: string; title: string; text: string };

/** « Voir aussi » : liens vers les prestations voisines (maillage interne). */
export function RelatedLinks({
  title = "Nos autres prestations électriques",
  eyebrow = "Voir aussi",
  items,
}: {
  title?: string;
  eyebrow?: string;
  items: RelatedLink[];
}) {
  return (
    <Section tone="graphite" labelledBy="voir-aussi">
      <SectionHeading id="voir-aussi" eyebrow={eyebrow} title={title} />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group flex h-full flex-col rounded-xl border border-white/10 bg-ink p-6 transition hover:-translate-y-0.5 hover:border-brand/60"
            >
              <span className="font-display text-lg font-semibold">{l.title}</span>
              <span className="mt-2 text-[0.95rem] leading-relaxed text-muted">{l.text}</span>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand-bright">
                Découvrir <span className="sr-only">{l.title}</span>
                <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** Prestations d'électricité générale, pour le « Voir aussi » des pages d'électricité. */
export const electricityLinks: RelatedLink[] = [
  { href: "/depannage-electrique", title: "Dépannage électrique", text: "Panne de courant, disjoncteur qui saute, prise ou éclairage hors service." },
  { href: "/renovation-electrique", title: "Rénovation et mise aux normes", text: "Mise en sécurité et rénovation de votre installation selon la NF C 15-100." },
  { href: "/tableau-electrique", title: "Tableau électrique", text: "Remplacement ou mise à niveau, protections différentielles 30 mA." },
  { href: "/electricite-tertiaire-industrielle", title: "Électricité tertiaire et industrielle", text: "Installation, mise en conformité et maintenance pour les professionnels." },
  { href: "/particuliers", title: "Borne de recharge", text: "Installation certifiée IRVE à domicile, en copropriété et en entreprise." },
];

/** Liens « Voir aussi » d'une page, sans la page elle-même (4 au maximum). */
export const relatedElectricity = (currentHref: string) => electricityLinks.filter((l) => l.href !== currentHref).slice(0, 4);
