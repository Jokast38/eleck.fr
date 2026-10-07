import Link from "next/link";
import { ArrowRight, Cable, Lightbulb, ScanLine } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LedArt, PanelArt, ThermoArt } from "@/components/home/ServiceArt";

const items = [
  {
    icon: Lightbulb,
    art: <LedArt uid="os" className="h-28 w-full" />,
    title: "Éclairage LED",
    href: "/eclairage-led",
    text: "Relamping et éclairage technique pour commerces, bureaux, entrepôts et collectivités. Moins de consommation, moins d'entretien.",
    points: ["Remplacement d'éclairages existants", "Éclairage de rayons, ateliers, parkings", "Choix de luminaires adaptés à l'usage"],
  },
  {
    icon: Cable,
    art: <PanelArt uid="os" className="h-28 w-full" />,
    title: "Électricité tertiaire et industrielle",
    href: "/electricite-tertiaire-industrielle",
    text: "Installation, mise en conformité, maintenance préventive et dépannage de vos installations électriques professionnelles.",
    points: ["Travaux neufs et rénovation", "Contrats de maintenance préventive", "Dépannage et maintenance curative"],
  },
  {
    icon: ScanLine,
    art: <ThermoArt uid="os" className="h-28 w-full" />,
    title: "Thermographie infrarouge",
    href: "/thermographie",
    text: "Contrôle de vos tableaux et équipements par caméra thermique, sous tension, pour repérer les anomalies avant la panne.",
    points: ["Détection des échauffements anormaux", "Contrôle sans coupure de l'activité", "Rapport avec images thermiques"],
  },
];

/** « Pour les professionnels » : électricité tertiaire et industrielle, éclairage LED, thermographie. */
export function OtherServices() {
  return (
    <Section tone="graphite" labelledBy="autres-expertises">
      <SectionHeading
        id="autres-expertises"
        eyebrow="Pour les professionnels"
        title="Électricité tertiaire, éclairage LED et thermographie"
        intro="elec k s'est construit sur l'électricité tertiaire et industrielle et sur l'éclairage LED. Commerces, bureaux, ateliers et collectivités nous confient leurs installations."
      />
      <ul className="mt-12 grid gap-6 lg:grid-cols-3">
        {items.map(({ icon: Icon, art, title, href, text, points }) => (
          <li key={href}>
            <Link href={href} className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-ink transition hover:-translate-y-0.5 hover:border-brand/60">
              <div className="border-b border-white/10 bg-[radial-gradient(ellipse_at_top,rgba(227,6,19,0.12),transparent_70%)] px-6 py-5">{art}</div>
              <div className="flex flex-1 flex-col p-7">
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
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
