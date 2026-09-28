import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { apiUser } from "@/lib/auth/session";
import { isSameOrigin } from "@/lib/security/request";
import { ATTACHMENT_TYPES, checkUpload } from "@/lib/security/files";
import { smtpConfigured } from "@/lib/mail/smtp";
import { sendFromDashboard } from "@/lib/mail/send";
import { clean } from "@/lib/validation/lead";

export const runtime = "nodejs";
export const maxDuration = 60;

const emails = z
  .string()
  .transform((s) => s.split(/[,;\s]+/).map((e) => e.trim().toLowerCase()).filter(Boolean))
  .pipe(z.array(z.email("Adresse e-mail invalide")).max(20));

const schema = z.object({
  to: emails.pipe(z.array(z.string()).min(1, "Indiquez au moins un destinataire")),
  cc: emails.optional().default([]),
  subject: z.string().transform(clean).pipe(z.string().min(1, "Indiquez un objet").max(250)),
  html: z.string().min(1, "Le message est vide").max(200_000),
  leadId: z.string().max(40).optional(),
  replyToId: z.string().max(40).optional(),
});

const MAX_TOTAL = 4 * 1024 * 1024; // limite d'une requête sur Vercel (4,5 Mo)

/** Envoi d'un e-mail depuis le dashboard (nouveau message ou réponse). */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Origine non autorisée" }, { status: 403 });
  const user = await apiUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  if (!smtpConfigured()) return NextResponse.json({ error: "L'envoi n'est pas configuré (variables SMTP)." }, { status: 503 });

  const form = await req.formData();
  const parsed = schema.safeParse({
    to: form.get("to") ?? "",
    cc: form.get("cc") || undefined,
    subject: form.get("subject") ?? "",
    html: form.get("html") ?? "",
    leadId: form.get("leadId") || undefined,
    replyToId: form.get("replyToId") || undefined,
  });
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 422 });

  const files = form.getAll("attachments").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.reduce((n, f) => n + f.size, 0) > MAX_TOTAL)
    return NextResponse.json({ error: "Pièces jointes trop lourdes (4 Mo au total)." }, { status: 413 });
  const attachments = [];
  for (const f of files) {
    const checked = await checkUpload(f, ATTACHMENT_TYPES, MAX_TOTAL);
    if (!checked) return NextResponse.json({ error: `« ${f.name} » : type de fichier non autorisé (PDF, images, Word, Excel).` }, { status: 422 });
    attachments.push(checked);
  }

  try {
    const res = await sendFromDashboard({ userId: user.id, userName: user.name, ...parsed.data, attachments });
    revalidatePath("/admin", "layout");
    return NextResponse.json({ ok: true, ...res });
  } catch (e) {
    console.error("[mail] envoi", e);
    return NextResponse.json({ error: "L'envoi a échoué. Vérifiez la configuration SMTP ou réessayez." }, { status: 502 });
  }
}
