import { Container } from "@/components/ui/Container";
import { CtaButton } from "@/components/ui/CtaButton";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";

/** En-tête des pages intérieures : fil d'Ariane, H1 unique, introduction, CTA. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  intro,
  showCta = true,
  ctaService,
  children,
}: {
  /** Prestation présélectionnée dans le formulaire de devis */
  ctaService?: string;
  crumbs: Crumb[];
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  showCta?: boolean;
  /** Contenu optionnel affiché à droite (desktop) */
  children?: React.ReactNode;
}) {
  return (
    <section aria-labelledby="page-title" className="relative isolate overflow-hidden border-b border-white/10 bg-ink">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_80%_20%,#000_10%,transparent_65%)]"
      />
      <div aria-hidden className="absolute -top-32 -right-32 -z-10 size-[28rem] rounded-full bg-brand/20 blur-[120px]" />
      <Container className="py-12 sm:py-16 lg:py-20">
        <Breadcrumbs items={crumbs} />
        <div className={children ? "mt-8 grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]" : "mt-8"}>
          <div className="max-w-3xl">
            {eyebrow && (
              <p className="mb-4 text-sm font-semibold tracking-[0.14em] text-brand-bright uppercase">{eyebrow}</p>
            )}
            <h1 id="page-title" className="font-display text-4xl leading-tight font-semibold sm:text-5xl">
              {title}
            </h1>
            {intro && <div className="mt-6 space-y-4 text-lg leading-relaxed text-white/80">{intro}</div>}
            {showCta && (
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <CtaButton size="lg" service={ctaService} />
                <PhoneLink variant="outline" className="h-14" />
              </div>
            )}
          </div>
          {children && <div>{children}</div>}
        </div>
      </Container>
    </section>
  );
}
