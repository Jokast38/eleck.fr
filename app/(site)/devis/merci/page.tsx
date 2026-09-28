import Link from "next/link";
import { CheckCircle2, Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ConversionEvent } from "@/components/analytics/ConversionEvent";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Demande envoyée",
  description: "Votre demande de devis a bien été envoyée à elec k.",
  path: "/devis/merci",
  noindex: true,
});

const nextSteps = [
  "Vous recevez un e-mail de confirmation avec le récapitulatif de votre demande.",
  "Nous étudions votre projet et vous recontactons pour en préciser les détails.",
  "Si nécessaire, nous organisons une visite technique, puis vous remettons un devis détaillé.",
];

export default function MerciPage() {
  return (
    <section aria-labelledby="page-title" className="relative isolate overflow-hidden bg-ink">
      <ConversionEvent name="Demande devis" />
      <div aria-hidden className="absolute -top-40 left-1/2 -z-10 size-[34rem] -translate-x-1/2 rounded-full bg-brand/20 blur-[140px]" />
      <Container className="flex min-h-[70svh] flex-col items-center justify-center py-20 text-center">
        <CheckCircle2 aria-hidden className="size-16 text-brand-bright" />
        <h1 id="page-title" className="heading-underline heading-underline-center mt-6 font-display text-4xl font-semibold sm:text-5xl">
          Merci, votre demande est envoyée
        </h1>
        <p className="mt-8 max-w-xl text-lg text-white/80">Nous avons bien reçu votre projet. Voici la suite :</p>
        <ol className="mt-8 max-w-xl space-y-4 text-left">
          {nextSteps.map((s, i) => (
            <li key={s} className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand font-semibold text-white">{i + 1}</span>
              <span className="pt-1 text-white/85">{s}</span>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-muted">Une question d&apos;ici là ?</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <a href={site.phone.href} className="plausible-event-name=Clic+telephone inline-flex h-12 items-center justify-center gap-2 rounded-md border-2 border-white/70 px-5 font-semibold hover:bg-white hover:text-ink">
            <Phone aria-hidden className="size-4" /> {site.phone.display}
          </a>
          <a href={`mailto:${site.email}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-md px-5 font-semibold hover:bg-white/10">
            <Mail aria-hidden className="size-4" /> {site.email}
          </a>
        </div>
        <Link href="/" className="mt-10 text-sm text-muted underline underline-offset-4 hover:text-white">
          Retour à l&apos;accueil
        </Link>
      </Container>
    </section>
  );
}
