"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { saveFaq, saveRealisation, saveTemplate, updateSettings, type FormState } from "@/lib/content/actions";
import { faqCategories } from "@/lib/content/faq";
import { clientTypeLabels } from "@/lib/leads/format";
import { services } from "@/lib/content/services";
import { Button, Input, Label, Notice, Select, Textarea } from "./ui";
import { RichTextEditor } from "./RichTextEditor";

function Feedback({ state, success = "Modifications enregistrées." }: { state: FormState; success?: string }) {
  if (!state) return null;
  return state.error ? <Notice tone="error">{state.error}</Notice> : state.ok ? <Notice tone="success">{success}</Notice> : null;
}

function Submit({ pending, children = "Enregistrer" }: { pending: boolean; children?: React.ReactNode }) {
  return (
    <Button type="submit" variant="dark" disabled={pending}>
      {pending && <Loader2 aria-hidden className="size-4 animate-spin" />} {children}
    </Button>
  );
}

/* ───────────── Réalisation ───────────── */

type Photo = { id: string; alt: string | null; filename: string };
type RealisationValues = { id?: string; title: string; city: string; clientType: string; service: string; description: string; published: boolean; order: number; photos: Photo[] };

export function RealisationForm({ r }: { r: RealisationValues }) {
  const [state, action, pending] = useActionState(saveRealisation, null);
  return (
    <form action={action} className="space-y-5" key={state?.at}>
      {r.id && <input type="hidden" name="id" value={r.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="title">Titre</Label>
          <Input id="title" name="title" defaultValue={r.title} required placeholder="Ex. : Relamping LED d'un supermarché" />
        </div>
        <div>
          <Label htmlFor="city">Ville</Label>
          <Input id="city" name="city" defaultValue={r.city} required />
        </div>
        <div>
          <Label htmlFor="clientType">Type de client</Label>
          <Select id="clientType" name="clientType" defaultValue={r.clientType}>
            {Object.entries(clientTypeLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="service">Prestation</Label>
          <Select id="service" name="service" defaultValue={r.service}>
            {services.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="order">Ordre d&apos;affichage</Label>
          <Input id="order" name="order" type="number" min={0} defaultValue={r.order} />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={5} defaultValue={r.description} required />
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Photos</legend>
        {r.photos.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {r.photos.map((p) => (
              <li key={p.id} className="rounded-lg border border-black/10 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element -- aperçu dans le dashboard */}
                <img src={`/api/admin/files/${p.id}`} alt="" className="aspect-[4/3] w-full rounded object-cover" />
                <Label htmlFor={`alt-${p.id}`} className="mt-2 text-xs">Texte alternatif (décrit la photo)</Label>
                <Input id={`alt-${p.id}`} name={`alt:${p.id}`} defaultValue={p.alt ?? ""} className="h-9 text-xs" />
                <label className="mt-2 flex items-center gap-2 text-xs text-brand">
                  <input type="checkbox" name="remove" value={p.id} className="accent-brand" /> Supprimer cette photo
                </label>
              </li>
            ))}
          </ul>
        )}
        <div>
          <Label htmlFor="photos">Ajouter des photos</Label>
          <input id="photos" name="photos" type="file" multiple accept="image/jpeg,image/png,image/webp" className="block text-sm file:mr-3 file:rounded-md file:border-0 file:bg-ink file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white" />
          <p className="mt-1 text-xs text-muted-dark">JPG, PNG ou WebP, 4 Mo maximum par envoi. La première photo sert de vignette sur le site.</p>
        </div>
      </fieldset>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="published" defaultChecked={r.published} className="size-4 accent-brand" /> Publier sur le site
      </label>
      <Feedback state={state} />
      <Submit pending={pending} />
    </form>
  );
}

/* ───────────── FAQ ───────────── */

type FaqValues = { id?: string; question: string; answer: string; category: string; showOnHome: boolean; published: boolean; order: number };

export function FaqForm({ f, onDone }: { f: FaqValues; onDone?: () => void }) {
  const [state, action, pending] = useActionState(async (prev: FormState, form: FormData) => {
    const res = await saveFaq(prev, form);
    if (res?.ok) onDone?.();
    return res;
  }, null);
  return (
    <form action={action} className="space-y-4">
      {f.id && <input type="hidden" name="id" value={f.id} />}
      <div>
        <Label htmlFor={`q-${f.id ?? "new"}`}>Question</Label>
        <Input id={`q-${f.id ?? "new"}`} name="question" defaultValue={f.question} required />
      </div>
      <div>
        <Label htmlFor={`a-${f.id ?? "new"}`}>Réponse</Label>
        <Textarea id={`a-${f.id ?? "new"}`} name="answer" rows={4} defaultValue={f.answer} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
        <div>
          <Label htmlFor={`c-${f.id ?? "new"}`}>Catégorie</Label>
          <Select id={`c-${f.id ?? "new"}`} name="category" defaultValue={f.category}>
            {Object.entries(faqCategories).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor={`o-${f.id ?? "new"}`}>Ordre</Label>
          <Input id={`o-${f.id ?? "new"}`} name="order" type="number" min={0} defaultValue={f.order} />
        </div>
      </div>
      <div className="flex flex-wrap gap-5 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="published" defaultChecked={f.published} className="accent-brand" /> Publiée
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="showOnHome" defaultChecked={f.showOnHome} className="accent-brand" /> Afficher sur l&apos;accueil
        </label>
      </div>
      <Feedback state={state} />
      <Submit pending={pending} />
    </form>
  );
}

/* ───────────── Modèle de réponse ───────────── */

export function TemplateForm({ t }: { t: { id?: string; name: string; subject: string; body: string; order: number } }) {
  const [state, action, pending] = useActionState(saveTemplate, null);
  const [body, setBody] = useState(t.body);
  return (
    <form action={action} className="space-y-4">
      {t.id && <input type="hidden" name="id" value={t.id} />}
      <input type="hidden" name="body" value={body} />
      <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
        <div>
          <Label htmlFor="tpl-name">Nom du modèle</Label>
          <Input id="tpl-name" name="name" defaultValue={t.name} required />
        </div>
        <div>
          <Label htmlFor="tpl-order">Ordre</Label>
          <Input id="tpl-order" name="order" type="number" min={0} defaultValue={t.order} />
        </div>
      </div>
      <div>
        <Label htmlFor="tpl-subject">Objet</Label>
        <Input id="tpl-subject" name="subject" defaultValue={t.subject} required />
      </div>
      <div>
        <p className="mb-1.5 text-sm font-medium">Contenu</p>
        <RichTextEditor value={t.body} onChange={setBody} label="Contenu du modèle" />
        <p className="mt-1.5 text-xs text-muted-dark">
          Variables disponibles : {"{{prenom}}"}, {"{{nom}}"}, {"{{ville}}"}, {"{{entreprise}}"}, {"{{reference}}"}, {"{{utilisateur}}"}. La signature est ajoutée automatiquement.
        </p>
      </div>
      <Feedback state={state} />
      <Submit pending={pending} />
    </form>
  );
}

/* ───────────── Paramètres ───────────── */

export function SettingsForm({ s }: { s: { notifyEmails: string[]; responseDelay: string; openingHours: string; zoneText: string; signature: string } }) {
  const [state, action, pending] = useActionState(updateSettings, null);
  const [signature, setSignature] = useState(s.signature);
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="signature" value={signature} />
      <div>
        <Label htmlFor="notifyEmails">Adresses de notification des nouvelles demandes</Label>
        <Input id="notifyEmails" name="notifyEmails" defaultValue={s.notifyEmails.join(", ")} required />
        <p className="mt-1 text-xs text-muted-dark">Plusieurs adresses possibles, séparées par des virgules.</p>
      </div>
      <div>
        <Label htmlFor="responseDelay">Délai de réponse annoncé dans l&apos;accusé de réception</Label>
        <Input id="responseDelay" name="responseDelay" defaultValue={s.responseDelay} placeholder="dans les meilleurs délais" />
        <p className="mt-1 text-xs text-muted-dark">Complète la phrase « … vous recontactera [délai] ». N&apos;annoncez qu&apos;un délai que vous pouvez tenir.</p>
      </div>
      <div>
        <Label htmlFor="openingHours">Horaires</Label>
        <Input id="openingHours" name="openingHours" defaultValue={s.openingHours} placeholder="Du lundi au vendredi, 8 h – 18 h" />
      </div>
      <div>
        <Label htmlFor="zoneText">Zone d&apos;intervention</Label>
        <Textarea id="zoneText" name="zoneText" rows={2} defaultValue={s.zoneText} />
      </div>
      <div>
        <p className="mb-1.5 text-sm font-medium">Signature des e-mails</p>
        <RichTextEditor value={s.signature} onChange={setSignature} label="Signature des e-mails" minHeight="7rem" />
        <p className="mt-1.5 text-xs text-muted-dark">{"{{utilisateur}}"} est remplacé par le nom de la personne qui envoie.</p>
      </div>
      <Feedback state={state} />
      <Submit pending={pending} />
    </form>
  );
}
