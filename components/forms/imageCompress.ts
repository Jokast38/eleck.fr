/**
 * Réduction des photos dans le navigateur avant envoi (limite de 4,5 Mo par requête sur Vercel,
 * et envoi plus rapide sur mobile). JPG/PNG → JPEG 1920 px max, qualité 0,8.
 * Les HEIC que le navigateur ne sait pas décoder sont envoyés tels quels s'ils restent légers.
 */
const MAX_SIDE = 1920;

export async function compressImage(file: File, quality = 0.8): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.fillStyle = "#fff"; // fond blanc pour les PNG transparents
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", quality));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file; // format non décodable par ce navigateur (ex. HEIC hors Safari)
  }
}
