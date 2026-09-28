import { NextResponse } from "next/server";
import { imapConfigured, syncMailbox } from "@/lib/mail/imap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * Tâche planifiée (Vercel Cron, voir vercel.json) : synchronise la boîte même quand personne
 * n'a le dashboard ouvert, pour que les réponses des prospects soient rattachées sans délai.
 * Protégée par CRON_SECRET (Vercel envoie « Authorization: Bearer <CRON_SECRET> »).
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Non autorisé", { status: 401 });
  if (!imapConfigured()) return NextResponse.json({ skipped: "IMAP non configuré" });
  const res = await syncMailbox();
  return NextResponse.json({ ok: true, ...res });
}
