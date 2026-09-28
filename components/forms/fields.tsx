"use client";

import { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Champs du formulaire public (fond sombre), accessibles : label, aide, erreur liée par aria-describedby. */

const control =
  "w-full rounded-md border bg-ink px-4 py-3 text-base text-white placeholder:text-white/40 transition-colors focus:border-brand-bright focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-brand-bright/40";

type FieldProps = {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
};

function describedBy(id: string, error?: string, hint?: string) {
  return [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(" ") || undefined;
}

function FieldShell({
  id,
  label,
  error,
  hint,
  optional,
  className,
  children,
}: FieldProps & { id: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block font-medium text-white">
        {label}
        {optional ? <span className="ml-1 font-normal text-muted">(facultatif)</span> : <span aria-hidden className="ml-0.5 text-brand-bright">*</span>}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-brand-bright">
          {error}
        </p>
      )}
    </div>
  );
}

export const TextField = forwardRef<HTMLInputElement, FieldProps & React.InputHTMLAttributes<HTMLInputElement>>(
  function TextField({ label, error, hint, optional, className, ...props }, ref) {
    const id = useId();
    return (
      <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          aria-required={!optional}
          className={cn(control, error ? "border-brand-bright" : "border-white/15")}
          {...props}
        />
      </FieldShell>
    );
  },
);

export const TextAreaField = forwardRef<HTMLTextAreaElement, FieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function TextAreaField({ label, error, hint, optional, className, ...props }, ref) {
    const id = useId();
    return (
      <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
        <textarea
          ref={ref}
          id={id}
          rows={4}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(control, "resize-y", error ? "border-brand-bright" : "border-white/15")}
          {...props}
        />
      </FieldShell>
    );
  },
);

export const SelectField = forwardRef<
  HTMLSelectElement,
  FieldProps & React.SelectHTMLAttributes<HTMLSelectElement> & { options: string[]; placeholder?: string }
>(function SelectField({ label, error, hint, optional, className, options, placeholder = "Sélectionnez…", ...props }, ref) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          aria-required={!optional}
          className={cn(control, "appearance-none pr-10", error ? "border-brand-bright" : "border-white/15")}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3.5 size-5 -translate-y-1/2 text-white/70" />
      </div>
    </FieldShell>
  );
});

/** Groupe de boutons radio présentés en « pastilles » (choix rapides). */
export function ChoiceGroup({
  legend,
  name,
  options,
  value,
  onChange,
  error,
  columns = 2,
}: {
  legend: string;
  name: string;
  options: string[];
  value?: string;
  onChange: (v: string) => void;
  error?: string;
  columns?: 2 | 3 | 4;
}) {
  const id = useId();
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined} aria-invalid={error ? true : undefined}>
      <legend className="mb-2 font-medium text-white">
        {legend}
        <span aria-hidden className="ml-0.5 text-brand-bright">*</span>
      </legend>
      <div className={cn("grid gap-2", columns === 2 && "sm:grid-cols-2", columns === 3 && "sm:grid-cols-3", columns === 4 && "grid-cols-2 sm:grid-cols-4")}>
        {options.map((o) => (
          <label
            key={o}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-bright",
              value === o ? "border-brand bg-brand/10 text-white" : "border-white/15 text-white/85 hover:border-white/40",
            )}
          >
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} className="size-4 accent-brand" />
            {o}
          </label>
        ))}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-brand-bright">
          {error}
        </p>
      )}
    </fieldset>
  );
}
