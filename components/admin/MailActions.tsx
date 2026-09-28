"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Link2, Loader2, MailOpen, Mail, RefreshCw } from "lucide-react";
import { Button, Notice, Select } from "./ui";

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
