import { db } from "@/lib/db";

export const runtime = "nodejs";

/**
 * Photos publiques : uniquement celles d'une réalisation PUBLIÉE.
 * Les photos des demandes et les pièces jointes restent accessibles seulement via /api/admin/files.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const file = await db.storedFile.findFirst({
    where: { id, realisation: { published: true } },
    select: { data: true, mimeType: true, size: true },
  });
  if (!file || !file.mimeType.startsWith("image/")) return new Response("Introuvable", { status: 404 });
  return new Response(Buffer.from(file.data), {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Length": String(file.size),
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
