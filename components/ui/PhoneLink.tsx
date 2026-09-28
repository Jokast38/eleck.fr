import { Phone } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Lien téléphone : action SECONDAIRE (style lien ou bouton contour, jamais rouge plein).
 * La classe `plausible-event-name=...` déclenche l'événement de conversion « Clic téléphone ».
 */
export function PhoneLink({
  variant = "link",
  tone = "dark",
  className,
  iconOnly = false,
}: {
  variant?: "link" | "outline";
  tone?: "dark" | "light";
  className?: string;
  iconOnly?: boolean;
}) {
  return (
    <a
      href={site.phone.href}
      aria-label={iconOnly ? `Appeler elec k au ${site.phone.display}` : undefined}
      className={cn(
        "plausible-event-name=Clic+telephone inline-flex items-center gap-2 font-semibold whitespace-nowrap transition-colors",
        variant === "link" && (tone === "dark" ? "text-white hover:text-brand-bright" : "text-ink hover:text-brand"),
        variant === "outline" &&
          cn(
            "h-12 justify-center rounded-md border-2 px-5",
            tone === "dark"
              ? "border-white/70 text-white hover:border-white hover:bg-white hover:text-ink"
              : "border-ink text-ink hover:bg-ink hover:text-white",
          ),
        className,
      )}
    >
      <Phone aria-hidden className="size-[1.05em] shrink-0" />
      {!iconOnly && <span>{site.phone.display}</span>}
    </a>
  );
}
