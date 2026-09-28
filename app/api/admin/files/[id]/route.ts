import { db } from "@/lib/db";
import { apiUser } from "@/lib/auth/session";

export const runtime = "nodejs";

/**
 * Fichiers privés (photos des demandes, pièces jointes des e-mails) : accès réservé à l'équipe connectée.
 * ?download=1 force le téléchargement ; sinon les images et PDF s'affichent dans le navigateur.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await apiUser())) return new Response("Non authentifié", { status: 401 });
  const { id } = await params;
  const file = await db.storedFile.findUnique({ where: { id } });
  if (!file) return new Response("Introuvable", { status: 404 });

  const inline = !new URL(req.url).searchParams.has("download") && /^(image\/(jpeg|png|webp|gif)|application\/pdf)$/.test(file.mimeType);
  const name = encodeURIComponent(file.filename);
  return new Response(Buffer.from(file.data), {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Length": String(file.size),
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${name}`,
      "X-Content-Type-Options": "nosniff",
      // Empêche l'exécution d'un contenu actif (ex. SVG ou HTML malveillant joint à un e-mail)
      "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
