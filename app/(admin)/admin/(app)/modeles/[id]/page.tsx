import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { deleteTemplate } from "@/lib/content/actions";
import { Card, PageHeader, buttonClass } from "@/components/admin/ui";
import { TemplateForm } from "@/components/admin/ContentForms";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";

export const metadata = { title: "Modèle d'e-mail" };

export default async function TemplateEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const t = id === "nouveau" ? null : await db.template.findUnique({ where: { id } });
  if (id !== "nouveau" && !t) notFound();
  return (
    <>
      <Link href="/admin/modeles" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-dark hover:text-ink">
        <ArrowLeft aria-hidden className="size-4" /> Modèles
      </Link>
      <PageHeader title={t ? t.name : "Nouveau modèle"} />
      <Card className="max-w-4xl p-6">
        <TemplateForm t={t ?? { name: "", subject: "", body: "<p>Bonjour {{prenom}},</p><p></p>", order: 0 }} />
      </Card>
      {t && (
        <form action={deleteTemplate} className="mt-6">
          <input type="hidden" name="id" value={t.id} />
          <ConfirmSubmit message="Supprimer ce modèle ?" className={buttonClass("danger", "sm")}>
            <Trash2 aria-hidden className="size-4" /> Supprimer le modèle
          </ConfirmSubmit>
        </form>
      )}
    </>
  );
}
