import { cn } from "@/lib/utils";
import { LOGO_LETTERS, LOGO_STROKE, LOGO_UNDERLINE, LOGO_VIEWBOX, RED } from "@/brand/logo-paths.mjs";

type LogoProps = {
  /** "light" = lettres blanches (fond sombre, version principale) ; "dark" = lettres noires (fond clair) */
  tone?: "light" | "dark";
  className?: string;
  /** Titre accessible ; passer null si le logo est décoratif (ex. déjà dans un lien étiqueté) */
  title?: string | null;
};

/** Logo « elec k » en SVG inline (aucune requête réseau, net à toutes les tailles). */
export function Logo({ tone = "light", className, title = "elec k" }: LogoProps) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={cn("h-8 w-auto", className)}
      role={title ? "img" : undefined}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <g
        fill="none"
        stroke={tone === "light" ? "#FFFFFF" : "#0A0A0A"}
        strokeWidth={LOGO_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {LOGO_LETTERS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <rect {...LOGO_UNDERLINE} rx={1.5} fill={RED} />
    </svg>
  );
}
