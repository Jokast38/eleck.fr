"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

/** Déclenche un événement de conversion dans Plausible (script ajouté à l'étape SEO / analytics). */
export function ConversionEvent({ name }: { name: string }) {
  useEffect(() => {
    window.plausible?.(name);
  }, [name]);
  return null;
}
