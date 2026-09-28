"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { footerNav, isNavGroup, mainNav, site, type NavItem } from "@/lib/site";
import { CtaButton } from "@/components/ui/CtaButton";
import { PhoneLink } from "@/components/ui/PhoneLink";

// Menu mobile : groupes à plat, avec un intitulé de section
const mobileSections: { title?: string; items: NavItem[] }[] = [
  { items: [{ label: "Accueil", href: "/" }] },
  ...mainNav
    .filter(isNavGroup)
    .map((g) => ({ title: g.label, items: g.items })),
  {
    title: "elec k",
    items: [
      ...mainNav.filter((i): i is NavItem => !isNavGroup(i)),
      { label: "Zone d'intervention", href: "/zone-intervention" },
      { label: "Questions fréquentes", href: "/faq" },
    ],
  },
];

/** Menu mobile plein écran (< lg). Se ferme au changement de page et avec Échap. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Ferme le menu après une navigation
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="-mr-2 inline-flex size-11 items-center justify-center rounded-md text-white hover:bg-white/10"
      >
        {open ? (
          <X aria-hidden className="size-6" />
        ) : (
          <Menu aria-hidden className="size-6" />
        )}
        <span className="sr-only">
          {open ? "Fermer le menu" : "Ouvrir le menu"}
        </span>
      </button>

      {/* Panneau rendu à la racine du document (portail) : l'en-tête floute son arrière-plan (backdrop-filter),
          ce qui ferait calculer un élément « fixed » placé à l'intérieur par rapport à l'en-tête et non à l'écran. */}
      {mounted &&
        createPortal(
          <div
            id={panelId}
            hidden={!open}
            className="fixed inset-x-0 top-(--header-h) bottom-0 z-40 overflow-y-auto border-t border-white/10 bg-ink lg:hidden"
          >
            <nav aria-label="Navigation mobile" className="px-4 pt-2 pb-28">
              {mobileSections.map((section, i) => (
                <div
                  key={section.title ?? i}
                  className={i > 0 ? "mt-6" : undefined}
                >
                  {section.title && (
                    <p className="mb-1 text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                      {section.title}
                    </p>
                  )}
                  <ul className="divide-y divide-white/10">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={
                            pathname === item.href ? "page" : undefined
                          }
                          className="flex py-3.5 font-display text-lg font-medium text-white aria-[current=page]:text-brand-bright"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="mt-8 flex flex-col gap-3">
                <CtaButton size="lg" className="w-full" />
                <PhoneLink variant="outline" className="w-full" />
              </div>
              <p className="mt-8 text-sm text-muted">
                {site.address.street}, {site.address.postalCode}{" "}
                {site.address.city}
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
                {footerNav.legal.slice(0, 2).map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="underline-offset-4 hover:text-white hover:underline"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>,
          document.body,
        )}
    </div>
  );
}
