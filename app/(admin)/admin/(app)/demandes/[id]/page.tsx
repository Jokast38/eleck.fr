import Link from "next/link";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { setSeen } from "@/lib/mail/flags";
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, Mail, MapPin, Paperclip, Phone, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { deleteLead } from "@/lib/leads/actions";
import { clientTypeLabels, leadReference, projectRows, sourceLabels, statusLabels } from "@/lib/leads/format";
import type { LeadStatus } from "@prisma/client";
import { serviceLabels, type ServiceKey } from "@/lib/content/services";
import { formatDateTime, toLocalInput } from "@/lib/format";
import { composerData, leadVariables } from "@/lib/mail/composer-data";
import { sanitizeIncoming } from "@/lib/mail/sanitize";
import { actionLabels } from "@/lib/activity";
import { Card, CardHeader, EmptyState, StatusBadge, buttonClass } from "@/components/admin/ui";
import { NoteForm, PlanningForm, StatusSelect } from "@/components/admin/LeadControls";
import { Composer } from "@/components/admin/Composer";
import { MessageBody } from "@/components/admin/MessageBody";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const lead = await db.lead.findUnique({ where: { id: (await params).id }, select: { number: true } });
  return { title: lead ? leadReference(lead.number) : "Demande" };
}

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const lead = await db.lead.findUnique({
    where: { id },
    include: {
      files: { select: { id: true, filename: true, mimeType: true, size: true }, orderBy: { order: "asc" } },
      notes: { include: { author: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
      emails: {
        orderBy: { date: "desc" },
        include: { files: { select: { id: true, filename: true, size: true } }, sentBy: { select: { name: true } } },
      },
    },
  });
  if (!lead) notFound();

  const [users, activity, composer] = await Promise.all([
    db.user.findMany({ where: { active: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    db.activityLog.findMany({ where: { entityType: "lead", entityId: id }, include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 30 }),
    composerData(user.name),
  ]);
  const ref = leadReference(lead.number);
  const lastInbound = lead.emails.find((e) => e.direction === "INBOUND");

  // Les e-mails entrants non lus deviennent lus à l'ouverture de la fiche
  const unread = lead.emails.filter((e) => e.direction === "INBOUND" && !e.seen).map((e) => e.id);
  if (unread.length) after(() => setSeen(unread, true));

  return (
    <>
      <Link href="/admin/demandes" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-dark hover:text-ink">
        <ArrowLeft aria-hidden className="size-4" /> Demandes
      </Link>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-mono text-sm text-muted-dark">{ref}</p>
          <h1 className="font-display text-2xl font-semibold">
            {lead.firstName} {lead.lastName}
            {lead.companyName && <span className="text-muted-dark"> · {lead.companyName}</span>}
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-dark">
            <StatusBadge status={lead.status} /> {serviceLabels[lead.service as ServiceKey] ?? lead.service} · {clientTypeLabels[lead.clientType]} · reçue le {formatDateTime(lead.createdAt)} ·{" "}
            {sourceLabels[lead.source] ?? lead.source}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusSelect leadId={lead.id} status={lead.status} />
          <a href={`tel:${lead.phone.replace(/\s/g, "")}`} className={buttonClass("outline")}>
            <Phone aria-hidden className="size-4" /> Appeler
          </a>
          <a href="#ecrire" className={buttonClass("primary")}>
            <Mail aria-hidden className="size-4" /> Écrire
          </a>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader title="Projet" />
            <dl className="grid gap-x-6 gap-y-3 p-5 text-sm sm:grid-cols-2">
              {projectRows(lead)
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-muted-dark">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
            </dl>
            {lead.message && (
              <div className="border-t border-black/10 p-5">
                <p className="text-sm text-muted-dark">Message</p>
                <p className="mt-1 text-sm whitespace-pre-wrap">{lead.message}</p>
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title={`Photos jointes (${lead.files.length})`} />
            {lead.files.length ? (
              <ul className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-5">
                {lead.files.map((f) => (
                  <li key={f.id}>
                    <a href={`/api/admin/files/${f.id}`} target="_blank" className="block overflow-hidden rounded-lg border border-black/10 hover:border-ink">
                      {/^image\/(jpeg|png|webp)$/.test(f.mimeType) ? (
                        // eslint-disable-next-line @next/next/no-img-element -- fichier privé servi par l'API authentifiée
                        <img src={`/api/admin/files/${f.id}`} alt={`Photo jointe par le client : ${f.filename}`} className="aspect-square w-full object-cover" loading="lazy" />
                      ) : (
                        <span className="flex aspect-square items-center justify-center bg-mist p-2 text-center text-xs">{f.filename} (HEIC, cliquer pour télécharger)</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-5 text-sm text-muted-dark">Aucune photo envoyée avec la demande.</p>
            )}
          </Card>

          <Card>
            <CardHeader title={`Échanges e-mail (${lead.emails.length})`} />
            {lead.emails.length ? (
              <ol className="divide-y divide-black/10">
                {lead.emails.map((m, i) => (
                  <li key={m.id}>
                    <details open={i === 0} className="group">
                      <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-3 hover:bg-mist/60 [&::-webkit-details-marker]:hidden">
                        {m.direction === "INBOUND" ? (
                          <ArrowDownLeft aria-label="Reçu" className="size-4 shrink-0 text-sky-700" />
                        ) : (
                          <ArrowUpRight aria-label="Envoyé" className="size-4 shrink-0 text-emerald-700" />
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{m.subject}</span>
                          <span className="block truncate text-xs text-muted-dark">
                            {m.direction === "INBOUND" ? `De ${m.fromName ?? m.fromAddress}` : `À ${m.toAddresses.join(", ")}${m.sentBy ? ` · par ${m.sentBy.name}` : " · envoi automatique"}`}
                          </span>
                        </span>
                        {m.hasAttachments && <Paperclip aria-label="Pièces jointes" className="size-3.5 text-muted-dark" />}
                        <span className="text-xs whitespace-nowrap text-muted-dark">{formatDateTime(m.date)}</span>
                      </summary>
                      <div className="px-5 pb-5">
                        <MessageBody html={m.html ? sanitizeIncoming(m.html) : null} text={m.text} />
                        {m.files.length > 0 && (
                          <ul className="mt-3 flex flex-wrap gap-2">
                            {m.files.map((f) => (
                              <li key={f.id}>
                                <a href={`/api/admin/files/${f.id}?download=1`} className="inline-flex items-center gap-1.5 rounded-md border border-black/10 px-2.5 py-1 text-xs hover:bg-mist">
                                  <Paperclip aria-hidden className="size-3.5" /> {f.filename} ({Math.ceil(f.size / 1024)} Ko)
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                        <Link href={`/admin/messagerie/${m.id}`} className="mt-3 inline-block text-xs font-medium underline underline-offset-4">
                          Ouvrir dans la messagerie
                        </Link>
                      </div>
                    </details>
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyState title="Aucun échange pour l'instant">Les e-mails reçus de {lead.email} et vos réponses apparaîtront ici automatiquement.</EmptyState>
            )}
          </Card>

          <Card id="ecrire" className="scroll-mt-6">
            <CardHeader title={lastInbound ? "Répondre" : `Écrire à ${lead.firstName}`} />
            <div className="p-5">
              <Composer
                defaultTo={lead.email}
                defaultSubject={lastInbound ? `Re: ${lastInbound.subject.replace(/^(re|tr|fwd?)\s*:\s*/i, "")}` : `Votre projet de borne de recharge · ${ref}`}
                leadId={lead.id}
                replyToId={lastInbound?.id}
                templates={composer.templates}
                variables={leadVariables(lead, user.name)}
                signaturePreview={composer.signaturePreview}
              />
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader title="Coordonnées" />
            <ul className="space-y-3 p-5 text-sm">
              <li className="flex items-center gap-2">
                <Mail aria-hidden className="size-4 text-muted-dark" />
                <a href="#ecrire" className="break-all underline-offset-4 hover:underline">{lead.email}</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone aria-hidden className="size-4 text-muted-dark" />
                <a href={`tel:${lead.phone.replace(/\s/g, "")}`} className="underline-offset-4 hover:underline">{lead.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin aria-hidden className="size-4 text-muted-dark" />
                <a
                  href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(`${lead.postalCode} ${lead.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  {lead.postalCode} {lead.city}
                </a>
              </li>
            </ul>
          </Card>

          <Card>
            <CardHeader title="Suivi" />
            <div className="p-5">
              <PlanningForm
                leadId={lead.id}
                followUpAt={toLocalInput(lead.followUpAt)}
                visitAt={toLocalInput(lead.visitAt)}
                assignedToId={lead.assignedToId ?? ""}
                users={users}
              />
            </div>
          </Card>

          <Card>
            <CardHeader title={`Notes internes (${lead.notes.length})`} />
            <div className="space-y-4 p-5">
              <NoteForm leadId={lead.id} />
              <ul className="space-y-3">
                {lead.notes.map((n) => (
                  <li key={n.id} className="rounded-md bg-mist p-3 text-sm">
                    <p className="whitespace-pre-wrap">{n.body}</p>
                    <p className="mt-1.5 text-xs text-muted-dark">
                      {n.author?.name ?? "Utilisateur supprimé"} · {formatDateTime(n.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card>
            <CardHeader title="Historique" />
            <ol className="space-y-2 p-5 text-xs">
              {activity.map((a) => {
                const d = a.details as { to?: unknown; auto?: boolean } | null;
                const statusTo = a.action === "lead.status" && typeof d?.to === "string" ? statusLabels[d.to as LeadStatus] ?? d.to : null;
                return (
                  <li key={a.id} className="flex gap-2">
                    <span className="whitespace-nowrap text-muted-dark">{formatDateTime(a.createdAt)}</span>
                    <span>
                      {actionLabels[a.action] ?? a.action}
                      {statusTo && ` → ${statusTo}`}
                      {d?.auto ? " (automatique)" : a.user ? ` · ${a.user.name}` : ""}
                    </span>
                  </li>
                );
              })}
            </ol>
          </Card>

          {user.role === "ADMIN" && (
            <form action={deleteLead}>
              <input type="hidden" name="leadId" value={lead.id} />
              <ConfirmSubmit message={`Supprimer définitivement la demande ${ref} et ses photos ? Cette action est irréversible.`} className={buttonClass("danger", "sm", "w-full")}>
                <Trash2 aria-hidden className="size-4" /> Supprimer la demande (RGPD)
              </ConfirmSubmit>
            </form>
          )}
        </aside>
      </div>
    </>
  );
}
