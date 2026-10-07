import { Building2, Flame, Lightbulb, Plug, ShieldCheck, Zap } from "lucide-react";
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

const path = "/depannage-electrique";
const description =
  "Électricien pour vos dépannages à Herblay et dans le Val-d'Oise : panne de courant, disjoncteur qui saute, prise ou éclairage hors service.";

export const revalidate = 3600;
export const metadata = pageMetadata({ title: "Dépannage électrique Val-d'Oise (95)", description, path });

export default async function DepannagePage() {
  const faq = await getFaq();
  return (
    <>
      <ServiceJsonLd name="Dépannage électrique" serviceType="Dépannage électrique" description={description} audience="Particuliers et professionnels" />
      <PageHero
        crumbs={[{ label: "Dépannage électrique", href: path }]}
        eyebrow="Dépannage électrique"
        title="Dépannage électrique à Herblay-sur-Seine et dans le Val-d'Oise"
        ctaService="electricite"
        intro={
          <p>
            Panne de courant, disjoncteur qui saute, différentiel qui déclenche, prises ou éclairage qui ne fonctionnent
            plus : nos électriciens recherchent l&apos;origine de la panne et remettent votre installation en service en
            toute sécurité, chez les particuliers comme chez les professionnels.
          </p>
        }
      >
        <div className="hidden rounded-2xl border border-white/10 bg-graphite/70 p-8 lg:block">
          <PanelArt uid="page" className="w-full" />
        </div>
      </PageHero>
      <Benefits
        id="pannes"
        eyebrow="Nos interventions"
        title="Les pannes électriques que nous traitons"
        items={[
          { icon: Zap, title: "Panne de courant", text: "Coupure totale ou partielle, disjoncteur général qui ne se réenclenche plus." },
          { icon: ShieldCheck, title: "Disjoncteur ou différentiel qui saute", text: "Recherche du défaut d'isolement, de la surcharge ou de l'appareil en cause." },
          { icon: Plug, title: "Prises et interrupteurs", text: "Prise qui ne fonctionne plus, qui chauffe ou qui noircit, interrupteur défectueux." },
          { icon: Lightbulb, title: "Éclairage", text: "Circuit d'éclairage hors service, points lumineux qui grésillent ou clignotent." },
          { icon: Flame, title: "Odeur de brûlé, échauffement", text: "Coupez le circuit concerné et appelez-nous : ces signes ne doivent jamais être ignorés." },
          { icon: Building2, title: "Locaux professionnels", text: "Commerces, bureaux, ateliers : nous remettons aussi votre installation en service pour reprendre votre activité." },
        ]}
      />
      <SplitChecklist
        id="reflexes"
        eyebrow="En attendant l'électricien"
        title="Les bons réflexes en cas de panne"
        paragraphs={[
          "Commencez par regarder votre tableau électrique : un disjoncteur ou un interrupteur différentiel abaissé vous indique le circuit concerné.",
          "Ne démontez jamais une prise ou un appareillage sous tension, et ne remplacez jamais une protection par un modèle de calibre supérieur : c'est une cause fréquente d'échauffement et d'incendie.",
        ]}
        items={[
          "Repérez le disjoncteur ou le différentiel abaissé",
          "Débranchez les appareils du circuit concerné",
          "Réenclenchez la protection une seule fois",
          "Si elle retombe, laissez le circuit coupé",
          "Odeur de brûlé ou fumée : coupez le disjoncteur général",
          "Appelez-nous en décrivant ce que vous constatez",
        ]}
      />
      <Process
        title="Un dépannage en 4 étapes"
        intro="Un diagnostic méthodique pour réparer la cause de la panne, pas seulement ses effets."
        steps={[
          { title: "Appel", text: "Vous nous décrivez la panne par téléphone. Nous vous donnons les premiers conseils de sécurité." },
          { title: "Diagnostic sur place", text: "Recherche de l'origine : appareil, circuit, protection ou défaut d'isolement." },
          { title: "Réparation", text: "Remplacement des éléments défectueux et remise en service, après accord sur l'intervention." },
          { title: "Conseils", text: "Si votre installation présente d'autres faiblesses, nous vous les signalons, sans obligation de travaux." },
        ]}
      />
      <RealisationsGrid service="ELECTRICITE" hideWhenEmpty title="Nos chantiers d'électricité" intro="Quelques chantiers récents réalisés par nos équipes." />
      <FaqSection items={faq.filter((f) => f.category === "habitat")} title="Questions fréquentes sur le dépannage électrique" />
      <RelatedLinks items={relatedElectricity(path)} />
      <FinalCta
        title="Une panne électrique ?"
        text="Appelez-nous en décrivant la situation, ou envoyez-nous votre demande en ligne : nous vous recontactons pour organiser l'intervention."
        service="electricite"
      />
    </>
  );
}
