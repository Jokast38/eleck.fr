import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { composerData, leadVariables } from "@/lib/mail/composer-data";
import { Card, PageHeader } from "@/components/admin/ui";
import { Composer } from "@/components/admin/Composer";

export const metadata = { title: "Nouveau message" };

export default async function NewMessagePage({ searchParams }: { searchParams: Promise<{ demande?: string; a?: string }> }) {
  const user = await requireUser();
  const sp = await searchParams;
  const [composer, lead] = await Promise.all([
    composerData(user.name),
    sp.demande ? db.lead.findUnique({ where: { id: sp.demande }, select: { id: true, number: true, email: true, firstName: true, lastName: true, city: true, companyName: true } }) : null,
  ]);
  return (
    <>
      <Link href="/admin/messagerie" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-dark hover:text-ink">
        <ArrowLeft aria-hidden className="size-4" /> Messagerie
      </Link>
      <PageHeader title="Nouveau message" description="L'e-mail est envoyé depuis la boîte professionnelle et copié dans « Envoyés »." />
      <Card className="max-w-4xl p-5">
        <Composer
          defaultTo={lead?.email ?? sp.a ?? ""}
          leadId={lead?.id}
          templates={composer.templates}
          variables={lead ? leadVariables(lead, user.name) : { utilisateur: user.name }}
          signaturePreview={composer.signaturePreview}
        />
      </Card>
    </>
  );
}
