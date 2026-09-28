import { Container } from "@/components/ui/Container";
import { CtaButton } from "@/components/ui/CtaButton";
import { PhoneLink } from "@/components/ui/PhoneLink";

/** Bloc d'appel à l'action final, présent en bas de chaque page. */
export function FinalCta({
  title = "Parlons de votre projet",
  text = "Décrivez votre besoin en quelques minutes. Nous revenons vers vous pour préciser votre projet et vous remettre un devis détaillé, gratuit et sans engagement.",
  service,
}: {
  title?: string;
  text?: string;
  /** Prestation présélectionnée dans le formulaire de devis */
  service?: string;
}) {
  return (
    <section aria-labelledby="cta-final" className="bg-ink py-16 sm:py-20">
      <Container>
        <div className="relative isolate overflow-hidden rounded-2xl border border-white/10 bg-graphite px-6 py-12 sm:px-12 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:py-14">
          <div aria-hidden className="absolute -bottom-24 -left-24 -z-10 size-72 rounded-full bg-brand/25 blur-[100px]" />
          <div className="max-w-2xl">
            <h2 id="cta-final" className="heading-underline font-display text-3xl font-semibold sm:text-4xl">
              {title}
            </h2>
            <p className="mt-6 text-lg text-white/80">{text}</p>
          </div>
          <div className="mt-8 flex shrink-0 flex-col gap-4 sm:flex-row lg:mt-0 lg:flex-col xl:flex-row">
            <CtaButton size="lg" service={service} />
            <PhoneLink variant="outline" className="h-14" />
          </div>
        </div>
      </Container>
    </section>
  );
}
