import { CalendarCheck, Cable, Search, ShieldCheck, Timer, Wrench } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Benefits } from "@/components/sections/Benefits";
import { SplitChecklist } from "@/components/sections/SplitChecklist";
import { FaqSection } from "@/components/sections/FaqSection";
import { RealisationsGrid } from "@/components/sections/RealisationsGrid";
import { FinalCta } from "@/components/sections/FinalCta";
import { ServiceJsonLd } from "@/components/seo/BusinessJsonLd";
import { getFaq } from "@/lib/content/queries";
import { pageMetadata } from "@/lib/seo";

const description =
  "Maintenance et dépannage de bornes de recharge dans le Val-d'Oise : contrôle périodique, diagnostic, réparation. Technicien certifié IRVE. Devis gratuit.";

// Contenu (FAQ, réalisations) géré depuis le dashboard : régénération au plus toutes les heures
export const revalidate = 3600;

export const metadata = pageMetadata({ title: "Maintenance et dépannage de bornes de recharge", description, path: "/maintenance" });

export default async function MaintenancePage() {
  const faq = await getFaq();
  return (
    <>
      <ServiceJsonLd name="Maintenance et dépannage de bornes de recharge" description={description} />
      <PageHero
        crumbs={[{ label: "Maintenance", href: "/maintenance" }]}
        eyebrow="Maintenance et dépannage"
        title="Une borne entretenue, c'est une recharge sûre et toujours disponible"
        intro={
          <p>
            Contrôles périodiques, diagnostic de panne, remplacement de pièces : nous veillons au bon fonctionnement de
            votre borne, à domicile, en copropriété comme en entreprise.
          </p>
        }
      />
      <Benefits
        id="services-maintenance"
        eyebrow="Nos prestations"
        title="Maintenance préventive et dépannage"
        items={[
          { icon: CalendarCheck, title: "Contrôle périodique", text: "Vérification des protections électriques, des serrages, des connecteurs et du câble de recharge." },
          { icon: Search, title: "Diagnostic de panne", text: "Borne qui ne démarre plus, recharge interrompue, erreur affichée : nous identifions l'origine du problème." },
          { icon: Wrench, title: "Réparation", text: "Remplacement des pièces défectueuses et remise en service de votre borne." },
          { icon: Cable, title: "Mise en conformité", text: "Vérification d'une installation existante et travaux de mise en conformité si nécessaire." },
          { icon: ShieldCheck, title: "Sécurité des utilisateurs", text: "Une borne partagée doit rester sûre pour tous : un entretien régulier limite les risques." },
          { icon: Timer, title: "Disponibilité", text: "Pour une flotte ou une copropriété, chaque borne hors service pénalise les utilisateurs." },
        ]}
      />
      <SplitChecklist
        id="contrat"
        eyebrow="Contrat de maintenance"
        title="Un suivi régulier, adapté au nombre de bornes"
        paragraphs={[
          "Pour les copropriétés et les entreprises, un contrat de maintenance permet de planifier les contrôles et de bénéficier d'une intervention prioritaire en cas de panne.",
          "Pour les particuliers, une visite de contrôle ponctuelle suffit généralement à s'assurer du bon état de l'installation.",
        ]}
        items={[
          "Visites de contrôle planifiées",
          "Rapport d'intervention après chaque visite",
          "Diagnostic et dépannage sur demande",
          "Conseils sur les mises à jour et l'évolution de l'installation",
        ]}
        tone="light"
      />
      <RealisationsGrid service="BORNE" hideWhenEmpty title="Nos installations de bornes de recharge" intro="Quelques chantiers récents réalisés par nos équipes." />
      <FaqSection items={faq.filter((f) => f.category === "maintenance")} title="Questions fréquentes sur la maintenance" />
      <FinalCta title="Une borne à entretenir ou à dépanner ?" text="Décrivez le problème ou votre besoin d'entretien dans le formulaire. Nous revenons vers vous pour organiser l'intervention." />
    </>
  );
}
