import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { apiUser } from "@/lib/auth/session";
import { isSameOrigin } from "@/lib/security/request";
import { logActivity } from "@/lib/activity";
import { setSeen } from "@/lib/mail/flags";
import { recordResponse } from "@/lib/mail/responses";

export const runtime = "nodejs";

const schema = z.object({
  seen: z.boolean().optional(),
  leadId: z.string().max(40).nullable().optional(),
});

/** Lu / non lu, et rattachement manuel d'un e-mail à une demande. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Origine non autorisée" }, { status: 403 });
  const user = await apiUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const { id } = await params;
  const body = schema.safeParse(await req.json().catch(() => ({})));
  if (!body.success) return NextResponse.json({ error: "Données invalides" }, { status: 422 });

  const message = await db.emailMessage.findUnique({ where: { id }, select: { id: true, direction: true, date: true } });
  if (!message) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  if (body.data.seen !== undefined) await setSeen([id], body.data.seen);
  if (body.data.leadId !== undefined) {
    if (body.data.leadId && !(await db.lead.findUnique({ where: { id: body.data.leadId }, select: { id: true } })))
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    await db.emailMessage.update({ where: { id }, data: { leadId: body.data.leadId } });
    if (body.data.leadId && message.direction === "OUTBOUND") await recordResponse(body.data.leadId, message.date, user.id);
    await logActivity({ userId: user.id, action: "mail.link", entityType: "lead", entityId: body.data.leadId ?? undefined, details: { emailId: id } });
  }
  revalidatePath("/admin", "layout");
  return NextResponse.json({ ok: true });
}
