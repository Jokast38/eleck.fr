import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { AudienceCards } from "@/components/sections/AudienceCards";
import { Process } from "@/components/sections/Process";
import { RelatedLinks, electricityLinks } from "@/components/sections/RelatedLinks";
import { FinalCta } from "@/components/sections/FinalCta";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BusinessJsonLd } from "@/components/seo/BusinessJsonLd";
import { cities, cityPath, electricianPages, electricianPath, getCity, type City, type LocalContent } from "@/lib/content/cities";
import { pageMetadata } from "@/lib/seo";

/**
 * Pages locales « /borne-recharge-[ville] » et « /electricien-[ville] ».
 * Next.js ne permet pas un segment partiellement dynamique : on capte le slug complet
 * (« borne-recharge-cergy », « electricien-cergy ») puis on en extrait le type de page et la ville.
 * Seules les villes déclarées dans lib/content/cities.ts sont générées (dynamicParams = false → 404 sinon).
 */
const kinds = {
  borne: { prefix: "borne-recharge-", path: cityPath },
  electricien: { prefix: "electricien-", path: electricianPath },
} as const;
type Kind = keyof typeof kinds;

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...cities.map((c) => ({ localSlug: `${kinds.borne.prefix}${c.slug}` })),
    ...cities.filter((c) => electricianPages[c.slug]).map((c) => ({ localSlug: `${kinds.electricien.prefix}${c.slug}` })),
  ];
}

function fromParam(localSlug: string): { kind: Kind; city: City; content: LocalContent } | undefined {
  for (const kind of Object.keys(kinds) as Kind[]) {
    const { prefix } = kinds[kind];
    if (!localSlug.startsWith(prefix)) continue;
    const city = getCity(localSlug.slice(prefix.length));
    const content = city && (kind === "borne" ? city : electricianPages[city.slug]);
    return city && content ? { kind, city, content } : undefined;
  }
}

type Props = { params: Promise<{ localSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = fromParam((await params).localSlug);
  if (!page) return {};
  const { kind, city, content } = page;
  return pageMetadata({
    title: kind === "borne" ? `Borne de recharge ${city.name} (${city.postalCode})` : `Électricien ${city.name} (${city.postalCode})`,
    description: content.metaDescription,
    path: kinds[kind].path(city.slug),
  });
}

export default async function LocalPage({ params }: Props) {
  const page = fromParam((await params).localSlug);
  if (!page) notFound();
  const { kind, city, content } = page;
  const isBorne = kind === "borne";
  const path = kinds[kind].path;
  const nearby = city.nearby.map(getCity).filter((c) => c !== undefined).filter((c) => isBorne || electricianPages[c.slug]);
  const label = (name: string) => (isBorne ? `Borne de recharge ${name}` : `Électricien ${name}`);
  // Lien croisé vers l'autre page de la même ville (électricien ↔ borne)
  const other = isBorne
    ? electricianPages[city.slug] && { href: electricianPath(city.slug), text: `Besoin d'un électricien à ${city.name} ? Dépannage, rénovation, tableau électrique` }
    : { href: cityPath(city.slug), text: `Installer une borne de recharge à ${city.name}` };

  return (
    <>
      <BusinessJsonLd areaServed={city.name} />
      <PageHero
        crumbs={[
          { label: "Zone d'intervention", href: "/zone-intervention" },
          { label: label(city.name), href: path(city.slug) },
        ]}
        eyebrow={`${city.name} · ${city.department}`}
        title={content.headline}
        ctaService={isBorne ? undefined : "electricite"}
        intro={content.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
      />
      <Section tone="white" labelledBy="besoins">
        <SectionHeading
          id="besoins"
          tone="light"
          eyebrow={city.name}
          title={isBorne ? `Nos solutions de recharge à ${city.name}` : `Nos interventions d'électricien à ${city.name}`}
        />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {content.focus.map((f) => (
            <li key={f.title} className="rounded-xl border border-black/10 bg-mist p-7">
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-dark">{f.text}</p>
            </li>
          ))}
        </ul>
        {other && (
          <Link href={other.href} className="mt-10 inline-flex items-center gap-1.5 font-semibold text-ink underline decoration-brand decoration-2 underline-offset-4">
            {other.text} <ArrowRight aria-hidden className="size-4" />
          </Link>
        )}
      </Section>
      {isBorne ? (
        <AudienceCards tone="dark" />
      ) : (
        <RelatedLinks eyebrow="Nos prestations" title={`Nos services d'électricité à ${city.name}`} items={electricityLinks.slice(0, 4)} />
      )}
      <Process />
      {nearby.length > 0 && (
        <Section tone="dark" labelledBy="villes-proches">
          <SectionHeading id="villes-proches" title="Nous intervenons aussi à proximité" />
          <ul className="mt-8 flex flex-wrap gap-3">
            {nearby.map((c) => (
              <li key={c.slug}>
                <Link
                  href={path(c.slug)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 hover:border-brand/60"
                >
                  <MapPin aria-hidden className="size-4 text-brand-bright" /> {label(c.name)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/zone-intervention" className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-brand-bright hover:text-white">
                Toute la zone <ArrowRight aria-hidden className="size-4" />
              </Link>
            </li>
          </ul>
        </Section>
      )}
      <FinalCta
        title={isBorne ? `Un projet de borne à ${city.name} ?` : `Besoin d'un électricien à ${city.name} ?`}
        service={isBorne ? undefined : "electricite"}
      />
    </>
  );
}
