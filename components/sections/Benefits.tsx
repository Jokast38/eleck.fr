import type { LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type Benefit = { icon: LucideIcon; title: string; text: string };

/** Grille de bénéfices (pages cibles). */
export function Benefits({
  id,
  eyebrow,
  title,
  intro,
  items,
  tone = "light",
}: {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  items: Benefit[];
  tone?: "light" | "dark";
}) {
  const light = tone === "light";
  return (
    <Section tone={light ? "light" : "dark"} labelledBy={id}>
      <SectionHeading id={id} tone={tone} eyebrow={eyebrow} title={title} intro={intro} />
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, text }) => (
          <li
            key={title}
            className={light ? "rounded-xl border border-black/10 bg-white p-7" : "rounded-xl border border-white/10 bg-graphite p-7"}
          >
            <Icon aria-hidden className="size-7 text-brand" />
            <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
            <p className={`mt-2 leading-relaxed ${light ? "text-muted-dark" : "text-muted"}`}>{text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
