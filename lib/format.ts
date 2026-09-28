/** Formats de date et de durée en français (fuseau Europe/Paris). */
const tz = "Europe/Paris";

export const formatDate = (d: Date | string | null | undefined) =>
  d ? new Date(d).toLocaleDateString("fr-FR", { timeZone: tz, day: "2-digit", month: "2-digit", year: "numeric" }) : "";

export const formatDateTime = (d: Date | string | null | undefined) =>
  d
    ? new Date(d).toLocaleString("fr-FR", { timeZone: tz, day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "";

/** Date courte adaptée à une liste de messages : heure si aujourd'hui, sinon jour et mois. */
export function formatShort(d: Date | string) {
  const date = new Date(d);
  const today = new Date().toLocaleDateString("fr-FR", { timeZone: tz });
  if (date.toLocaleDateString("fr-FR", { timeZone: tz }) === today)
    return date.toLocaleTimeString("fr-FR", { timeZone: tz, hour: "2-digit", minute: "2-digit" });
  return date.toLocaleDateString("fr-FR", { timeZone: tz, day: "numeric", month: "short" });
}

export function formatDuration(hours: number | null) {
  if (hours === null || Number.isNaN(hours)) return "–";
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} min`;
  if (hours < 48) return `${Math.round(hours)} h`;
  return `${Math.round(hours / 24)} j`;
}

export function timeAgo(d: Date | string) {
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (s < 60) return "à l'instant";
  if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
  if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
  return `il y a ${Math.floor(s / 86400)} j`;
}

/** Valeur « AAAA-MM-JJTHH:MM » pour un champ datetime-local, en heure de Paris. */
export function toLocalInput(d: Date | null | undefined) {
  if (!d) return "";
  const parts = new Intl.DateTimeFormat("sv-SE", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(d);
  return parts.replace(" ", "T");
}

/** Interprète une valeur datetime-local saisie en heure de Paris. */
export function fromLocalInput(v: string) {
  if (!v) return null;
  const guess = new Date(`${v}:00Z`);
  // Décalage Paris/UTC à cette date (gère l'heure d'été)
  const paris = new Date(guess.toLocaleString("en-US", { timeZone: tz }));
  const utc = new Date(guess.toLocaleString("en-US", { timeZone: "UTC" }));
  return new Date(guess.getTime() - (paris.getTime() - utc.getTime()));
}
