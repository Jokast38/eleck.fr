import { Button, Heading, Text } from "@react-email/components";
import { EmailLayout, SummaryTable } from "./components/EmailLayout";
import { clientTypeLabels, contactRows, leadReference, projectRows } from "../lib/leads/format";
import type { ClientType } from "@prisma/client";

type Props = {
  lead: Parameters<typeof projectRows>[0] & { clientType: ClientType; source: string };
  dashboardUrl: string;
  photoCount: number;
};

/** Notification interne : nouvelle demande de devis (récapitulatif complet + lien vers la fiche). */
export default function LeadNotificationEmail({ lead, dashboardUrl, photoCount }: Props) {
  const ref = leadReference(lead.number);
  return (
    <EmailLayout preview={`${ref} · ${clientTypeLabels[lead.clientType]} · ${lead.firstName} ${lead.lastName} (${lead.city})`}>
      <Heading as="h1" style={{ fontSize: 22, margin: "0 0 8px", color: "#0A0A0A" }}>
        Nouvelle demande de devis
      </Heading>
      <Text style={{ margin: "0 0 16px", color: "#525252" }}>
        Référence <strong>{ref}</strong> · {clientTypeLabels[lead.clientType]} · {lead.postalCode} {lead.city}
      </Text>
      <Button
        href={dashboardUrl}
        style={{ backgroundColor: "#E30613", color: "#FFFFFF", padding: "12px 20px", borderRadius: 6, fontWeight: 700, fontSize: 15 }}
      >
        Ouvrir la fiche dans le dashboard
      </Button>
      <Heading as="h2" style={{ fontSize: 16, margin: "28px 0 0", color: "#0A0A0A" }}>
        Coordonnées
      </Heading>
      <SummaryTable rows={contactRows(lead)} />
      <Heading as="h2" style={{ fontSize: 16, margin: "20px 0 0", color: "#0A0A0A" }}>
        Projet
      </Heading>
      <SummaryTable rows={[...projectRows(lead), ["Photos jointes", photoCount ? `${photoCount} (visibles dans la fiche)` : "Aucune"]]} />
      <Text style={{ fontSize: 13, color: "#737373" }}>
        Répondez directement à cet e-mail pour écrire au prospect : l&apos;adresse de réponse est la sienne.
      </Text>
    </EmailLayout>
  );
}
