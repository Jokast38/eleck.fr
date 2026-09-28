import "server-only";
import { render } from "@react-email/render";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { logActivity } from "@/lib/activity";
import { formatDateTime } from "@/lib/format";
import OutgoingMessageEmail from "@/emails/OutgoingMessageEmail";
import { sendMail } from "./smtp";
import { appendToSent, imapConfigured } from "./imap";
import { escapeHtml, sanitizeIncoming, sanitizeOutgoing } from "./sanitize";
import { emitMailEvent } from "./events";
import { recordResponse } from "./responses";
import type { CheckedFile } from "@/lib/security/files";

type SendInput = {
  userId: string;
  userName: string;
  to: string[];
  cc: string[];
  subject: string;
  html: string;
  leadId?: string | null;
  replyToId?: string | null;
  attachments: CheckedFile[];
};

/**
 * Envoi d'un e-mail depuis le dashboard :
 * nettoyage du HTML → signature → citation et en-têtes de fil (In-Reply-To / References) → SMTP
 * → copie dans « Envoyés » (IMAP APPEND) → enregistrement et rattachement à la demande.
 */
export async function sendFromDashboard(input: SendInput) {
  const settings = await getSettings();
  const bodyHtml = sanitizeOutgoing(input.html);
  const signatureHtml = sanitizeOutgoing(settings.signature.replaceAll("{{utilisateur}}", escapeHtml(input.userName)));

  // Réponse : on garde le fil de discussion intact dans le client mail du destinataire
  let inReplyTo: string | undefined;
  let references: string | undefined;
  let quoteHtml: string | undefined;
  let leadId = input.leadId ?? null;
  if (input.replyToId) {
    const original = await db.emailMessage.findUnique({ where: { id: input.replyToId } });
    if (original) {
      inReplyTo = original.messageId ?? undefined;
      references = [original.references, original.messageId].filter(Boolean).join(" ") || undefined;
      const who = original.fromName ? `${original.fromName} <${original.fromAddress}>` : original.fromAddress;
      const content = original.html ? sanitizeIncoming(original.html) : `<p>${escapeHtml(original.text ?? "").replace(/\n/g, "<br>")}</p>`;
      quoteHtml = `<p>Le ${escapeHtml(formatDateTime(original.date))}, ${escapeHtml(who)} a écrit :</p>${content}`;
      leadId ??= original.leadId;
    }
  }
  // Sinon, rattachement par l'adresse du destinataire
  if (!leadId) {
    const lead = await db.lead.findFirst({
      where: { email: { in: input.to, mode: "insensitive" } },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });
    leadId = lead?.id ?? null;
  }

  const email = <OutgoingMessageEmail bodyHtml={bodyHtml} signatureHtml={signatureHtml} quoteHtml={quoteHtml} preview={input.subject} />;
  const html = await render(email);
  const text = await render(email, { plainText: true });

  const sent = await sendMail({
    to: input.to,
    cc: input.cc,
    subject: input.subject,
    html,
    text,
    inReplyTo,
    references,
    attachments: input.attachments.map((a) => ({ filename: a.filename, content: Buffer.from(a.data), contentType: a.mimeType })),
  });

  let folder = "Sent";
  let uid: number | undefined;
  let uidValidity: bigint | undefined;
  if (imapConfigured()) {
    try {
      ({ path: folder, uid, uidValidity } = await appendToSent(sent.raw));
    } catch (e) {
      console.error("[mail] copie dans « Envoyés » impossible", e);
    }
  }

  const message = await db.emailMessage.create({
    data: {
      direction: "OUTBOUND",
      folder,
      uid: uid ?? null,
      uidValidity: uidValidity ?? null,
      messageId: sent.messageId,
      inReplyTo: inReplyTo ?? null,
      references: references ?? null,
      subject: input.subject,
      fromAddress: (process.env.SMTP_USER ?? "").toLowerCase(),
      fromName: input.userName,
      toAddresses: input.to,
      ccAddresses: input.cc,
      date: new Date(),
      html,
      text,
      snippet: text.replace(/\s+/g, " ").trim().slice(0, 180),
      seen: true,
      hasAttachments: input.attachments.length > 0,
      leadId,
      sentById: input.userId,
      files: {
        create: input.attachments.map((a, i) => ({ filename: a.filename, mimeType: a.mimeType, size: a.size, data: a.data, order: i })),
      },
    },
  });

  if (leadId) await recordResponse(leadId, message.date, input.userId);
  await logActivity({ userId: input.userId, action: "mail.send", entityType: leadId ? "lead" : "email", entityId: leadId ?? message.id, details: { to: input.to, subject: input.subject } });
  emitMailEvent({ type: "sent", leadId });
  return { id: message.id, leadId };
}
