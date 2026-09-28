import { Building2, FileText, Gauge, Receipt, Scale, TrendingUp } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Benefits } from "@/components/sections/Benefits";
import { SplitChecklist } from "@/components/sections/SplitChecklist";
import { Process } from "@/components/sections/Process";
import { Aides } from "@/components/sections/Aides";
import { FaqSection } from "@/components/sections/FaqSection";
import { RealisationsGrid } from "@/components/sections/RealisationsGrid";
import { FinalCta } from "@/components/sections/FinalCta";
import { ServiceJsonLd } from "@/components/seo/BusinessJsonLd";
import { getFaq } from "@/lib/content/queries";
import { pageMetadata } from "@/lib/seo";

const description =
  "Borne de recharge en copropriété dans le Val-d'Oise : droit à la prise, projet collectif, accompagnement du syndic jusqu'à l'AG. Installateur IRVE.";

// Contenu (FAQ, réalisations) géré depuis le dashboard : régénération au plus toutes les heures
export const revalidate = 3600;

export const metadata = pageMetadata({ title: "Borne de recharge en copropriété (95)", description, path: "/coproprietes" });

export default async function CoproprietesPage() {
  const faq = await getFaq();
  return (
    <>
      <ServiceJsonLd name="Installation de bornes de recharge en copropriété" description={description} audience="Copropriétés, syndics et conseils syndicaux" />
      <PageHero
        crumbs={[{ label: "Copropriétés", href: "/coproprietes" }]}
        eyebrow="Copropriétés"
        title="Bornes de recharge en copropriété : une solution claire pour tous"
        intro={
          <p>
            Copropriétaire, syndic ou membre du conseil syndical : nous vous accompagnons pour équiper le parking de
            votre résidence, qu&apos;il s&apos;agisse d&apos;une borne individuelle ou d&apos;une infrastructure collective.
          </p>
        }
      />
      <SplitChecklist
        id="droit-prise"
        eyebrow="Droit à la prise"
        title="Individuel ou collectif : deux façons d'équiper votre résidence"
        paragraphs={[
          "Le droit à la prise permet à tout copropriétaire ou locataire d'installer, à ses frais, une borne sur sa place de stationnement. Il suffit d'en informer le syndic, qui ne peut s'y opposer que pour un motif sérieux et légitime.",
          "La copropriété peut aussi décider en assemblée générale de réaliser une infrastructure collective. Cette solution anticipe les besoins futurs, répartit mieux la puissance disponible et simplifie l'ajout de nouvelles bornes.",
        ]}
        items={[
          "Étude de la puissance disponible dans le parking",
          "Comparaison des solutions individuelle et collective",
          "Dossier technique et chiffrage clair pour le conseil syndical",
          "Présentation du projet en vue de l'assemblée générale",
          "Solution de comptage pour refacturer chaque consommation",
          "Installation, mise en service et maintenance",
        ]}
      />
      <Benefits
        id="avantages"
        eyebrow="Pour la copropriété"
        title="Un projet collectif bien préparé, voté sereinement"
        items={[
          { icon: Scale, title: "Un cadre respecté", text: "Nous tenons compte des règles propres à la copropriété et des démarches auprès du syndic." },
          { icon: FileText, title: "Un dossier pour l'AG", text: "Documents clairs et chiffrés pour permettre au conseil syndical et aux copropriétaires de décider." },
          { icon: Gauge, title: "Une puissance maîtrisée", text: "La gestion de la charge partage la puissance entre les bornes sans surcharger l'installation." },
          { icon: Receipt, title: "Une consommation refacturée", text: "Chaque utilisateur paie ce qu'il consomme, grâce à un comptage individuel adapté." },
          { icon: TrendingUp, title: "Un bien valorisé", text: "Un parking équipé répond aux attentes des acquéreurs et des locataires qui roulent en électrique." },
          { icon: Building2, title: "Une solution évolutive", text: "L'infrastructure est dimensionnée pour accueillir de nouvelles bornes au fil des demandes." },
        ]}
      />
      <Process
        title="Votre projet de copropriété en 4 étapes"
        steps={[
          { title: "Prise de contact", text: "Un copropriétaire, le syndic ou le conseil syndical nous présente le projet et la configuration du parking." },
          { title: "Visite et étude", text: "Nous relevons l'installation existante et la puissance disponible pour proposer la solution la plus adaptée." },
          { title: "Devis et AG", text: "Vous recevez un devis détaillé et les éléments nécessaires pour inscrire le projet à l'ordre du jour." },
          { title: "Installation", text: "Nous réalisons les travaux, mettons en service les bornes et assurons leur suivi." },
        ]}
      />
      <Aides />
      <RealisationsGrid service="BORNE" hideWhenEmpty title="Nos installations de bornes de recharge" intro="Quelques chantiers récents réalisés par nos équipes." />
      <FaqSection items={faq.filter((f) => f.category === "coproprietes")} title="Questions fréquentes des copropriétés" />
      <FinalCta title="Parlons du projet de votre résidence" />
    </>
  );
}
