import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CtaButton } from "@/components/ui/CtaButton";

const links = [
  { label: "Accueil", href: "/" },
  { label: "Borne pour particuliers", href: "/particuliers" },
  { label: "Borne en copropriété", href: "/coproprietes" },
  { label: "Borne pour entreprises", href: "/entreprises" },
  { label: "Maintenance et dépannage", href: "/maintenance" },
  { label: "Questions fréquentes", href: "/faq" },
];

/** Contenu de la page 404 aux couleurs de la marque. */
export function NotFoundContent() {
  return (
    <section aria-labelledby="page-title" className="relative isolate overflow-hidden bg-ink">
      <div aria-hidden className="absolute -top-40 left-1/2 -z-10 size-[34rem] -translate-x-1/2 rounded-full bg-brand/20 blur-[140px]" />
      <Container className="flex min-h-[70svh] flex-col items-center justify-center py-20 text-center">
        <p aria-hidden className="font-display text-[7rem] leading-none font-semibold text-white sm:text-[10rem]">
          4<span className="text-brand">0</span>4
        </p>
        <span aria-hidden className="mt-2 h-2 w-40 bg-brand" />
        <h1 id="page-title" className="mt-10 font-display text-3xl font-semibold sm:text-4xl">
          Cette page est introuvable
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/80">
          Le lien est peut-être incorrect ou la page a été déplacée. Voici quelques pistes pour retrouver votre chemin.
        </p>
        <div className="mt-8">
          <CtaButton size="lg" />
        </div>
        <nav aria-label="Pages principales" className="mt-12 w-full max-w-3xl">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex items-center justify-between rounded-lg border border-white/10 bg-graphite px-4 py-3 text-left transition-colors hover:border-brand/60"
                >
                  {l.label}
                  <ArrowRight aria-hidden className="size-4 text-muted transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
