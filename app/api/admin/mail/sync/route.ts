import { NextResponse } from "next/server";
import { apiUser } from "@/lib/auth/session";
import { isSameOrigin } from "@/lib/security/request";
import { imapConfigured, syncMailbox } from "@/lib/mail/imap";

export const runtime = "nodejs";
export const maxDuration = 120;

/** Synchronisation IMAP à la demande (bouton « Synchroniser » de la messagerie). */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Origine non autorisée" }, { status: 403 });
  if (!(await apiUser())) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  if (!imapConfigured()) return NextResponse.json({ error: "La réception n'est pas configurée (variables IMAP)." }, { status: 503 });
  try {
    const res = await syncMailbox();
    return NextResponse.json({ ok: true, ...res });
  } catch (e) {
    console.error("[mail] sync", e);
    return NextResponse.json({ error: "Connexion au serveur IMAP impossible." }, { status: 502 });
  }
}
