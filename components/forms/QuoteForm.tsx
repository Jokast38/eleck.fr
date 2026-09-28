"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, Building2, Cable, Factory, Home, ImagePlus, Lightbulb, Loader2, PlugZap, ScanLine, X } from "lucide-react";
import type { ZodType } from "zod";
import {
  chargerCounts,
  clientTypes,
  distances,
  leadSchema,
  locations,
  projectIssues,
  siteTypeOptions,
  PHOTO_ACCEPT,
  PHOTO_MAX_BYTES,
  PHOTO_MAX_FILES,
  powers,
  stepConsentSchema,
  stepContactSchema,
  stepProfileSchema,
  stepProjectSchema,
  timelines,
  type ClientTypeKey,
} from "@/lib/validation/lead";
import { ATTRIBUTION_KEY } from "@/components/analytics/AttributionTracker";
import { serviceByKey, serviceByQuery, services, type ServiceKey } from "@/lib/content/services";
import { ChoiceGroup, SelectField, TextAreaField, TextField } from "./fields";
import { compressImage } from "./imageCompress";
import { Turnstile } from "./Turnstile";
import { cn } from "@/lib/utils";

type Values = {
  service?: ServiceKey;
  clientType?: ClientTypeKey;
  need: string;
  siteType: string;
  companyName: string;
  chargerCount: string;
  power: string;
  location: string;
  distance: string;
  vehicle: string;
  timeline: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postalCode: string;
  city: string;
  message: string;
  consent: boolean;
  website: string; // pot de miel
};

const steps = ["Profil", "Projet", "Coordonnées", "Envoi"] as const;
const stepFields: (keyof Values)[][] = [
  ["service", "clientType"],
  ["siteType", "companyName", "need", "chargerCount", "power", "location", "distance", "vehicle", "timeline"],
  ["firstName", "lastName", "email", "phone", "postalCode", "city", "message"],
  ["consent"],
];

const profileCards: { key: ClientTypeKey; icon: typeof Home; text: string }[] = [
  { key: "PARTICULIER", icon: Home, text: "Maison, appartement, résidence secondaire" },
  { key: "COPROPRIETE", icon: Building2, text: "Syndic, conseil syndical, copropriétaire" },
  { key: "ENTREPRISE", icon: Factory, text: "Entreprise, commerce, industrie, collectivité" },
];

const serviceIcons: Record<ServiceKey, typeof Home> = { BORNE: PlugZap, LED: Lightbulb, ELECTRICITE: Cable, THERMOGRAPHIE: ScanLine };

/** Formulaire de demande de devis en 4 étapes. Validation Zod identique à celle du serveur (lib/validation/lead.ts). */
export function QuoteForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string>();
  const [token, setToken] = useState<string>();
  const [turnstileKey, setTurnstileKey] = useState(0);
  const startedAt = useRef(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const {
    register,
    watch,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {
      need: "",
      siteType: "",
      companyName: "",
      chargerCount: "",
      power: "",
      location: "",
      distance: "",
      vehicle: "",
      timeline: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      postalCode: "",
      city: "",
      message: "",
      consent: false,
      website: "",
    },
  });

  const clientType = watch("clientType");
  const service = watch("service");
  const isBorne = service === "BORNE";

  // Prestation présélectionnée depuis une page de service (/devis?service=eclairage-led)
  useEffect(() => {
    const s = serviceByQuery(new URLSearchParams(location.search).get("service"));
    if (s) setValue("service", s.key);
  }, [setValue]);

  // Une erreur disparaît dès que le champ concerné est modifié
  useEffect(() => {
    const sub = watch((_, { name }) => {
      if (name) clearErrors(name);
    });
    return () => sub.unsubscribe();
  }, [watch, clearErrors]);

  // Déplace le focus sur le titre de l'étape (lecteurs d'écran, clavier)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  /** Valide l'étape courante avec son schéma Zod et affiche les erreurs. */
  const validateStep = (i: number) => {
    const v = getValues();
    const schemas: ZodType[] = [stepProfileSchema, stepProjectSchema, stepContactSchema, stepConsentSchema];
    const res = schemas[i].safeParse(v);
    clearErrors(stepFields[i]);
    const issues: { path: PropertyKey[]; message: string }[] = res.success
      ? []
      : res.error.issues.map((x) => ({ path: x.path, message: x.message }));
    // Règles dépendantes du service et du profil (les mêmes que côté serveur)
    if (i === 1) for (const x of projectIssues(v)) if (!issues.some((y) => y.path[0] === x.path)) issues.push({ path: [x.path], message: x.message });
    for (const issue of issues) setError(String(issue.path[0]) as keyof Values, { message: issue.message });
    if (issues.length) {
      const first = String(issues[0].path[0]);
      requestAnimationFrame(() => document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus());
    }
    return issues.length === 0;
  };

  const next = () => validateStep(step) && setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onToken = useCallback((t: string | undefined) => setToken(t), []);

  const addPhotos = async (list: FileList | null) => {
    setPhotoError(undefined);
    if (!list) return;
    const incoming = [...list];
    if (photos.length + incoming.length > PHOTO_MAX_FILES) {
      setPhotoError(`${PHOTO_MAX_FILES} photos maximum.`);
      return;
    }
    const accepted: File[] = [];
    for (const f of incoming) {
      const isHeic = /\.hei[cf]$/i.test(f.name) || f.type === "image/heic" || f.type === "image/heif";
      if (!PHOTO_ACCEPT.includes(f.type) && !isHeic) {
        setPhotoError(`« ${f.name} » : format non accepté (JPG, PNG ou HEIC).`);
        continue;
      }
      if (f.size > PHOTO_MAX_BYTES) {
        setPhotoError(`« ${f.name} » dépasse 5 Mo.`);
        continue;
      }
      accepted.push(await compressImage(f));
    }
    setPhotos((p) => [...p, ...accepted]);
  };

  const submit = async () => {
    setServerError(undefined);
    // Validation complète (toutes étapes) avant envoi
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        setStep(i);
        return;
      }
    }
    const v = getValues();
    const full = leadSchema.safeParse(v);
    if (!full.success) {
      setServerError("Merci de vérifier les informations saisies.");
      return;
    }
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !token) {
      setServerError("Merci de patienter pendant la vérification anti-robot.");
      return;
    }

    let attribution: unknown;
    try {
      attribution = JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) ?? "null") ?? undefined;
    } catch {
      /* ignoré */
    }

    const body = new FormData();
    body.set("data", JSON.stringify({ ...v, startedAt: startedAt.current, turnstileToken: token, attribution }));
    // Si le total dépasse la limite d'une requête, on recompresse plus fort
    let files = photos;
    if (files.reduce((n, f) => n + f.size, 0) > 4_000_000) files = await Promise.all(files.map((f) => compressImage(f, 0.6)));
    for (const f of files) body.append("photos", f);

    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", { method: "POST", body });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; fieldErrors?: Record<string, string[]> };
      if (res.ok && json.ok) {
        router.push("/devis/merci");
        return;
      }
      if (json.fieldErrors) {
        let firstStep = steps.length - 1;
        for (const [field, msgs] of Object.entries(json.fieldErrors)) {
          setError(field as keyof Values, { message: msgs[0] });
          const s = stepFields.findIndex((f) => f.includes(field as keyof Values));
          if (s >= 0) firstStep = Math.min(firstStep, s);
        }
        setStep(firstStep);
      }
      setServerError(json.message ?? "L'envoi a échoué. Merci de réessayer.");
    } catch {
      setServerError("Connexion impossible. Vérifiez votre réseau et réessayez.");
    } finally {
      setSubmitting(false);
      setToken(undefined);
      setTurnstileKey((k) => k + 1);
    }
  };

  const err = (k: keyof Values) => errors[k]?.message;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (step < steps.length - 1) next();
        else void submit();
      }}
      aria-describedby="form-required-note"
    >
      {/* Indicateur d'étapes */}
      <ol className="grid grid-cols-4 gap-2" aria-label="Étapes du formulaire">
        {steps.map((s, i) => (
          <li key={s} aria-current={i === step ? "step" : undefined}>
            <span className={cn("block h-1.5 rounded-full", i <= step ? "bg-brand" : "bg-white/10")} />
            <span className={cn("mt-2 block text-xs sm:text-sm", i === step ? "font-semibold text-white" : "text-muted")}>
              <span className="sr-only">Étape </span>
              {i + 1}. {s}
              {i < step && <span className="sr-only"> (terminée)</span>}
            </span>
          </li>
        ))}
      </ol>

      <h2 ref={headingRef} tabIndex={-1} className="mt-8 font-display text-2xl font-semibold outline-none">
        {["Votre demande", "Votre projet", "Vos coordonnées", "Dernière étape"][step]}
      </h2>
      <p id="form-required-note" className="mt-1 text-sm text-muted">
        Les champs marqués d&apos;un <span className="text-brand-bright">*</span> sont obligatoires.
      </p>

      {/* Pot de miel : invisible pour les humains, rempli par les robots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Site web
          <input tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <div className="mt-6 space-y-6">
        {step === 0 && (
          <>
            <fieldset aria-describedby={err("service") ? "service-error" : undefined}>
              <legend className="mb-3 font-medium text-white">
                Quelle prestation vous intéresse ?<span aria-hidden className="ml-0.5 text-brand-bright">*</span>
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map(({ key, label }) => {
                  const Icon = serviceIcons[key];
                  return (
                    <label
                      key={key}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-bright",
                        service === key ? "border-brand bg-brand/10" : "border-white/15 hover:border-white/40",
                      )}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={key}
                        checked={service === key}
                        onChange={() => {
                          setValue("service", key);
                          setValue("siteType", "");
                          setValue("need", "");
                          clearErrors("service");
                        }}
                        className="sr-only"
                      />
                      <Icon aria-hidden className={cn("size-6 shrink-0", service === key ? "text-brand-bright" : "text-white")} />
                      <span className="font-display font-semibold">{label}</span>
                    </label>
                  );
                })}
              </div>
              {err("service") && (
                <p id="service-error" className="mt-2 text-sm font-medium text-brand-bright">
                  {err("service")}
                </p>
              )}
            </fieldset>

            <fieldset aria-describedby={err("clientType") ? "clientType-error" : undefined}>
              <legend className="mb-3 font-medium text-white">
                Vous êtes…<span aria-hidden className="ml-0.5 text-brand-bright">*</span>
              </legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {profileCards.map(({ key, icon: Icon, text }) => (
                  <label
                    key={key}
                    className={cn(
                      "flex cursor-pointer flex-col rounded-xl border-2 p-5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-bright",
                      clientType === key ? "border-brand bg-brand/10" : "border-white/15 hover:border-white/40",
                    )}
                  >
                    <input
                      type="radio"
                      name="clientType"
                      value={key}
                      checked={clientType === key}
                      onChange={() => {
                        setValue("clientType", key);
                        setValue("siteType", "");
                        clearErrors("clientType");
                      }}
                      className="sr-only"
                    />
                    <Icon aria-hidden className={cn("size-7", clientType === key ? "text-brand-bright" : "text-white")} />
                    <span className="mt-4 font-display text-lg font-semibold">{clientTypes[key]}</span>
                    <span className="mt-1 text-sm text-muted">{text}</span>
                  </label>
                ))}
              </div>
              {err("clientType") && (
                <p id="clientType-error" className="mt-2 text-sm font-medium text-brand-bright">
                  {err("clientType")}
                </p>
              )}
            </fieldset>
          </>
        )}

        {step === 1 && clientType && service && (
          <>
            <ChoiceGroup
              legend={clientType === "PARTICULIER" ? "Type de logement" : "Type de site"}
              name="siteType"
              options={siteTypeOptions(service, clientType)}
              value={watch("siteType")}
              onChange={(v) => {
                setValue("siteType", v);
                clearErrors("siteType");
              }}
              error={err("siteType")}
            />
            {clientType !== "PARTICULIER" && (
              <TextField
                label={clientType === "ENTREPRISE" ? "Nom de l'entreprise ou de la collectivité" : "Nom de la résidence ou du syndic"}
                optional={clientType === "COPROPRIETE"}
                autoComplete="organization"
                error={err("companyName")}
                {...register("companyName")}
              />
            )}
            {!isBorne && (
              <>
                <ChoiceGroup
                  legend="Nature de votre demande"
                  name="need"
                  options={serviceByKey(service)?.needs ?? []}
                  value={watch("need")}
                  onChange={(v) => {
                    setValue("need", v);
                    clearErrors("need");
                  }}
                  error={err("need")}
                />
                <SelectField label="Délai souhaité" options={timelines} error={err("timeline")} className="sm:max-w-sm" {...register("timeline")} />
              </>
            )}
            {isBorne && (
            <div className="grid gap-6 sm:grid-cols-2">
              <SelectField label="Nombre de bornes souhaitées" options={chargerCounts} error={err("chargerCount")} {...register("chargerCount")} />
              <SelectField label="Puissance souhaitée" options={powers} error={err("power")} hint="Si vous ne savez pas, nous vous conseillerons." {...register("power")} />
              <SelectField label="Emplacement de la place" options={locations} error={err("location")} {...register("location")} />
              <SelectField label="Distance approximative au tableau électrique" options={distances} error={err("distance")} {...register("distance")} />
              <TextField label="Véhicule" optional placeholder="Ex. : Renault Mégane E-Tech" error={err("vehicle")} {...register("vehicle")} />
              <SelectField label="Délai souhaité" options={timelines} error={err("timeline")} {...register("timeline")} />
            </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField label="Prénom" autoComplete="given-name" error={err("firstName")} {...register("firstName")} />
              <TextField label="Nom" autoComplete="family-name" error={err("lastName")} {...register("lastName")} />
              <TextField label="E-mail" type="email" autoComplete="email" inputMode="email" error={err("email")} {...register("email")} />
              <TextField label="Téléphone" type="tel" autoComplete="tel" inputMode="tel" placeholder="06 12 34 56 78" error={err("phone")} {...register("phone")} />
              <TextField label="Code postal" autoComplete="postal-code" inputMode="numeric" maxLength={5} error={err("postalCode")} {...register("postalCode")} />
              <TextField label="Ville" autoComplete="address-level2" error={err("city")} {...register("city")} />
            </div>
            <TextAreaField
              label="Votre message"
              optional
              placeholder={
                isBorne
                  ? "Précisez votre projet, vos contraintes, vos disponibilités…"
                  : "Décrivez votre besoin : surface, nombre de points lumineux ou d'équipements, contraintes d'accès, disponibilités…"
              }
              error={err("message")}
              {...register("message")}
            />
            <div>
              <p className="font-medium text-white">
                Photos <span className="font-normal text-muted">(facultatif)</span>
              </p>
              <p id="photos-hint" className="mt-1 text-sm text-muted">
                {isBorne ? "Tableau électrique, emplacement de la borne…" : "Tableau électrique, éclairage ou équipements concernés…"}{" "}
                {PHOTO_MAX_FILES} fichiers maximum, 5 Mo chacun (JPG, PNG, HEIC).
                Elles nous aident à préparer un devis plus précis.
              </p>
              {photos.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-3">
                  {photos.map((f, i) => (
                    <li key={`${f.name}-${i}`} className="relative flex items-center gap-2 rounded-md border border-white/15 bg-ink py-2 pr-2 pl-3 text-sm">
                      <span className="max-w-[12rem] truncate">{f.name}</span>
                      <span className="text-muted">{Math.max(1, Math.round(f.size / 1024))} Ko</span>
                      <button
                        type="button"
                        onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
                        className="rounded p-1 text-muted hover:text-white"
                      >
                        <X aria-hidden className="size-4" />
                        <span className="sr-only">Retirer {f.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {photos.length < PHOTO_MAX_FILES && (
                <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-md border-2 border-dashed border-white/25 px-5 py-3 font-medium text-white hover:border-white/60 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-bright">
                  <ImagePlus aria-hidden className="size-5 text-brand-bright" />
                  Ajouter des photos
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/heic,image/heif,.heic,.heif"
                    aria-describedby={`photos-hint${photoError ? " photos-error" : ""}`}
                    className="sr-only"
                    onChange={(e) => {
                      void addPhotos(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
              {photoError && (
                <p id="photos-error" role="alert" className="mt-2 text-sm font-medium text-brand-bright">
                  {photoError}
                </p>
              )}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="rounded-lg border border-white/10 bg-ink p-5 text-sm text-white/85">
              <p className="font-semibold text-white">Récapitulatif</p>
              <p className="mt-2">
                {service && serviceByKey(service)?.label} · {clientType && clientTypes[clientType]} · {watch("siteType")} ·{" "}
                {isBorne ? `${watch("chargerCount")} borne(s) · ${watch("power")}` : watch("need")}
              </p>
              <p className="mt-1">
                {watch("firstName")} {watch("lastName")} · {watch("email")} · {watch("phone")} · {watch("postalCode")} {watch("city")}
              </p>
              {photos.length > 0 && <p className="mt-1">{photos.length} photo(s) jointe(s)</p>}
            </div>
            <div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  aria-invalid={err("consent") ? true : undefined}
                  aria-describedby={err("consent") ? "consent-error" : undefined}
                  className="mt-1 size-5 shrink-0 accent-brand"
                  {...register("consent")}
                />
                <span className="text-white/90">
                  J&apos;accepte qu&apos;elec k utilise les informations saisies pour traiter ma demande de devis et me
                  recontacter. Mes données ne sont jamais cédées à des tiers.{" "}
                  <Link href="/politique-de-confidentialite" target="_blank" className="font-semibold text-white underline decoration-brand decoration-2 underline-offset-4">
                    Politique de confidentialité
                  </Link>
                  <span aria-hidden className="ml-0.5 text-brand-bright">*</span>
                </span>
              </label>
              {err("consent") && (
                <p id="consent-error" className="mt-2 text-sm font-medium text-brand-bright">
                  {err("consent")}
                </p>
              )}
            </div>
            <Turnstile onToken={onToken} resetKey={turnstileKey} />
          </>
        )}
      </div>

      {serverError && (
        <p role="alert" className="mt-6 rounded-md border border-brand/50 bg-brand/10 px-4 py-3 font-medium text-white">
          {serverError}
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <button type="button" onClick={back} className="inline-flex h-12 items-center justify-center gap-2 rounded-md px-4 font-semibold text-white hover:bg-white/10">
            <ArrowLeft aria-hidden className="size-4" /> Retour
          </button>
        ) : (
          <span />
        )}
        {step < steps.length - 1 ? (
          <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-6 font-semibold text-ink hover:bg-white/90">
            Continuer <ArrowRight aria-hidden className="size-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-brand px-8 text-lg font-semibold text-white hover:bg-brand-hover disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 aria-hidden className="size-5 animate-spin" /> Envoi en cours…
              </>
            ) : (
              <>
                Envoyer ma demande <ArrowRight aria-hidden className="size-5" />
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}
