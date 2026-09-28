import Link from "next/link";
import { Images, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { clientTypeLabels } from "@/lib/leads/format";
import { formatDate } from "@/lib/format";
import { serviceLabels, type ServiceKey } from "@/lib/content/services";
import { Badge, Card, EmptyState, PageHeader, buttonClass } from "@/components/admin/ui";

export const metadata = { title: "Réalisations" };

export default async function RealisationsAdminPage() {
  await requireUser();
  const items = await db.realisation.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { photos: { take: 1, orderBy: { order: "asc" }, select: { id: true } }, _count: { select: { photos: true } } },
  });
  return (
    <>
      <PageHeader
        title="Réalisations"
        description="Chantiers publiés sur la page Réalisations, sur l'accueil et sur la page de la prestation concernée."
        actions={
          <Link href="/admin/realisations/nouveau" className={buttonClass("primary")}>
            <Plus aria-hidden className="size-4" /> Nouvelle réalisation
          </Link>
        }
      />
      <Card>
        {items.length ? (
          <ul className="divide-y divide-black/5">
            {items.map((r) => (
              <li key={r.id}>
                <Link href={`/admin/realisations/${r.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-mist/60">
                  <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-mist">
                    {r.photos[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element -- vignette dashboard
                      <img src={`/api/admin/files/${r.photos[0].id}`} alt="" className="size-full object-cover" />
                    ) : (
                      <Images aria-hidden className="size-6 text-muted-dark" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{r.title}</span>
                    <span className="block text-sm text-muted-dark">
                      {serviceLabels[r.service as ServiceKey] ?? r.service} · {clientTypeLabels[r.clientType]} · {r.city} · {r._count.photos} photo(s) · modifiée le{" "}
                      {formatDate(r.updatedAt)}
                    </span>
                  </span>
                  <Badge className={r.published ? "bg-emerald-100 text-emerald-900" : "bg-neutral-200 text-neutral-700"}>{r.published ? "Publiée" : "Brouillon"}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={<Images className="size-8" />} title="Aucune réalisation">
            Ajoutez vos chantiers avec quelques photos : ils apparaîtront sur le site dès leur publication.
          </EmptyState>
        )}
      </Card>
    </>
  );
}
