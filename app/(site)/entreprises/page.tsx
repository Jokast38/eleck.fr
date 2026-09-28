import { BadgeCheck, BarChart3, Car, Leaf, Store, Users } from "lucide-react";
import { ClientLogos } from "@/components/sections/ClientLogos";
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
  "Bornes de recharge pour entreprises en Île-de-France : flottes, parkings salariés et visiteurs, supervision. Étude et installation IRVE par elec k.";

// Contenu (FAQ, réalisations) géré depuis le dashboard : régénération au plus toutes les heures
export const revalidate = 3600;

export const metadata = pageMetadata({ title: "Borne de recharge entreprise Île-de-France", description, path: "/entreprises" });

export default async function EntreprisesPage() {
  const faq = await getFaq();
  return (
    <>
      <ServiceJsonLd name="Installation de bornes de recharge pour entreprises" description={description} audience="Entreprises, commerces et gestionnaires de flottes" />
      <PageHero
        crumbs={[{ label: "Entreprises", href: "/entreprises" }]}
        eyebrow="Entreprises"
        title="Des bornes de recharge au service de votre activité"
        intro={
          <p>
            Flotte de véhicules, parking des salariés, accueil des clients et visiteurs : nous concevons une
            infrastructure de recharge dimensionnée pour votre site et vos usages, puis nous en assurons la maintenance.
          </p>
        }
      />
      <ClientLogos />
      <Benefits
        id="avantages"
        eyebrow="Vos bénéfices"
        title="Un investissement utile pour votre entreprise"
        items={[
          { icon: Car, title: "Une flotte toujours disponible", text: "Vos véhicules électriques rechargent sur place, entre deux tournées ou pendant la nuit." },
          { icon: Users, title: "Un avantage pour vos salariés", text: "La recharge sur le lieu de travail facilite le passage à l'électrique de vos équipes." },
          { icon: Leaf, title: "Votre démarche RSE", text: "Des bornes visibles et utilisées valorisent concrètement votre engagement environnemental." },
          { icon: Store, title: "Un service pour vos clients", text: "Commerces et établissements recevant du public : offrez la recharge à vos visiteurs." },
          { icon: BadgeCheck, title: "Un accès maîtrisé", text: "Badges, profils d'utilisateurs : vous décidez qui peut recharger, et quand." },
          { icon: BarChart3, title: "Des consommations suivies", text: "La supervision vous permet de suivre les recharges par utilisateur ou par véhicule." },
        ]}
      />
      <SplitChecklist
        id="inclus"
        eyebrow="Notre intervention"
        title="Une étude sur mesure pour votre site"
        paragraphs={[
          "Nombre de véhicules, rythme d'utilisation, puissance disponible, configuration du parking : nous analysons chaque paramètre pour installer le bon nombre de bornes, à la bonne puissance.",
          "La gestion dynamique de la charge permet d'équiper plusieurs places sans renforcer systématiquement votre raccordement.",
        ]}
        items={[
          "Audit de l'installation et de la puissance disponible",
          "Dimensionnement selon vos véhicules et vos usages",
          "Bornes murales ou sur pied, en parking extérieur ou couvert",
          "Contrôle d'accès, supervision et gestion de la charge",
          "Installation, mise en service et formation des utilisateurs",
          "Contrat de maintenance pour garantir la disponibilité",
        ]}
      />
      <Process />
      <Aides />
      <RealisationsGrid service="BORNE" hideWhenEmpty title="Nos installations de bornes de recharge" intro="Quelques chantiers récents réalisés par nos équipes." />
      <FaqSection items={faq.filter((f) => f.category === "entreprises")} title="Questions fréquentes des entreprises" />
      <FinalCta title="Équipez votre site en bornes de recharge" />
    </>
  );
}
