"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  FileText,
  HelpCircle,
  History,
  Images,
  Inbox,
  KanbanSquare,
  LayoutDashboard,
  Menu,
  Settings,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

const groups = [
  {
    label: "Activité",
    items: [
      { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
      { href: "/admin/demandes", label: "Demandes", icon: ClipboardList },
      { href: "/admin/pipeline", label: "Pipeline", icon: KanbanSquare },
      { href: "/admin/messagerie", label: "Messagerie", icon: Inbox, badge: "unread" as const },
    ],
  },
  {
    label: "Contenu du site",
    items: [
      { href: "/admin/realisations", label: "Réalisations", icon: Images },
      { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
      { href: "/admin/modeles", label: "Modèles d'e-mails", icon: FileText },
    ],
  },
  {
    label: "Administration",
    items: [
      { href: "/admin/parametres", label: "Paramètres", icon: Settings },
      { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users, adminOnly: true },
      { href: "/admin/journal", label: "Journal d'activité", icon: History, adminOnly: true },
      { href: "/admin/compte", label: "Mon compte", icon: UserCog },
    ],
  },
];

export function Sidebar({ role, unread, footer }: { role: "ADMIN" | "EMPLOYE"; unread: number; footer: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const nav = (
    <nav aria-label="Navigation du dashboard" className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
      {groups.map((g) => (
        <div key={g.label}>
          <p className="px-3 text-xs font-semibold tracking-wider text-white/50 uppercase">{g.label}</p>
          <ul className="mt-2 space-y-0.5">
            {g.items
              .filter((i) => !("adminOnly" in i && i.adminOnly) || role === "ADMIN")
              .map(({ href, label, icon: Icon, ...i }) => {
                const active = "exact" in i && i.exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        active ? "bg-white/10 text-white" : "text-white/75 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <Icon aria-hidden className={cn("size-4", active && "text-brand-bright")} />
                      <span className="flex-1">{label}</span>
                      {"badge" in i && unread > 0 && (
                        <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white">
                          {unread}
                          <span className="sr-only"> non lus</span>
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Barre supérieure mobile */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between bg-ink px-4 lg:hidden">
        <Link href="/admin" aria-label="Tableau de bord">
          <Logo title={null} className="h-6" />
        </Link>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="admin-sidebar" className="rounded p-2 text-white hover:bg-white/10">
          {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
        </button>
      </div>

      <aside
        id="admin-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink text-white transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center border-b border-white/10 px-6">
          <Link href="/admin" aria-label="Tableau de bord">
            <Logo title={null} className="h-7" />
          </Link>
        </div>
        {nav}
        <div className="border-t border-white/10 p-4">{footer}</div>
      </aside>
      {open && <div aria-hidden className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}
