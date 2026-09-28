import "server-only";
import type { Prisma } from "@prisma/client";
import { db } from "./db";

/** Journal d'activité : qui a fait quoi, et quand. N'interrompt jamais l'action en cas d'échec d'écriture. */
export async function logActivity(entry: {
  userId?: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: Prisma.InputJsonValue;
  ip?: string;
}) {
  try {
    await db.activityLog.create({ data: { ...entry, userId: entry.userId ?? null } });
  } catch (e) {
    console.error("[activity] échec d'écriture", e);
  }
}

export const actionLabels: Record<string, string> = {
  "lead.create": "Nouvelle demande de devis",
  "lead.status": "Changement de statut",
  "lead.update": "Mise à jour d'une demande",
  "lead.note": "Note ajoutée",
  "lead.delete": "Demande supprimée",
  "lead.export": "Export CSV des demandes",
  "mail.send": "E-mail envoyé",
  "mail.link": "E-mail rattaché à une demande",
  "user.login": "Connexion",
  "user.login_failed": "Échec de connexion",
  "user.locked": "Compte verrouillé",
  "user.create": "Utilisateur créé",
  "user.update": "Utilisateur modifié",
  "user.2fa_enabled": "Double authentification activée",
  "user.2fa_disabled": "Double authentification désactivée",
  "user.password": "Mot de passe modifié",
  "content.realisation": "Réalisation modifiée",
  "content.faq": "FAQ modifiée",
  "content.template": "Modèle de réponse modifié",
  "settings.update": "Paramètres modifiés",
};
