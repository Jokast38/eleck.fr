import { Body, Container, Head, Html, Img, Link, Preview, Section, Text } from "@react-email/components";
import { site, SITE_URL } from "../../lib/site";

/** Gabarit commun des e-mails elec k : en-tête noir avec logo, contenu blanc, pied de page avec coordonnées. */
export function EmailLayout({ preview, children }: { preview: string; children: React.ReactNode }) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: "#F5F5F5", fontFamily: "Helvetica, Arial, sans-serif", margin: 0, padding: "24px 0" }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", backgroundColor: "#FFFFFF" }}>
          <Section style={{ backgroundColor: "#0A0A0A", padding: "28px 32px" }}>
            <Img src={`${SITE_URL}/email/logo-white.png`} width="112" height="43" alt="elec k" />
          </Section>
          <Section style={{ height: 4, backgroundColor: "#E30613" }} />
          <Section style={{ padding: "32px", color: "#262626", fontSize: 15, lineHeight: "24px" }}>{children}</Section>
          <Section style={{ backgroundColor: "#0A0A0A", padding: "24px 32px" }}>
            <Text style={{ color: "#FFFFFF", fontSize: 13, lineHeight: "20px", margin: 0 }}>
              <strong>elec k</strong> · Installateur de bornes de recharge certifié IRVE
              <br />
              {site.address.street}, {site.address.postalCode} {site.address.city}
              <br />
              <Link href={site.phone.href} style={{ color: "#FFFFFF" }}>
                {site.phone.display}
              </Link>{" "}
              ·{" "}
              <Link href={`mailto:${site.email}`} style={{ color: "#FFFFFF" }}>
                {site.email}
              </Link>{" "}
              ·{" "}
              <Link href={SITE_URL} style={{ color: "#FF4D57" }}>
                {SITE_URL.replace(/^https?:\/\//, "")}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/** Tableau récapitulatif clé / valeur, compatible avec tous les clients mail. */
export function SummaryTable({ rows }: { rows: [string, string | null | undefined][] }) {
  return (
    <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse", margin: "16px 0", fontSize: 14 }}>
      <tbody>
        {rows
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <tr key={k}>
              <td style={{ padding: "8px 12px", backgroundColor: "#F5F5F5", border: "1px solid #E5E5E5", width: "38%", color: "#525252" }}>{k}</td>
              <td style={{ padding: "8px 12px", border: "1px solid #E5E5E5", color: "#0A0A0A", whiteSpace: "pre-wrap" }}>{v}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
