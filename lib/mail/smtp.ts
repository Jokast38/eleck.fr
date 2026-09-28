import "server-only";
import { randomUUID } from "node:crypto";
import nodemailer from "nodemailer";
import MailComposer from "nodemailer/lib/mail-composer";
import type Mail from "nodemailer/lib/mailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

export const smtpConfigured = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

let transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null = null;
function getTransporter() {
  if (!smtpConfigured()) throw new Error("SMTP non configuré (SMTP_HOST, SMTP_USER, SMTP_PASS)");
  transporter ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: (process.env.SMTP_SECURE ?? "true") === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

export const mailFrom = () => process.env.MAIL_FROM ?? `elec k <${process.env.SMTP_USER}>`;
const domain = () => (process.env.SMTP_USER ?? "eleck.fr").split("@")[1] ?? "eleck.fr";

export type OutgoingMail = {
  to: string | string[];
  cc?: string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  inReplyTo?: string;
  references?: string;
  attachments?: { filename: string; content: Buffer; contentType: string }[];
};

/**
 * Compose le message brut (RFC 822) puis l'envoie en SMTP.
 * Retourne le Message-ID et le message brut, réutilisé pour la copie IMAP (APPEND dans « Envoyés »).
 */
export async function sendMail(mail: OutgoingMail) {
  const messageId = `<${randomUUID()}@${domain()}>`;
  const options: Mail.Options = {
    from: mailFrom(),
    to: mail.to,
    cc: mail.cc?.length ? mail.cc : undefined,
    replyTo: mail.replyTo,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    messageId,
    inReplyTo: mail.inReplyTo,
    references: mail.references,
    attachments: mail.attachments,
    headers: { "X-Mailer": "elec k dashboard" },
  };
  const raw = await new MailComposer(options).compile().build();
  // On envoie exactement le message brut composé, afin que la copie « Envoyés » soit identique
  const recipients = [...(Array.isArray(mail.to) ? mail.to : [mail.to]), ...(mail.cc ?? [])];
  const info = await getTransporter().sendMail({
    envelope: { from: process.env.SMTP_USER!, to: recipients },
    raw,
  });
  return { messageId, raw, accepted: info.accepted };
}
