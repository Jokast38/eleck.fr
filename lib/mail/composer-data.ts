import "server-only";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { sanitizeOutgoing, escapeHtml } from "./sanitize";
import { leadReference } from "@/lib/leads/format";

/** Données nécessaires au composant de rédaction : modèles, aperçu de signature, variables d'une demande. */
export async function composerData(userName: string) {
  const [templates, settings] = await Promise.all([
    db.template.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }], select: { id: true, name: true, subject: true, body: true } }),
    getSettings(),
  ]);
  return {
    templates,
    signaturePreview: sanitizeOutgoing(settings.signature.replaceAll("{{utilisateur}}", escapeHtml(userName))),
  };
}

export function leadVariables(l: { number: number; firstName: string; lastName: string; city: string; companyName?: string | null }, userName: string) {
  return {
    prenom: l.firstName,
    nom: l.lastName,
    ville: l.city,
    entreprise: l.companyName ?? "",
    reference: leadReference(l.number),
    utilisateur: userName,
  };
}
