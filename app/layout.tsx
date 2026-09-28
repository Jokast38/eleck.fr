import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { site, SITE_URL } from "@/lib/site";
import "./globals.css";

// Polices auto-hébergées par next/font (aucune requête vers Google côté visiteur, pas de CLS)
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Borne de recharge Val-d'Oise | Installateur IRVE | elec k",
    template: "%s | elec k",
  },
  description: site.description,
  applicationName: site.name,
  formatDetection: { telephone: false },
  openGraph: { type: "website", locale: "fr_FR", siteName: site.name },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
