/**
 * Exécuté une fois au démarrage du serveur Next.js.
 * Sur un serveur permanent (VPS, Docker), MAIL_IDLE_ALWAYS=true maintient l'écoute IMAP IDLE en continu :
 * les e-mails sont importés et rattachés aux demandes même quand personne n'a le dashboard ouvert.
 * Sur Vercel (serverless), laisser à false : la tâche planifiée /api/cron/mail-sync prend le relais.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.MAIL_IDLE_ALWAYS === "true") {
    const { startPermanentWatcher } = await import("./lib/mail/watcher");
    startPermanentWatcher();
  }
}
