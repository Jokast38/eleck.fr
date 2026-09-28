import { after, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity";
import { hashIp } from "@/lib/crypto";
import { leadLimiter } from "@/lib/security/ratelimit";
import { clientIp, isSameOrigin } from "@/lib/security/request";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { checkUpload, IMAGE_TYPES } from "@/lib/security/files";
import { formatFrPhone, leadMetaSchema, leadSchema, PHOTO_MAX_BYTES, PHOTO_MAX_FILES } from "@/lib/validation/lead";
import { classifySource } from "@/lib/leads/format";
import { sendLeadEmails } from "@/lib/leads/notify";
import { emitMailEvent } from "@/lib/mail/events";
import { SITE_URL } from "@/lib/site";
import { serviceLabels } from "@/lib/content/services";

export const runtime = "nodejs";
export const maxDuration = 60;

const MIN_FILL_MS = 4000; // en dessous : remplissage trop rapide pour un humain

const fail = (status: number, message: string, fieldErrors?: Record<string, string[]>) =>
  NextResponse.json({ ok: false, message, fieldErrors }, { status });

/**
 * Réception d'une demande de devis (multipart/form-data : champ « data » en JSON + photos « photos »).
 * Chaîne de contrôles : origine → limitation de débit → pot de miel / temps de remplissage → Turnstile
 * → validation Zod (schéma partagé avec le formulaire) → contrôle du type réel des fichiers.
 */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return fail(403, "Origine non autorisée.");

  const ip = await clientIp();
  const { success } = await leadLimiter().limit(ip);
  if (!success) return fail(429, "Trop de demandes envoyées. Merci de réessayer plus tard ou de nous appeler.");

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail(400, "Requête invalide.");
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(String(form.get("data") ?? "{}"));
  } catch {
    return fail(400, "Requête invalide.");
  }

  const meta = leadMetaSchema.safeParse(payload);
  if (!meta.success) return fail(400, "Requête invalide.");

  // Robot probable : on répond « OK » sans rien enregistrer (ne pas lui donner d'indice)
  if (meta.data.website || Date.now() - meta.data.startedAt < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  if (!(await verifyTurnstile(meta.data.turnstileToken, ip)))
    return fail(400, "La vérification anti-robot a échoué. Merci de réessayer.");

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) (fieldErrors[String(issue.path[0])] ??= []).push(issue.message);
    return fail(422, "Certains champs sont invalides.", fieldErrors);
  }
  const data = parsed.data;

  const uploads = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (uploads.length > PHOTO_MAX_FILES) return fail(422, `${PHOTO_MAX_FILES} photos maximum.`);
  const photos = [];
  for (const f of uploads) {
    const checked = await checkUpload(f, IMAGE_TYPES, PHOTO_MAX_BYTES);
    if (!checked) return fail(422, `Le fichier « ${f.name.slice(0, 60)} » n'est pas une image JPG, PNG ou HEIC de moins de 5 Mo.`);
    photos.push(checked);
  }

  const attribution = meta.data.attribution;
  const borne = data.service === "BORNE";
  const lead = await db.lead.create({
    data: {
      clientType: data.clientType,
      companyName: data.companyName || null,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: formatFrPhone(data.phone),
      postalCode: data.postalCode,
      city: data.city,
      message: data.message || null,
      service: data.service,
      siteType: data.siteType,
      // Champs spécifiques : seuls ceux du service demandé sont conservés
      need: borne ? null : data.need || null,
      chargerCount: borne ? data.chargerCount || null : null,
      power: borne ? data.power || null : null,
      location: borne ? data.location || null : null,
      distance: borne ? data.distance || null : null,
      vehicle: borne ? data.vehicle || null : null,
      timeline: data.timeline,
      source: classifySource(attribution?.referrer, attribution?.utm, new URL(SITE_URL).hostname),
      referrer: attribution?.referrer?.slice(0, 500) || null,
      landingPage: attribution?.landingPage?.slice(0, 500) || null,
      utm: attribution?.utm ?? undefined,
      consentAt: new Date(),
      ipHash: hashIp(ip),
      files: {
        create: photos.map((p, i) => ({ filename: p.filename, mimeType: p.mimeType, size: p.size, data: p.data, order: i })),
      },
    },
    select: { id: true, number: true },
  });

  await logActivity({ action: "lead.create", entityType: "lead", entityId: lead.id, details: { number: lead.number } });

  // Les e-mails partent après la réponse : le visiteur n'attend pas le serveur SMTP
  emitMailEvent({ type: "lead", leadId: lead.id, label: `${data.firstName} ${data.lastName} · ${serviceLabels[data.service]} · ${data.city}` });
  after(() => sendLeadEmails(lead.id));

  return NextResponse.json({ ok: true });
}
