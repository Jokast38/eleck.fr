import "server-only";
import { ImapFlow } from "imapflow";
import { simpleParser, type AddressObject } from "mailparser";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { emitMailEvent } from "./events";
import { recordResponse } from "./responses";

export const imapConfigured = () => Boolean(process.env.IMAP_HOST && process.env.IMAP_USER && process.env.IMAP_PASS);

export function createImapClient() {
  if (!imapConfigured()) throw new Error("IMAP non configuré (IMAP_HOST, IMAP_USER, IMAP_PASS)");
  return new ImapFlow({
    host: process.env.IMAP_HOST!,
    port: Number(process.env.IMAP_PORT ?? 993),
    secure: (process.env.IMAP_SECURE ?? "true") === "true",
    auth: { user: process.env.IMAP_USER!, pass: process.env.IMAP_PASS! },
    logger: false,
    emitLogs: false,
  });
}

/** Ouvre une connexion, exécute `fn`, puis ferme proprement. */
export async function withImap<T>(fn: (client: ImapFlow) => Promise<T>): Promise<T> {
  const client = createImapClient();
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.logout().catch(() => client.close());
  }
}

/** Dossier « Envoyés » : détecté via l'attribut spécial \Sent, avec repli sur les noms usuels. */
export async function sentFolderPath(client: ImapFlow) {
  const folders = await client.list();
  return (
    folders.find((f) => f.specialUse === "\\Sent")?.path ??
    folders.find((f) => /^(sent|envoy|sent items|sent messages|éléments envoyés)/i.test(f.name))?.path ??
    "Sent"
  );
}

const MAX_ATTACHMENT = 15 * 1024 * 1024;
const INITIAL_MAX_MESSAGES = 300;

const addresses = (a?: AddressObject | AddressObject[]) =>
  (Array.isArray(a) ? a : a ? [a] : []).flatMap((o) => o.value.map((v) => v.address?.toLowerCase()).filter(Boolean) as string[]);

/** Rattache un message à la demande la plus récente correspondant à l'adresse du correspondant. */
async function findLeadId(emails: string[]) {
  if (!emails.length) return null;
  const lead = await db.lead.findFirst({
    where: { email: { in: emails, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });
  return lead?.id ?? null;
}

let syncing: Promise<SyncResult> | null = null;
type SyncResult = { inbox: number; sent: number; leadIds: string[] };

/** Synchronise la boîte de réception et les envoyés. Une seule synchronisation à la fois par instance. */
export function syncMailbox(): Promise<SyncResult> {
  syncing ??= withImap(async (client) => {
    const inbox = await syncFolder(client, "INBOX", "INBOUND");
    const sent = await syncFolder(client, await sentFolderPath(client), "OUTBOUND");
    return { inbox: inbox.count, sent: sent.count, leadIds: [...new Set([...inbox.leadIds, ...sent.leadIds])] };
  })
    .then((r) => {
      if (r.inbox || r.sent) emitMailEvent({ type: "sync", ...r });
      return r;
    })
    .finally(() => {
      syncing = null;
    });
  return syncing;
}

async function syncFolder(client: ImapFlow, path: string, direction: "INBOUND" | "OUTBOUND") {
  const lock = await client.getMailboxLock(path);
  const leadIds: string[] = [];
  let count = 0;
  try {
    const box = client.mailbox;
    if (!box) return { count, leadIds };
    const uidValidity = BigInt(box.uidValidity);
    const state = await db.mailboxState.findUnique({ where: { folder: path } });

    let uids: number[];
    if (!state || state.uidValidity !== uidValidity) {
      // Première synchronisation (ou dossier recréé) : historique limité
      const days = Number(process.env.IMAP_INITIAL_DAYS ?? 90);
      const since = new Date(Date.now() - days * 864e5);
      const found = (await client.search({ since }, { uid: true })) || [];
      uids = found.slice(-INITIAL_MAX_MESSAGES);
    } else {
      const found = (await client.search({ uid: `${state.lastUid + 1}:*` }, { uid: true })) || [];
      uids = found.filter((u) => u > state.lastUid); // « n:* » renvoie toujours le dernier message
    }

    let lastUid = state?.uidValidity === uidValidity ? state.lastUid : 0;
    if (uids.length) {
      for await (const msg of client.fetch(uids.join(","), { uid: true, flags: true, source: true, internalDate: true }, { uid: true })) {
        lastUid = Math.max(lastUid, msg.uid);
        if (!msg.source) continue;
        const stored = await storeMessage({
          source: msg.source,
          uid: msg.uid,
          uidValidity,
          folder: path,
          direction,
          seen: msg.flags?.has("\\Seen") ?? false,
          internalDate: msg.internalDate instanceof Date ? msg.internalDate : undefined,
        });
        if (stored) {
          count++;
          if (stored.leadId) leadIds.push(stored.leadId);
        }
      }
    }

    // Mise à jour des indicateurs lu / non lu des messages récents (lus depuis un autre client mail)
    if (state && state.uidValidity === uidValidity && box.exists > 0) {
      const recent = await db.emailMessage.findMany({
        where: { folder: path, uidValidity, uid: { not: null } },
        orderBy: { uid: "desc" },
        take: 200,
        select: { id: true, uid: true, seen: true },
      });
      if (recent.length) {
        const flags = new Map<number, boolean>();
        for await (const m of client.fetch(recent.map((r) => r.uid).join(","), { uid: true, flags: true }, { uid: true }))
          flags.set(m.uid, m.flags?.has("\\Seen") ?? false);
        for (const r of recent) {
          const seen = flags.get(r.uid!);
          if (seen !== undefined && seen !== r.seen) await db.emailMessage.update({ where: { id: r.id }, data: { seen } });
        }
      }
    }

    await db.mailboxState.upsert({
      where: { folder: path },
      create: { folder: path, uidValidity, lastUid },
      update: { uidValidity, lastUid, lastSyncAt: new Date() },
    });
  } finally {
    lock.release();
  }
  return { count, leadIds };
}

async function storeMessage(m: {
  source: Buffer;
  uid: number;
  uidValidity: bigint;
  folder: string;
  direction: "INBOUND" | "OUTBOUND";
  seen: boolean;
  internalDate?: Date;
}) {
  const parsed = await simpleParser(m.source);
  const messageId = parsed.messageId ?? null;
  const from = parsed.from?.value[0];
  const to = addresses(parsed.to);
  const cc = addresses(parsed.cc);

  // Message déjà connu : envoyé depuis le dashboard puis copié dans « Envoyés » (on complète son UID),
  // ou présent dans deux dossiers (envoi à sa propre adresse, ex. notification interne) : pas de doublon
  if (messageId) {
    const existing = await db.emailMessage.findFirst({ where: { messageId }, select: { id: true, uid: true, folder: true } });
    if (existing) {
      if (existing.uid === null && existing.folder === m.folder)
        await db.emailMessage.update({ where: { id: existing.id }, data: { uid: m.uid, uidValidity: m.uidValidity } });
      return null;
    }
  }

  const correspondents = m.direction === "INBOUND" ? [from?.address?.toLowerCase() ?? ""] : [...to, ...cc];
  const leadId = await findLeadId(correspondents.filter(Boolean));
  const references = Array.isArray(parsed.references) ? parsed.references.join(" ") : parsed.references;
  const text = parsed.text ?? null;

  try {
    const created = await db.emailMessage.create({
      data: {
        direction: m.direction,
        folder: m.folder,
        uid: m.uid,
        uidValidity: m.uidValidity,
        messageId,
        inReplyTo: parsed.inReplyTo ?? null,
        references: references ?? null,
        subject: parsed.subject?.slice(0, 500) || "(sans objet)",
        fromAddress: from?.address?.toLowerCase() ?? "",
        fromName: from?.name || null,
        toAddresses: to,
        ccAddresses: cc,
        date: parsed.date ?? m.internalDate ?? new Date(),
        text,
        html: typeof parsed.html === "string" ? parsed.html : null,
        snippet: text?.replace(/\s+/g, " ").trim().slice(0, 180) ?? null,
        seen: m.seen || m.direction === "OUTBOUND" || from?.address?.toLowerCase() === process.env.SMTP_USER?.toLowerCase(),
        hasAttachments: parsed.attachments.length > 0,
        leadId,
      },
    });

    // Pièces jointes (les images intégrées « cid: » sont réécrites vers l'URL protégée du dashboard)
    let html = created.html;
    for (const [i, a] of parsed.attachments.entries()) {
      if (a.size > MAX_ATTACHMENT) continue;
      const file = await db.storedFile.create({
        data: {
          filename: a.filename ?? `piece-jointe-${i + 1}`,
          mimeType: a.contentType,
          size: a.size,
          data: new Uint8Array(a.content),
          order: i,
          emailMessageId: created.id,
        },
      });
      if (a.cid && html) html = html.replaceAll(`cid:${a.cid}`, `/api/admin/files/${file.id}`);
    }
    if (html !== created.html) await db.emailMessage.update({ where: { id: created.id }, data: { html } });

    if (leadId && m.direction === "OUTBOUND") await recordResponse(leadId, created.date);
    return { id: created.id, leadId };
  } catch (e) {
    // Doublon (synchronisation concurrente sur une autre instance) : ignoré
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return null;
    throw e;
  }
}

/** Copie un message envoyé dans le dossier « Envoyés » (IMAP APPEND), marqué comme lu. */
export async function appendToSent(raw: Buffer) {
  return withImap(async (client) => {
    const path = await sentFolderPath(client);
    const res = await client.append(path, raw, ["\\Seen"]);
    return { path, uid: res && typeof res === "object" ? res.uid : undefined, uidValidity: res && typeof res === "object" ? res.uidValidity : undefined };
  });
}

/** Répercute l'état lu / non lu sur le serveur IMAP. */
export async function setSeenOnServer(folder: string, uid: number, seen: boolean) {
  return withImap(async (client) => {
    const lock = await client.getMailboxLock(folder);
    try {
      if (seen) await client.messageFlagsAdd(String(uid), ["\\Seen"], { uid: true });
      else await client.messageFlagsRemove(String(uid), ["\\Seen"], { uid: true });
    } finally {
      lock.release();
    }
  });
}
