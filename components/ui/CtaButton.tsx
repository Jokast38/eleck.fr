import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CTA_HREF, CTA_LABEL, CTA_SHORT_LABEL } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * LE bouton d'action principal du site (règle « un seul CTA »).
 * Toujours rouge, toujours le même libellé, toujours vers /devis.
 * Le libellé n'est pas modifiable : seules la taille et la version courte (barre mobile) varient.
 * `service` présélectionne la prestation dans le formulaire (ex. « eclairage-led »).
 */
export function CtaButton({
  size = "md",
  short = false,
  service,
  className,
}: {
  size?: "sm" | "md" | "lg";
  short?: boolean;
  service?: string;
  className?: string;
}) {
  return (
    <Link
      href={service ? `${CTA_HREF}?service=${service}` : CTA_HREF}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-md bg-brand font-semibold whitespace-nowrap text-white shadow-sm transition-colors",
        "hover:bg-brand-hover active:bg-brand-hover",
        size === "sm" && "h-10 px-4 text-sm",
        size === "md" && "h-12 px-6 text-base",
        size === "lg" && "h-14 px-8 text-lg",
        className,
      )}
    >
      {short ? CTA_SHORT_LABEL : CTA_LABEL}
      <ArrowRight aria-hidden className="size-[1.1em] transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
