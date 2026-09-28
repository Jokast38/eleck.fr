import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { actionLabels } from "@/lib/activity";
import { formatDateTime } from "@/lib/format";
import { Card, PageHeader, buttonClass } from "@/components/admin/ui";

export const metadata = { title: "Journal d'activité" };
const PAGE_SIZE = 50;

export default async function ActivityPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireUser({ role: "ADMIN" });
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const [logs, total] = await Promise.all([
    db.activityLog.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, include: { user: { select: { name: true } } } }),
    db.activityLog.count(),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return (
    <>
      <PageHeader title="Journal d'activité" description="Qui a fait quoi, et quand. Connexions, modifications des demandes, envois d'e-mails, contenus." />
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <caption className="sr-only">Journal d&apos;activité</caption>
          <thead className="border-b border-black/10 text-xs text-muted-dark uppercase">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Date</th>
              <th scope="col" className="px-4 py-3 font-medium">Utilisateur</th>
              <th scope="col" className="px-4 py-3 font-medium">Action</th>
              <th scope="col" className="px-4 py-3 font-medium">Élément</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {logs.map((l) => (
              <tr key={l.id}>
                <td className="px-4 py-2.5 whitespace-nowrap text-muted-dark">{formatDateTime(l.createdAt)}</td>
                <td className="px-4 py-2.5">{l.user?.name ?? <span className="text-muted-dark">Système / visiteur</span>}</td>
                <td className="px-4 py-2.5">{actionLabels[l.action] ?? l.action}</td>
                <td className="px-4 py-2.5">
                  {l.entityType === "lead" && l.entityId && l.action !== "lead.delete" ? (
                    <Link href={`/admin/demandes/${l.entityId}`} className="underline underline-offset-4">Voir la demande</Link>
                  ) : (
                    <span className="text-muted-dark">{l.entityType ?? ""}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-dark">Page {page} sur {pages}</span>
          <div className="flex gap-2">
            {page > 1 && <Link href={`?page=${page - 1}`} className={buttonClass("outline", "sm")}>Précédente</Link>}
            {page < pages && <Link href={`?page=${page + 1}`} className={buttonClass("outline", "sm")}>Suivante</Link>}
          </div>
        </nav>
      )}
    </>
  );
}
