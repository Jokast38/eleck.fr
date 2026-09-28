"use client";

import { useEffect, useId, useState } from "react";
import { readConsent, saveConsent, type Consent } from "@/lib/consent";

const categories = [
  {
    key: "media" as const,
    label: "Contenus tiers",
    text: "Affichage automatique de la carte OpenStreetMap de notre zone d'intervention. Si vous refusez, la carte reste disponible sur simple clic.",
  },
  {
    key: "statistics" as const,
    label: "Mesure d'audience avec cookies",
    text: "Utilisée uniquement si un outil de statistiques déposant des cookies est activé. Notre mesure d'audience principale fonctionne sans cookie.",
  },
];

/** Panneau de préférences (page /gestion-cookies). « Tout accepter » et « Tout refuser » ont le même poids visuel. */
export function CookiePreferences() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [draft, setDraft] = useState({ statistics: false, media: false });
  const [saved, setSaved] = useState(false);
  const baseId = useId();

  useEffect(() => {
    const c = readConsent();
    setConsent(c);
    if (c) setDraft({ statistics: c.statistics, media: c.media });
  }, []);

  const apply = (choice: { statistics: boolean; media: boolean }) => {
    setDraft(choice);
    setConsent(saveConsent(choice));
    setSaved(true);
  };

  const btn = "h-12 rounded-md border-2 border-ink px-5 font-semibold transition-colors";

  return (
    <div className="mt-5 rounded-xl border border-black/10 bg-mist p-6 sm:p-8">
      <p className="text-sm text-muted-dark" aria-live="polite">
        {saved
          ? "Vos préférences ont été enregistrées."
          : consent
            ? `Choix enregistré le ${new Date(consent.date).toLocaleDateString("fr-FR")}.`
            : "Aucun choix enregistré pour le moment."}
      </p>
      <ul className="mt-6 space-y-4">
        <li className="rounded-lg border border-black/10 bg-white p-4">
          <p className="font-semibold text-ink">Strictement nécessaires (toujours actifs)</p>
          <p className="mt-1 text-sm text-muted-dark">
            Mémorisation de vos choix de cookies et sécurité du formulaire. Ils ne nécessitent pas votre consentement.
          </p>
        </li>
        {categories.map((c) => (
          <li key={c.key} className="flex items-start justify-between gap-6 rounded-lg border border-black/10 bg-white p-4">
            <div>
              <label htmlFor={`${baseId}-${c.key}`} className="font-semibold text-ink">
                {c.label}
              </label>
              <p id={`${baseId}-${c.key}-desc`} className="mt-1 text-sm text-muted-dark">
                {c.text}
              </p>
            </div>
            <input
              id={`${baseId}-${c.key}`}
              type="checkbox"
              role="switch"
              aria-describedby={`${baseId}-${c.key}-desc`}
              checked={draft[c.key]}
              onChange={(e) => {
                setSaved(false);
                setDraft((d) => ({ ...d, [c.key]: e.target.checked }));
              }}
              className="mt-1 size-5 shrink-0 accent-brand"
            />
          </li>
        ))}
      </ul>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <button type="button" onClick={() => apply({ statistics: false, media: false })} className={`${btn} bg-white text-ink hover:bg-ink hover:text-white`}>
          Tout refuser
        </button>
        <button type="button" onClick={() => apply({ statistics: true, media: true })} className={`${btn} bg-white text-ink hover:bg-ink hover:text-white`}>
          Tout accepter
        </button>
        <button type="button" onClick={() => apply(draft)} className={`${btn} bg-ink text-white hover:bg-graphite-2`}>
          Enregistrer mes choix
        </button>
      </div>
    </div>
  );
}
