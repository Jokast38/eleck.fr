import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const defaultSteps = [
  {
    title: "Prise de contact",
    text: "Vous décrivez votre projet via le formulaire ou par téléphone. Nous vous rappelons pour faire le point sur vos besoins.",
  },
  {
    title: "Visite technique et étude",
    text: "Nous examinons votre installation électrique et les contraintes du site pour proposer la bonne solution.",
  },
  {
    title: "Devis détaillé",
    text: "Vous recevez un devis clair : matériel, travaux, délais et, le cas échéant, les aides auxquelles vous pouvez prétendre.",
  },
  {
    title: "Réalisation et suivi",
    text: "Travaux, tests et mise en service, puis maintenance si vous le souhaitez. Le même interlocuteur, du début à la fin.",
  },
];

/** « Notre méthode en 4 étapes ». */
export function Process({
  steps = defaultSteps,
  title = "Notre méthode en 4 étapes",
  intro = "Borne, éclairage ou électricité : un déroulé simple et transparent, pour que vous sachiez toujours où en est votre projet.",
}: {
  steps?: { title: string; text: string }[];
  title?: string;
  intro?: string;
}) {
  return (
    <Section tone="white" labelledBy="methode">
      <SectionHeading id="methode" tone="light" eyebrow="Accompagnement" title={title} intro={intro} />
      <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.title} className="relative">
            <div className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ink font-display text-lg font-semibold text-white">
                {i + 1}
              </span>
              {i < steps.length - 1 && <span aria-hidden className="hidden h-[3px] flex-1 bg-brand/80 lg:block" />}
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 leading-relaxed text-muted-dark">{s.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
