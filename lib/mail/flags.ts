import "server-only";
import { db } from "@/lib/db";
import { imapConfigured, setSeenOnServer } from "./imap";

/** Marque des messages lus / non lus en base ET sur le serveur IMAP (état identique dans tous les clients mail). */
export async function setSeen(ids: string[], seen: boolean) {
  if (!ids.length) return;
  const messages = await db.emailMessage.findMany({ where: { id: { in: ids } }, select: { folder: true, uid: true } });
  await db.emailMessage.updateMany({ where: { id: { in: ids } }, data: { seen } });
  if (!imapConfigured()) return;
  for (const m of messages) {
    if (m.uid === null) continue;
    await setSeenOnServer(m.folder, m.uid, seen).catch((e) => console.error("[mail] indicateur IMAP", e));
  }
}
