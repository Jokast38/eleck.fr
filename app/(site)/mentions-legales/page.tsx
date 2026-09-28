import Link from "next/link";
import { LegalPage, Todo } from "@/components/sections/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { clients } from "@/lib/content/clients";

export const metadata = pageMetadata({
  title: "Mentions légales",
  description: "Mentions légales du site elec k : éditeur, directeur de la publication, hébergeur, propriété intellectuelle.",
  path: "/mentions-legales",
});

/** Affiche une valeur, surlignée si elle reste à compléter. */
const V = ({ v }: { v: string }) => (v.includes("[À") ? <Todo>{v}</Todo> : <>{v}</>);

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales" path="/mentions-legales" updatedAt="25 septembre 2026">
      <p>
        Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique (LCEN), les
        informations suivantes sont portées à la connaissance des utilisateurs du site {site.url.replace("https://", "")}.
      </p>

      <h2>Éditeur du site</h2>
      <ul>
        <li>Dénomination : {site.legalName}</li>
        <li>Forme juridique : {site.legalForm}</li>
        <li>
          Capital social : <V v={site.shareCapital} />
        </li>
        <li>
          Siège social : {site.address.street}, {site.address.postalCode} {site.address.city}
        </li>
        <li>SIRET : {site.siret}</li>
        <li>
          Immatriculation : <V v={site.rcs} />
        </li>
        <li>Code APE : {site.ape}</li>
        <li>
          N° de TVA intracommunautaire : <V v={site.vatNumber} />
        </li>
        <li>
          Téléphone : <a href={site.phone.href}>{site.phone.display}</a>
        </li>
        <li>
          E-mail : <a href={`mailto:${site.email}`}>{site.email}</a>
        </li>
      </ul>

      <h2>Directeur de la publication</h2>
      <p>{site.director}, en qualité de dirigeant de la société.</p>

      <h2>Hébergeur</h2>
      <p>
        Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. Site :{" "}
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
          vercel.com
        </a>
        .
      </p>

      <h2>Qualification professionnelle</h2>
      <p>
        elec k est titulaire de la {site.certification} pour l&apos;installation d&apos;infrastructures de recharge pour
        véhicules électriques. Organisme et numéro de qualification : <Todo>[À COMPLÉTER]</Todo>.
      </p>
      <p>
        Assurance responsabilité civile professionnelle et décennale : <Todo>[À COMPLÉTER : assureur, n° de contrat, couverture géographique]</Todo>.
      </p>

      <h2>Médiation de la consommation</h2>
      <p>
        Conformément aux articles L.612-1 et suivants du Code de la consommation, le client consommateur peut recourir
        gratuitement à un médiateur de la consommation en vue de la résolution amiable d&apos;un litige :{" "}
        <Todo>[À COMPLÉTER : nom, adresse et site du médiateur]</Todo>.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus de ce site (textes, logo, illustrations, photographies, mise en page) est la
        propriété exclusive d&apos;elec k ou de ses partenaires. Toute reproduction ou représentation, totale ou
        partielle, sans autorisation écrite préalable est interdite.
      </p>

      <h2>Marques et logos des clients</h2>
      <p>
        Les marques et logos des entreprises présentées comme références restent la propriété de leurs titulaires
        respectifs. Ils sont reproduits à titre de référence, avec leur accord.
      </p>
      <ul>
        {clients
          .filter((c) => c.credit)
          .map((c) => (
            <li key={c.name}>
              {c.name} : fichier issu de {c.credit}
            </li>
          ))}
      </ul>

      <h2>Responsabilité</h2>
      <p>
        Les informations publiées sur ce site sont fournies à titre indicatif. Elles ne constituent pas une offre
        contractuelle : seul le devis signé engage les parties. En particulier, les informations relatives aux aides
        financières sont susceptibles d&apos;évoluer et doivent être vérifiées auprès des organismes concernés.
      </p>

      <h2>Données personnelles et cookies</h2>
      <p>
        Le traitement de vos données personnelles est décrit dans notre{" "}
        <Link href="/politique-de-confidentialite">politique de confidentialité</Link>. Vous pouvez gérer vos choix
        relatifs aux cookies sur la page <Link href="/gestion-cookies">gestion des cookies</Link>.
      </p>
    </LegalPage>
  );
}
