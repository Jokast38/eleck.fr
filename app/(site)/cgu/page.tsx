import Link from "next/link";
import { LegalPage } from "@/components/sections/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Conditions générales d'utilisation",
  description: "Conditions générales d'utilisation du site elec k : accès, formulaire de devis, propriété intellectuelle, responsabilité.",
  path: "/cgu",
});

export default function CguPage() {
  return (
    <LegalPage title="Conditions générales d'utilisation" path="/cgu" updatedAt="25 septembre 2026">
      <h2>1. Objet</h2>
      <p>
        Les présentes conditions générales d&apos;utilisation (CGU) définissent les modalités d&apos;accès et
        d&apos;utilisation du site {site.url.replace("https://", "")}, édité par {site.legalName}. En naviguant sur le
        site, vous acceptez ces CGU.
      </p>

      <h2>2. Accès au site</h2>
      <p>
        Le site est accessible gratuitement à tout utilisateur disposant d&apos;un accès à Internet. elec k s&apos;efforce
        d&apos;en assurer la disponibilité, sans obligation de résultat. L&apos;accès peut être interrompu pour des
        raisons de maintenance ou en cas de force majeure.
      </p>

      <h2>3. Demande de devis</h2>
      <p>
        Le formulaire de demande de devis permet de nous présenter votre projet. L&apos;envoi d&apos;une demande est
        gratuit et n&apos;engage ni l&apos;utilisateur ni elec k. Le devis remis après étude précise les prestations,
        les prix et les conditions applicables ; seul le devis accepté et signé a une valeur contractuelle.
      </p>
      <p>
        L&apos;utilisateur s&apos;engage à fournir des informations exactes et à ne transmettre que des fichiers dont il
        détient les droits et ne portant pas atteinte aux droits de tiers.
      </p>

      <h2>4. Comportements interdits</h2>
      <p>
        Il est interdit d&apos;utiliser le site à des fins illicites, d&apos;envoyer des messages automatisés ou
        abusifs, ou de tenter de porter atteinte à la sécurité ou au fonctionnement du site. elec k se réserve le droit
        de bloquer les envois abusifs.
      </p>

      <h2>5. Propriété intellectuelle</h2>
      <p>
        Les contenus du site (textes, logo, illustrations, photographies) sont protégés par le droit de la propriété
        intellectuelle. Toute reproduction sans autorisation préalable est interdite.
      </p>

      <h2>6. Responsabilité</h2>
      <p>
        Les informations publiées sont fournies à titre indicatif et peuvent évoluer, notamment celles relatives à la
        réglementation et aux aides financières. elec k ne saurait être tenue responsable de l&apos;usage fait de ces
        informations sans étude préalable de votre situation.
      </p>

      <h2>7. Liens externes</h2>
      <p>
        Le site peut contenir des liens vers des sites tiers (organismes officiels, partenaires). elec k n&apos;exerce
        aucun contrôle sur leur contenu et décline toute responsabilité à leur égard.
      </p>

      <h2>8. Données personnelles</h2>
      <p>
        Les données collectées via le site sont traitées conformément à notre{" "}
        <Link href="/politique-de-confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>9. Droit applicable</h2>
      <p>
        Les présentes CGU sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant
        toute action judiciaire. Le consommateur peut recourir au médiateur de la consommation mentionné dans les{" "}
        <Link href="/mentions-legales">mentions légales</Link>.
      </p>

      <h2>10. Modification des CGU</h2>
      <p>elec k peut modifier les présentes CGU à tout moment. La version applicable est celle publiée sur le site au moment de votre navigation.</p>
    </LegalPage>
  );
}
