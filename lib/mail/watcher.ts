import "server-only";
import type { ImapFlow } from "imapflow";
import { createImapClient, imapConfigured, syncMailbox } from "./imap";
import { emitMailEvent } from "./events";

/**
 * Réception en temps réel : une connexion IMAP en mode IDLE sur INBOX.
 * Le serveur signale chaque nouveau message (« exists ») → synchronisation → événement poussé
 * aux dashboards ouverts (SSE). La connexion est partagée par tous les onglets d'une même instance,
 * ouverte au premier abonné et fermée 60 s après le départ du dernier (sauf MAIL_IDLE_ALWAYS=true).
 * Une synchronisation complète est aussi lancée toutes les 5 minutes (dossier « Envoyés » compris).
 */
type State = {
  client: ImapFlow | null;
  connecting: Promise<void> | null;
  subscribers: number;
  always: boolean;
  stopTimer: ReturnType<typeof setTimeout> | null;
  periodic: ReturnType<typeof setInterval> | null;
  debounce: ReturnType<typeof setTimeout> | null;
  retry: number;
  connected: boolean;
};

const g = globalThis as unknown as { __mailWatcher?: State };
const s: State = (g.__mailWatcher ??= {
  client: null,
  connecting: null,
  subscribers: 0,
  always: false,
  stopTimer: null,
  periodic: null,
  debounce: null,
  retry: 0,
  connected: false,
});

const wanted = () => s.always || s.subscribers > 0;

function scheduleSync() {
  if (s.debounce) clearTimeout(s.debounce);
  s.debounce = setTimeout(() => syncMailbox().catch((e) => console.error("[mail] sync", e)), 800);
}

async function connect() {
  if (s.client || s.connecting || !imapConfigured()) return s.connecting ?? undefined;
  s.connecting = (async () => {
    const client = createImapClient();
    client.on("exists", scheduleSync);
    client.on("error", (e: Error) => console.error("[mail] IMAP", e.message));
    client.on("close", () => {
      s.client = null;
      s.connected = false;
      emitMailEvent({ type: "status", connected: false });
      if (wanted()) {
        // Reconnexion avec délai progressif (5 s → 60 s)
        const delay = Math.min(60_000, 5_000 * 2 ** s.retry++);
        setTimeout(() => wanted() && connect(), delay);
      }
    });
    await client.connect();
    await client.mailboxOpen("INBOX"); // ImapFlow passe automatiquement en IDLE lorsqu'il est inactif
    s.client = client;
    s.connected = true;
    s.retry = 0;
    emitMailEvent({ type: "status", connected: true });
    s.periodic ??= setInterval(() => syncMailbox().catch(() => {}), 5 * 60_000);
    scheduleSync(); // rattrapage des messages reçus pendant la déconnexion
  })()
    .catch((e: Error) => {
      emitMailEvent({ type: "status", connected: false, error: e.message });
      if (wanted()) setTimeout(() => wanted() && connect(), Math.min(60_000, 5_000 * 2 ** s.retry++));
    })
    .finally(() => {
      s.connecting = null;
    });
  return s.connecting;
}

async function disconnect() {
  if (s.periodic) clearInterval(s.periodic);
  s.periodic = null;
  const c = s.client;
  s.client = null;
  s.connected = false;
  await c?.logout().catch(() => c.close());
}

/** Abonne un dashboard ; renvoie la fonction de désabonnement. */
export function subscribeWatcher() {
  s.subscribers++;
  if (s.stopTimer) clearTimeout(s.stopTimer);
  s.stopTimer = null;
  void connect();
  return () => {
    s.subscribers = Math.max(0, s.subscribers - 1);
    if (!wanted()) s.stopTimer = setTimeout(() => !wanted() && disconnect(), 60_000);
  };
}

/** Mode serveur permanent (VPS/Docker) : écoute continue, démarrée par instrumentation.ts. */
export function startPermanentWatcher() {
  s.always = true;
  void connect();
}

export const watcherConnected = () => s.connected;
