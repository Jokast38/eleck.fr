import { Section } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";

/**
 * E-mail rédigé depuis le dashboard : corps (HTML déjà nettoyé) + signature, dans le gabarit elec k.
 * La citation du message précédent est ajoutée sous la signature pour garder le fil lisible.
 */
export default function OutgoingMessageEmail({
  bodyHtml,
  signatureHtml,
  quoteHtml,
  preview,
}: {
  bodyHtml: string;
  signatureHtml: string;
  quoteHtml?: string;
  preview: string;
}) {
  return (
    <EmailLayout preview={preview}>
      <Section>
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </Section>
      <Section style={{ marginTop: 24, borderTop: "1px solid #E5E5E5", paddingTop: 16, fontSize: 14, color: "#404040" }}>
        <div dangerouslySetInnerHTML={{ __html: signatureHtml }} />
      </Section>
      {quoteHtml && (
        <Section style={{ marginTop: 24, borderLeft: "3px solid #E5E5E5", paddingLeft: 12, color: "#737373", fontSize: 13 }}>
          <div dangerouslySetInnerHTML={{ __html: quoteHtml }} />
        </Section>
      )}
    </EmailLayout>
  );
}
