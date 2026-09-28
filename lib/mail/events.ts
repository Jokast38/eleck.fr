import "server-only";
import { EventEmitter } from "node:events";

/**
 * Bus d'événements en mémoire (par instance serveur) : la synchronisation IMAP publie,
 * les connexions temps réel (SSE) du dashboard s'abonnent.
 */
export type MailEvent =
  | { type: "sync"; inbox: number; sent: number; leadIds: string[] }
  | { type: "sent"; leadId?: string | null }
  | { type: "lead"; leadId: string; label: string }
  | { type: "status"; connected: boolean; error?: string };

const g = globalThis as unknown as { __mailBus?: EventEmitter };
const bus = (g.__mailBus ??= new EventEmitter().setMaxListeners(100));

export const emitMailEvent = (e: MailEvent) => bus.emit("mail", e);
export function onMailEvent(fn: (e: MailEvent) => void) {
  bus.on("mail", fn);
  return () => bus.off("mail", fn);
}
