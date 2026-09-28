import { apiUser } from "@/lib/auth/session";
import { onMailEvent } from "@/lib/mail/events";
import { imapConfigured } from "@/lib/mail/imap";
import { subscribeWatcher, watcherConnected } from "@/lib/mail/watcher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Flux temps réel du dashboard (Server-Sent Events).
 * Pousse : nouveaux e-mails (IMAP IDLE), nouvelles demandes de devis, e-mails envoyés, état de la connexion.
 * La connexion est fermée avant la durée maximale de la fonction ; le navigateur se reconnecte seul.
 */
export async function GET(req: Request) {
  const user = await apiUser();
  if (!user) return new Response("Non authentifié", { status: 401 });

  const encoder = new TextEncoder();
  let cleanup = () => {};

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;
      const send = (event: string, data: unknown) => {
        if (!closed) controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };
      const off = onMailEvent((e) => send(e.type, e));
      const unsubscribe = imapConfigured() ? subscribeWatcher() : () => {};
      send("hello", { imap: imapConfigured(), connected: watcherConnected() });
      const heartbeat = setInterval(() => !closed && controller.enqueue(encoder.encode(": ping\n\n")), 25_000);
      const end = setTimeout(() => cleanup(), (maxDuration - 20) * 1000);

      cleanup = () => {
        if (closed) return;
        closed = true;
        clearInterval(heartbeat);
        clearTimeout(end);
        off();
        unsubscribe();
        try {
          controller.close();
        } catch {
          /* déjà fermé */
        }
      };
      req.signal.addEventListener("abort", () => cleanup());
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
