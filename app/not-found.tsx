import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { SkipLink } from "@/components/layout/SkipLink";
import { NotFoundContent } from "@/components/sections/NotFoundContent";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: true },
};

/** 404 globale (URL ne correspondant à aucune route) : rendue hors du groupe (site), d'où l'en-tête et le pied ajoutés ici. */
export default function NotFound() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="contenu" tabIndex={-1} className="pt-(--header-h) outline-none">
        <NotFoundContent />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  );
}
