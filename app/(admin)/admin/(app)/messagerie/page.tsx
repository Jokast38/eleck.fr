import Link from "next/link";
import { Inbox, Paperclip, PenSquare, Search, Send } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { imapConfigured } from "@/lib/mail/imap";
import { smtpConfigured } from "@/lib/mail/smtp";
import { formatDateTime, formatShort } from "@/lib/format";
import { leadReference } from "@/lib/leads/format";
import { Card, EmptyState, Input, Notice, PageHeader, buttonClass } from "@/components/admin/ui";
import { SyncButton } from "@/components/admin/MailActions";
import { cn } from "@/lib/utils";

export const metadata = { title: "Messagerie" };
const PAGE_SIZE = 40;

export default async function MailboxPage({ searchParams }: { searchParams: Promise<{ dossier?: string; q?: string; page?: string; nonlus?: string }> }) {
  await requireUser();
  const sp = await searchParams;
  const folder = sp.dossier === "envoyes" ? "OUTBOUND" : "INBOUND";
  const page = Math.max(1, Number(sp.page) || 1);

  const where: Prisma.EmailMessageWhereInput = { direction: folder };
  if (sp.nonlus && folder === "INBOUND") where.seen = false;
  const q = sp.q?.trim();
  if (q)
    where.OR = [
      { subject: { contains: q, mode: "insensitive" } },
      { fromAddress: { contains: q, mode: "insensitive" } },
      { fromName: { contains: q, mode: "insensitive" } },
      { toAddresses: { has: q.toLowerCase() } },
      { snippet: { contains: q, mode: "insensitive" } },
    ];

  const [messages, total, unread, lastSync] = await Promise.all([
    db.emailMessage.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true, subject: true, fromAddress: true, fromName: true, toAddresses: true, date: true, snippet: true, seen: true, hasAttachments: true,
        lead: { select: { id: true, number: true } },
      },
    }),
    db.emailMessage.count({ where }),
    db.emailMessage.count({ where: { direction: "INBOUND", seen: false } }),
    db.mailboxState.findFirst({ orderBy: { lastSyncAt: "desc" }, select: { lastSyncAt: true } }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const tab = (key: string, label: string, icon: React.ReactNode, count?: number) => {
    const active = (sp.dossier ?? "reception") === key;
    return (
      <Link
        href={`/admin/messagerie${key === "reception" ? "" : "?dossier=envoyes"}`}
        aria-current={active ? "page" : undefined}
        className={cn("inline-flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium", active ? "border-brand text-ink" : "border-transparent text-muted-dark hover:text-ink")}
      >
        {icon} {label}
        {!!count && <span className="rounded-full bg-brand px-1.5 text-xs text-white">{count}</span>}
      </Link>
    );
  };

  return (
    <>
      <PageHeader
        title="Messagerie"
        description={
          imapConfigured()
            ? `Boîte ${process.env.IMAP_USER}${lastSync ? ` · dernière synchronisation ${formatDateTime(lastSync.lastSyncAt)}` : ""}`
            : undefined
        }
        actions={
          <>
            <SyncButton disabled={!imapConfigured()} />
            <Link href="/admin/messagerie/nouveau" className={buttonClass("primary")}>
              <PenSquare aria-hidden className="size-4" /> Nouveau message
            </Link>
          </>
        }
      />
      {(!imapConfigured() || !smtpConfigured()) && (
        <div className="mb-4">
          <Notice tone="info">
            {!imapConfigured() && "Réception non configurée : renseignez IMAP_HOST, IMAP_USER et IMAP_PASS. "}
            {!smtpConfigured() && "Envoi non configuré : renseignez SMTP_HOST, SMTP_USER et SMTP_PASS. "}
            Voir le README, section « Messagerie ».
          </Notice>
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-black/10 px-3 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Dossiers" className="flex">
            {tab("reception", "Réception", <Inbox aria-hidden className="size-4" />, unread)}
            {tab("envoyes", "Envoyés", <Send aria-hidden className="size-4" />)}
          </nav>
          <form role="search" className="relative pb-3 sm:pb-0">
            {sp.dossier && <input type="hidden" name="dossier" value={sp.dossier} />}
            <label htmlFor="mail-q" className="sr-only">Rechercher un e-mail</label>
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-dark sm:top-1/2" />
            <Input id="mail-q" name="q" defaultValue={q} placeholder="Rechercher…" className="h-9 w-full pl-9 sm:w-64" />
          </form>
        </div>

        {messages.length ? (
          <ul className="divide-y divide-black/5">
            {messages.map((m) => {
              const unreadRow = folder === "INBOUND" && !m.seen;
              return (
                <li key={m.id}>
                  <Link href={`/admin/messagerie/${m.id}`} className={cn("flex items-start gap-3 px-4 py-3 hover:bg-mist/70", unreadRow && "bg-brand/[0.03]")}>
                    <span aria-hidden className={cn("mt-2 size-2 shrink-0 rounded-full", unreadRow ? "bg-brand" : "bg-transparent")} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className={cn("truncate text-sm", unreadRow ? "font-semibold" : "font-medium")}>
                          {folder === "INBOUND" ? m.fromName || m.fromAddress : `À : ${m.toAddresses.join(", ")}`}
                          {unreadRow && <span className="sr-only"> (non lu)</span>}
                        </span>
                        <span className="shrink-0 text-xs text-muted-dark">{formatShort(m.date)}</span>
                      </span>
                      <span className={cn("block truncate text-sm", unreadRow ? "text-ink" : "text-neutral-700")}>{m.subject}</span>
                      <span className="mt-0.5 flex items-center gap-2 text-xs text-muted-dark">
                        {m.lead && <span className="rounded bg-ink px-1.5 py-0.5 font-mono text-[10px] text-white">{leadReference(m.lead.number)}</span>}
                        {m.hasAttachments && <Paperclip aria-label="Pièce jointe" className="size-3" />}
                        <span className="truncate">{m.snippet}</span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState icon={<Inbox className="size-8" />} title={q ? "Aucun résultat" : "Aucun message"}>
            {imapConfigured() ? "Les nouveaux e-mails apparaissent ici en temps réel." : "Configurez l'IMAP pour importer la boîte de réception."}
          </EmptyState>
        )}
      </Card>

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-dark">Page {page} sur {pages}</span>
          <div className="flex gap-2">
            {page > 1 && <Link href={`?${new URLSearchParams({ ...sp, page: String(page - 1) })}`} className={buttonClass("outline", "sm")}>Précédente</Link>}
            {page < pages && <Link href={`?${new URLSearchParams({ ...sp, page: String(page + 1) })}`} className={buttonClass("outline", "sm")}>Suivante</Link>}
          </div>
        </nav>
      )}
    </>
  );
}
