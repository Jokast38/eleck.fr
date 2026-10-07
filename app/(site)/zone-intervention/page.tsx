import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { ZoneSection } from "@/components/sections/ZoneSection";
import { AudienceCards } from "@/components/sections/AudienceCards";
import { FinalCta } from "@/components/sections/FinalCta";
import { BusinessJsonLd } from "@/components/seo/BusinessJsonLd";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Zone d'intervention : Val-d'Oise et Île-de-France",
  description:
    "Électricien à Herblay-sur-Seine : dépannage, rénovation et bornes de recharge à Cergy, Argenteuil, Conflans, dans le Val-d'Oise et en Île-de-France.",
  path: "/zone-intervention",
});

export default function ZonePage() {
  return (
    <>
      <BusinessJsonLd />
      <div className="border-b border-white/10 bg-ink">
        <Container className="pt-8">
          <Breadcrumbs items={[{ label: "Zone d'intervention", href: "/zone-intervention" }]} />
        </Container>
      </div>
      <ZoneSection headingAs="h1" />
      <AudienceCards />
      <FinalCta />
    </>
  );
}
