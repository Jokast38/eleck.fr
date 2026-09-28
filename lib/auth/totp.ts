import "server-only";
import { generateSecret, generateURI, verify } from "otplib";
import QRCode from "qrcode";
import { decrypt, encrypt } from "@/lib/crypto";

/** Double authentification TOTP (Google Authenticator, Microsoft Authenticator, 1Password…). */
export function newTotpSecret() {
  return generateSecret();
}

export async function totpQrDataUrl(secret: string, email: string) {
  const uri = generateURI({ issuer: "elec k", label: email, secret });
  return { uri, qr: await QRCode.toDataURL(uri, { margin: 1, width: 220 }) };
}

/** Vérifie un code à 6 chiffres (tolérance ± 30 s pour les horloges légèrement décalées). */
export async function verifyTotp(secret: string, code: string) {
  if (!/^\d{6}$/.test(code)) return false;
  try {
    const res = await verify({ secret, token: code, epochTolerance: 30 });
    return res.valid;
  } catch {
    return false;
  }
}

export const encryptSecret = encrypt;
export const decryptSecret = decrypt;
