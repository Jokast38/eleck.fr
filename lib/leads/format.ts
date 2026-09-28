import type { ClientType, LeadStatus } from "@prisma/client";
import { serviceLabels, type ServiceKey } from "@/lib/content/services";

export const leadReference = (n: number) => `DEV-${String(n).padStart(5, "0")}`;

export const clientTypeLabels: Record<ClientType, string> = {
  PARTICULIER: "Particulier",
  COPROPRIETE: "Copropriété",
  ENTREPRISE: "Entreprise",
};

export const statusLabels: Record<LeadStatus, string> = {
  NOUVEAU: "Nouveau",
  CONTACTE: "Contacté",
  VISITE_PLANIFIEE: "Visite planifiée",
  DEVIS_ENVOYE: "Devis envoyé",
  GAGNE: "Gagné",
  PERDU: "Perdu",
};

export const statusOrder: LeadStatus[] = ["NOUVEAU", "CONTACTE", "VISITE_PLANIFIEE", "DEVIS_ENVOYE", "GAGNE", "PERDU"];

export const sourceLabels: Record<string, string> = {
  organique: "Recherche naturelle",
  direct: "Accès direct",
  reseaux: "Réseaux sociaux",
  referent: "Sites référents",
  payant: "Publicité",
};

type LeadLike = {
  number: number;
  clientType: ClientType;
  companyName?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postalCode: string;
  city: string;
  service?: string;
  need?: string | null;
  siteType: string;
  chargerCount?: string | null;
  power?: string | null;
  location?: string | null;
  distance?: string | null;
  vehicle?: string | null;
  timeline: string;
  message?: string | null;
};

/** Récapitulatif du projet (e-mails, fiche, export). */
export function projectRows(l: LeadLike): [string, string | null | undefined][] {
  return [
    ["Prestation", serviceLabels[(l.service ?? "BORNE") as ServiceKey] ?? l.service],
    ["Nature de la demande", l.need],
    ["Profil", clientTypeLabels[l.clientType]],
    [l.clientType === "ENTREPRISE" ? "Entreprise / collectivité" : "Résidence / syndic", l.companyName],
    ["Type de site", l.siteType],
    ["Nombre de bornes", l.chargerCount],
    ["Puissance", l.power],
    ["Emplacement", l.location],
    ["Distance au tableau", l.distance],
    ["Véhicule", l.vehicle],
    ["Délai souhaité", l.timeline],
  ];
}

export function contactRows(l: LeadLike): [string, string | null | undefined][] {
  return [
    ["Nom", `${l.firstName} ${l.lastName}`],
    ["E-mail", l.email],
    ["Téléphone", l.phone],
    ["Ville", `${l.postalCode} ${l.city}`],
    ["Message", l.message],
  ];
}

/** Classe la provenance d'une visite à partir du référent et des paramètres UTM. */
export function classifySource(referrer?: string, utm?: Record<string, string>, ownHost?: string) {
  const medium = utm?.utm_medium?.toLowerCase() ?? "";
  if (/cpc|ppc|paid|ads|display/.test(medium)) return "payant";
  if (/social/.test(medium)) return "reseaux";
  if (!referrer) return utm?.utm_source ? "referent" : "direct";
  let host = "";
  try {
    host = new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "direct";
  }
  if (ownHost && host === ownHost.replace(/^www\./, "")) return "direct";
  if (/(^|\.)(google|bing|qwant|duckduckgo|ecosia|yahoo|yandex|lilo|brave)\./.test(host)) return "organique";
  if (/(facebook|instagram|linkedin|twitter|x\.com|t\.co|tiktok|pinterest|youtube|whatsapp)/.test(host)) return "reseaux";
  return "referent";
}
