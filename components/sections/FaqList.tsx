import { Plus } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import type { FaqItem } from "@/lib/content/faq";
import { cn } from "@/lib/utils";

/**
 * Accordéon de questions (details/summary natif : accessible au clavier, aucun JavaScript).
 * `withSchema` ajoute les données structurées FAQPage (une seule fois par page).
 */
export function FaqList({
  items,
  tone = "light",
  withSchema = true,
}: {
  items: FaqItem[];
  tone?: "light" | "dark";
  withSchema?: boolean;
}) {
  const light = tone === "light";
  return (
    <>
      <div className={cn("divide-y rounded-xl border", light ? "divide-black/10 border-black/10 bg-white" : "divide-white/10 border-white/10 bg-graphite")}>
        {items.map((f) => (
          <details key={f.q} className="group">
            <summary
              className={cn(
                "flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 font-display text-lg font-medium [&::-webkit-details-marker]:hidden",
                light ? "hover:text-brand" : "hover:text-brand-bright",
              )}
            >
              {f.q}
              <Plus aria-hidden className="size-5 shrink-0 text-brand transition-transform group-open:rotate-45" />
            </summary>
            <p className={cn("px-6 pb-6 leading-relaxed", light ? "text-muted-dark" : "text-muted")}>{f.a}</p>
          </details>
        ))}
      </div>
      {withSchema && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }}
        />
      )}
    </>
  );
}
