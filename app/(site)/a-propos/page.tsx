import Link from "next/link";
import { ArrowRight, Ear, Handshake, ShieldCheck, Target } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/lib/content/services";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { PageHero } from "@/components/sections/PageHero";
import { Benefits } from "@/components/sections/Benefits";
import { SplitChecklist } from "@/components/sections/SplitChecklist";
import { FinalCta } from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "À propos d'elec k, électricien à Herblay",
  description:
    "elec k, électricien à Herblay-sur-Seine : bornes de recharge certifiées IRVE, éclairage LED, électricité tertiaire et industrielle, thermographie.",
  path: "/a-propos",
});

export default function AProposPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "À propos", href: "/a-propos" }]}
        eyebrow="À propos"
        title="elec k, votre partenaire pour une énergie mieux maîtrisée"
        intro={
          <>
            <p>
              elec k est une entreprise d&apos;électricité installée à Herblay-sur-Seine, dans le Val-d&apos;Oise. Elle
              est née d&apos;un constat : le gaspillage d&apos;énergie, notamment dans l&apos;éclairage de nos bâtiments,
              de nos commerces et de nos industries.
            </p>
            <p>
              Spécialisée à l&apos;origine dans l&apos;éclairage LED et l&apos;électricité tertiaire et industrielle, elle
              accompagne aujourd&apos;hui aussi particuliers, copropriétés et entreprises dans leur passage à la mobilité
              électrique.
            </p>
          </>
        }
      />
      <ClientLogos />
      <Section tone="light" labelledBy="metiers">
        <SectionHeading
          id="metiers"
          tone="light"
          eyebrow="Nos métiers"
          title="Quatre savoir-faire, un seul interlocuteur"
          intro="Nous travaillons pour des particuliers, des copropriétés, des sociétés privées, des sociétés d'économie mixte et des collectivités, en travaux neufs comme en rénovation."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <li key={s.key}>
              <Link href={s.href} className="group flex h-full flex-col rounded-xl border border-black/10 bg-white p-6 hover:border-ink">
                <span className="font-display text-lg font-semibold">{s.title}</span>
                <span className="mt-2 text-muted-dark">{s.pitch}</span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline decoration-brand decoration-2 underline-offset-4">
                  En savoir plus <ArrowRight aria-hidden className="size-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <SplitChecklist
        id="irve"
        eyebrow="Certification"
        title="Qualification IRVE : la garantie d'une installation conforme"
        paragraphs={[
          "Les Infrastructures de Recharge pour Véhicules Électriques (IRVE) obéissent à des exigences techniques et réglementaires précises. Pour toute borne de plus de 3,7 kW, l'intervention d'un installateur qualifié est obligatoire.",
          `elec k détient la ${site.certification}. Cette qualification atteste de nos compétences et conditionne l'accès aux aides financières ainsi que la validité des garanties constructeur.`,
        ]}
        items={[
          "Installateur qualifié IRVE",
          "Respect des normes électriques en vigueur",
          "Matériel sélectionné pour sa fiabilité",
          "Documents d'installation remis à la mise en service",
        ]}
      />
      <Benefits
        id="engagements"
        eyebrow="Notre charte qualité"
        title="Écoute, réactivité, engagement et rigueur"
        items={[
          { icon: Ear, title: "Écoute", text: "Nous prenons le temps de comprendre votre usage, votre logement ou votre site avant de proposer une solution." },
          { icon: Target, title: "Adaptation et réactivité", text: "Une solution adaptée à votre budget et à vos contraintes, et des réponses rapides à vos questions." },
          { icon: Handshake, title: "Engagement et rigueur", text: "Un chantier soigné, des délais tenus et un suivi assuré après l'installation." },
          { icon: ShieldCheck, title: "Transparence", text: "Un devis détaillé, sans surprise, qui précise le matériel, les travaux et les aides applicables." },
        ]}
      />
      <FinalCta />
    </>
  );
}
