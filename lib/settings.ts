import "server-only";
import { db, hasDatabase } from "./db";
import { site } from "./site";

/**
 * Paramètres modifiables depuis le dashboard (table Setting), avec valeurs par défaut.
 * Les coordonnées légales (adresse, téléphone, SIRET) restent dans lib/site.ts pour garantir
 * la cohérence NAP avec Google Business Profile : elles ne changent qu'avec un redéploiement.
 */
export type Settings = {
  notifyEmails: string[];
  signature: string; // HTML
  responseDelay: string; // repris dans l'accusé de réception
  openingHours: string;
  zoneText: string;
};

export const defaultSettings = (): Settings => ({
  notifyEmails: (process.env.MAIL_NOTIFY_TO ?? site.email)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  signature: `<p>Cordialement,</p><p><strong>{{utilisateur}}</strong><br>elec k · Bornes de recharge IRVE<br>${site.phone.display} · ${site.email}<br>${site.address.street}, ${site.address.postalCode} ${site.address.city}</p>`,
  responseDelay: "dans les meilleurs délais",
  openingHours: "",
  zoneText: "Herblay-sur-Seine, Val-d'Oise (95) et Île-de-France",
});

export async function getSettings(): Promise<Settings> {
  const defaults = defaultSettings();
  if (!hasDatabase()) return defaults;
  try {
    const rows = await db.setting.findMany();
    const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return { ...defaults, ...stored } as Settings;
  } catch {
    return defaults;
  }
}

export async function saveSettings(values: Partial<Settings>) {
  await db.$transaction(
    Object.entries(values).map(([key, value]) =>
      db.setting.upsert({ where: { key }, create: { key, value }, update: { value } }),
    ),
  );
}
