import { Building2, Gauge, LayoutGrid, Plug, Search, ShieldCheck } from "lucide-react";
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

const path = "/tableau-electrique";
const description =
  "Remplacement et mise à niveau de tableau électrique à Herblay et dans le Val-d'Oise : disjoncteurs, différentiels 30 mA, NF C 15-100. Devis gratuit.";

export const revalidate = 3600;
export const metadata = pageMetadata({ title: "Remplacement de tableau électrique (95)", description, path });

export default async function TableauPage() {
  const faq = await getFaq();
  return (
    <>
      <ServiceJsonLd
        name="Remplacement de tableau électrique"
        serviceType="Remplacement de tableau électrique"
        description={description}
        audience="Particuliers et professionnels"
      />
      <PageHero
        crumbs={[{ label: "Tableau électrique", href: path }]}
        eyebrow="Tableau électrique"
        title="Remplacement et mise à niveau de votre tableau électrique"
        ctaService="electricite"
        intro={
          <p>
            Le tableau électrique protège votre installation et les personnes. Tableau à fusibles, sans différentiel,
            saturé ou qui chauffe : nous le remplaçons ou le mettons à niveau, avec des protections adaptées à chacun de
            vos circuits.
          </p>
        }
      >
        <div className="hidden rounded-2xl border border-white/10 bg-graphite/70 p-8 lg:block">
          <PanelArt uid="page" className="w-full" />
        </div>
      </PageHero>
      <Benefits
        id="prestations"
        eyebrow="Nos prestations"
        title="Un tableau sûr, clair et prêt pour vos futurs besoins"
        items={[
          { icon: Gauge, title: "Remplacement complet", text: "Nouveau tableau équipé de disjoncteurs et de différentiels 30 mA, avec un repérage clair de chaque circuit." },
          { icon: ShieldCheck, title: "Protection différentielle", text: "Ajout ou remplacement des interrupteurs différentiels qui protègent les personnes." },
          { icon: Plug, title: "Nouveaux circuits", text: "De la place pour vos projets : cuisine, chauffage, climatisation, borne de recharge." },
          { icon: Search, title: "Vérification de l'existant", text: "Contrôle des serrages, des protections et de la mise à la terre de votre installation." },
          { icon: LayoutGrid, title: "Tableau divisionnaire", text: "Tableau secondaire pour un garage, un atelier, une extension ou un sous-sol." },
          { icon: Building2, title: "Tableaux professionnels", text: "Tableaux généraux et divisionnaires pour commerces, bureaux et sites industriels." },
        ]}
      />
      <SplitChecklist
        id="signes"
        eyebrow="Quand remplacer son tableau ?"
        title="Les signes d'un tableau à remplacer"
        paragraphs={[
          "Un tableau ancien peut continuer à fonctionner tout en protégeant mal votre logement : l'absence de protection différentielle, par exemple, ne se remarque pas au quotidien.",
          "Le remplacement du tableau est aussi l'occasion d'identifier et d'étiqueter chaque circuit : en cas de panne, vous savez immédiatement quoi couper.",
        ]}
        items={[
          "Fusibles anciens (à broches ou en porcelaine)",
          "Pas de différentiel 30 mA",
          "Tableau plein, sans place pour un nouveau circuit",
          "Traces de chauffe ou odeur de brûlé",
          "Disjoncteurs qui sautent sans raison apparente",
          "Projet de borne de recharge, de cuisine ou d'extension",
        ]}
      />
      <Process />
      <RealisationsGrid service="ELECTRICITE" hideWhenEmpty title="Nos chantiers d'électricité" intro="Quelques chantiers récents réalisés par nos équipes." />
      <FaqSection items={faq.filter((f) => f.category === "habitat")} title="Questions fréquentes sur le tableau électrique" />
      <RelatedLinks items={relatedElectricity(path)} />
      <FinalCta title="Votre tableau électrique a besoin d'être remplacé ?" service="electricite" />
    </>
  );
}
