"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { logActivity } from "@/lib/activity";
import { saveSettings } from "@/lib/settings";
import { checkUpload, IMAGE_TYPES } from "@/lib/security/files";
import { sanitizeOutgoing } from "@/lib/mail/sanitize";
import { clean } from "@/lib/validation/lead";
import { faqCategories, type FaqCategory } from "./faq";

export type FormState = { ok?: boolean; error?: string; at?: number } | null;

const str = (form: FormData, k: string, max = 5000) => clean(String(form.get(k) ?? "")).slice(0, max);
const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

/** Pages publiques qui affichent du contenu géré dans le dashboard (régénération immédiate). */
function revalidatePublic() {
  for (const p of ["/", "/realisations", "/faq", "/particuliers", "/coproprietes", "/entreprises", "/maintenance", "/eclairage-led", "/electricite-tertiaire-industrielle", "/thermographie"])
    revalidatePath(p);
}

/* ───────────── Réalisations ───────────── */

const realisationSchema = z.object({
  title: z.string().min(3, "Titre trop court").max(120),
  city: z.string().min(2, "Indiquez la ville").max(80),
  clientType: z.enum(["PARTICULIER", "COPROPRIETE", "ENTREPRISE"]),
  service: z.enum(["BORNE", "LED", "ELECTRICITE", "THERMOGRAPHIE"]),
  description: z.string().min(10, "Description trop courte").max(2000),
  order: z.coerce.number().int().min(0).max(999),
});

export async function saveRealisation(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const id = String(form.get("id") ?? "");
  const parsed = realisationSchema.safeParse({
    title: str(form, "title", 120),
    city: str(form, "city", 80),
    clientType: form.get("clientType"),
    service: form.get("service"),
    description: str(form, "description", 2000),
    order: form.get("order") || 0,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message, at: Date.now() };
  const published = form.get("published") === "on";

  // Nouvelles photos (type réel contrôlé)
  const uploads = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  const photos = [];
  for (const f of uploads) {
    const checked = await checkUpload(f, IMAGE_TYPES.filter((t) => !t.includes("hei")), 4 * 1024 * 1024);
    if (!checked) return { error: `« ${f.name} » : image JPG, PNG ou WebP de 4 Mo maximum.`, at: Date.now() };
    photos.push(checked);
  }

  let realisationId = id;
  if (id) {
    await db.realisation.update({ where: { id }, data: { ...parsed.data, published } });
  } else {
    let slug = slugify(`${parsed.data.title}-${parsed.data.city}`);
    if (await db.realisation.findUnique({ where: { slug } })) slug = `${slug}-${Date.now().toString(36)}`;
    realisationId = (await db.realisation.create({ data: { ...parsed.data, slug, published } })).id;
  }

  // Textes alternatifs des photos existantes + suppressions
  for (const [key, value] of form.entries()) {
    if (key.startsWith("alt:")) await db.storedFile.updateMany({ where: { id: key.slice(4), realisationId }, data: { alt: clean(String(value)).slice(0, 200) } });
  }
  const remove = form.getAll("remove").map(String);
  if (remove.length) await db.storedFile.deleteMany({ where: { id: { in: remove }, realisationId } });

  if (photos.length) {
    const count = await db.storedFile.count({ where: { realisationId } });
    await db.storedFile.createMany({
      data: photos.map((p, i) => ({
        filename: p.filename,
        mimeType: p.mimeType,
        size: p.size,
        data: p.data,
        order: count + i,
        realisationId,
        alt: `${parsed.data.title} à ${parsed.data.city}`.slice(0, 200),
      })),
    });
  }

  await logActivity({ userId: user.id, action: "content.realisation", entityType: "realisation", entityId: realisationId, details: { title: parsed.data.title, published } });
  revalidatePublic();
  if (!id) redirect(`/admin/realisations/${realisationId}?cree=1`);
  revalidatePath(`/admin/realisations/${realisationId}`);
  return { ok: true, at: Date.now() };
}

export async function deleteRealisation(form: FormData) {
  const user = await requireUser();
  const id = String(form.get("id"));
  await db.realisation.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "content.realisation", entityType: "realisation", entityId: id, details: { deleted: true } });
  revalidatePublic();
  redirect("/admin/realisations");
}

/* ───────────── FAQ ───────────── */

const faqSchema = z.object({
  question: z.string().min(5, "Question trop courte").max(300),
  answer: z.string().min(10, "Réponse trop courte").max(3000),
  category: z.enum(Object.keys(faqCategories) as [FaqCategory, ...FaqCategory[]]),
  order: z.coerce.number().int().min(0).max(999),
});

export async function saveFaq(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const id = String(form.get("id") ?? "");
  const parsed = faqSchema.safeParse({
    question: str(form, "question", 300),
    answer: str(form, "answer", 3000),
    category: form.get("category"),
    order: form.get("order") || 0,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message, at: Date.now() };
  const data = { ...parsed.data, showOnHome: form.get("showOnHome") === "on", published: form.get("published") === "on" };
  const item = id ? await db.faqItem.update({ where: { id }, data }) : await db.faqItem.create({ data });
  await logActivity({ userId: user.id, action: "content.faq", entityType: "faq", entityId: item.id });
  revalidatePublic();
  revalidatePath("/admin/faq");
  return { ok: true, at: Date.now() };
}

export async function deleteFaq(form: FormData) {
  const user = await requireUser();
  const id = String(form.get("id"));
  await db.faqItem.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "content.faq", entityType: "faq", entityId: id, details: { deleted: true } });
  revalidatePublic();
  revalidatePath("/admin/faq");
}

/* ───────────── Modèles de réponses ───────────── */

export async function saveTemplate(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const id = String(form.get("id") ?? "");
  const name = str(form, "name", 80);
  const subject = str(form, "subject", 250);
  const body = sanitizeOutgoing(String(form.get("body") ?? "")).slice(0, 20000);
  const order = Number(form.get("order")) || 0;
  if (!name || !subject || body.replace(/<[^>]+>/g, "").trim().length < 5) return { error: "Nom, objet et contenu sont obligatoires.", at: Date.now() };
  const t = id
    ? await db.template.update({ where: { id }, data: { name, subject, body, order } })
    : await db.template.create({ data: { name, subject, body, order } });
  await logActivity({ userId: user.id, action: "content.template", entityType: "template", entityId: t.id });
  revalidatePath("/admin/modeles");
  if (!id) redirect("/admin/modeles");
  return { ok: true, at: Date.now() };
}

export async function deleteTemplate(form: FormData) {
  const user = await requireUser();
  const id = String(form.get("id"));
  await db.template.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "content.template", entityType: "template", entityId: id, details: { deleted: true } });
  redirect("/admin/modeles");
}

/* ───────────── Paramètres ───────────── */

export async function updateSettings(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const notifyEmails = String(form.get("notifyEmails") ?? "")
    .split(/[,;\s]+/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!notifyEmails.length || !notifyEmails.every((e) => z.email().safeParse(e).success))
    return { error: "Adresses de notification invalides.", at: Date.now() };
  await saveSettings({
    notifyEmails,
    responseDelay: str(form, "responseDelay", 120) || "dans les meilleurs délais",
    openingHours: str(form, "openingHours", 300),
    zoneText: str(form, "zoneText", 500),
    signature: sanitizeOutgoing(String(form.get("signature") ?? "")).slice(0, 5000),
  });
  await logActivity({ userId: user.id, action: "settings.update" });
  revalidatePath("/admin/parametres");
  return { ok: true, at: Date.now() };
}
