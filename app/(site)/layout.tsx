import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { SkipLink } from "@/components/layout/SkipLink";
import { AttributionTracker } from "@/components/analytics/AttributionTracker";

/** Layout du site vitrine public. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="contenu" tabIndex={-1} className="pt-(--header-h) outline-none">
        {children}
      </main>
      <Footer />
      <MobileCtaBar />
      <AttributionTracker />
    </>
  );
}
