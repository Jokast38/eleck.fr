import { requireUser } from "@/lib/auth/session";
import { Card, CardHeader, Notice, PageHeader } from "@/components/admin/ui";
import { PasswordForm, TwoFactor } from "@/components/admin/AccountForms";

export const metadata = { title: "Mon compte" };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ "2fa"?: string }> }) {
  const user = await requireUser({ allowWithout2fa: true });
  const sp = await searchParams;
  return (
    <>
      <PageHeader title="Mon compte" description={`${user.name} · ${user.email}`} />
      {sp["2fa"] === "obligatoire" && !user.totpEnabled && (
        <div className="mb-6 max-w-3xl">
          <Notice tone="error">La double authentification est obligatoire : activez-la pour accéder au dashboard.</Notice>
        </div>
      )}
      <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Double authentification (2FA)" />
          <div className="p-5">
            <TwoFactor enabled={user.totpEnabled} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Mot de passe" />
          <div className="p-5">
            <PasswordForm />
          </div>
        </Card>
      </div>
    </>
  );
}
