import type { Metadata } from "next";
import { site, SITE_URL } from "./site";

/**
 * Métadonnées d'une page : title unique (≤ 60 caractères, suffixe « | elec k » compris),
 * meta description (≤ 155 caractères), URL canonique, Open Graph et Twitter Card.
 */
export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  /** true : n'ajoute pas le suffixe « | elec k » (titre déjà complet) */
  absoluteTitle?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: { title: fullTitle, description, url, type: "website", locale: "fr_FR", siteName: site.name },
    twitter: { card: "summary_large_image", title: fullTitle, description },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

export const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;
