import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { CtaButton } from "@/components/ui/CtaButton";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { Container } from "@/components/ui/Container";
import { NavLinks } from "./NavLinks";
import { MobileMenu } from "./MobileMenu";

/** En-tête fixe : logo, navigation, téléphone (action secondaire) et CTA unique. */
export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-(--header-h) border-b border-white/10 bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-ink/80">
      <Container className="flex h-full items-center justify-between gap-6">
        <Link href="/" className="shrink-0" aria-label="elec k, retour à l'accueil">
          <Logo title={null} className="h-7 sm:h-8" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-5">
          <PhoneLink className="hidden text-[0.94rem] xl:inline-flex" />
          <CtaButton size="sm" className="hidden md:inline-flex" />
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
