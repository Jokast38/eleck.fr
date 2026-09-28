import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";

/** Gabarit des pages légales : en-tête sombre sobre + contenu sur fond blanc. */
export function LegalPage({
  title,
  path,
  updatedAt,
  children,
}: {
  title: string;
  path: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section aria-labelledby="page-title" className="border-b border-white/10 bg-ink">
        <Container className="py-12 sm:py-16">
          <Breadcrumbs items={[{ label: title, href: path }]} />
          <h1 id="page-title" className="heading-underline mt-8 font-display text-4xl font-semibold sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 text-sm text-muted">Dernière mise à jour : {updatedAt}</p>
        </Container>
      </section>
      <div className="on-light bg-white py-14 sm:py-20">
        <Container>
          <div className="prose-legal">{children}</div>
        </Container>
      </div>
    </>
  );
}

/** Valeur à compléter, surlignée pour être repérée avant la mise en ligne. */
export function Todo({ children }: { children: React.ReactNode }) {
  return <mark>{children}</mark>;
}
