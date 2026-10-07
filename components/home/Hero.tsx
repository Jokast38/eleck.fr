import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CtaButton } from "@/components/ui/CtaButton";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { IrveBadge } from "@/components/ui/IrveBadge";
import { HeroServices } from "./HeroServices";

// Raccourcis vers les activités (affichés à la place de la mosaïque sur mobile et tablette)
const quickLinks = [
  { href: "/depannage-electrique", label: "Dépannage" },
  { href: "/renovation-electrique", label: "Rénovation" },
  { href: "/tableau-electrique", label: "Tableau électrique" },
  { href: "/particuliers", label: "Bornes de recharge" },
  { href: "/eclairage-led", label: "Éclairage LED" },
  { href: "/thermographie", label: "Thermographie" },
];

/**
 * Hero plein écran. Accroche « électricien » (requête principale du métier), la borne de recharge IRVE
 * en spécialité ; toutes les activités sont visibles immédiatement : sous-titre, raccourcis et mosaïque illustrée.
 * Aucune image lourde : illustrations SVG inline (le LCP est le titre, affiché immédiatement).
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[calc(100svh-var(--header-h))] items-center overflow-hidden bg-ink"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_70%_40%,#000_20%,transparent_70%)]"
      />
      <div aria-hidden className="absolute top-1/4 -right-40 -z-10 size-[36rem] rounded-full bg-brand/25 blur-[140px]" />

      <Container className="grid items-center gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <IrveBadge />
          <h1 id="hero-title" className="mt-6 font-display text-[2.1rem] leading-[1.14] font-semibold sm:text-5xl lg:text-[3.3rem]">
            {/* Soulignement rouge (rappel du logo) dessiné en fond : ne déborde jamais sur la ligne suivante */}
            <span className="bg-[linear-gradient(var(--color-brand),var(--color-brand))] bg-[length:100%_0.11em] bg-[position:0_94%] bg-no-repeat">
              Électricien
            </span>{" "}
            à Herblay et dans tout le <span className="whitespace-nowrap">Val-d&apos;Oise</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">
            Dépannage, rénovation et mise aux normes, tableau électrique : depuis Herblay-sur-Seine, elec k intervient chez
            les particuliers comme chez les professionnels. Installateur certifié IRVE, nous posons aussi des bornes de recharge et réalisons vos
            projets d&apos;éclairage LED et de thermographie infrarouge.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <CtaButton size="lg" />
            <PhoneLink variant="outline" className="h-14" />
          </div>
          <ul aria-label="Nos activités" className="mt-9 flex flex-wrap gap-2 lg:hidden">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-sm font-medium text-white hover:border-brand/60"
                >
                  {l.label} <ArrowRight aria-hidden className="size-3.5 text-brand-bright" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <HeroServices className="hidden lg:block" />
      </Container>
    </section>
  );
}
