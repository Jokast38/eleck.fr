"use client";

import { useActionState, useTransition } from "react";
import type { LeadStatus } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { addNote, setLeadStatus, updateLeadPlanning } from "@/lib/leads/actions";
import { statusLabels, statusOrder } from "@/lib/leads/format";
import { Button, Input, Label, Notice, Select, Textarea } from "./ui";

export function StatusSelect({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const [pending, start] = useTransition();
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="lead-status" className="text-sm font-medium">
        Statut
      </label>
      <Select
        id="lead-status"
        defaultValue={status}
        className="w-48"
        onChange={(e) => {
          const v = e.target.value as LeadStatus;
          start(() => setLeadStatus(leadId, v));
        }}
      >
        {statusOrder.map((s) => (
          <option key={s} value={s}>
            {statusLabels[s]}
          </option>
        ))}
      </Select>
      {pending && <Loader2 aria-label="Enregistrement…" className="size-4 animate-spin" />}
    </div>
  );
}

export function PlanningForm({
  leadId,
  followUpAt,
  visitAt,
  assignedToId,
  users,
}: {
  leadId: string;
  followUpAt: string;
  visitAt: string;
  assignedToId: string;
  users: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState(updateLeadPlanning, null);
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="leadId" value={leadId} />
      <div>
        <Label htmlFor="followUpAt">Date de relance</Label>
        <Input id="followUpAt" name="followUpAt" type="datetime-local" defaultValue={followUpAt} />
      </div>
      <div>
        <Label htmlFor="visitAt">Visite technique</Label>
        <Input id="visitAt" name="visitAt" type="datetime-local" defaultValue={visitAt} />
      </div>
      <div>
        <Label htmlFor="assignedToId">Responsable</Label>
        <Select id="assignedToId" name="assignedToId" defaultValue={assignedToId}>
          <option value="">Non attribuée</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </Select>
      </div>
      <Button type="submit" size="sm" disabled={pending}>
        {pending && <Loader2 aria-hidden className="size-3.5 animate-spin" />} Enregistrer
      </Button>
      {state?.ok && <Notice tone="success">Planning enregistré.</Notice>}
    </form>
  );
}

export function NoteForm({ leadId }: { leadId: string }) {
  const [state, action, pending] = useActionState(addNote, null);
  return (
    <form action={action} className="space-y-2" key={state?.at}>
      <input type="hidden" name="leadId" value={leadId} />
      <Label htmlFor="note-body" className="sr-only">
        Nouvelle note interne
      </Label>
      <Textarea id="note-body" name="body" rows={3} placeholder="Note interne (non visible par le client)…" required />
      {state && !state.ok && <Notice tone="error">{state.error}</Notice>}
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        Ajouter la note
      </Button>
    </form>
  );
}
