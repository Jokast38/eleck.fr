import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/** Badge « Certifié IRVE » (réassurance). */
export function IrveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-white backdrop-blur",
        className,
      )}
    >
      <ShieldCheck aria-hidden className="size-4 text-brand-bright" />
      Installateur certifié IRVE
    </span>
  );
}
