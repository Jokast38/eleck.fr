"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Bell, BellOff, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Toast = { id: number; text: string; href?: string };

/**
 * Temps réel du dashboard : écoute le flux SSE, rafraîchit les données affichées
 * et affiche une notification (dans la page, et dans le système si autorisé et l'onglet en arrière-plan).
 */
export function LiveUpdates() {
  const router = useRouter();
  const [status, setStatus] = useState<"off" | "connecting" | "live" | "no-imap">("connecting");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission | "unsupported">("default");
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNotifPerm(typeof Notification === "undefined" ? "unsupported" : Notification.permission);

    const refresh = () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      refreshTimer.current = setTimeout(() => router.refresh(), 400);
    };
    const notify = (text: string, href?: string) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t.slice(-3), { id, text, href }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 8000);
      if (typeof Notification !== "undefined" && Notification.permission === "granted" && document.hidden) {
        const n = new Notification("elec k", { body: text, icon: "/icon-192.png" });
        n.onclick = () => {
          window.focus();
          if (href) router.push(href);
        };
      }
    };

    const es = new EventSource("/api/admin/mail/events");
    es.addEventListener("hello", (e) => {
      const d = JSON.parse((e as MessageEvent).data) as { imap: boolean; connected: boolean };
      setStatus(!d.imap ? "no-imap" : d.connected ? "live" : "connecting");
    });
    es.addEventListener("status", (e) => {
      const d = JSON.parse((e as MessageEvent).data) as { connected: boolean };
      setStatus(d.connected ? "live" : "connecting");
    });
    es.addEventListener("sync", (e) => {
      const d = JSON.parse((e as MessageEvent).data) as { inbox: number };
      refresh();
      if (d.inbox > 0) notify(d.inbox > 1 ? `${d.inbox} nouveaux e-mails reçus` : "Nouvel e-mail reçu", "/admin/messagerie");
    });
    es.addEventListener("lead", (e) => {
      const d = JSON.parse((e as MessageEvent).data) as { leadId: string; label: string };
      refresh();
      notify(`Nouvelle demande de devis : ${d.label}`, `/admin/demandes/${d.leadId}`);
    });
    es.addEventListener("sent", refresh);
    es.onerror = () => setStatus((s) => (s === "no-imap" ? s : "connecting"));

    return () => es.close();
  }, [router]);

  const label = {
    live: "Messagerie connectée en temps réel",
    connecting: "Connexion à la messagerie…",
    off: "Messagerie hors ligne",
    "no-imap": "Messagerie non configurée (IMAP)",
  }[status];

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-2 text-xs text-white/70" title={label}>
          <span className={cn("size-2 rounded-full", status === "live" ? "bg-emerald-400" : status === "no-imap" ? "bg-neutral-500" : "animate-pulse bg-amber-400")} />
          <span className="sr-only sm:not-sr-only">{status === "live" ? "En direct" : status === "no-imap" ? "IMAP non configuré" : "Connexion…"}</span>
        </span>
        {notifPerm !== "unsupported" && (
          <button
            type="button"
            onClick={async () => setNotifPerm(await Notification.requestPermission())}
            disabled={notifPerm !== "default"}
            className="rounded p-1.5 text-white/70 hover:bg-white/10 hover:text-white disabled:hover:bg-transparent"
            title={notifPerm === "granted" ? "Notifications activées" : notifPerm === "denied" ? "Notifications bloquées par le navigateur" : "Activer les notifications"}
          >
            {notifPerm === "denied" ? <BellOff aria-hidden className="size-4" /> : <Bell aria-hidden className="size-4" />}
            <span className="sr-only">
              {notifPerm === "granted" ? "Notifications activées" : notifPerm === "denied" ? "Notifications bloquées" : "Activer les notifications du navigateur"}
            </span>
          </button>
        )}
      </div>

      {mounted &&
        createPortal(
      <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto flex items-start gap-3 rounded-lg border-l-4 border-brand bg-ink p-4 text-sm text-white shadow-xl">
            {t.href ? (
              <a href={t.href} className="flex-1 font-medium hover:underline" onClick={(e) => (e.preventDefault(), router.push(t.href!))}>
                {t.text}
              </a>
            ) : (
              <p className="flex-1 font-medium">{t.text}</p>
            )}
            <button type="button" onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))} className="text-white/60 hover:text-white">
              <X aria-hidden className="size-4" />
              <span className="sr-only">Fermer</span>
            </button>
          </div>
        ))}
      </div>,
          document.body,
        )}
    </>
  );
}
