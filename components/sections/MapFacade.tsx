"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { site } from "@/lib/site";
import { CONSENT_EVENT, readConsent, type Consent } from "@/lib/consent";

/**
 * Carte OpenStreetMap chargée uniquement au clic (façade) : aucune requête vers un tiers
 * tant que le visiteur ne l'a pas demandée (RGPD + performance).
 */
export function MapFacade() {
  const [show, setShow] = useState(false);

  // Chargement automatique si le visiteur a accepté les contenus tiers
  useEffect(() => {
    if (readConsent()?.media) setShow(true);
    const onConsent = (e: Event) => (e as CustomEvent<Consent>).detail.media && setShow(true);
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);
  const { lat, lng } = site.geo;
  const bbox = [lng - 0.22, lat - 0.1, lng + 0.22, lat + 0.1].join(",");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-graphite">
      {show ? (
        <iframe
          src={src}
          title={`Carte de la zone d'intervention autour de ${site.address.city}`}
          className="absolute inset-0 size-full"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center [background-image:radial-gradient(circle_at_50%_45%,rgba(227,6,19,0.25),transparent_55%)]">
          <span className="relative flex size-16 items-center justify-center rounded-full bg-brand text-white">
            <MapPin aria-hidden className="size-8" />
          </span>
          <p className="mt-5 font-display text-lg font-semibold">
            {site.address.city} ({site.address.postalCode})
          </p>
          <p className="mt-1 text-sm text-muted">Point de départ de nos interventions</p>
          <button
            type="button"
            onClick={() => setShow(true)}
            className="mt-6 rounded-md border-2 border-white/70 px-5 py-2.5 font-semibold text-white hover:bg-white hover:text-ink"
          >
            Afficher la carte
          </button>
          <p className="mt-3 max-w-xs text-xs text-muted">La carte est fournie par OpenStreetMap et ne se charge qu&apos;à votre demande.</p>
        </div>
      )}
    </div>
  );
}
