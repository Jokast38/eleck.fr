import "server-only";
import { db } from "@/lib/db";
import { imapConfigured, trashOnServer } from "./imap";

/**
 * Supprime des e-mails du dashboard (pièces jointes comprises) après les avoir placés dans la corbeille du serveur IMAP.
 * Si le serveur refuse, rien n'est supprimé : le dashboard et les autres clients mail restent identiques.
 */
export async function deleteMessages(ids: string[]) {
  if (!ids.length) return 0;
  const messages = await db.emailMessage.findMany({ where: { id: { in: ids } }, select: { folder: true, uid: true, uidValidity: true } });
  if (imapConfigured())
    await trashOnServer(
      messages.flatMap((m) => (m.uid !== null && m.uidValidity !== null ? [{ folder: m.folder, uid: m.uid, uidValidity: m.uidValidity }] : [])),
    );
  const { count } = await db.emailMessage.deleteMany({ where: { id: { in: ids } } });
  return count;
}
