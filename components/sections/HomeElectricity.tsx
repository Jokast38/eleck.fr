import Link from "next/link";
import { ArrowRight, Gauge, ShieldCheck, Zap } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const items = [
  {
    icon: Zap,
    title: "Dépannage électrique",
    href: "/depannage-electrique",
    text: "Panne de courant, disjoncteur qui saute, prises ou éclairage hors service : nous trouvons la cause et remettons votre installation en service.",
    points: ["Recherche de panne", "Disjoncteur ou différentiel qui déclenche", "Prises, interrupteurs, éclairage"],
  },
  {
    icon: ShieldCheck,
    title: "Rénovation et mise aux normes",
    href: "/renovation-electrique",
    text: "Mise en sécurité et rénovation de votre installation selon la norme NF C 15-100, en maison comme en appartement.",
    points: ["Mise à la terre et différentiel 30 mA", "Rénovation partielle ou complète", "Correction des anomalies d'un diagnostic"],
  },
  {
    icon: Gauge,
    title: "Tableau électrique",
    href: "/tableau-electrique",
    text: "Remplacement d'un tableau ancien ou saturé, ajout de protections et de circuits pour vos nouveaux équipements.",
    points: ["Remplacement complet", "Protections différentielles", "Nouveaux circuits (cuisine, borne…)"],
  },
];

/** Accueil : électricité générale (dépannage, rénovation, tableau), activité principale d'elec k. */
export function HomeElectricity() {
  return (
    <Section tone="dark" labelledBy="electricite">
      <SectionHeading
        id="electricite"
        eyebrow="Électricité générale"
        title="Votre électricien pour la maison et les locaux professionnels"
        intro="Une panne, une installation à remettre aux normes, un tableau à remplacer : nos électriciens interviennent à Herblay-sur-Seine et dans tout le Val-d'Oise."
      />
      <ul className="mt-12 grid gap-6 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, href, text, points }) => (
          <li key={href}>
            <Link href={href} className="group flex h-full flex-col rounded-xl border border-white/10 bg-graphite p-7 transition hover:-translate-y-0.5 hover:border-brand/60">
              <h3 className="flex items-center gap-3 font-display text-xl font-semibold">
                <Icon aria-hidden className="size-6 shrink-0 text-brand" />
                {title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted">{text}</p>
              <ul className="mt-5 space-y-2 text-[0.95rem] text-white/85">
                {points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span aria-hidden className="mt-2 h-[3px] w-3 shrink-0 bg-brand" />
                    {p}
                  </li>
                ))}
              </ul>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-7 font-semibold text-brand-bright">
                Découvrir <span className="sr-only">{title}</span>
                <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/electricite-tertiaire-industrielle" className="mt-10 inline-flex items-center gap-1.5 font-semibold text-brand-bright hover:text-white">
        Professionnels : électricité tertiaire et industrielle <ArrowRight aria-hidden className="size-4" />
      </Link>
    </Section>
  );
}
