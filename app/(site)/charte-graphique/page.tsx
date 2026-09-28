import type { Metadata } from "next";
import Image from "next/image";
import { Logo } from "@/components/brand/Logo";
import { CtaButton } from "@/components/ui/CtaButton";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { IrveBadge } from "@/components/ui/IrveBadge";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contrastRatio } from "@/lib/contrast";

// Page interne de référence du design system : non indexée, exclue du sitemap.
export const metadata: Metadata = {
  title: "Charte graphique (interne)",
  robots: { index: false, follow: false },
};

const palette = [
  { name: "Noir principal", token: "ink", hex: "#0A0A0A", use: "Fonds, header, footer" },
  { name: "Anthracite", token: "graphite", hex: "#1A1A1A", use: "Cartes, sections secondaires" },
  { name: "Anthracite 2", token: "graphite-2", hex: "#2A2A2A", use: "Bordures, survols" },
  { name: "Rouge accent", token: "brand", hex: "#E30613", use: "CTA, soulignements, icônes" },
  { name: "Rouge survol", token: "brand-hover", hex: "#B8050F", use: "Survol des CTA" },
  { name: "Rouge lisible", token: "brand-bright", hex: "#FF4D57", use: "Petits textes rouges sur fond noir" },
  { name: "Blanc", token: "white", hex: "#FFFFFF", use: "Texte sur fond sombre" },
  { name: "Gris clair", token: "mist", hex: "#F5F5F5", use: "Fonds de sections claires" },
];

const pairs: [string, string, string][] = [
  ["Blanc sur rouge (bouton CTA)", "#FFFFFF", "#E30613"],
  ["Blanc sur rouge survol", "#FFFFFF", "#B8050F"],
  ["Rouge sur blanc", "#E30613", "#FFFFFF"],
  ["Rouge sur gris clair", "#E30613", "#F5F5F5"],
  ["Rouge sur noir (grands textes, icônes)", "#E30613", "#0A0A0A"],
  ["Rouge lisible sur noir (petits textes)", "#FF4D57", "#0A0A0A"],
  ["Rouge lisible sur anthracite", "#FF4D57", "#1A1A1A"],
  ["Gris secondaire sur noir", "#A3A3A3", "#0A0A0A"],
  ["Gris secondaire sur anthracite", "#A3A3A3", "#1A1A1A"],
  ["Gris foncé sur gris clair", "#525252", "#F5F5F5"],
];

function Verdict({ ratio }: { ratio: number }) {
  const label = ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA grand texte" : "Échec";
  const ok = ratio >= 4.5;
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-semibold ${ok ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}>
      {label}
    </span>
  );
}

export default function ChartePage() {
  return (
    <>
      <Section tone="dark" labelledBy="charte-titre">
        <SectionHeading
          as="h1"
          id="charte-titre"
          eyebrow="Design system"
          title="Charte graphique elec k"
          intro="Référence interne : logo, palette, contrastes, typographie et composants. Cette page n'est pas indexée."
        />
      </Section>

      <Section tone="light" labelledBy="charte-logo">
        <SectionHeading id="charte-logo" tone="light" title="Logo" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <figure className="flex flex-col items-center justify-center rounded-lg bg-ink p-12">
            <Logo className="h-20" />
            <figcaption className="mt-6 text-sm text-muted">Version principale · logo-white.svg</figcaption>
          </figure>
          <figure className="flex flex-col items-center justify-center rounded-lg border border-black/10 bg-white p-12">
            <Logo tone="dark" className="h-20" />
            <figcaption className="mt-6 text-sm text-muted-dark">Version fond clair · logo.svg</figcaption>
          </figure>
        </div>
        <div className="mt-6 flex flex-wrap items-end gap-6 rounded-lg border border-black/10 bg-white p-8">
          {[16, 32, 48, 64, 128].map((s) => (
            <figure key={s} className="text-center">
              <Image src="/icon-512.png" alt="" width={s} height={s} unoptimized />
              <figcaption className="mt-2 text-xs text-muted-dark">{s}px</figcaption>
            </figure>
          ))}
          <p className="text-sm text-muted-dark">Favicon « k » souligné : favicon.ico, icon.svg, apple-icon.png, icônes 192/512.</p>
        </div>
      </Section>

      <Section tone="white" labelledBy="charte-couleurs">
        <SectionHeading id="charte-couleurs" tone="light" title="Palette" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {palette.map((c) => (
            <li key={c.token} className="overflow-hidden rounded-lg border border-black/10">
              <div className="h-24" style={{ background: c.hex }} />
              <div className="p-4">
                <p className="font-display font-semibold">{c.name}</p>
                <p className="font-mono text-sm text-muted-dark">
                  {c.hex} · <code>{c.token}</code>
                </p>
                <p className="mt-1 text-sm text-muted-dark">{c.use}</p>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="mt-14 font-display text-xl font-semibold">Contrastes (WCAG 2.1)</h3>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-muted-dark">
                <th className="py-3 pr-4 font-medium">Combinaison</th>
                <th className="py-3 pr-4 font-medium">Aperçu</th>
                <th className="py-3 pr-4 font-medium">Ratio</th>
                <th className="py-3 font-medium">Niveau</th>
              </tr>
            </thead>
            <tbody>
              {pairs.map(([label, fg, bg]) => {
                const r = contrastRatio(fg, bg);
                return (
                  <tr key={label} className="border-b border-black/5">
                    <td className="py-3 pr-4">{label}</td>
                    <td className="py-3 pr-4">
                      <span className="inline-block rounded px-3 py-1 font-semibold" style={{ color: fg, background: bg }}>
                        Borne de recharge
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-mono">{r.toFixed(2)}:1</td>
                    <td className="py-3">
                      <Verdict ratio={r} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted-dark">
          Règle : le rouge #E30613 sur fond noir est réservé aux icônes, soulignements et textes de 24 px et plus. Pour
          les petits textes rouges sur fond sombre, utiliser <code>brand-bright</code>.
        </p>
      </Section>

      <Section tone="dark" labelledBy="charte-typo">
        <SectionHeading id="charte-typo" title="Typographie" intro="Titres : Poppins (géométrique, proche du logo). Texte : Inter." />
        <div className="mt-10 space-y-6">
          <p className="font-display text-5xl font-semibold">H1 · Poppins 600</p>
          <p className="font-display text-3xl font-semibold">H2 · titre de section</p>
          <p className="font-display text-xl font-semibold">H3 · titre de carte</p>
          <p className="max-w-2xl text-lg leading-relaxed text-white/80">
            Texte courant Inter 18 px. Phrases courtes, bénéfices avant les caractéristiques techniques. Une borne
            installée dans les règles, pour recharger chez vous en toute sérénité.
          </p>
        </div>
      </Section>

      <Section tone="graphite" labelledBy="charte-composants">
        <SectionHeading id="charte-composants" title="Composants" />
        <div className="mt-10 space-y-10">
          <div>
            <p className="mb-4 text-sm text-muted">CTA unique (3 tailles, libellé figé) et version courte mobile</p>
            <div className="flex flex-wrap items-center gap-4">
              <CtaButton size="sm" />
              <CtaButton />
              <CtaButton size="lg" />
              <CtaButton short />
            </div>
          </div>
          <div>
            <p className="mb-4 text-sm text-muted">Téléphone : action secondaire (lien ou contour)</p>
            <div className="flex flex-wrap items-center gap-6">
              <PhoneLink />
              <PhoneLink variant="outline" />
              <PhoneLink variant="outline" iconOnly className="w-14 px-0" />
            </div>
          </div>
          <div>
            <p className="mb-4 text-sm text-muted">Badge de réassurance</p>
            <IrveBadge />
          </div>
        </div>
      </Section>

      <Section tone="light" labelledBy="charte-fond-clair">
        <SectionHeading
          id="charte-fond-clair"
          tone="light"
          eyebrow="Sur-titre"
          title="Titre de section sur fond clair"
          intro="Le soulignement rouge rappelle le logo sous chaque H2."
        />
        <div className="mt-8 flex flex-wrap gap-4">
          <CtaButton />
          <PhoneLink variant="outline" tone="light" />
        </div>
      </Section>
    </>
  );
}
