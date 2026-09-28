"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Editor } from "@tiptap/react";
import { FileText, Loader2, Paperclip, Send, X } from "lucide-react";
import { Button, Input, Label, Notice, Select } from "./ui";
import { RichTextEditor } from "./RichTextEditor";

export type TemplateOption = { id: string; name: string; subject: string; body: string };

/** Remplace les variables {{prenom}}, {{nom}}, {{ville}}, {{reference}}… par les valeurs de la demande. */
const fill = (s: string, vars: Record<string, string>) => s.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, k: string) => vars[k] ?? m);

/**
 * Rédaction d'un e-mail (nouveau message ou réponse) avec modèles, pièces jointes et signature automatique.
 */
export function Composer({
  defaultTo = "",
  defaultSubject = "",
  leadId,
  replyToId,
  templates,
  variables = {},
  signaturePreview,
  onSent,
  compact = false,
}: {
  defaultTo?: string;
  defaultSubject?: string;
  leadId?: string;
  replyToId?: string;
  templates: TemplateOption[];
  variables?: Record<string, string>;
  signaturePreview: string;
  onSent?: (id: string) => void;
  compact?: boolean;
}) {
  const router = useRouter();
  const [to, setTo] = useState(defaultTo);
  const [cc, setCc] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [subject, setSubject] = useState(defaultSubject);
  const [html, setHtml] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const editor = useRef<Editor | null>(null);
  // Référence stable : évite de relancer l'effet de l'éditeur à chaque rendu
  const setEditor = useCallback((e: Editor | null) => {
    editor.current = e;
  }, []);

  const applyTemplate = (id: string) => {
    const t = templates.find((x) => x.id === id);
    if (!t) return;
    if (!subject || !replyToId) setSubject(fill(t.subject, variables));
    const body = fill(t.body, variables);
    editor.current?.commands.setContent(body);
    setHtml(body);
  };

  const send = async () => {
    setError(undefined);
    setSuccess(false);
    if (!to.trim()) return setError("Indiquez au moins un destinataire.");
    if (!subject.trim()) return setError("Indiquez un objet.");
    if (!editor.current || editor.current.isEmpty) return setError("Le message est vide.");
    const body = new FormData();
    body.set("to", to);
    if (cc) body.set("cc", cc);
    body.set("subject", subject);
    body.set("html", html);
    if (leadId) body.set("leadId", leadId);
    if (replyToId) body.set("replyToId", replyToId);
    for (const f of files) body.append("attachments", f);
    setSending(true);
    try {
      const res = await fetch("/api/admin/mail/send", { method: "POST", body });
      const json = (await res.json()) as { ok?: boolean; id?: string; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error ?? "L'envoi a échoué.");
      setSuccess(true);
      setHtml("");
      setFiles([]);
      editor.current?.commands.clearContent();
      router.refresh();
      onSent?.(json.id!);
    } catch (e) {
      setError(e instanceof Error ? e.message : "L'envoi a échoué.");
    } finally {
      setSending(false);
    }
  };

  const total = files.reduce((n, f) => n + f.size, 0);

  return (
    <div className="space-y-4">
      {!compact && (
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div>
            <Label htmlFor="mail-to">À</Label>
            <Input id="mail-to" value={to} onChange={(e) => setTo(e.target.value)} placeholder="adresse@exemple.fr" autoComplete="off" />
          </div>
          {!showCc && (
            <Button variant="ghost" size="sm" className="self-end" onClick={() => setShowCc(true)}>
              + Cc
            </Button>
          )}
        </div>
      )}
      {showCc && (
        <div>
          <Label htmlFor="mail-cc">Cc</Label>
          <Input id="mail-cc" value={cc} onChange={(e) => setCc(e.target.value)} placeholder="Séparer les adresses par des virgules" />
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-[1fr_16rem]">
        <div>
          <Label htmlFor="mail-subject">Objet</Label>
          <Input id="mail-subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        {templates.length > 0 && (
          <div>
            <Label htmlFor="mail-template">
              <FileText aria-hidden className="mr-1 inline size-3.5" /> Modèle
            </Label>
            <Select id="mail-template" defaultValue="" onChange={(e) => applyTemplate(e.target.value)}>
              <option value="">Insérer un modèle…</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
          </div>
        )}
      </div>

      <RichTextEditor value="" onChange={setHtml} label="Message" editorRef={setEditor} minHeight={compact ? "9rem" : "14rem"} />

      <details className="text-sm">
        <summary className="cursor-pointer text-muted-dark">Signature ajoutée automatiquement</summary>
        <div className="prose-editor mt-2 rounded-md border border-black/10 bg-mist px-4 py-3" dangerouslySetInnerHTML={{ __html: signaturePreview }} />
      </details>

      <div className="flex flex-wrap items-center gap-2">
        {files.map((f, i) => (
          <span key={`${f.name}-${i}`} className="inline-flex items-center gap-1.5 rounded-md border border-black/10 bg-mist px-2.5 py-1 text-xs">
            <Paperclip aria-hidden className="size-3.5" /> {f.name} ({Math.ceil(f.size / 1024)} Ko)
            <button type="button" onClick={() => setFiles((x) => x.filter((_, j) => j !== i))} className="text-muted-dark hover:text-ink">
              <X aria-hidden className="size-3.5" />
              <span className="sr-only">Retirer {f.name}</span>
            </button>
          </span>
        ))}
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium hover:bg-black/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink">
          <Paperclip aria-hidden className="size-4" /> Joindre un fichier
          <input
            type="file"
            multiple
            className="sr-only"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.docx,.xlsx"
            onChange={(e) => {
              setFiles((x) => [...x, ...Array.from(e.target.files ?? [])]);
              e.target.value = "";
            }}
          />
        </label>
        {total > 4 * 1024 * 1024 && <span className="text-xs font-medium text-brand">4 Mo maximum au total</span>}
      </div>

      {error && <Notice tone="error">{error}</Notice>}
      {success && <Notice tone="success">E-mail envoyé et copié dans « Envoyés ».</Notice>}

      <div className="flex justify-end">
        <Button variant="primary" size="lg" onClick={send} disabled={sending}>
          {sending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Send aria-hidden className="size-4" />}
          {sending ? "Envoi…" : "Envoyer"}
        </Button>
      </div>
    </div>
  );
}
