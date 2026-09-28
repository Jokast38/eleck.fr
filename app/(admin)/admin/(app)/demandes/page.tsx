import Link from "next/link";
import { ArrowDown, ArrowUp, Download, Paperclip, Search } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { leadQuery, type LeadFilters } from "@/lib/leads/query";
import { clientTypeLabels, leadReference, statusLabels, statusOrder } from "@/lib/leads/format";
import { serviceLabels, services, type ServiceKey } from "@/lib/content/services";
import { formatDate, formatDateTime } from "@/lib/format";
import { Card, EmptyState, Input, Notice, PageHeader, Select, StatusBadge, buttonClass } from "@/components/admin/ui";

export const metadata = { title: "Demandes" };
const PAGE_SIZE = 25;

export default async function LeadsPage({ searchParams }: { searchParams: Promise<LeadFilters & { supprime?: string }> }) {
  await requireUser();
  const f = await searchParams;
  const { where, orderBy } = leadQuery(f);
  const page = Math.max(1, Number(f.page) || 1);

  const [leads, total] = await Promise.all([
    db.lead.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true, number: true, createdAt: true, firstName: true, lastName: true, companyName: true, city: true, postalCode: true,
        clientType: true, service: true, status: true, followUpAt: true, _count: { select: { files: true, emails: true } },
      },
    }),
    db.lead.count({ where }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const qs = (patch: Partial<LeadFilters>) => {
    const p = new URLSearchParams(Object.entries({ ...f, supprime: undefined, ...patch }).filter(([, v]) => v) as [string, string][]);
    return `?${p}`;
  };
  const sortLink = (key: string, label: string) => {
    const active = (f.tri ?? "date") === key;
    const next = active && f.ordre !== "asc" ? "asc" : "desc";
    return (
      <Link href={qs({ tri: key, ordre: next, page: undefined })} className="inline-flex items-center gap-1 hover:text-ink" aria-label={`Trier par ${label.toLowerCase()}`}>
        {label}
        {active && (f.ordre === "asc" ? <ArrowUp aria-hidden className="size-3" /> : <ArrowDown aria-hidden className="size-3" />)}
      </Link>
    );
  };
  const exportHref = `/api/admin/leads/export${qs({ page: undefined })}`;

  return (
    <>
      <PageHeader
        title="Demandes de devis"
        description={`${total} demande${total > 1 ? "s" : ""}${where.status || where.clientType || where.service || where.OR || where.city ? " correspondant aux filtres" : ""}`}
        actions={
          <a href={exportHref} className={buttonClass("outline")}>
            <Download aria-hidden className="size-4" /> Export CSV
          </a>
        }
      />
      {f.supprime && (
        <div className="mb-4">
          <Notice tone="success">La demande a été supprimée.</Notice>
        </div>
      )}

      <form role="search" className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]">
        <div className="relative">
          <label htmlFor="q" className="sr-only">Rechercher</label>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-dark" />
          <Input id="q" name="q" defaultValue={f.q} placeholder="Nom, e-mail, téléphone, référence…" className="pl-9" />
        </div>
        <div>
          <label htmlFor="statut" className="sr-only">Statut</label>
          <Select id="statut" name="statut" defaultValue={f.statut ?? ""}>
            <option value="">Tous les statuts</option>
            {statusOrder.map((s) => (
              <option key={s} value={s}>{statusLabels[s]}</option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="profil" className="sr-only">Profil</label>
          <Select id="profil" name="profil" defaultValue={f.profil ?? ""}>
            <option value="">Tous les profils</option>
            {Object.entries(clientTypeLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="service" className="sr-only">Prestation</label>
          <Select id="service" name="service" defaultValue={f.service ?? ""}>
            <option value="">Toutes les prestations</option>
            {services.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="ville" className="sr-only">Ville</label>
          <Input id="ville" name="ville" defaultValue={f.ville} placeholder="Ville" />
        </div>
        <div className="flex gap-2">
          <button type="submit" className={buttonClass("dark")}>Filtrer</button>
          <Link href="/admin/demandes" className={buttonClass("ghost")}>Réinitialiser</Link>
        </div>
      </form>

      <Card className="overflow-hidden">
        {leads.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[56rem] text-left text-sm">
              <caption className="sr-only">Liste des demandes de devis</caption>
              <thead className="border-b border-black/10 bg-mist/60 text-xs text-muted-dark uppercase">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Réf.</th>
                  <th scope="col" className="px-4 py-3 font-medium">{sortLink("date", "Date")}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{sortLink("nom", "Contact")}</th>
                  <th scope="col" className="px-4 py-3 font-medium">Prestation</th>
                  <th scope="col" className="px-4 py-3 font-medium">Profil</th>
                  <th scope="col" className="px-4 py-3 font-medium">{sortLink("ville", "Ville")}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{sortLink("statut", "Statut")}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{sortLink("relance", "Relance")}</th>
                  <th scope="col" className="px-4 py-3 font-medium"><span className="sr-only">Pièces</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-mist/60">
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link href={`/admin/demandes/${l.id}`} className="font-semibold text-ink hover:underline">{leadReference(l.number)}</Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-dark">{formatDate(l.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/demandes/${l.id}`} className="font-medium hover:underline">{l.firstName} {l.lastName}</Link>
                      {l.companyName && <span className="block text-xs text-muted-dark">{l.companyName}</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{serviceLabels[l.service as ServiceKey] ?? l.service}</td>
                    <td className="px-4 py-3">{clientTypeLabels[l.clientType]}</td>
                    <td className="px-4 py-3">{l.postalCode} {l.city}</td>
                    <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                    <td className={`px-4 py-3 whitespace-nowrap ${l.followUpAt && l.followUpAt < new Date() ? "font-semibold text-brand" : "text-muted-dark"}`}>
                      {formatDateTime(l.followUpAt)}
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap text-muted-dark">
                      {l._count.files > 0 && (
                        <span className="inline-flex items-center gap-1" title={`${l._count.files} photo(s)`}>
                          <Paperclip aria-hidden className="size-3.5" />{l._count.files}
                          <span className="sr-only">photo(s)</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="Aucune demande">Les demandes envoyées depuis le formulaire du site apparaîtront ici.</EmptyState>
        )}
      </Card>

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-dark">Page {page} sur {pages}</span>
          <div className="flex gap-2">
            {page > 1 && <Link href={qs({ page: String(page - 1) })} className={buttonClass("outline", "sm")}>Précédente</Link>}
            {page < pages && <Link href={qs({ page: String(page + 1) })} className={buttonClass("outline", "sm")}>Suivante</Link>}
          </div>
        </nav>
      )}
    </>
  );
}
