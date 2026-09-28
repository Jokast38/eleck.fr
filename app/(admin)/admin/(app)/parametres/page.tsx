import { requireUser } from "@/lib/auth/session";
import { getSettings } from "@/lib/settings";
import { site } from "@/lib/site";
import { imapConfigured } from "@/lib/mail/imap";
import { smtpConfigured } from "@/lib/mail/smtp";
import { Badge, Card, CardHeader, PageHeader } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/ContentForms";

export const metadata = { title: "Paramètres" };

export default async function SettingsPage() {
  await requireUser();
  const s = await getSettings();
  const ok = (v: boolean) => <Badge className={v ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}>{v ? "Configuré" : "Non configuré"}</Badge>;

  return (
    <>
      <PageHeader title="Paramètres" />
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <Card>
          <CardHeader title="E-mails et informations" />
          <div className="p-6">
            <SettingsForm s={s} />
          </div>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader title="Coordonnées de l'entreprise" />
            <dl className="space-y-2 p-5 text-sm">
              <div><dt className="text-muted-dark">Adresse</dt><dd>{site.address.street}, {site.address.postalCode} {site.address.city}</dd></div>
              <div><dt className="text-muted-dark">Téléphone</dt><dd>{site.phone.display}</dd></div>
              <div><dt className="text-muted-dark">E-mail</dt><dd>{site.email}</dd></div>
              <div><dt className="text-muted-dark">SIRET</dt><dd>{site.siret}</dd></div>
            </dl>
            <p className="border-t border-black/10 p-5 text-xs text-muted-dark">
              Ces informations doivent rester identiques à la fiche Google Business Profile (cohérence « NAP »). Elles sont
              définies dans <code>lib/site.ts</code> et modifiées lors d&apos;une mise à jour du site.
            </p>
          </Card>
          <Card>
            <CardHeader title="Messagerie" />
            <dl className="space-y-3 p-5 text-sm">
              <div className="flex items-center justify-between"><dt>Envoi (SMTP)</dt><dd>{ok(smtpConfigured())}</dd></div>
              <div className="flex items-center justify-between"><dt>Réception (IMAP)</dt><dd>{ok(imapConfigured())}</dd></div>
              <div className="flex items-center justify-between"><dt>Anti-spam Turnstile</dt><dd>{ok(Boolean(process.env.TURNSTILE_SECRET_KEY))}</dd></div>
              <div className="flex items-center justify-between"><dt>Limitation de débit (Upstash)</dt><dd>{ok(Boolean(process.env.UPSTASH_REDIS_REST_URL))}</dd></div>
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}
