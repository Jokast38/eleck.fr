"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { LeadStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { logActivity } from "@/lib/activity";
import { fromLocalInput } from "@/lib/format";
import { clean } from "@/lib/validation/lead";
import { statusOrder } from "./format";

const revalidateLead = (id: string) => {
  revalidatePath("/admin", "layout");
  revalidatePath(`/admin/demandes/${id}`);
};

/** Change le statut d'une demande (tableau, Kanban, fiche). Horodate devis envoyé / clôture pour les KPI. */
export async function setLeadStatus(leadId: string, status: LeadStatus) {
  const user = await requireUser();
  if (!statusOrder.includes(status)) throw new Error("Statut inconnu");
  const lead = await db.lead.findUniqueOrThrow({ where: { id: leadId }, select: { status: true, quoteSentAt: true } });
  if (lead.status === status) return;
  await db.lead.update({
    where: { id: leadId },
    data: {
      status,
      quoteSentAt: status === "DEVIS_ENVOYE" && !lead.quoteSentAt ? new Date() : undefined,
      closedAt: status === "GAGNE" || status === "PERDU" ? new Date() : null,
    },
  });
  await logActivity({ userId: user.id, action: "lead.status", entityType: "lead", entityId: leadId, details: { from: lead.status, to: status } });
  revalidateLead(leadId);
}

/** Planification : date de relance, date de visite technique, responsable. */
export async function updateLeadPlanning(_prev: unknown, form: FormData) {
  const user = await requireUser();
  const leadId = String(form.get("leadId"));
  const assignedToId = String(form.get("assignedToId") ?? "") || null;
  await db.lead.update({
    where: { id: leadId },
    data: {
      followUpAt: fromLocalInput(String(form.get("followUpAt") ?? "")),
      visitAt: fromLocalInput(String(form.get("visitAt") ?? "")),
      assignedToId,
    },
  });
  await logActivity({ userId: user.id, action: "lead.update", entityType: "lead", entityId: leadId, details: { planning: true } });
  revalidateLead(leadId);
  return { ok: true, at: Date.now() };
}

export async function addNote(_prev: unknown, form: FormData) {
  const user = await requireUser();
  const leadId = String(form.get("leadId"));
  const body = clean(String(form.get("body") ?? "")).slice(0, 5000);
  if (!body) return { ok: false, error: "La note est vide.", at: Date.now() };
  await db.note.create({ data: { leadId, body, authorId: user.id } });
  await logActivity({ userId: user.id, action: "lead.note", entityType: "lead", entityId: leadId });
  revalidateLead(leadId);
  return { ok: true, at: Date.now() };
}

/** Suppression définitive (droit à l'effacement RGPD). Réservée aux administrateurs. */
export async function deleteLead(form: FormData) {
  const user = await requireUser({ role: "ADMIN" });
  const leadId = String(form.get("leadId"));
  const lead = await db.lead.findUniqueOrThrow({ where: { id: leadId }, select: { number: true } });
  // Les e-mails liés sont conservés dans la messagerie mais détachés ; photos et notes supprimées
  await db.lead.delete({ where: { id: leadId } });
  await logActivity({ userId: user.id, action: "lead.delete", entityType: "lead", entityId: leadId, details: { number: lead.number } });
  revalidatePath("/admin", "layout");
  redirect("/admin/demandes?supprime=1");
}
