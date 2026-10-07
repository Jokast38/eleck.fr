import { FileCheck2, ShieldCheck, Users, Wrench } from "lucide-react";
import { Container } from "@/components/ui/Container";

const items = [
  { icon: ShieldCheck, label: "Certifié IRVE", sub: "Qualification AFNOR" },
  { icon: FileCheck2, label: "Devis gratuit", sub: "Après étude de votre projet" },
  { icon: Users, label: "Particuliers et professionnels", sub: "Maisons, copropriétés, entreprises" },
  { icon: Wrench, label: "Dépannage et travaux", sub: "Électricité, bornes, LED, thermographie" },
];

/** Bandeau de réassurance sous le hero. */
export function TrustBar() {
  return (
    <section aria-label="Nos engagements" className="border-y border-white/10 bg-graphite">
      <Container>
        <ul className="grid grid-cols-1 divide-white/10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x">
          {items.map(({ icon: Icon, label, sub }) => (
            <li key={label} className="flex items-center gap-4 py-6 lg:px-6 lg:first:pl-0">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand-bright">
                <Icon aria-hidden className="size-5" />
              </span>
              <span>
                <span className="block font-display font-semibold text-white">{label}</span>
                <span className="block text-sm text-muted">{sub}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
