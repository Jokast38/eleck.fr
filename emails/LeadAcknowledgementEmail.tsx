import { Heading, Link, Text } from "@react-email/components";
import { EmailLayout, SummaryTable } from "./components/EmailLayout";
import { leadReference, projectRows } from "../lib/leads/format";
import { site } from "../lib/site";
import { serviceByKey } from "../lib/content/services";

type Props = {
  lead: Parameters<typeof projectRows>[0];
  responseDelay: string;
};

/** Accusé de réception envoyé automatiquement au prospect. */
export default function LeadAcknowledgementEmail({ lead, responseDelay }: Props) {
  const ref = leadReference(lead.number);
  const subject = (serviceByKey(lead.service ?? "BORNE")?.title ?? "prestation électrique").toLowerCase();
  return (
    <EmailLayout preview={`Nous avons bien reçu votre demande de devis (${ref})`}>
      <Heading as="h1" style={{ fontSize: 22, margin: "0 0 16px", color: "#0A0A0A" }}>
        Merci {lead.firstName}, votre demande est bien reçue
      </Heading>
      <Text>
        Nous avons bien reçu votre demande de devis ({subject}). Un membre de notre équipe va l&apos;étudier et vous
        recontactera {responseDelay} pour préciser votre projet et, si nécessaire, organiser une visite sur place.
      </Text>
      <Text style={{ margin: "20px 0 0", fontWeight: 700, color: "#0A0A0A" }}>Récapitulatif de votre demande · {ref}</Text>
      <SummaryTable rows={projectRows(lead)} />
      <Text>
        Une question ou une précision à ajouter ? Répondez simplement à cet e-mail ou appelez-nous au{" "}
        <Link href={site.phone.href} style={{ color: "#0A0A0A", fontWeight: 700 }}>
          {site.phone.display}
        </Link>
        .
      </Text>
      <Text style={{ margin: "24px 0 0" }}>
        À très bientôt,
        <br />
        <strong>L&apos;équipe elec k</strong>
      </Text>
      <Text style={{ fontSize: 12, color: "#737373", marginTop: 28 }}>
        Vous recevez cet e-mail suite à votre demande sur notre site. Vos données sont traitées conformément à notre
        politique de confidentialité et ne sont jamais cédées à des tiers.
      </Text>
    </EmailLayout>
  );
}
