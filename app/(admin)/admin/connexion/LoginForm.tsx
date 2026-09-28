"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button, Input, Label, Notice } from "@/components/admin/ui";
import { loginAction, type LoginState } from "./actions";

export function LoginForm({ retour }: { retour?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, { step: "credentials" });
  const codeRef = useRef<HTMLInputElement>(null);
  const totp = state.step === "totp";

  useEffect(() => {
    if (totp) codeRef.current?.focus();
  }, [totp, state]);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="retour" value={retour ?? ""} />
      {totp && state.pending && <input type="hidden" name="pending" value={state.pending} />}
      {state.error && <Notice tone="error">{state.error}</Notice>}

      {/* Étape 2FA : l'e-mail reste (masqué) ; le mot de passe est remplacé par un jeton « mot de passe vérifié » */}
      <div className={totp ? "hidden" : "space-y-5"}>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" autoComplete="username" required={!totp} defaultValue={state.email} />
        </div>
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required={!totp} />
        </div>
      </div>

      {totp && (
        <div>
          <p className="mb-4 flex items-start gap-2 text-sm text-muted-dark">
            <ShieldCheck aria-hidden className="size-5 shrink-0 text-ink" />
            Saisissez le code à 6 chiffres affiché dans votre application d&apos;authentification.
          </p>
          <Label htmlFor="code">Code de vérification</Label>
          <Input
            ref={codeRef}
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9 ]{6,7}"
            maxLength={7}
            required
            className="text-center font-mono text-lg tracking-[0.4em]"
          />
        </div>
      )}

      <Button type="submit" variant="dark" size="lg" className="w-full" disabled={pending}>
        {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
        {totp ? "Valider" : "Se connecter"}
      </Button>
    </form>
  );
}
