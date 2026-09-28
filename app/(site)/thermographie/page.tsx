import { Activity, CalendarCheck, FileText, Flame, PlugZap, Wrench } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Benefits } from "@/components/sections/Benefits";
import { SplitChecklist } from "@/components/sections/SplitChecklist";
import { Process } from "@/components/sections/Process";
import { FaqSection } from "@/components/sections/FaqSection";
import { RealisationsGrid } from "@/components/sections/RealisationsGrid";
import { FinalCta } from "@/components/sections/FinalCta";
import { ThermoArt } from "@/components/home/ServiceArt";
import { ServiceJsonLd } from "@/components/seo/BusinessJsonLd";
import { getFaq } from "@/lib/content/queries";
import { pageMetadata } from "@/lib/seo";

const description =
  "Thermographie infrarouge de vos installations électriques dans le Val-d'Oise : détection des échauffements, maintenance prédictive, rapport détaillé.";

export const revalidate = 3600;
export const metadata = pageMetadata({ title: "Thermographie infrarouge électrique", description, path: "/thermographie" });

export default async function ThermographiePage() {
  const faq = await getFaq();
  return (
    <>
      <ServiceJsonLd name="Thermographie infrarouge des installations électriques" description={description} audience="Entreprises, commerces, industries et collectivités" />
      <PageHero
        crumbs={[{ label: "Thermographie", href: "/thermographie" }]}
        eyebrow="Thermographie infrarouge"
        title="Détectez les anomalies électriques avant la panne"
        ctaService="thermographie"
        intro={
          <p>
            Grâce à une caméra thermique, nous contrôlons vos tableaux et équipements électriques en fonctionnement. Les
            échauffements anormaux deviennent visibles : vous les corrigez avant qu&apos;ils ne provoquent un arrêt de
            production ou un départ de feu.
          </p>
        }
      >
        <div className="hidden rounded-2xl border border-white/10 bg-graphite/70 p-8 lg:block">
          <ThermoArt uid="page" className="w-full" />
        </div>
      </PageHero>
      <Benefits
        id="avantages"
        eyebrow="Maintenance prédictive"
        title="Voir ce que l'œil ne voit pas"
        items={[
          { icon: Flame, title: "Prévenir les risques d'incendie", text: "Un serrage desserré ou une surcharge chauffe bien avant de lâcher : la caméra le repère à temps." },
          { icon: Activity, title: "Éviter les arrêts imprévus", text: "Les anomalies sont corrigées lors d'une intervention planifiée, plutôt qu'en urgence." },
          { icon: PlugZap, title: "Sans coupure", text: "Le contrôle se fait installation en fonctionnement : votre activité n'est pas interrompue." },
          { icon: FileText, title: "Un rapport exploitable", text: "Anomalies localisées et classées par priorité, images thermiques et recommandations." },
          { icon: CalendarCheck, title: "Un suivi dans le temps", text: "Un contrôle régulier permet de suivre l'évolution de votre installation d'une année sur l'autre." },
          { icon: Wrench, title: "Correction des anomalies", text: "Électriciens avant tout, nous pouvons réaliser les travaux de correction nécessaires." },
        ]}
      />
      <SplitChecklist
        id="controles"
        eyebrow="Ce que nous contrôlons"
        title="Vos équipements électriques les plus sollicités"
        paragraphs={[
          "La thermographie est particulièrement utile sur les installations fortement chargées ou critiques pour votre activité : tableaux généraux, armoires de production, groupes froids, éclairage, bornes de recharge.",
          "Elle se pratique à intervalles réguliers, après des travaux importants ou avant une période de forte activité. Nous définissons avec vous la fréquence adaptée.",
        ]}
        items={[
          "Tableaux électriques généraux et divisionnaires",
          "Connexions, serrages et jeux de barres",
          "Protections, disjoncteurs et contacteurs",
          "Câbles et canalisations électriques",
          "Moteurs, variateurs et équipements de production",
          "Bornes de recharge et leurs alimentations",
        ]}
      />
      <Process
        title="Un contrôle en 4 étapes"
        steps={[
          { title: "Prise de contact", text: "Vous nous présentez votre site et les équipements à contrôler." },
          { title: "Contrôle sur site", text: "Relevés à la caméra thermique, installation en fonctionnement et sous charge." },
          { title: "Rapport", text: "Anomalies classées par priorité, images thermiques et recommandations de correction." },
          { title: "Corrections", text: "Nous réalisons les travaux nécessaires si vous le souhaitez, puis un contrôle de vérification." },
        ]}
      />
      <RealisationsGrid service="THERMOGRAPHIE" hideWhenEmpty title="Nos interventions de thermographie" intro="Quelques chantiers récents réalisés par nos équipes." />
      <FaqSection items={faq.filter((f) => f.category === "thermographie")} title="Questions fréquentes sur la thermographie" />
      <FinalCta title="Planifier une thermographie ?" service="thermographie" />
    </>
  );
}
