import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChargerIllustration } from "./ChargerIllustration";
import { LedArt, PanelArt, ThermoArt } from "./ServiceArt";

type Tile = { href: string; label: string; art: React.ReactNode; className?: string; artClass?: string };

const tiles: Tile[] = [
  {
    href: "/particuliers",
    label: "Bornes de recharge IRVE",
    art: <ChargerIllustration className="h-full w-full" />,
    className: "row-span-2",
    artClass: "flex-1 min-h-0 py-2",
  },
  { href: "/eclairage-led", label: "Éclairage LED", art: <LedArt className="h-full w-full" />, artClass: "h-24" },
  { href: "/electricite-tertiaire-industrielle", label: "Électricité tertiaire et industrielle", art: <PanelArt className="h-full w-full" />, artClass: "h-24" },
  { href: "/thermographie", label: "Thermographie infrarouge", art: <ThermoArt className="h-full w-full" />, className: "col-span-2", artClass: "h-24" },
];

/**
 * Illustration du hero : les 4 activités d'elec k en mosaïque cliquable.
 * La borne occupe la plus grande tuile (activité principale).
 */
export function HeroServices({ className }: { className?: string }) {
  return (
    <nav aria-label="Nos activités" className={className}>
      <ul className="grid h-[34rem] grid-cols-2 grid-rows-[1fr_1fr_auto] gap-3">
        {tiles.map((t) => (
          <li key={t.href} className={cn("min-h-0", t.className)}>
            <Link
              href={t.href}
              className="group flex h-full flex-col rounded-2xl border border-white/10 bg-graphite/80 p-4 backdrop-blur transition-colors hover:border-brand/60"
            >
              <div className={cn("flex items-center justify-center", t.artClass)}>{t.art}</div>
              <span className="mt-3 flex items-center justify-between gap-2 text-sm font-semibold text-white">
                {t.label}
                <ArrowUpRight aria-hidden className="size-4 shrink-0 text-brand-bright transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
