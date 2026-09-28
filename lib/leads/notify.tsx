import "server-only";
import { render } from "@react-email/render";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import { getSettings } from "@/lib/settings";
import { sendMail, smtpConfigured } from "@/lib/mail/smtp";
import { appendToSent, imapConfigured } from "@/lib/mail/imap";
import LeadNotificationEmail from "@/emails/LeadNotificationEmail";
import LeadAcknowledgementEmail from "@/emails/LeadAcknowledgementEmail";
import { leadReference } from "./format";
import { serviceLabels, type ServiceKey } from "@/lib/content/services";

/**
 * E-mails envoyés après une nouvelle demande (exécuté après la réponse HTTP, via `after()`) :
 *  1. notification interne (récapitulatif + lien vers la fiche) ;
 *  2. accusé de réception au prospect, enregistré dans le fil de la fiche et copié dans « Envoyés ».
 * Un échec d'envoi n'annule jamais la demande, déjà enregistrée en base.
 */
export async function sendLeadEmails(leadId: string) {
  if (!smtpConfigured()) {
    console.warn("[lead] SMTP non configuré : e-mails non envoyés pour", leadId);
    return;
  }
  const lead = await db.lead.findUniqueOrThrow({ where: { id: leadId }, include: { _count: { select: { files: true } } } });
  const settings = await getSettings();
  const ref = leadReference(lead.number);

  try {
    const notif = <LeadNotificationEmail lead={lead} dashboardUrl={`${SITE_URL}/admin/demandes/${lead.id}`} photoCount={lead._count.files} />;
    await sendMail({
      to: settings.notifyEmails,
      replyTo: `${lead.firstName} ${lead.lastName} <${lead.email}>`,
      subject: `Nouvelle demande ${ref} · ${serviceLabels[lead.service as ServiceKey] ?? ""} · ${lead.firstName} ${lead.lastName} (${lead.city})`,
      html: await render(notif),
      text: await render(notif, { plainText: true }),
    });
  } catch (e) {
    console.error("[lead] notification interne non envoyée", e);
  }

  try {
    const ack = <LeadAcknowledgementEmail lead={lead} responseDelay={settings.responseDelay} />;
    const subject = `Votre demande de devis ${ref} · elec k`;
    const html = await render(ack);
    const text = await render(ack, { plainText: true });
    const sent = await sendMail({ to: lead.email, subject, html, text });

    let folder = "Sent";
    let uid: number | undefined;
    let uidValidity: bigint | undefined;
    if (imapConfigured()) {
      const copy = await appendToSent(sent.raw).catch((e) => {
        console.error("[lead] copie IMAP de l'accusé de réception impossible", e);
        return null;
      });
      if (copy) ({ path: folder, uid, uidValidity } = copy);
    }
    await db.emailMessage.create({
      data: {
        direction: "OUTBOUND",
        folder,
        uid: uid ?? null,
        uidValidity: uidValidity ?? null,
        messageId: sent.messageId,
        subject,
        fromAddress: (process.env.SMTP_USER ?? "").toLowerCase(),
        fromName: "elec k",
        toAddresses: [lead.email],
        ccAddresses: [],
        date: new Date(),
        html,
        text,
        snippet: "Accusé de réception automatique",
        seen: true,
        leadId: lead.id,
      },
    });
  } catch (e) {
    console.error("[lead] accusé de réception non envoyé", e);
  }
}
