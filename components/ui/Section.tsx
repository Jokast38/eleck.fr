import { cn } from "@/lib/utils";
import { Container } from "./Container";

type Tone = "dark" | "graphite" | "light" | "white";

const tones: Record<Tone, string> = {
  dark: "bg-ink text-white",
  graphite: "bg-graphite text-white",
  light: "on-light bg-mist text-ink",
  white: "on-light bg-white text-ink",
};

/** Section de page : alterne fonds sombres et clairs (charte). */
export function Section({
  tone = "dark",
  id,
  className,
  containerClassName,
  labelledBy,
  children,
}: {
  tone?: Tone;
  id?: string;
  className?: string;
  containerClassName?: string;
  /** id du titre de la section, pour l'accessibilité (aria-labelledby) */
  labelledBy?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} data-tone={tone} className={cn("py-16 sm:py-20 lg:py-24", tones[tone], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
