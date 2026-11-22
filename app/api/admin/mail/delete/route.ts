import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { apiUser } from "@/lib/auth/session";
import { isSameOrigin } from "@/lib/security/request";
import { logActivity } from "@/lib/activity";
import { deleteMessages } from "@/lib/mail/delete";

export const runtime = "nodejs";

const schema = z.object({ ids: z.array(z.string().max(40)).min(1).max(200) });

/** Suppression d'un ou plusieurs e-mails (dashboard + corbeille de la boîte mail). */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Origine non autorisée" }, { status: 403 });
  const user = await apiUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const body = schema.safeParse(await req.json().catch(() => ({})));
  if (!body.success) return NextResponse.json({ error: "Données invalides" }, { status: 422 });

  let count: number;
  try {
    count = await deleteMessages(body.data.ids);
  } catch (e) {
    console.error("[mail] suppression", e);
    return NextResponse.json({ error: "La boîte mail n'a pas pu être mise à jour. Réessayez dans un instant." }, { status: 502 });
  }
  await logActivity({ userId: user.id, action: "mail.delete", entityType: "email", details: { count } });
  revalidatePath("/admin", "layout");
  return NextResponse.json({ ok: true, count });
}
