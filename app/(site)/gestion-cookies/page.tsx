import Link from "next/link";
import { LegalPage } from "@/components/sections/LegalPage";
import { CookiePreferences } from "@/components/consent/CookiePreferences";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Gestion des cookies",
  description: "Consultez et modifiez à tout moment vos choix concernant les cookies et traceurs sur le site elec k.",
  path: "/gestion-cookies",
});

export default function GestionCookiesPage() {
  return (
    <LegalPage title="Gestion des cookies" path="/gestion-cookies" updatedAt="25 septembre 2026">
      <p>
        Un cookie (ou traceur) est un petit fichier déposé sur votre appareil lors de la visite d&apos;un site. Nous
        limitons leur usage au strict nécessaire : aucun cookie publicitaire n&apos;est utilisé sur ce site, et aucun
        traceur soumis à consentement n&apos;est déposé avant votre accord.
      </p>

      <h2>Vos préférences</h2>
      <p>Vous pouvez modifier vos choix à tout moment. Ils sont conservés 6 mois, puis nous vous les redemandons.</p>
      <CookiePreferences />

      <h2>Traceurs utilisés</h2>
      <table>
        <thead>
          <tr>
            <th>Traceur</th>
            <th>Finalité</th>
            <th>Consentement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Préférences de cookies (stockage local)</td>
            <td>Mémoriser vos choix</td>
            <td>Non requis (nécessaire)</td>
          </tr>
          <tr>
            <td>Cloudflare Turnstile</td>
            <td>Protéger le formulaire de devis contre les robots</td>
            <td>Non requis (sécurité)</td>
          </tr>
          <tr>
            <td>Plausible Analytics</td>
            <td>Statistiques de fréquentation anonymes, sans cookie</td>
            <td>Non requis (exempté)</td>
          </tr>
          <tr>
            <td>Carte OpenStreetMap</td>
            <td>Afficher notre zone d&apos;intervention</td>
            <td>Chargée sur clic, ou automatiquement si vous acceptez les contenus tiers</td>
          </tr>
          <tr>
            <td>Cookie de session du back-office</td>
            <td>Authentification des collaborateurs d&apos;elec k (espace privé)</td>
            <td>Non requis (nécessaire)</td>
          </tr>
        </tbody>
      </table>

      <h2>Paramétrer votre navigateur</h2>
      <p>
        Vous pouvez également configurer votre navigateur pour bloquer ou supprimer les cookies. Pour en savoir plus,
        consultez les recommandations de la{" "}
        <a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs/comment-se-proteger/maitriser-votre-navigateur" target="_blank" rel="noopener noreferrer">
          CNIL
        </a>
        . Pour tout savoir sur vos données, consultez notre{" "}
        <Link href="/politique-de-confidentialite">politique de confidentialité</Link>.
      </p>
    </LegalPage>
  );
}
