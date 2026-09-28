import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { deleteRealisation } from "@/lib/content/actions";
import { Card, Notice, PageHeader, buttonClass } from "@/components/admin/ui";
import { RealisationForm } from "@/components/admin/ContentForms";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";

export const metadata = { title: "Réalisation" };

export default async function RealisationEditPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ cree?: string }> }) {
  await requireUser();
  const { id } = await params;
  const { cree } = await searchParams;
  const isNew = id === "nouveau";
  const r = isNew
    ? null
    : await db.realisation.findUnique({
        where: { id },
        include: { photos: { orderBy: { order: "asc" }, select: { id: true, alt: true, filename: true } } },
      });
  if (!isNew && !r) notFound();

  return (
    <>
      <Link href="/admin/realisations" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-dark hover:text-ink">
        <ArrowLeft aria-hidden className="size-4" /> Réalisations
      </Link>
      <PageHeader
        title={isNew ? "Nouvelle réalisation" : r!.title}
        actions={
          r?.published && (
            <Link href="/realisations" target="_blank" className={buttonClass("outline")}>
              Voir sur le site
            </Link>
          )
        }
      />
      {cree && (
        <div className="mb-4 max-w-4xl">
          <Notice tone="success">Réalisation créée.</Notice>
        </div>
      )}
      <Card className="max-w-4xl p-6">
        <RealisationForm
          r={
            r
              ? { id: r.id, title: r.title, city: r.city, clientType: r.clientType, service: r.service, description: r.description, published: r.published, order: r.order, photos: r.photos }
              : { title: "", city: "", clientType: "PARTICULIER", service: "BORNE", description: "", published: false, order: 0, photos: [] }
          }
        />
      </Card>
      {r && (
        <form action={deleteRealisation} className="mt-6 max-w-4xl">
          <input type="hidden" name="id" value={r.id} />
          <ConfirmSubmit message="Supprimer cette réalisation et ses photos ?" className={buttonClass("danger", "sm")}>
            <Trash2 aria-hidden className="size-4" /> Supprimer la réalisation
          </ConfirmSubmit>
        </form>
      )}
    </>
  );
}
