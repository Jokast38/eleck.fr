import { BatteryCharging, Clock, PiggyBank, ShieldCheck, Smartphone, Zap } from "lucide-react";
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
  "Borne de recharge à domicile dans le Val-d'Oise : étude, installation certifiée IRVE et mise en service pour votre maison. Devis gratuit par elec k.";

// Contenu (FAQ, réalisations) géré depuis le dashboard : régénération au plus toutes les heures
export const revalidate = 3600;

export const metadata = pageMetadata({ title: "Borne de recharge à domicile, maison", description, path: "/particuliers" });

export default async function ParticuliersPage() {
  const faq = await getFaq();
  return (
    <>
      <ServiceJsonLd name="Installation de borne de recharge à domicile" description={description} audience="Particuliers" />
      <PageHero
        crumbs={[{ label: "Particuliers", href: "/particuliers" }]}
        eyebrow="Particuliers"
        title="Votre borne de recharge à la maison, installée en toute sérénité"
        intro={
          <p>
            Rechargez chez vous, pendant la nuit, et retrouvez chaque matin un véhicule prêt à partir. Nous étudions votre
            installation, choisissons avec vous la borne adaptée et la posons dans les règles de l&apos;art.
          </p>
        }
      />
      <Benefits
        id="avantages"
        eyebrow="Vos avantages"
        title="Pourquoi installer une borne plutôt que d'utiliser une prise classique ?"
        items={[
          { icon: Zap, title: "Une recharge plus rapide", text: "Une borne murale recharge nettement plus vite qu'une prise domestique. Votre batterie est pleine en une nuit." },
          { icon: ShieldCheck, title: "La sécurité avant tout", text: "Ligne dédiée, protections adaptées, matériel conçu pour la recharge : votre installation électrique est protégée." },
          { icon: PiggyBank, title: "Des économies au quotidien", text: "Programmez la recharge aux heures les plus avantageuses de votre contrat d'électricité." },
          { icon: Smartphone, title: "Une borne pilotable", text: "Selon le modèle : suivi de consommation, programmation et démarrage à distance depuis votre smartphone." },
          { icon: BatteryCharging, title: "Adaptée à votre véhicule", text: "Nous choisissons la puissance utile pour votre voiture et votre abonnement, sans surdimensionner." },
          { icon: Clock, title: "Un gain de temps", text: "Plus besoin de chercher une borne publique : vous rechargez chez vous, quand vous le souhaitez." },
        ]}
      />
      <SplitChecklist
        id="inclus"
        eyebrow="Notre intervention"
        title="Une installation complète, de l'étude à la mise en service"
        paragraphs={[
          "Chaque maison est différente : emplacement du tableau électrique, garage ou stationnement extérieur, puissance de l'abonnement. Nous commençons donc toujours par comprendre votre configuration.",
          "Vous recevez ensuite un devis détaillé, qui précise le matériel, les travaux et les aides auxquelles vous pouvez prétendre.",
        ]}
        items={[
          "Visite technique et analyse de votre tableau électrique",
          "Conseil sur la borne et la puissance adaptées",
          "Création d'une ligne dédiée avec les protections nécessaires",
          "Pose de la borne en garage ou en extérieur",
          "Mise en service, tests et prise en main",
          "Remise des documents de l'installation",
        ]}
      />
      <Process />
      <Aides />
      <RealisationsGrid service="BORNE" hideWhenEmpty title="Nos installations de bornes de recharge" intro="Quelques chantiers récents réalisés par nos équipes." />
      <FaqSection items={faq.filter((f) => f.category === "particuliers" || f.q.startsWith("Quelle puissance"))} title="Questions fréquentes des particuliers" />
      <FinalCta title="Prêt à recharger chez vous ?" />
    </>
  );
}
