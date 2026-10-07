import { JsonLd } from "./JsonLd";
import { site, SITE_URL } from "@/lib/site";

/**
 * Données structurées LocalBusiness / Electrician (cohérence NAP avec Google Business Profile).
 * Les horaires et coordonnées GPS ne sont publiés que lorsqu'ils ont été validés (site.geoVerified / openingHoursSpec).
 */
export function businessSchema(areaServed?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Electrician",
    "@id": `${SITE_URL}/#entreprise`,
    name: site.name,
    description: site.description,
    url: SITE_URL,
    telephone: site.phone.international.replace(/\s/g, ""),
    email: site.email,
    image: `${SITE_URL}/icon-512.png`,
    logo: `${SITE_URL}/icon-512.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    ...(site.geoVerified && {
      geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    }),
    ...(site.openingHoursSpec.length > 0 && { openingHoursSpecification: site.openingHoursSpec }),
    areaServed: areaServed
      ? { "@type": "City", name: areaServed }
      : [
          { "@type": "City", name: "Herblay-sur-Seine" },
          { "@type": "AdministrativeArea", name: "Val-d'Oise" },
          { "@type": "AdministrativeArea", name: "Île-de-France" },
        ],
    hasCredential: { "@type": "EducationalOccupationalCredential", name: site.certification },
    makesOffer: [
      "Dépannage électrique",
      "Rénovation et mise aux normes électrique",
      "Remplacement de tableau électrique",
      "Installation de bornes de recharge (IRVE)",
      "Maintenance de bornes de recharge",
      "Éclairage LED et relamping",
      "Installation et maintenance électrique tertiaire et industrielle",
      "Thermographie infrarouge",
    ].map(
      (name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } }),
    ),
    sameAs: site.social.map((s) => s.href),
  };
}

export function BusinessJsonLd({ areaServed }: { areaServed?: string }) {
  return <JsonLd data={businessSchema(areaServed)} />;
}

/** Schéma Service pour une page de prestation. */
export function ServiceJsonLd({
  name,
  description,
  audience,
  serviceType = "Installation de bornes de recharge pour véhicules électriques (IRVE)",
}: {
  name: string;
  description: string;
  audience?: string;
  serviceType?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        serviceType,
        provider: { "@id": `${SITE_URL}/#entreprise` },
        areaServed: [
          { "@type": "AdministrativeArea", name: "Val-d'Oise" },
          { "@type": "AdministrativeArea", name: "Île-de-France" },
        ],
        ...(audience && { audience: { "@type": "Audience", audienceType: audience } }),
      }}
    />
  );
}
