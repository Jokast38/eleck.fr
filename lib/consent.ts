/**
 * Consentement aux traceurs (CNIL). Stocké dans le navigateur uniquement (localStorage), durée 6 mois.
 * Catégories soumises à consentement :
 *  - statistics : mesure d'audience avec cookies (ex. GA4), seulement si un tel outil est activé.
 *  - media      : contenus tiers chargés automatiquement (carte OpenStreetMap).
 * La mesure d'audience sans cookie (Plausible) est exemptée et n'en dépend pas.
 */
export type Consent = { statistics: boolean; media: boolean; date: string };

export const CONSENT_KEY = "eleck-consent-v1";
export const CONSENT_EVENT = "eleck:consent";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 182; // ~6 mois (recommandation CNIL)

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    if (Date.now() - new Date(c.date).getTime() > MAX_AGE_MS) return null; // choix expiré : on redemande
    return c;
  } catch {
    return null;
  }
}

export function saveConsent(choice: Omit<Consent, "date">) {
  const c: Consent = { ...choice, date: new Date().toISOString() };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
  } catch {
    /* stockage indisponible : le choix vaut pour la session en cours */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: c }));
  return c;
}
