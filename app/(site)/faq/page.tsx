import { PageHero } from "@/components/sections/PageHero";
import { FaqList } from "@/components/sections/FaqList";
import { FinalCta } from "@/components/sections/FinalCta";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqCategories, type FaqCategory } from "@/lib/content/faq";
import { getFaq } from "@/lib/content/queries";
import { pageMetadata } from "@/lib/seo";

// Contenu (FAQ, réalisations) géré depuis le dashboard : régénération au plus toutes les heures
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "FAQ borne de recharge : vos questions",
  description:
    "Puissance, aides, copropriété, délais, maintenance : les réponses à vos questions sur l'installation d'une borne de recharge IRVE.",
  path: "/faq",
});

export default async function FaqPage() {
  const faq = await getFaq();
  const categories = Object.keys(faqCategories) as FaqCategory[];
  return (
    <>
      <PageHero
        crumbs={[{ label: "FAQ", href: "/faq" }]}
        eyebrow="Questions fréquentes"
        title="Tout savoir sur l'installation d'une borne de recharge"
        intro={<p>Retrouvez les réponses aux questions les plus courantes. Pour toute question sur votre projet, contactez-nous.</p>}
        showCta={false}
      />
      <Section tone="light">
        <nav aria-label="Catégories de questions" className="mb-12">
          <ul className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <li key={c}>
                <a href={`#${c}`} className="inline-block rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-medium hover:border-ink">
                  {faqCategories[c]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-14">
          {categories.map((c) => (
            <section key={c} id={c} aria-labelledby={`${c}-titre`}>
              <h2 id={`${c}-titre`} className="heading-underline mb-8 font-display text-2xl font-semibold sm:text-3xl">
                {faqCategories[c]}
              </h2>
              <FaqList items={faq.filter((f) => f.category === c)} withSchema={false} />
            </section>
          ))}
        </div>
      </Section>
      {/* Un seul schéma FAQPage pour toute la page */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <FinalCta />
    </>
  );
}
