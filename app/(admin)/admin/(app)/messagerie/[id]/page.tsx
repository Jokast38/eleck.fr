import Link from "next/link";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { ArrowLeft, Paperclip } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { setSeen } from "@/lib/mail/flags";
import { sanitizeIncoming } from "@/lib/mail/sanitize";
import { composerData, leadVariables } from "@/lib/mail/composer-data";
import { formatDateTime } from "@/lib/format";
import { leadReference } from "@/lib/leads/format";
import { Card, CardHeader, StatusBadge } from "@/components/admin/ui";
import { MessageBody } from "@/components/admin/MessageBody";
import { Composer } from "@/components/admin/Composer";
import { LinkLead, SeenToggle } from "@/components/admin/MailActions";

export const metadata = { title: "E-mail" };

export default async function MessagePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const m = await db.emailMessage.findUnique({
    where: { id },
    include: {
      files: { select: { id: true, filename: true, size: true, mimeType: true } },
      lead: { select: { id: true, number: true, firstName: true, lastName: true, city: true, companyName: true, status: true } },
      sentBy: { select: { name: true } },
    },
  });
  if (!m) notFound();
  if (!m.seen) after(() => setSeen([m.id], true));

  const correspondent = m.direction === "INBOUND" ? m.fromAddress : m.toAddresses[0];
  const [composer, candidates] = await Promise.all([
    composerData(user.name),
    db.lead.findMany({
      where: { OR: [{ email: { equals: correspondent ?? "", mode: "insensitive" } }, { updatedAt: { gte: new Date(Date.now() - 90 * 864e5) } }] },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, number: true, firstName: true, lastName: true, city: true },
    }),
  ]);
  const safe = m.html ? sanitizeIncoming(m.html) : null;
  const withImages = m.html ? sanitizeIncoming(m.html, { remoteImages: true }) : null;
  const replyTo = m.direction === "INBOUND" ? m.fromAddress : m.toAddresses.join(", ");

  return (
    <>
      <Link href={m.direction === "INBOUND" ? "/admin/messagerie" : "/admin/messagerie?dossier=envoyes"} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-dark hover:text-ink">
        <ArrowLeft aria-hidden className="size-4" /> {m.direction === "INBOUND" ? "Réception" : "Envoyés"}
      </Link>

      <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-6">
          <Card>
            <div className="border-b border-black/10 p-5">
              <h1 className="font-display text-xl font-semibold break-words">{m.subject}</h1>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                <dt className="text-muted-dark">De</dt>
                <dd className="break-all">{m.fromName ? `${m.fromName} <${m.fromAddress}>` : m.fromAddress}</dd>
                <dt className="text-muted-dark">À</dt>
                <dd className="break-all">{m.toAddresses.join(", ")}</dd>
                {m.ccAddresses.length > 0 && (
                  <>
                    <dt className="text-muted-dark">Cc</dt>
                    <dd className="break-all">{m.ccAddresses.join(", ")}</dd>
                  </>
                )}
                <dt className="text-muted-dark">Date</dt>
                <dd>{formatDateTime(m.date)}</dd>
              </dl>
            </div>
            <div className="p-5">
              <MessageBody html={safe} htmlWithImages={withImages} text={m.text} />
              {m.files.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2 border-t border-black/10 pt-4">
                  {m.files.map((f) => (
                    <li key={f.id}>
                      <a href={`/api/admin/files/${f.id}?download=1`} className="inline-flex items-center gap-1.5 rounded-md border border-black/10 px-3 py-1.5 text-sm hover:bg-mist">
                        <Paperclip aria-hidden className="size-4" /> {f.filename}
                        <span className="text-xs text-muted-dark">({Math.ceil(f.size / 1024)} Ko)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title={m.direction === "INBOUND" ? "Répondre" : "Relancer"} />
            <div className="p-5">
              <Composer
                defaultTo={replyTo}
                defaultSubject={`Re: ${m.subject.replace(/^(re|tr|fwd?)\s*:\s*/i, "")}`}
                replyToId={m.id}
                leadId={m.lead?.id}
                templates={composer.templates}
                variables={m.lead ? leadVariables(m.lead, user.name) : { utilisateur: user.name }}
                signaturePreview={composer.signaturePreview}
              />
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="space-y-4 p-5">
            {m.direction === "INBOUND" && <SeenToggle id={m.id} seen={true} />}
            {m.lead ? (
              <div className="rounded-md bg-mist p-3 text-sm">
                <p className="text-muted-dark">Rattaché à</p>
                <Link href={`/admin/demandes/${m.lead.id}`} className="font-semibold hover:underline">
                  {leadReference(m.lead.number)} · {m.lead.firstName} {m.lead.lastName}
                </Link>
                <p className="mt-1.5">
                  <StatusBadge status={m.lead.status} />
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-dark">Cet e-mail n&apos;est rattaché à aucune demande.</p>
            )}
            <LinkLead
              id={m.id}
              leadId={m.lead?.id ?? null}
              options={candidates.map((c) => ({ id: c.id, label: `${leadReference(c.number)} · ${c.firstName} ${c.lastName} (${c.city})` }))}
            />
            {m.sentBy && <p className="text-xs text-muted-dark">Envoyé par {m.sentBy.name} depuis le dashboard.</p>}
          </Card>
        </aside>
      </div>
    </>
  );
}
