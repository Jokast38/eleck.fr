import { CalendarCheck, Cable, Factory, ScanLine, ShieldCheck, Wrench } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { Benefits } from "@/components/sections/Benefits";
import { SplitChecklist } from "@/components/sections/SplitChecklist";
import { Process } from "@/components/sections/Process";
import { FaqSection } from "@/components/sections/FaqSection";
import { RealisationsGrid } from "@/components/sections/RealisationsGrid";
import { FinalCta } from "@/components/sections/FinalCta";
import { PanelArt } from "@/components/home/ServiceArt";
import { ServiceJsonLd } from "@/components/seo/BusinessJsonLd";
import { getFaq } from "@/lib/content/queries";
import { pageMetadata } from "@/lib/seo";

const description =
  "Électricien pour le tertiaire et l'industrie dans le Val-d'Oise : installation, mise en conformité, maintenance préventive et dépannage. Devis gratuit.";

export const revalidate = 3600;
export const metadata = pageMetadata({ title: "Électricité tertiaire et industrielle (95)", description, path: "/electricite-tertiaire-industrielle" });

export default async function ElectricitePage() {
  const faq = await getFaq();
  return (
    <>
      <ServiceJsonLd name="Installation et maintenance électrique tertiaire et industrielle" description={description} audience="Entreprises, commerces, industries et collectivités" />
      <PageHero
        crumbs={[{ label: "Électricité tertiaire et industrielle", href: "/electricite-tertiaire-industrielle" }]}
        eyebrow="Électricité tertiaire et industrielle"
        title="Installation et maintenance électrique pour les professionnels"
        ctaService="electricite"
        intro={
          <p>
            Bureaux, commerces, grandes surfaces, établissements recevant du public, ateliers et sites industriels : nous
            réalisons vos installations électriques et en assurons la maintenance préventive et curative, pour une
            installation sûre, conforme et disponible.
          </p>
        }
      >
        <div className="hidden rounded-2xl border border-white/10 bg-graphite/70 p-8 lg:block">
          <PanelArt uid="page" className="w-full" />
        </div>
      </PageHero>
      <ClientLogos />
      <Benefits
        id="prestations"
        eyebrow="Nos prestations"
        title="Tout le cycle de vie de votre installation électrique"
        items={[
          { icon: Cable, title: "Installation neuve et rénovation", text: "Distribution électrique, tableaux, alimentation d'équipements et de machines, éclairage." },
          { icon: ShieldCheck, title: "Mise en conformité", text: "Travaux de sécurisation et levée des observations de vos rapports de vérification périodique." },
          { icon: CalendarCheck, title: "Maintenance préventive", text: "Visites planifiées : contrôle des protections, des serrages et de l'état général de l'installation." },
          { icon: Wrench, title: "Maintenance curative", text: "Diagnostic et dépannage pour remettre votre installation en service au plus vite." },
          { icon: ScanLine, title: "Maintenance prédictive", text: "La thermographie infrarouge repère les échauffements anormaux avant qu'ils ne causent une panne." },
          { icon: Factory, title: "Tertiaire et industrie", text: "Bureaux, commerces, grandes surfaces, ateliers, sites de production, bâtiments publics." },
        ]}
      />
      <SplitChecklist
        id="suivi"
        eyebrow="Contrats de maintenance"
        title="Un interlocuteur qui connaît votre site"
        paragraphs={[
          "Une installation électrique bien entretenue, c'est moins d'arrêts imprévus, plus de sécurité pour vos équipes et des vérifications périodiques plus sereines.",
          "Nous adaptons nos interventions à votre activité : fréquence des visites, horaires, contraintes d'exploitation. Après chaque passage, vous recevez un compte rendu clair.",
        ]}
        items={[
          "Contrat adapté à votre installation et à votre activité",
          "Compte rendu après chaque intervention",
          "Dépannage sur demande",
          "Travaux réalisés selon les normes en vigueur",
          "Thermographie infrarouge en complément, si besoin",
        ]}
      />
      <Process />
      <RealisationsGrid service="ELECTRICITE" hideWhenEmpty title="Nos chantiers d'électricité" intro="Quelques chantiers récents réalisés par nos équipes." />
      <FaqSection items={faq.filter((f) => f.category === "electricite")} title="Questions fréquentes sur nos travaux électriques" />
      <FinalCta title="Un besoin en électricité pour votre site ?" service="electricite" />
    </>
  );
}
