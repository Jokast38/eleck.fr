import type { Metadata } from "next";

// Tout l'espace d'administration est exclu de l'indexation (en plus de robots.txt et de l'en-tête X-Robots-Tag)
export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Dashboard elec k" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="on-light min-h-dvh bg-mist text-ink">{children}</div>;
}
