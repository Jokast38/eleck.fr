import Link from "next/link";
import { ArrowRight, CalendarClock, Inbox, PhoneCall } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { dashboardStats, priorityLeads } from "@/lib/leads/stats";
import { clientTypeLabels, leadReference, sourceLabels } from "@/lib/leads/format";
import { formatDateTime, formatDuration, timeAgo } from "@/lib/format";
import { services } from "@/lib/content/services";
import { BarList, WeeklyBars } from "@/components/admin/charts";
import { Card, CardHeader, EmptyState, Notice, PageHeader, StatusBadge, buttonClass } from "@/components/admin/ui";

export const metadata = { title: "Tableau de bord" };

const pct = (v: number | null) => (v === null ? "–" : `${Math.round(v * 100)} %`);

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-muted-dark">{label}</p>
      <p className="mt-2 font-sans text-3xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-dark">{hint}</p>}
    </Card>
  );
}

type PriorityLead = Awaited<ReturnType<typeof priorityLeads>>["fresh"][number];

function PriorityList({ title, icon, items, meta, empty }: { title: string; icon: React.ReactNode; items: PriorityLead[]; meta: (l: PriorityLead) => string; empty: string }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 px-5 pt-4 pb-2 text-sm font-semibold">
        {icon} {title} <span className="text-muted-dark">({items.length})</span>
      </h3>
      {items.length ? (
        <ul className="divide-y divide-black/5">
          {items.map((l) => (
            <li key={l.id}>
              <Link href={`/admin/demandes/${l.id}`} className="flex items-center gap-3 px-5 py-2.5 hover:bg-mist">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {l.firstName} {l.lastName} · {l.city}
                  </span>
                  <span className="block text-xs text-muted-dark">
                    {leadReference(l.number)} · {clientTypeLabels[l.clientType]} · {meta(l)}
                  </span>
                </span>
                <StatusBadge status={l.status} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-5 pb-4 text-sm text-muted-dark">{empty}</p>
      )}
    </div>
  );
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ acces?: string }> }) {
  const user = await requireUser();
  const { acces } = await searchParams;
  const [s, p] = await Promise.all([dashboardStats(), priorityLeads()]);

  const weekData = s.weeks.map((w) => ({
    label: w.start.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
    long: `Semaine du ${w.start.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`,
    value: w.count,
  }));
  const typeData = (["PARTICULIER", "COPROPRIETE", "ENTREPRISE"] as const).map((t) => ({ label: clientTypeLabels[t], value: s.byType.get(t) ?? 0 }));
  const serviceData = services.map((sv) => ({ label: sv.label, value: s.byService.get(sv.key) ?? 0 }));
  const sourceData = Object.keys(sourceLabels)
    .map((k) => ({ label: sourceLabels[k], value: s.bySource.get(k) ?? 0 }))
    .sort((a, b) => b.value - a.value);

  return (
    <>
      <PageHeader
        title={`Bonjour ${user.name.split(" ")[0]}`}
        description="Vue d'ensemble de l'activité commerciale."
        actions={
          <Link href="/admin/demandes" className={buttonClass("dark")}>
            Toutes les demandes <ArrowRight aria-hidden className="size-4" />
          </Link>
        }
      />
      {acces === "refuse" && (
        <div className="mb-6">
          <Notice tone="error">Cette page est réservée aux administrateurs.</Notice>
        </div>
      )}

      <section aria-label="Indicateurs clés" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Nouvelles demandes" value={s.new7} hint={`7 derniers jours · ${s.new30} sur 30 jours`} />
        <Stat label="Taux de réponse" value={pct(s.responseRate)} hint="Demandes des 30 derniers jours ayant reçu une réponse" />
        <Stat label="Délai moyen de première réponse" value={formatDuration(s.avgResponseHours)} hint="30 derniers jours" />
        <Stat label="Devis envoyés" value={s.quotes30} hint="30 derniers jours" />
        <Stat label="Chantiers gagnés" value={s.won30} hint="30 derniers jours" />
        <Stat label="Taux de conversion" value={pct(s.conversion90)} hint={`Gagnés / demandes reçues sur 90 jours (${s.total90})`} />
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Demandes par semaine (12 semaines)" />
          <div className="p-5">
            <WeeklyBars data={weekData} label="Nombre de demandes de devis par semaine" />
          </div>
        </Card>
        <Card>
          <CardHeader title="Demandes à traiter en priorité" />
          <div className="divide-y divide-black/10 pb-2">
            <PriorityList title="Nouvelles" icon={<Inbox aria-hidden className="size-4 text-brand" />} items={p.fresh} meta={(l) => timeAgo(l.createdAt)} empty="Aucune demande en attente." />
            <PriorityList title="Relances à faire" icon={<PhoneCall aria-hidden className="size-4" />} items={p.followUps} meta={(l) => `relance ${formatDateTime(l.followUpAt)}`} empty="Aucune relance échue." />
            <PriorityList title="Visites des 7 prochains jours" icon={<CalendarClock aria-hidden className="size-4" />} items={p.visits} meta={(l) => `visite ${formatDateTime(l.visitAt)}`} empty="Aucune visite planifiée." />
          </div>
        </Card>
        <Card>
          <CardHeader title="Répartition par prestation (90 jours)" />
          <div className="p-5">
            {s.total90 ? <BarList data={serviceData} total={s.total90} label="Répartition des demandes par prestation" /> : <EmptyState title="Pas encore de données" />}
          </div>
        </Card>
        <Card>
          <CardHeader title="Répartition par profil (90 jours)" />
          <div className="p-5">
            {s.total90 ? <BarList data={typeData} total={s.total90} label="Répartition des demandes par profil" /> : <EmptyState title="Pas encore de données" />}
          </div>
        </Card>
        <Card>
          <CardHeader title="Provenance des demandes (90 jours)" />
          <div className="p-5">
            {s.total90 ? <BarList data={sourceData} total={s.total90} label="Provenance des demandes" /> : <EmptyState title="Pas encore de données" />}
          </div>
        </Card>
      </div>
    </>
  );
}
