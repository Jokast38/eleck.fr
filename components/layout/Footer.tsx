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

/** Logo LinkedIn (lucide n'inclut pas les logos de marques). */
function LinkedInIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-5 shrink-0 text-brand-bright">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
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
            Dépannage, rénovation et mise aux normes, tableau électrique, bornes de recharge, éclairage LED,
            thermographie : votre électricien de proximité à Herblay-sur-Seine, de l&apos;étude à la maintenance.
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
          {site.social.length > 0 && (
            <ul aria-label="Réseaux sociaux" className="mt-6 flex gap-5">
              {site.social.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-muted transition-colors hover:text-white"
                  >
                    {s.label === "LinkedIn" && <LinkedInIcon />}
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
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
          <p>Électricien · Bornes de recharge · Éclairage LED · Thermographie · Val-d&apos;Oise (95)</p>
        </Container>
      </div>
    </footer>
  );
}
