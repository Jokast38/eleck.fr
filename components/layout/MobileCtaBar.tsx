import { CtaButton } from "@/components/ui/CtaButton";
import { PhoneLink } from "@/components/ui/PhoneLink";

/** Barre fixe en bas d'écran sur mobile : CTA « Devis gratuit » + appel. */
export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <div className="flex gap-3">
        <CtaButton short className="flex-1" />
        <PhoneLink variant="outline" iconOnly className="w-14 px-0" />
      </div>
    </div>
  );
}
