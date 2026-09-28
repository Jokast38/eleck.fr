import { Clock, FileCheck2, Mail, Phone, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Demande de devis gratuit : borne de recharge",
  description:
    "Demandez votre devis gratuit pour installer une borne de recharge : particulier, copropriété ou entreprise. Installateur certifié IRVE.",
  path: "/devis",
});

const reassurance = [
  { icon: FileCheck2, text: "Devis gratuit et sans engagement" },
  { icon: ShieldCheck, text: "Installateur certifié IRVE" },
  { icon: Clock, text: "Quelques minutes pour décrire votre projet" },
];

export default function DevisPage() {
  return (
    <section aria-labelledby="page-title" className="bg-ink">
      <Container className="py-12 sm:py-16">
        <Breadcrumbs items={[{ label: "Demande de devis", href: "/devis" }]} />
        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <h1 id="page-title" className="heading-underline font-display text-4xl font-semibold sm:text-5xl">
              Demandez votre devis gratuit
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/80">
              Décrivez votre projet en quelques étapes. Nous revenons vers vous pour préciser vos besoins et, si
              nécessaire, organiser une visite technique avant de vous remettre un devis détaillé.
            </p>
            <ul className="mt-8 space-y-4">
              {reassurance.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <Icon aria-hidden className="size-5 text-brand-bright" /> {text}
                </li>
              ))}
            </ul>
            <div className="mt-10 rounded-xl border border-white/10 bg-graphite p-6">
              <p className="font-display font-semibold">Vous préférez nous parler ?</p>
              <p className="mt-3 flex items-center gap-3">
                <Phone aria-hidden className="size-5 text-brand-bright" />
                <a href={site.phone.href} className="plausible-event-name=Clic+telephone font-semibold hover:text-brand-bright">
                  {site.phone.display}
                </a>
              </p>
              <p className="mt-2 flex items-center gap-3">
                <Mail aria-hidden className="size-5 text-brand-bright" />
                <a href={`mailto:${site.email}`} className="hover:text-brand-bright">
                  {site.email}
                </a>
              </p>
            </div>
          </div>

          <div id="formulaire" className="rounded-2xl border border-white/10 bg-graphite p-6 sm:p-10">
            <QuoteForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
