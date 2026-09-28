import { Check } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Section texte + liste à cocher (ex. « Ce qui est compris dans notre intervention »). */
export function SplitChecklist({
  id,
  eyebrow,
  title,
  paragraphs,
  items,
  tone = "dark",
}: {
  id: string;
  eyebrow?: string;
  title: string;
  paragraphs: string[];
  items: string[];
  tone?: "light" | "dark";
}) {
  const light = tone === "light";
  return (
    <Section tone={light ? "white" : "dark"} labelledBy={id}>
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading id={id} tone={tone} eyebrow={eyebrow} title={title} />
          <div className={`mt-6 space-y-4 text-lg leading-relaxed ${light ? "text-muted-dark" : "text-muted"}`}>
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <ul className={`space-y-4 rounded-xl border p-7 sm:p-9 ${light ? "border-black/10 bg-mist" : "border-white/10 bg-graphite"}`}>
          {items.map((it) => (
            <li key={it} className="flex gap-4">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <Check aria-hidden className="size-4" strokeWidth={3} />
              </span>
              <span className={light ? "text-ink" : "text-white/90"}>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
