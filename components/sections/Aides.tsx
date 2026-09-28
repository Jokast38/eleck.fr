import { ExternalLink, Info } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Aides financières : section volontairement informative, SANS montant.
 * Les montants et conditions changent régulièrement (lois de finances, programme ADVENIR) :
 * ils doivent être vérifiés sur les sources officielles avant toute mention chiffrée.
 */
const aides = [
  {
    title: "Programme ADVENIR",
    who: "Copropriétés, entreprises, collectivités",
    text: "Programme national qui finance une partie de l'installation de points de recharge, sous conditions. L'installateur doit être labellisé ADVENIR pour que la prime soit versée.",
    source: { label: "advenir.mobi", href: "https://advenir.mobi/" },
  },
  {
    title: "Avantages fiscaux pour les particuliers",
    who: "Particuliers (résidence principale ou secondaire)",
    text: "Un crédit d'impôt et un taux de TVA réduit ont été prévus pour l'installation d'une borne à domicile, selon des conditions et des périodes fixées par la loi de finances.",
    source: { label: "service-public.fr", href: "https://www.service-public.fr/" },
  },
  {
    title: "Aides locales",
    who: "Selon votre commune ou votre région",
    text: "Certaines collectivités proposent des aides complémentaires. Nous vous aidons à identifier celles qui s'appliquent à votre projet.",
  },
];

export function Aides() {
  return (
    <Section tone="light" labelledBy="aides">
      <SectionHeading
        id="aides"
        tone="light"
        eyebrow="Financement"
        title="Des aides pour alléger le coût de votre borne"
        intro="Selon votre profil, une partie de votre installation peut être financée. Nous vous indiquons les dispositifs applicables au moment du devis."
      />
      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {aides.map((a) => (
          <li key={a.title} className="flex flex-col rounded-xl border border-black/10 bg-white p-7">
            <h3 className="font-display text-xl font-semibold">{a.title}</h3>
            <p className="mt-1 text-sm font-medium text-muted-dark">{a.who}</p>
            <p className="mt-4 leading-relaxed text-muted-dark">{a.text}</p>
            {a.source && (
              <a
                href={a.source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-ink underline-offset-4 hover:underline"
              >
                Source officielle : {a.source.label}
                <ExternalLink aria-hidden className="size-3.5" />
                <span className="sr-only">(nouvel onglet)</span>
              </a>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-8 flex gap-3 rounded-lg border border-black/10 bg-white p-4 text-sm text-muted-dark">
        <Info aria-hidden className="size-5 shrink-0 text-ink" />
        Les montants, plafonds et conditions d&apos;éligibilité évoluent régulièrement. Ils sont vérifiés et précisés dans
        chaque devis.
      </p>
    </Section>
  );
}
