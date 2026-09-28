"use client";

import { useOptimistic, useState, useTransition } from "react";
import Link from "next/link";
import type { LeadStatus } from "@prisma/client";
import { CalendarClock, GripVertical } from "lucide-react";
import { setLeadStatus } from "@/lib/leads/actions";
import { statusLabels, statusOrder } from "@/lib/leads/format";
import { cn } from "@/lib/utils";

export type KanbanLead = {
  id: string;
  ref: string;
  name: string;
  city: string;
  type: string;
  status: LeadStatus;
  followUp?: string;
  late: boolean;
};

/**
 * Pipeline : Nouveau → Contacté → Visite planifiée → Devis envoyé → Gagné / Perdu.
 * Glisser-déposer à la souris ; au clavier et sur mobile, le menu « Déplacer vers » de chaque carte.
 */
export function Kanban({ leads }: { leads: KanbanLead[] }) {
  const [items, move] = useOptimistic(leads, (state, { id, status }: { id: string; status: LeadStatus }) =>
    state.map((l) => (l.id === id ? { ...l, status } : l)),
  );
  const [, startTransition] = useTransition();
  const [over, setOver] = useState<LeadStatus | null>(null);
  const [announce, setAnnounce] = useState("");

  const change = (id: string, status: LeadStatus) => {
    const lead = items.find((l) => l.id === id);
    if (!lead || lead.status === status) return;
    startTransition(async () => {
      move({ id, status });
      await setLeadStatus(id, status);
    });
    setAnnounce(`${lead.ref} déplacée vers « ${statusLabels[status]} »`);
  };

  return (
    <>
      <p aria-live="polite" className="sr-only">{announce}</p>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statusOrder.map((status) => {
          const col = items.filter((l) => l.status === status);
          return (
            <section
              key={status}
              aria-labelledby={`col-${status}`}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(status);
              }}
              onDragLeave={() => setOver((o) => (o === status ? null : o))}
              onDrop={(e) => {
                e.preventDefault();
                setOver(null);
                change(e.dataTransfer.getData("text/plain"), status);
              }}
              className={cn(
                "flex w-72 shrink-0 flex-col rounded-xl border bg-white/60 transition-colors",
                over === status ? "border-ink bg-white" : "border-black/10",
              )}
            >
              <h2 id={`col-${status}`} className="flex items-center justify-between border-b border-black/10 px-4 py-3 text-sm font-semibold">
                {statusLabels[status]}
                <span className="rounded-full bg-mist px-2 py-0.5 text-xs text-muted-dark">{col.length}</span>
              </h2>
              <ul className="flex min-h-32 flex-1 flex-col gap-2 p-3">
                {col.map((l) => (
                  <li
                    key={l.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", l.id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    className="group cursor-grab rounded-lg border border-black/10 bg-white p-3 shadow-sm active:cursor-grabbing"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical aria-hidden className="mt-0.5 size-4 shrink-0 text-black/25" />
                      <div className="min-w-0 flex-1">
                        <Link href={`/admin/demandes/${l.id}`} className="block truncate text-sm font-semibold hover:underline">
                          {l.name}
                        </Link>
                        <p className="truncate text-xs text-muted-dark">
                          {l.ref} · {l.type} · {l.city}
                        </p>
                        {l.followUp && (
                          <p className={cn("mt-1.5 flex items-center gap-1 text-xs", l.late ? "font-semibold text-brand" : "text-muted-dark")}>
                            <CalendarClock aria-hidden className="size-3.5" /> Relance {l.followUp}
                          </p>
                        )}
                      </div>
                    </div>
                    <label className="mt-2 block">
                      <span className="sr-only">Déplacer {l.ref} vers</span>
                      <select
                        value={l.status}
                        onChange={(e) => change(l.id, e.target.value as LeadStatus)}
                        className="w-full rounded border border-black/10 bg-mist px-2 py-1 text-xs"
                      >
                        {statusOrder.map((s) => (
                          <option key={s} value={s}>
                            {statusLabels[s]}
                          </option>
                        ))}
                      </select>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
