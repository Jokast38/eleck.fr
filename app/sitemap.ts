import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { cities, cityPath, electricianPages, electricianPath } from "@/lib/content/cities";

/** Plan du site pour les moteurs : pages publiques indexables uniquement (ni admin, ni pages noindex). */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, "weekly"),
    // Électricité générale
    page("/depannage-electrique", 0.9),
    page("/renovation-electrique", 0.9),
    page("/tableau-electrique", 0.9),
    // Bornes de recharge et autres services
    page("/particuliers", 0.9),
    page("/coproprietes", 0.9),
    page("/entreprises", 0.9),
    page("/eclairage-led", 0.8),
    page("/electricite-tertiaire-industrielle", 0.8),
    page("/thermographie", 0.8),
    page("/maintenance", 0.7),
    // Conversion et réassurance
    page("/devis", 0.9),
    page("/realisations", 0.7, "weekly"),
    page("/zone-intervention", 0.7),
    page("/faq", 0.6),
    page("/a-propos", 0.5),
    // Pages locales
    ...cities.filter((c) => electricianPages[c.slug]).map((c) => page(electricianPath(c.slug), 0.8)),
    ...cities.map((c) => page(cityPath(c.slug), 0.8)),
    // Légal
    page("/mentions-legales", 0.1, "yearly"),
    page("/politique-de-confidentialite", 0.1, "yearly"),
    page("/cgu", 0.1, "yearly"),
    page("/gestion-cookies", 0.1, "yearly"),
  ];
}
