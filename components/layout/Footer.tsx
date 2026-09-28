import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { footerNav, site } from "@/lib/site";

function FooterColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-white">{title}</h2>
      <ul className="mt-4 space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-muted transition-colors hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Pied de page : coordonnées (NAP identique à Google Business Profile), liens, mentions légales. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-ink pb-24 text-white md:pb-0">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo className="h-9" />
          <p className="mt-6 max-w-sm text-muted">
            Bornes de recharge, éclairage LED, installation et maintenance électrique, thermographie : votre électricien
            de proximité, de l&apos;étude à la maintenance.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
            <ShieldCheck aria-hidden className="size-4 text-brand-bright" />
            {site.certification}
          </p>
          <address className="mt-6 space-y-3 text-muted not-italic">
            <p className="flex gap-3">
              <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-bright" />
              <span>
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}
              </span>
            </p>
            <p className="flex gap-3">
              <Phone aria-hidden className="size-5 shrink-0 text-brand-bright" />
              <a href={site.phone.href} className="plausible-event-name=Clic+telephone hover:text-white">
                {site.phone.display}
              </a>
            </p>
            <p className="flex gap-3">
              <Mail aria-hidden className="size-5 shrink-0 text-brand-bright" />
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </p>
          </address>
        </div>
        <FooterColumn title="Nos services" links={footerNav.solutions} />
        <FooterColumn title="elec k" links={footerNav.company} />
        <FooterColumn title="Informations" links={footerNav.legal} />
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. Tous droits réservés.
          </p>
          <p>Bornes de recharge · Éclairage LED · Électricité · Thermographie · Val-d&apos;Oise (95)</p>
        </Container>
      </div>
    </footer>
  );
}
