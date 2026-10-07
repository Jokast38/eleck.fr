import { ClipboardCheck, Eye, Leaf, Store, Wrench, Zap } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { Benefits } from "@/components/sections/Benefits";
import { SplitChecklist } from "@/components/sections/SplitChecklist";
import { Process } from "@/components/sections/Process";
import { FaqSection } from "@/components/sections/FaqSection";
import { RealisationsGrid } from "@/components/sections/RealisationsGrid";
import { FinalCta } from "@/components/sections/FinalCta";
import { LedArt } from "@/components/home/ServiceArt";
import { ServiceJsonLd } from "@/components/seo/BusinessJsonLd";
import { getFaq } from "@/lib/content/queries";
import { pageMetadata } from "@/lib/seo";

const description =
  "Éclairage LED et relamping pour commerces, bureaux, entrepôts et collectivités dans le Val-d'Oise et en Île-de-France. Étude, installation, devis gratuit.";

export const revalidate = 3600;
export const metadata = pageMetadata({ title: "Éclairage LED professionnel et relamping (95)", description, path: "/eclairage-led" });

export default async function EclairageLedPage() {
  const faq = await getFaq();
  return (
    <>
      <ServiceJsonLd name="Éclairage LED et relamping" serviceType="Éclairage LED et relamping" description={description} audience="Commerces, entreprises, industries et collectivités" />
      <PageHero
        crumbs={[{ label: "Éclairage LED", href: "/eclairage-led" }]}
        eyebrow="Éclairage LED"
        title="Éclairage LED : moins de consommation, plus de confort"
        ctaService="eclairage-led"
        intro={
          <>
            <p>
              Grandes surfaces, commerces, bureaux, entrepôts, parkings, collectivités : nous remplaçons vos éclairages
              existants par des solutions LED adaptées à chaque zone de votre activité.
            </p>
            <p>
              elec k est née d&apos;un constat : le gaspillage d&apos;énergie dans l&apos;éclairage de nos bâtiments. Nous
              vous aidons à le réduire, sans compromis sur la qualité de la lumière.
            </p>
          </>
        }
      >
        <div className="hidden rounded-2xl border border-white/10 bg-graphite/70 p-8 lg:block">
          <LedArt uid="page" className="w-full" />
        </div>
      </PageHero>
      <ClientLogos />
      <Benefits
        id="avantages"
        eyebrow="Pourquoi passer au LED ?"
        title="Un investissement qui se voit sur la facture et au quotidien"
        items={[
          { icon: Zap, title: "Une consommation réduite", text: "À niveau d'éclairement équivalent, un luminaire LED consomme nettement moins qu'un tube fluorescent ou qu'une lampe à décharge." },
          { icon: Wrench, title: "Moins de maintenance", text: "Une durée de vie bien plus longue : moins de remplacements de lampes et moins d'interventions en hauteur." },
          { icon: Eye, title: "Un meilleur confort visuel", text: "Allumage instantané, sans scintillement, avec un rendu des couleurs adapté à vos produits et à vos équipes." },
          { icon: Store, title: "Un éclairage pour chaque usage", text: "Rayons, meubles frais, laboratoires, ateliers, bureaux, parkings : chaque zone a son éclairage." },
          { icon: Leaf, title: "Votre démarche environnementale", text: "Moins d'énergie consommée : un argument concret pour votre politique RSE." },
          {
            icon: ClipboardCheck,
            title: "Vos obligations tertiaires",
            text: "Le dispositif Éco Énergie Tertiaire impose aux bâtiments tertiaires de plus de 1 000 m² de réduire progressivement leur consommation. L'éclairage est un levier rapide.",
          },
        ]}
      />
      <SplitChecklist
        id="intervention"
        eyebrow="Notre intervention"
        title="Du relevé de l'existant à la mise en service"
        paragraphs={[
          "Chaque site est différent : hauteur sous plafond, horaires d'ouverture, exigences d'hygiène ou de sécurité. Nous partons de votre éclairage actuel et de vos usages pour proposer les bons luminaires, au bon endroit.",
          "Les travaux sont organisés pour limiter la gêne pour votre activité. Selon votre situation, une partie peut être financée par les certificats d'économies d'énergie (CEE) : nous vérifions votre éligibilité au moment du devis.",
        ]}
        items={[
          "Relevé de l'éclairage existant et de vos besoins",
          "Choix de luminaires adaptés à chaque zone",
          "Devis détaillé, aides étudiées selon votre éligibilité",
          "Travaux planifiés avec vous",
          "Mise en service et contrôle",
          "Maintenance de vos installations si vous le souhaitez",
        ]}
      />
      <Process />
      <RealisationsGrid service="LED" hideWhenEmpty title="Nos chantiers d'éclairage LED" intro="Quelques chantiers récents réalisés par nos équipes." />
      <FaqSection items={faq.filter((f) => f.category === "eclairage")} title="Questions fréquentes sur l'éclairage LED" />
      <FinalCta title="Un projet d'éclairage LED ?" service="eclairage-led" />
    </>
  );
}
