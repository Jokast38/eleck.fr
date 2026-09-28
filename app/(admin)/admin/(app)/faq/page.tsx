import { Home, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { deleteFaq } from "@/lib/content/actions";
import { faqCategories, type FaqCategory } from "@/lib/content/faq";
import { Badge, Card, CardHeader, PageHeader, buttonClass } from "@/components/admin/ui";
import { FaqForm } from "@/components/admin/ContentForms";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";

export const metadata = { title: "FAQ" };

export default async function FaqAdminPage() {
  await requireUser();
  const items = await db.faqItem.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }, { createdAt: "asc" }] });
  const byCat = Object.keys(faqCategories).map((c) => ({ c: c as FaqCategory, items: items.filter((i) => i.category === c) }));

  return (
    <>
      <PageHeader title="Questions fréquentes" description="Affichées sur la page FAQ, les pages de services et (sélection) sur l'accueil, avec les données structurées Google." />
      <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          {byCat.map(({ c, items }) => (
            <Card key={c}>
              <CardHeader title={`${faqCategories[c]} (${items.length})`} />
              <ul className="divide-y divide-black/5">
                {items.map((f) => (
                  <li key={f.id}>
                    <details>
                      <summary className="flex cursor-pointer items-center gap-3 px-5 py-3 text-sm hover:bg-mist/60">
                        <span className="flex-1 font-medium">{f.question}</span>
                        {f.showOnHome && <Home aria-label="Affichée sur l'accueil" className="size-4 text-muted-dark" />}
                        {!f.published && <Badge className="bg-neutral-200 text-neutral-700">Masquée</Badge>}
                      </summary>
                      <div className="space-y-4 border-t border-black/5 bg-mist/40 p-5">
                        <FaqForm f={f} />
                        <form action={deleteFaq}>
                          <input type="hidden" name="id" value={f.id} />
                          <ConfirmSubmit message="Supprimer cette question ?" className={buttonClass("danger", "sm")}>
                            <Trash2 aria-hidden className="size-4" /> Supprimer
                          </ConfirmSubmit>
                        </form>
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <Card className="h-fit">
          <CardHeader title="Nouvelle question" />
          <div className="p-5">
            <FaqForm f={{ question: "", answer: "", category: "general", showOnHome: false, published: true, order: 0 }} />
          </div>
        </Card>
      </div>
    </>
  );
}
