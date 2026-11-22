"use client";

import { createContext, useContext, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckSquare, Link2, Loader2, MailOpen, Mail, RefreshCw, Trash2 } from "lucide-react";
import { Button, Notice, Select } from "./ui";

/** Suppression : les e-mails vont dans la corbeille de la boîte mail (récupérables depuis le webmail). */
async function deleteMails(ids: string[]) {
  const res = await fetch("/api/admin/mail/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids }) });
  if (!res.ok) throw new Error(((await res.json().catch(() => ({}))) as { error?: string }).error ?? "Suppression impossible");
}

const confirmDelete = (n: number) =>
  window.confirm(
    `Supprimer ${n > 1 ? `ces ${n} e-mails` : "cet e-mail"} ? ${n > 1 ? "Ils seront placés" : "Il sera placé"} dans la corbeille de la boîte mail et ${n > 1 ? "retirés" : "retiré"} du dashboard.`,
  );

/** Bouton « Supprimer » de la page d'un e-mail : retour à la liste du dossier ensuite. */
export function DeleteMailButton({ id, backHref }: { id: string; backHref: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();
  return (
    <div className="space-y-2">
      <Button
        variant="danger"
        size="sm"
        disabled={pending}
        onClick={() => {
          if (!confirmDelete(1)) return;
          start(async () => {
            try {
              await deleteMails([id]);
              router.push(backHref);
              router.refresh();
            } catch (e) {
              setError((e as Error).message);
            }
          });
        }}
      >
        {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Trash2 aria-hidden className="size-4" />} Supprimer
      </Button>
      {error && <Notice tone="error">{error}</Notice>}
    </div>
  );
}

/* Sélection multiple dans la liste : le bouton « Sélectionner » fait apparaître une case à cocher par e-mail. */
type Selection = {
  ids: string[];
  selecting: boolean;
  selected: Set<string>;
  setSelecting: (v: boolean) => void;
  setSelected: (s: Set<string>) => void;
};
const SelectionContext = createContext<Selection | null>(null);
const useSelection = () => useContext(SelectionContext)!;

/** Fournit l'état de sélection aux cases à cocher et à la barre d'actions. `ids` : e-mails affichés sur la page. */
export function MailSelection({ ids, children }: { ids: string[]; children: React.ReactNode }) {
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  return <SelectionContext.Provider value={{ ids, selecting, selected, setSelecting, setSelected }}>{children}</SelectionContext.Provider>;
}

export function MailCheckbox({ id, label }: { id: string; label: string }) {
  const { selecting, selected, setSelected } = useSelection();
  if (!selecting) return null;
  return (
    <label className="flex shrink-0 cursor-pointer items-start py-3.5 pl-4">
      <span className="sr-only">Sélectionner : {label}</span>
      <input
        type="checkbox"
        className="size-4 accent-brand"
        checked={selected.has(id)}
        onChange={(e) => {
          const next = new Set(selected);
          if (e.target.checked) next.add(id);
          else next.delete(id);
          setSelected(next);
        }}
      />
    </label>
  );
}

export function MailSelectionBar() {
  const { ids, selecting, selected, setSelecting, setSelected } = useSelection();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();
  if (!ids.length) return null;
  if (!selecting)
    return (
      <Button variant="outline" size="sm" onClick={() => setSelecting(true)}>
        <CheckSquare aria-hidden className="size-4" /> Sélectionner
      </Button>
    );

  // Seuls les e-mails affichés comptent (la sélection survit à un changement de page ou de dossier)
  const chosen = ids.filter((id) => selected.has(id));
  const all = chosen.length === ids.length;
  const stop = () => {
    setSelecting(false);
    setSelected(new Set());
    setError(undefined);
  };
  return (
    <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Actions sur la sélection">
      <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
        <input type="checkbox" className="size-4 accent-brand" checked={all} onChange={() => setSelected(new Set(all ? [] : ids))} />
        Tout
      </label>
      <span className="text-sm text-muted-dark" aria-live="polite">
        {chosen.length} sélectionné{chosen.length > 1 ? "s" : ""}
      </span>
      <Button
        variant="danger"
        size="sm"
        disabled={!chosen.length || pending}
        onClick={() => {
          if (!confirmDelete(chosen.length)) return;
          start(async () => {
            try {
              await deleteMails(chosen);
              stop();
              router.refresh();
            } catch (e) {
              setError((e as Error).message);
            }
          });
        }}
      >
        {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Trash2 aria-hidden className="size-4" />} Supprimer
      </Button>
      <Button variant="ghost" size="sm" onClick={stop} disabled={pending}>
        Annuler
      </Button>
      {error && (
        <span role="alert" className="text-xs text-brand">
          {error}
        </span>
      )}
    </div>
  );
}

/** Bouton de synchronisation IMAP à la demande. */
export function SyncButton({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string }>();
  return (
    <div className="flex items-center gap-3">
      {msg && <span className={`text-xs ${msg.tone === "error" ? "text-brand" : "text-muted-dark"}`} role="status">{msg.text}</span>}
      <Button
        variant="outline"
        disabled={disabled || pending}
        onClick={async () => {
          setPending(true);
          setMsg(undefined);
          const res = await fetch("/api/admin/mail/sync", { method: "POST" });
          const json = (await res.json().catch(() => ({}))) as { inbox?: number; sent?: number; error?: string };
          setPending(false);
          if (!res.ok) setMsg({ tone: "error", text: json.error ?? "Échec de la synchronisation" });
          else {
            setMsg({ tone: "success", text: json.inbox || json.sent ? `${json.inbox ?? 0} reçu(s), ${json.sent ?? 0} envoyé(s) importé(s)` : "Boîte à jour" });
            router.refresh();
          }
        }}
      >
        <RefreshCw aria-hidden className={`size-4 ${pending ? "animate-spin" : ""}`} /> Synchroniser
      </Button>
    </div>
  );
}

async function patch(id: string, body: object) {
  const res = await fetch(`/api/admin/mail/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(((await res.json().catch(() => ({}))) as { error?: string }).error ?? "Erreur");
}

export function SeenToggle({ id, seen }: { id: string; seen: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await patch(id, { seen: !seen });
          router.refresh();
        })
      }
    >
      {seen ? <Mail aria-hidden className="size-4" /> : <MailOpen aria-hidden className="size-4" />}
      {seen ? "Marquer non lu" : "Marquer lu"}
    </Button>
  );
}

/** Rattachement manuel d'un e-mail à une demande (si l'adresse ne correspond à aucune fiche). */
export function LinkLead({ id, leadId, options }: { id: string; leadId: string | null; options: { id: string; label: string }[] }) {
  const router = useRouter();
  const [value, setValue] = useState(leadId ?? "");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();
  return (
    <div className="space-y-2">
      <label htmlFor="link-lead" className="flex items-center gap-1.5 text-sm font-medium">
        <Link2 aria-hidden className="size-4" /> Demande associée
      </label>
      <div className="flex gap-2">
        <Select id="link-lead" value={value} onChange={(e) => setValue(e.target.value)}>
          <option value="">Aucune</option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </Select>
        <Button
          size="md"
          disabled={pending || value === (leadId ?? "")}
          onClick={() =>
            start(async () => {
              try {
                await patch(id, { leadId: value || null });
                router.refresh();
              } catch (e) {
                setError((e as Error).message);
              }
            })
          }
        >
          {pending && <Loader2 aria-hidden className="size-4 animate-spin" />} Associer
        </Button>
      </div>
      {error && <Notice tone="error">{error}</Notice>}
    </div>
  );
}
