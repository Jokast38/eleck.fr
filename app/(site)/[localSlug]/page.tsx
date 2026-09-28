import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { AudienceCards } from "@/components/sections/AudienceCards";
import { Process } from "@/components/sections/Process";
import { FinalCta } from "@/components/sections/FinalCta";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BusinessJsonLd } from "@/components/seo/BusinessJsonLd";
import { cities, cityPath, getCity } from "@/lib/content/cities";
import { pageMetadata } from "@/lib/seo";

/**
 * Pages locales « /borne-recharge-[ville] ».
 * Next.js ne permet pas un segment partiellement dynamique : on capte le slug complet
 * (« borne-recharge-cergy ») puis on en extrait la ville. Seules les villes déclarées
 * dans lib/content/cities.ts sont générées (dynamicParams = false → 404 sinon).
 */
const PREFIX = "borne-recharge-";
export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map((c) => ({ localSlug: `${PREFIX}${c.slug}` }));
}

function cityFromParam(localSlug: string) {
  return localSlug.startsWith(PREFIX) ? getCity(localSlug.slice(PREFIX.length)) : undefined;
}

type Props = { params: Promise<{ localSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = cityFromParam((await params).localSlug);
  if (!city) return {};
  return pageMetadata({
    title: `Borne de recharge ${city.name} (${city.postalCode})`,
    description: city.metaDescription,
    path: cityPath(city.slug),
  });
}

export default async function CityPage({ params }: Props) {
  const city = cityFromParam((await params).localSlug);
  if (!city) notFound();
  const nearby = city.nearby.map(getCity).filter((c) => c !== undefined);

  return (
    <>
      <BusinessJsonLd areaServed={city.name} />
      <PageHero
        crumbs={[
          { label: "Zone d'intervention", href: "/zone-intervention" },
          { label: city.name, href: cityPath(city.slug) },
        ]}
        eyebrow={`${city.name} · ${city.department}`}
        title={city.headline}
        intro={city.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
      />
      <Section tone="white" labelledBy="besoins">
        <SectionHeading id="besoins" tone="light" eyebrow={city.name} title={`Nos solutions de recharge à ${city.name}`} />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {city.focus.map((f) => (
            <li key={f.title} className="rounded-xl border border-black/10 bg-mist p-7">
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-dark">{f.text}</p>
            </li>
          ))}
        </ul>
      </Section>
      <AudienceCards tone="dark" />
      <Process />
      {nearby.length > 0 && (
        <Section tone="dark" labelledBy="villes-proches">
          <SectionHeading id="villes-proches" title="Nous intervenons aussi à proximité" />
          <ul className="mt-8 flex flex-wrap gap-3">
            {nearby.map((c) => (
              <li key={c.slug}>
                <Link
                  href={cityPath(c.slug)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 hover:border-brand/60"
                >
                  <MapPin aria-hidden className="size-4 text-brand-bright" /> Borne de recharge {c.name}
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
      <FinalCta title={`Un projet de borne à ${city.name} ?`} />
    </>
  );
}
