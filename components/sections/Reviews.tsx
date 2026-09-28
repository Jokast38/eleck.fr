import { ExternalLink, MessageSquareQuote } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Avis clients : UNIQUEMENT de vrais avis issus de la fiche Google Business Profile.
 * Aucun témoignage n'est inventé. Tant que l'URL de la fiche n'est pas renseignée
 * (NEXT_PUBLIC_GOOGLE_REVIEWS_URL), la section invite simplement à consulter/déposer un avis.
 * L'affichage des avis eux-mêmes (API Google Places, côté serveur) sera branché à l'étape 6.
 */
export function Reviews() {
  const reviewsUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL;
  return (
    <Section tone="white" labelledBy="avis">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <SectionHeading
          id="avis"
          tone="light"
          eyebrow="Avis clients"
          title="Ils nous ont confié leur projet"
          intro="Nous publions uniquement les avis authentiques laissés par nos clients sur notre fiche Google."
        />
        <div className="flex shrink-0 flex-col items-start gap-3 rounded-xl border border-black/10 bg-mist p-6">
          <MessageSquareQuote aria-hidden className="size-8 text-ink" />
          <p className="font-medium">Nos avis sur Google</p>
          {reviewsUrl ? (
            <a
              href={reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-ink underline underline-offset-4 decoration-brand decoration-2"
            >
              Consulter nos avis sur Google <ExternalLink aria-hidden className="size-4" />
              <span className="sr-only">(nouvel onglet)</span>
            </a>
          ) : (
            <p className="text-sm text-muted-dark">Lien vers la fiche Google Business Profile à renseigner.</p>
          )}
        </div>
      </div>
    </Section>
  );
}
