import Link from "next/link";
import { LegalPage, Todo } from "@/components/sections/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Politique de confidentialité (RGPD)",
  description:
    "Comment elec k collecte, utilise et protège vos données personnelles : finalités, bases légales, durées de conservation, sous-traitants et vos droits.",
  path: "/politique-de-confidentialite",
});

export default function ConfidentialitePage() {
  return (
    <LegalPage title="Politique de confidentialité" path="/politique-de-confidentialite" updatedAt="25 septembre 2026">
      <p>
        elec k attache une grande importance à la protection de vos données personnelles. Cette politique explique
        quelles données nous collectons, pourquoi, combien de temps nous les conservons et comment exercer vos droits,
        conformément au Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.
      </p>

      <h2>1. Responsable du traitement</h2>
      <p>
        {site.legalName}, {site.legalForm}, SIRET {site.siret}, dont le siège est situé {site.address.street},{" "}
        {site.address.postalCode} {site.address.city}, représentée par {site.director}. Contact :{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2>2. Données collectées</h2>
      <ul>
        <li>
          <strong>Formulaire de demande de devis</strong> : nom, prénom, e-mail, téléphone, code postal, ville, profil
          (particulier, copropriété, entreprise), description du projet, message libre et, si vous choisissez d&apos;en
          envoyer, photos de votre installation (tableau électrique, emplacement).
        </li>
        <li>
          <strong>Échanges par e-mail</strong> : contenu des messages que vous nous adressez et que nous vous envoyons
          dans le cadre de votre demande.
        </li>
        <li>
          <strong>Données techniques</strong> : adresse IP et informations de connexion, utilisées pour la sécurité du
          site et la lutte contre les envois abusifs.
        </li>
        <li>
          <strong>Mesure d&apos;audience</strong> : statistiques de fréquentation agrégées, sans cookie et sans
          identification des visiteurs.
        </li>
      </ul>

      <h2>3. Finalités et bases légales</h2>
      <table>
        <thead>
          <tr>
            <th>Finalité</th>
            <th>Base légale</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Répondre à votre demande, établir et suivre votre devis</td>
            <td>Mesures précontractuelles prises à votre demande (art. 6.1.b RGPD)</td>
          </tr>
          <tr>
            <td>Gestion de la relation client (échanges, visite technique, relances liées à votre demande)</td>
            <td>Exécution du contrat ou mesures précontractuelles ; intérêt légitime</td>
          </tr>
          <tr>
            <td>Sécurité du site, prévention du spam et des abus</td>
            <td>Intérêt légitime (art. 6.1.f RGPD)</td>
          </tr>
          <tr>
            <td>Statistiques de fréquentation anonymes</td>
            <td>Intérêt légitime ; outil exempté de consentement (sans cookie, données agrégées)</td>
          </tr>
          <tr>
            <td>Respect de nos obligations comptables et fiscales (clients)</td>
            <td>Obligation légale (art. 6.1.c RGPD)</td>
          </tr>
        </tbody>
      </table>
      <p>Vos données ne sont jamais vendues ni utilisées à des fins de prospection par des tiers.</p>

      <h2>4. Durées de conservation</h2>
      <ul>
        <li>Demandes de devis sans suite (prospects) : 3 ans à compter du dernier contact de votre part.</li>
        <li>Clients : pendant toute la relation contractuelle, puis archivage pendant les durées de prescription légales.</li>
        <li>Documents comptables (factures) : 10 ans.</li>
        <li>Photos transmises avec la demande : supprimées en même temps que la demande.</li>
        <li>Journaux techniques de sécurité : 12 mois maximum.</li>
      </ul>

      <h2>5. Destinataires et sous-traitants</h2>
      <p>
        Vos données sont destinées exclusivement aux personnes habilitées d&apos;elec k. Elles peuvent être traitées
        par nos sous-traitants techniques, dans la stricte limite de leurs missions :
      </p>
      <ul>
        <li>Hébergement du site : Vercel Inc. (États-Unis).</li>
        <li>
          Base de données : <Todo>[À COMPLÉTER : Neon, Supabase ou Vercel Postgres, région d&apos;hébergement]</Todo>.
        </li>
        <li>
          Messagerie électronique professionnelle : <Todo>[À COMPLÉTER : fournisseur de la boîte contact@eleck.fr]</Todo>.
        </li>
        <li>Protection anti-spam du formulaire : Cloudflare, Inc. (Turnstile).</li>
        <li>Limitation du nombre d&apos;envois : Upstash, Inc.</li>
        <li>Mesure d&apos;audience sans cookie : Plausible Analytics (hébergement dans l&apos;Union européenne).</li>
      </ul>

      <h2>6. Transferts hors de l&apos;Union européenne</h2>
      <p>
        Certains sous-traitants sont établis aux États-Unis. Ces transferts sont encadrés par le cadre de protection des
        données UE–États-Unis (Data Privacy Framework) lorsque le prestataire y a adhéré, et à défaut par les clauses
        contractuelles types de la Commission européenne.
      </p>

      <h2>7. Sécurité</h2>
      <p>
        Nous mettons en œuvre des mesures techniques et organisationnelles adaptées : connexion chiffrée (HTTPS), accès
        au back-office protégé par mot de passe et double authentification, journalisation des accès, sauvegardes.
      </p>

      <h2>8. Vos droits</h2>
      <p>
        Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation, d&apos;opposition et de
        portabilité de vos données, ainsi que du droit de définir des directives relatives à leur sort après votre
        décès. Pour les exercer, écrivez-nous à <a href={`mailto:${site.email}`}>{site.email}</a> ou par courrier à
        l&apos;adresse du siège. Nous répondons dans un délai d&apos;un mois.
      </p>
      <p>
        Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez adresser une
        réclamation à la CNIL (
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
          www.cnil.fr
        </a>
        ).
      </p>

      <h2>9. Cookies</h2>
      <p>
        Le site n&apos;utilise pas de cookie publicitaire. Le détail des traceurs et la modification de vos choix sont
        disponibles sur la page <Link href="/gestion-cookies">gestion des cookies</Link>.
      </p>
    </LegalPage>
  );
}
