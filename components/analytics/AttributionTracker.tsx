"use client";

import { useEffect } from "react";

export const ATTRIBUTION_KEY = "eleck-attribution";

/**
 * Mémorise, pour la session, la provenance de la visite (référent externe, page d'arrivée, UTM).
 * Transmise avec la demande de devis pour la répartition « provenance » du dashboard.
 * sessionStorage uniquement : aucun cookie, rien n'est conservé après la fermeture de l'onglet.
 */
export function AttributionTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(ATTRIBUTION_KEY)) return;
      const params = new URLSearchParams(location.search);
      const utm = Object.fromEntries([...params].filter(([k]) => k.startsWith("utm_")));
      sessionStorage.setItem(
        ATTRIBUTION_KEY,
        JSON.stringify({ referrer: document.referrer || undefined, landingPage: location.pathname, utm }),
      );
    } catch {
      /* stockage indisponible */
    }
  }, []);
  return null;
}
