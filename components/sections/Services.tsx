import Link from "next/link";
import { ArrowRight, ClipboardList, PlugZap, Wrench } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const services = [
  {
    icon: ClipboardList,
    title: "Étude et conception",
    text: "Visite technique, analyse de votre tableau et de la puissance disponible, choix de la borne et de son emplacement. Vous savez précisément ce qui sera installé, et pourquoi.",
  },
  {
    icon: PlugZap,
    title: "Installation",
    text: "Pose de la borne, création de la ligne dédiée et des protections électriques, mise en service et prise en main. Un chantier propre, conforme aux normes en vigueur.",
  },
  {
    icon: Wrench,
    title: "Maintenance",
    text: "Contrôles périodiques, diagnostic et dépannage pour que votre borne reste sûre et disponible. Un service particulièrement utile pour les bornes partagées.",
    href: "/maintenance",
  },
];

/** « Nos services » : étude et conception, installation, maintenance. */
export function Services() {
  return (
    <Section tone="dark" labelledBy="services">
      <SectionHeading
        id="services"
        eyebrow="Bornes de recharge"
        title="De la conception à la maintenance de votre borne"
        intro="Nous prenons en charge votre projet de recharge de A à Z : un seul interlocuteur, pas d'intervenants à coordonner."
      />
      <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-3">
        {services.map(({ icon: Icon, title, text, href }, i) => (
          <li key={title} className="flex flex-col bg-graphite p-8">
            <div className="flex items-center justify-between">
              <Icon aria-hidden className="size-8 text-brand" />
              <span aria-hidden className="font-display text-sm font-semibold text-white/30">
                0{i + 1}
              </span>
            </div>
            <h3 className="mt-6 font-display text-xl font-semibold">{title}</h3>
            <p className="mt-3 leading-relaxed text-muted">{text}</p>
            {href && (
              <Link href={href} className="mt-6 inline-flex items-center gap-1.5 font-semibold text-brand-bright hover:text-white">
                En savoir plus sur la maintenance
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}
