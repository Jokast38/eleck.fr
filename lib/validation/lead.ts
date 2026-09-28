import { z } from "zod";
import { serviceByKey, type ServiceKey } from "@/lib/content/services";

/**
 * Schéma de la demande de devis, PARTAGÉ entre le formulaire (client) et /api/leads (serveur).
 * Toute évolution se fait ici, une seule fois.
 */

export const clientTypes = {
  PARTICULIER: "Particulier",
  COPROPRIETE: "Copropriété",
  ENTREPRISE: "Entreprise",
} as const;
export type ClientTypeKey = keyof typeof clientTypes;

/** Types de site pour une borne de recharge. */
export const siteTypes: Record<ClientTypeKey, string[]> = {
  PARTICULIER: ["Maison individuelle", "Appartement (place en copropriété)", "Résidence secondaire"],
  COPROPRIETE: ["Parking souterrain", "Parking extérieur", "Boxes fermés", "Autre"],
  ENTREPRISE: ["Parking d'entreprise", "Commerce / établissement recevant du public", "Dépôt ou flotte de véhicules", "Autre"],
};

/** Types de site pour les autres activités (éclairage LED, électricité, thermographie). */
export const siteTypesOther: Record<ClientTypeKey, string[]> = {
  PARTICULIER: ["Maison individuelle", "Appartement", "Autre"],
  COPROPRIETE: ["Parties communes", "Parking", "Autre"],
  ENTREPRISE: [
    "Commerce / grande surface",
    "Bureaux",
    "Entrepôt / site industriel",
    "Établissement recevant du public",
    "Collectivité / bâtiment public",
    "Autre",
  ],
};

export const siteTypeOptions = (service: ServiceKey, clientType: ClientTypeKey) =>
  (service === "BORNE" ? siteTypes : siteTypesOther)[clientType];

export const chargerCounts = ["1", "2", "3 à 5", "6 à 10", "Plus de 10", "Je ne sais pas"];
export const powers = ["7 kW", "11 kW", "22 kW", "Je ne sais pas"];
export const locations = ["Intérieure", "Extérieure", "Je ne sais pas"];
export const distances = ["Moins de 10 m", "10 à 25 m", "25 à 50 m", "Plus de 50 m", "Je ne sais pas"];
export const timelines = ["Dès que possible", "Dans les 3 mois", "Dans les 6 mois", "Je me renseigne"];

export const PHOTO_MAX_FILES = 5;
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
export const PHOTO_ACCEPT = ["image/jpeg", "image/png", "image/heic", "image/heif"];

/** Nettoyage : suppression des balises, des caractères de contrôle et des espaces superflus. */
export const clean = (s: string) =>
  s
    .normalize("NFC")
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();

const text = (max: number) => z.string().transform(clean).pipe(z.string().max(max, `${max} caractères maximum`));
const required = (msg: string, max = 100) =>
  z.string().transform(clean).pipe(z.string().min(1, msg).max(max, `${max} caractères maximum`));
const oneOf = (values: string[], msg: string) =>
  z.string({ error: msg }).refine((v) => values.includes(v), { message: msg });

// Mobile ou fixe français : 06 12 34 56 78, 0612345678, +33 6 12 34 56 78, 0033…
export const FR_PHONE = /^(?:(?:\+|00)33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/;

export const stepProfileSchema = z.object({
  service: z.enum(["BORNE", "LED", "ELECTRICITE", "THERMOGRAPHIE"], { error: "Choisissez le type de prestation" }),
  clientType: z.enum(["PARTICULIER", "COPROPRIETE", "ENTREPRISE"], { error: "Choisissez votre profil" }),
});

// Les champs propres aux bornes ou aux autres activités sont contrôlés par projectIssues() selon le service
const optionalChoice = z.string().max(120).optional();
export const stepProjectSchema = z.object({
  siteType: required("Indiquez le type de site"),
  companyName: text(120).optional(),
  need: optionalChoice,
  chargerCount: optionalChoice,
  power: optionalChoice,
  location: optionalChoice,
  distance: optionalChoice,
  vehicle: text(80).optional(),
  timeline: oneOf(timelines, "Indiquez le délai souhaité"),
});

type ProjectFields = {
  service?: ServiceKey;
  clientType?: ClientTypeKey;
  siteType?: string;
  companyName?: string;
  need?: string;
  chargerCount?: string;
  power?: string;
  location?: string;
  distance?: string;
};

/**
 * Règles qui dépendent du service et du profil. Utilisées à l'identique par le formulaire (étape 2)
 * et par le serveur (validation finale).
 */
export function projectIssues(v: ProjectFields): { path: string; message: string }[] {
  if (!v.service || !v.clientType) return [];
  const issues: { path: string; message: string }[] = [];
  const check = (path: keyof ProjectFields, values: string[], message: string) => {
    if (!values.includes(String(v[path] ?? ""))) issues.push({ path, message });
  };
  check("siteType", siteTypeOptions(v.service, v.clientType), "Indiquez le type de site");
  if (v.clientType === "ENTREPRISE" && !v.companyName?.trim()) issues.push({ path: "companyName", message: "Indiquez le nom de l'entreprise ou de la collectivité" });
  if (v.service === "BORNE") {
    check("chargerCount", chargerCounts, "Indiquez le nombre de bornes");
    check("power", powers, "Indiquez la puissance souhaitée");
    check("location", locations, "Indiquez l'emplacement");
    check("distance", distances, "Indiquez la distance approximative");
  } else {
    check("need", serviceByKey(v.service)?.needs ?? [], "Indiquez la nature de votre demande");
  }
  return issues;
}

export const stepContactSchema = z.object({
  firstName: required("Indiquez votre prénom", 60),
  lastName: required("Indiquez votre nom", 60),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Adresse e-mail invalide").max(160)),
  phone: z
    .string()
    .trim()
    .regex(FR_PHONE, "Numéro de téléphone français invalide (ex. 06 12 34 56 78)"),
  postalCode: z
    .string()
    .trim()
    .regex(/^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/, "Code postal invalide (5 chiffres)"),
  city: required("Indiquez votre ville", 80),
  message: text(2000).optional(),
});

export const stepConsentSchema = z.object({
  consent: z.literal(true, { error: "Votre accord est nécessaire pour traiter votre demande" }),
});

export const leadSchema = stepProfileSchema
  .extend(stepProjectSchema.shape)
  .extend(stepContactSchema.shape)
  .extend(stepConsentSchema.shape)
  .superRefine((v, ctx) => {
    for (const i of projectIssues(v)) ctx.addIssue({ code: "custom", path: [i.path], message: i.message });
  });

export type LeadInput = z.input<typeof leadSchema>;
export type LeadData = z.output<typeof leadSchema>;

/** Champs techniques envoyés avec le formulaire (anti-spam, provenance). */
export const leadMetaSchema = z.object({
  website: z.string().max(200).optional(), // pot de miel : doit rester vide
  startedAt: z.coerce.number(), // horodatage d'ouverture du formulaire
  turnstileToken: z.string().max(4096).optional(),
  attribution: z
    .object({
      referrer: z.string().max(500).optional(),
      landingPage: z.string().max(500).optional(),
      utm: z.record(z.string(), z.string().max(200)).optional(),
    })
    .optional(),
});

/** Normalise un numéro français au format « 06 12 34 56 78 ». */
export function formatFrPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").replace(/^(?:0033|33)/, "0");
  return digits.length === 10 ? digits.replace(/(\d{2})(?=\d)/g, "$1 ") : raw;
}
