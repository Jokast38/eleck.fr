import { forwardRef } from "react";
import type { LeadStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { statusLabels } from "@/lib/leads/format";

/**
 * Kit d'interface du dashboard (esprit shadcn/ui : composants simples, stylés en Tailwind, sans dépendance lourde).
 * Fond clair, texte noir, rouge réservé aux actions principales.
 */

type ButtonVariant = "primary" | "dark" | "outline" | "ghost" | "danger";
const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-60";
const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  dark: "bg-ink text-white hover:bg-graphite-2",
  outline: "border border-black/15 bg-white text-ink hover:bg-mist",
  ghost: "text-ink hover:bg-black/5",
  danger: "border border-brand/40 bg-white text-brand hover:bg-brand hover:text-white",
};
const buttonSizes = { sm: "h-8 px-3 text-sm", md: "h-10 px-4 text-sm", lg: "h-11 px-5" };

export function buttonClass(variant: ButtonVariant = "dark", size: keyof typeof buttonSizes = "md", className?: string) {
  return cn(buttonBase, buttonVariants[variant], buttonSizes[size], className);
}

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: keyof typeof buttonSizes }
>(function Button({ variant = "dark", size = "md", className, type = "button", ...props }, ref) {
  return <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...props} />;
});

const control =
  "w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-ink placeholder:text-neutral-500 focus:border-ink focus:ring-2 focus:ring-ink/15 focus:outline-none aria-[invalid=true]:border-brand";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref,
) {
  return <input ref={ref} className={cn(control, "h-10", className)} {...props} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...props },
  ref,
) {
  return <textarea ref={ref} className={cn(control, "min-h-24", className)} {...props} />;
});

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, ...props },
  ref,
) {
  return <select ref={ref} className={cn(control, "h-10 pr-8", className)} {...props} />;
});

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-sm font-medium text-ink", className)} {...props} />;
}

export function Field({ label, htmlFor, hint, error, children }: { label: string; htmlFor: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted-dark">{hint}</p>}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1 text-xs font-medium text-brand">
          {error}
        </p>
      )}
    </div>
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl border border-black/10 bg-white", className)} {...props} />;
}

export function CardHeader({ title, action, id }: { title: string; action?: React.ReactNode; id?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-black/10 px-5 py-4">
      <h2 id={id} className="font-display text-base font-semibold">
        {title}
      </h2>
      {action}
    </div>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-dark">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap", className)} {...props} />;
}

/** Statuts : chaque statut a un libellé (jamais la couleur seule). */
export const statusStyles: Record<LeadStatus, string> = {
  NOUVEAU: "bg-brand text-white",
  CONTACTE: "bg-sky-100 text-sky-900",
  VISITE_PLANIFIEE: "bg-amber-100 text-amber-900",
  DEVIS_ENVOYE: "bg-violet-100 text-violet-900",
  GAGNE: "bg-emerald-100 text-emerald-900",
  PERDU: "bg-neutral-200 text-neutral-700",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return <Badge className={statusStyles[status]}>{statusLabels[status]}</Badge>;
}

export function EmptyState({ icon, title, children }: { icon?: React.ReactNode; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      {icon && <div className="text-muted-dark">{icon}</div>}
      <p className="mt-3 font-medium">{title}</p>
      {children && <div className="mt-1 max-w-md text-sm text-muted-dark">{children}</div>}
    </div>
  );
}

/** Message de retour d'action (succès / erreur), annoncé aux lecteurs d'écran. */
export function Notice({ tone = "info", children }: { tone?: "info" | "success" | "error"; children: React.ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-md border px-3 py-2 text-sm",
        tone === "error" && "border-brand/40 bg-brand/5 text-brand-hover",
        tone === "success" && "border-emerald-300 bg-emerald-50 text-emerald-900",
        tone === "info" && "border-black/10 bg-mist text-ink",
      )}
    >
      {children}
    </p>
  );
}
