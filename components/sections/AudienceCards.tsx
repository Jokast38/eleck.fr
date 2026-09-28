import Link from "next/link";
import { ArrowRight, Building2, Home, Factory } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const audiences = [
  {
    icon: Home,
    title: "Particuliers",
    href: "/particuliers",
    text: "Rechargez chez vous, la nuit, en toute sécurité. Une borne adaptée à votre maison, à votre véhicule et à votre abonnement.",
    points: ["Recharge plus rapide qu'une prise classique", "Programmation en heures creuses", "Pose soignée, garage ou extérieur"],
  },
  {
    icon: Building2,
    title: "Copropriétés",
    href: "/coproprietes",
    text: "Droit à la prise ou infrastructure collective : nous accompagnons syndics, conseils syndicaux et copropriétaires jusqu'au vote en AG.",
    points: ["Étude de la puissance disponible", "Dossier clair pour l'assemblée générale", "Solution évolutive et refacturation"],
  },
  {
    icon: Factory,
    title: "Entreprises",
    href: "/entreprises",
    text: "Équipez votre flotte, vos salariés et vos visiteurs. Une solution dimensionnée pour votre site et vos usages.",
    points: ["Flottes et véhicules de service", "Avantage pour les salariés, image RSE", "Contrôle d'accès et supervision"],
  },
];

/** 3 cartes « Pour qui ? » menant vers les pages dédiées. */
export function AudienceCards({ tone = "light" }: { tone?: "light" | "dark" }) {
  const light = tone === "light";
  return (
    <Section tone={light ? "light" : "dark"} labelledBy="pour-qui">
      <SectionHeading
        id="pour-qui"
        tone={tone}
        eyebrow="Bornes de recharge · Pour qui ?"
        title="Une solution de recharge adaptée à votre situation"
        intro="Chaque projet est différent. Nous adaptons l'étude, le matériel et l'accompagnement à votre profil."
      />
      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {audiences.map(({ icon: Icon, title, href, text, points }) => (
          <li key={href}>
            <Link
              href={href}
              className={
                light
                  ? "group flex h-full flex-col rounded-xl border border-black/10 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
                  : "group flex h-full flex-col rounded-xl border border-white/10 bg-graphite p-7 transition hover:-translate-y-0.5 hover:border-brand/50"
              }
            >
              <span className="flex size-12 items-center justify-center rounded-lg bg-ink text-white">
                <Icon aria-hidden className="size-6" />
              </span>
              <h3 className="mt-6 font-display text-2xl font-semibold">{title}</h3>
              <p className={`mt-3 leading-relaxed ${light ? "text-muted-dark" : "text-muted"}`}>{text}</p>
              <ul className={`mt-5 space-y-2 text-[0.95rem] ${light ? "text-ink" : "text-white/85"}`}>
                {points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span aria-hidden className="mt-2 h-[3px] w-3 shrink-0 bg-brand" />
                    {p}
                  </li>
                ))}
              </ul>
              <span className={`mt-auto inline-flex items-center gap-1.5 pt-7 font-semibold ${light ? "text-brand" : "text-brand-bright"}`}>
                Découvrir la solution {title.toLowerCase()}
                <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
