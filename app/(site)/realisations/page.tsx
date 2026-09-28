import { PageHero } from "@/components/sections/PageHero";
import { RealisationsGrid } from "@/components/sections/RealisationsGrid";
import { FinalCta } from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Réalisations : bornes, éclairage LED, électricité",
  description:
    "Chantiers réalisés par elec k dans le Val-d'Oise et en Île-de-France : bornes de recharge, éclairage LED, électricité tertiaire et industrielle.",
  path: "/realisations",
});

// Régénération périodique : les réalisations seront publiées depuis le dashboard (étape 4)
export const revalidate = 3600;

export default function RealisationsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Réalisations", href: "/realisations" }]}
        eyebrow="Réalisations"
        title="Nos chantiers : bornes, éclairage LED et électricité"
        intro={<p>Bornes de recharge, éclairage LED, installations électriques et thermographie : découvrez quelques chantiers réalisés par nos équipes.</p>}
        showCta={false}
      />
      <RealisationsGrid withHeading={false} filterable />
      <FinalCta title="Votre projet sera peut-être notre prochaine réalisation" />
    </>
  );
}
