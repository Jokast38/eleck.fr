import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { Card, EmptyState, PageHeader, buttonClass } from "@/components/admin/ui";

export const metadata = { title: "Modèles d'e-mails" };

export default async function TemplatesPage() {
  await requireUser();
  const templates = await db.template.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });
  return (
    <>
      <PageHeader
        title="Modèles de réponses"
        description="Insérables en un clic lors de la rédaction d'un e-mail, avec les informations de la demande."
        actions={
          <Link href="/admin/modeles/nouveau" className={buttonClass("primary")}>
            <Plus aria-hidden className="size-4" /> Nouveau modèle
          </Link>
        }
      />
      <Card>
        {templates.length ? (
          <ul className="divide-y divide-black/5">
            {templates.map((t) => (
              <li key={t.id}>
                <Link href={`/admin/modeles/${t.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-mist/60">
                  <FileText aria-hidden className="size-4 text-muted-dark" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{t.name}</span>
                    <span className="block truncate text-sm text-muted-dark">Objet : {t.subject}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="Aucun modèle" />
        )}
      </Card>
    </>
  );
}
