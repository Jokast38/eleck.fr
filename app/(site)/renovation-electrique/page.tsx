import { Bath, Cable, FileText, Gauge, Plug, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Benefits } from "@/components/sections/Benefits";
import { SplitChecklist } from "@/components/sections/SplitChecklist";
import { Process } from "@/components/sections/Process";
import { FaqSection } from "@/components/sections/FaqSection";
import { RealisationsGrid } from "@/components/sections/RealisationsGrid";
import { RelatedLinks, relatedElectricity } from "@/components/sections/RelatedLinks";
import { FinalCta } from "@/components/sections/FinalCta";
import { PanelArt } from "@/components/home/ServiceArt";
import { ServiceJsonLd } from "@/components/seo/BusinessJsonLd";
import { getFaq } from "@/lib/content/queries";
import { pageMetadata } from "@/lib/seo";

const path = "/renovation-electrique";
const description =
  "Rénovation électrique et mise aux normes NF C 15-100 à Herblay et dans le Val-d'Oise : mise en sécurité, maison ancienne, diagnostic. Devis gratuit.";

export const revalidate = 3600;
export const metadata = pageMetadata({ title: "Rénovation et mise aux normes électrique (95)", description, path });

export default async function RenovationPage() {
  const faq = await getFaq();
  return (
    <>
      <ServiceJsonLd
        name="Rénovation et mise aux normes électrique"
        serviceType="Rénovation électrique"
        description={description}
        audience="Particuliers, propriétaires bailleurs et professionnels"
      />
      <PageHero
        crumbs={[{ label: "Rénovation et mise aux normes", href: path }]}
        eyebrow="Rénovation électrique"
        title="Rénovation et mise aux normes de votre installation électrique"
        ctaService="electricite"
        intro={
          <p>
            Installation vieillissante, prises sans terre, absence de protection différentielle, anomalies relevées par un
            diagnostic : nous remettons votre installation en sécurité et la rénovons selon la norme NF C 15-100, en
            maison comme en appartement.
          </p>
        }
      >
        <div className="hidden rounded-2xl border border-white/10 bg-graphite/70 p-8 lg:block">
          <PanelArt uid="page" className="w-full" />
        </div>
      </PageHero>
      <Benefits
        id="travaux"
        eyebrow="Nos travaux"
        title="De la mise en sécurité à la rénovation complète"
        items={[
          { icon: ShieldCheck, title: "Mise en sécurité", text: "Mise à la terre, protection différentielle 30 mA, protections adaptées à chaque circuit." },
          { icon: Cable, title: "Rénovation partielle ou complète", text: "Remplacement des câbles et des circuits vétustes, pièce par pièce ou sur toute l'installation." },
          { icon: Bath, title: "Salle de bains et cuisine", text: "Respect des volumes de sécurité, liaison équipotentielle, circuits dédiés à l'électroménager." },
          { icon: Plug, title: "Prises, éclairage, circuits", text: "Ajout de prises, de points lumineux et de circuits spécialisés selon vos usages." },
          { icon: FileText, title: "Suite à un diagnostic", text: "Correction des anomalies relevées lors d'un diagnostic électrique de vente ou de location." },
          { icon: Gauge, title: "Tableau électrique", text: "Remplacement ou mise à niveau du tableau, souvent au cœur d'une rénovation." },
        ]}
      />
      <SplitChecklist
        id="signes"
        eyebrow="Les signes qui doivent alerter"
        title="Votre installation a-t-elle besoin d'être rénovée ?"
        paragraphs={[
          "Une installation ancienne n'a pas été conçue pour les usages d'aujourd'hui : plaques de cuisson, chauffage électrique, équipements multimédias, voiture électrique.",
          "Nous commençons par un état des lieux de votre installation. Vous savez ensuite précisément ce qui relève de la sécurité et ce qui relève du confort, pour décider des travaux en connaissance de cause.",
        ]}
        items={[
          "Installation de plus de 15 ans jamais rénovée",
          "Prises sans terre ou anciens fils sous gaine tissu",
          "Pas de différentiel 30 mA au tableau",
          "Disjoncteurs qui sautent souvent",
          "Travaux de cuisine, de salle de bains ou d'extension",
          "Vente ou mise en location du logement",
        ]}
      />
      <Process />
      <RealisationsGrid service="ELECTRICITE" hideWhenEmpty title="Nos chantiers d'électricité" intro="Quelques chantiers récents réalisés par nos équipes." />
      <FaqSection items={faq.filter((f) => f.category === "habitat")} title="Questions fréquentes sur la rénovation électrique" />
      <RelatedLinks items={relatedElectricity(path)} />
      <FinalCta title="Un projet de rénovation électrique ?" service="electricite" />
    </>
  );
}
