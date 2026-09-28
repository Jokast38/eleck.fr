import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { FaqItem } from "@/lib/content/faq";
import { FaqList } from "./FaqList";

/** Section FAQ (titre + accordéon + lien vers /faq), avec schéma FAQPage. */
export function FaqSection({ items, title = "Vos questions, nos réponses" }: { items: FaqItem[]; title?: string }) {
  return (
    <Section tone="light" labelledBy="faq">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <SectionHeading
            id="faq"
            tone="light"
            eyebrow="FAQ"
            title={title}
            intro="Vous ne trouvez pas votre réponse ? Posez-nous directement votre question lors de votre demande de devis."
          />
          <Link href="/faq" className="mt-8 inline-flex items-center gap-1.5 font-semibold text-ink underline decoration-brand decoration-2 underline-offset-4">
            Toutes les questions fréquentes <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
        <FaqList items={items} />
      </div>
    </Section>
  );
}
