import { Hero } from "@/components/home/Hero";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { TrustBar } from "@/components/home/TrustBar";
import { AudienceCards } from "@/components/sections/AudienceCards";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { OtherServices } from "@/components/sections/OtherServices";
import { Aides } from "@/components/sections/Aides";
import { RealisationsGrid } from "@/components/sections/RealisationsGrid";
import { Reviews } from "@/components/sections/Reviews";
import { FaqSection } from "@/components/sections/FaqSection";
import { ZoneSection } from "@/components/sections/ZoneSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { BusinessJsonLd } from "@/components/seo/BusinessJsonLd";
import { getFaq } from "@/lib/content/queries";
import { pageMetadata } from "@/lib/seo";

// Contenu (FAQ, réalisations) géré depuis le dashboard : régénération au plus toutes les heures
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Bornes de recharge, LED et électricité Val-d'Oise | elec k",
  absoluteTitle: true,
  description:
    "Électricien certifié IRVE à Herblay (95) : bornes de recharge, éclairage LED, électricité tertiaire et industrielle, thermographie. Devis gratuit.",
  path: "/",
});

export default async function HomePage() {
  const homeFaq = (await getFaq()).filter((f) => f.home);
  return (
    <>
      <BusinessJsonLd />
      <Hero />
      <TrustBar />
      <ClientLogos />
      <AudienceCards />
      <Services />
      <Process />
      <OtherServices />
      <Aides />
      <RealisationsGrid limit={6} />
      <Reviews />
      <FaqSection items={homeFaq} />
      <ZoneSection />
      <FinalCta />
    </>
  );
}
