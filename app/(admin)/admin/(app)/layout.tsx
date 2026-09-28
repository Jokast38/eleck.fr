import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { signOut } from "@/auth";
import { Sidebar } from "@/components/admin/Sidebar";
import { LiveUpdates } from "@/components/admin/LiveUpdates";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

// Données toujours fraîches dans le dashboard
export const dynamic = "force-dynamic";

export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser({ allowWithout2fa: true });
  const unread = await db.emailMessage.count({ where: { direction: "INBOUND", seen: false } });

  return (
    <div className="min-h-dvh">
      <Sidebar
        role={user.role}
        unread={unread}
        footer={
          <div className="space-y-3">
            <LiveUpdates />
            <div className="text-sm">
              <p className="truncate font-medium text-white">{user.name}</p>
              <p className="truncate text-xs text-white/60">{user.role === "ADMIN" ? "Administrateur" : "Employé"}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/" target="_blank" className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-white/15 py-1.5 text-xs text-white/80 hover:bg-white/10">
                <ExternalLink aria-hidden className="size-3.5" /> Voir le site
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/admin/connexion" });
                }}
                className="flex-1"
              >
                <button type="submit" className="flex w-full items-center justify-center gap-1.5 rounded-md border border-white/15 py-1.5 text-xs text-white/80 hover:bg-white/10">
                  <LogOut aria-hidden className="size-3.5" /> Déconnexion
                </button>
              </form>
            </div>
          </div>
        }
      />
      <main id="contenu" className="px-4 py-6 sm:px-6 lg:ml-64 lg:px-10 lg:py-8">
        {children}
      </main>
    </div>
  );
}
