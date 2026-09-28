import { cn } from "@/lib/utils";

/**
 * Titre de section (H2) avec le soulignement rouge rappelant le logo.
 * `eyebrow` : petit sur-titre facultatif. `tone` adapte les couleurs secondaires au fond.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "dark",
  as: Tag = "h2",
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  as?: "h1" | "h2";
  className?: string;
}) {
  const center = align === "center";
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-sm font-semibold uppercase tracking-[0.14em]",
            tone === "dark" ? "text-brand-bright" : "text-brand",
          )}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        id={id}
        className={cn(
          "heading-underline font-display text-3xl font-semibold leading-tight sm:text-4xl",
          center && "heading-underline-center",
        )}
      >
        {title}
      </Tag>
      {intro && (
        <p className={cn("mt-6 text-lg leading-relaxed", tone === "dark" ? "text-muted" : "text-muted-dark")}>{intro}</p>
      )}
    </div>
  );
}
