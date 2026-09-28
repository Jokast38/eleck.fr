"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { isNavGroup, mainNav, type NavGroup } from "@/lib/site";
import { cn } from "@/lib/utils";

const linkClass = (active: boolean) =>
  cn(
    "relative flex items-center gap-1 rounded px-2 py-2 text-sm font-medium whitespace-nowrap text-white/85 transition-colors hover:text-white xl:px-3 xl:text-[0.94rem]",
    "after:absolute after:inset-x-2 after:-bottom-0.5 after:h-[3px] after:origin-left after:scale-x-0 after:bg-brand after:transition-transform hover:after:scale-x-100 xl:after:inset-x-3",
    active && "text-white after:scale-x-100",
  );

/** Menu déroulant accessible : ouverture au survol ou au clic, fermeture avec Échap ou en cliquant ailleurs. */
function Dropdown({ group, pathname }: { group: NavGroup; pathname: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = group.items.some((i) => pathname === i.href || pathname.startsWith(`${i.href}/`));

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        ref.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        closeTimer.current = setTimeout(() => setOpen(false), 150);
      }}
      onBlur={(e) => !ref.current?.contains(e.relatedTarget as Node) && setOpen(false)}
    >
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)} className={linkClass(active)}>
        {group.label}
        <ChevronDown aria-hidden className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>
      <div id={id} hidden={!open} className="absolute top-full left-0 z-50 pt-3">
        <ul className="w-80 rounded-xl border border-white/10 bg-graphite p-2 shadow-2xl">
          {group.items.map((item) => {
            const current = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={cn("block rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5", current && "bg-white/5")}
                >
                  <span className={cn("block text-sm font-semibold", current ? "text-brand-bright" : "text-white")}>{item.label}</span>
                  {item.description && <span className="block text-xs text-muted">{item.description}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}

/** Navigation principale (desktop) avec indication de la page courante. */
export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-1">
      {mainNav.map((item) =>
        isNavGroup(item) ? (
          <Dropdown key={item.label} group={item} pathname={pathname} />
        ) : (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined}
              className={linkClass(pathname === item.href || pathname.startsWith(`${item.href}/`))}
            >
              {item.label}
            </Link>
          </li>
        ),
      )}
    </ul>
  );
}
