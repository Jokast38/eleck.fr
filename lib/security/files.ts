import "server-only";
import { fileTypeFromBuffer } from "file-type";

/** Types réellement acceptés, contrôlés sur le contenu du fichier (signature binaire), pas sur l'extension. */
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/heic", "image/heif", "image/webp"];
export const ATTACHMENT_TYPES = [
  ...IMAGE_TYPES,
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export type CheckedFile = { filename: string; mimeType: string; size: number; data: Uint8Array<ArrayBuffer> };

/**
 * Lit un fichier envoyé et vérifie son type MIME réel.
 * Retourne null si le type n'est pas autorisé ou la taille dépassée.
 */
export async function checkUpload(file: File, allowed: string[], maxBytes: number): Promise<CheckedFile | null> {
  if (file.size === 0 || file.size > maxBytes) return null;
  const data = new Uint8Array(await file.arrayBuffer());
  const detected = await fileTypeFromBuffer(data);
  // Les fichiers HEIC sont détectés « image/heic » ou « image/heif » selon la marque du conteneur
  const mime = detected?.mime;
  if (!mime || !allowed.includes(mime)) return null;
  const safeName =
    file.name
      .normalize("NFKD")
      .replace(/[^\w.\- ]+/g, "")
      .trim()
      .slice(-120) || `fichier.${detected.ext}`;
  return { filename: safeName, mimeType: mime, size: data.length, data };
}
