import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permet de lancer un build de vérification (NEXT_DIST_DIR=.next-check) sans perturber un `next dev` en cours
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: { formats: ["image/avif", "image/webp"] },
  // Modules Node natifs ou lourds : exécutés tels quels côté serveur, non empaquetés
  serverExternalPackages: ["@node-rs/argon2", "imapflow", "mailparser", "nodemailer"],
  experimental: {
    // Téléversement de photos (réalisations) via Server Actions ; 4 Mo = sous la limite de Vercel (4,5 Mo)
    serverActions: { bodySizeLimit: "4mb" },
  },
};

export default nextConfig;
