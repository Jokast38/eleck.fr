"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { changePassword, confirm2fa, createUser, disable2fa, start2fa, type UserFormState } from "@/lib/users/actions";
import { Button, Input, Label, Notice, Select } from "./ui";

function Feedback({ state, success }: { state: UserFormState; success: string }) {
  if (!state) return null;
  if (state.error) return <Notice tone="error">{state.error}</Notice>;
  return state.ok ? <Notice tone="success">{success}</Notice> : null;
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, null);
  return (
    <form action={action} className="space-y-4" key={state?.ok ? state.at : "pw"}>
      <div>
        <Label htmlFor="current">Mot de passe actuel</Label>
        <Input id="current" name="current" type="password" autoComplete="current-password" required />
      </div>
      <div>
        <Label htmlFor="next">Nouveau mot de passe</Label>
        <Input id="next" name="next" type="password" autoComplete="new-password" minLength={12} required aria-describedby="pw-hint" />
        <p id="pw-hint" className="mt-1 text-xs text-muted-dark">12 caractères minimum, avec des lettres et des chiffres.</p>
      </div>
      <div>
        <Label htmlFor="confirm">Confirmer le nouveau mot de passe</Label>
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required />
      </div>
      <Feedback state={state} success="Mot de passe modifié." />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 aria-hidden className="size-4 animate-spin" />} Modifier le mot de passe
      </Button>
    </form>
  );
}

export function TwoFactor({ enabled }: { enabled: boolean }) {
  const [setup, setSetup] = useState<UserFormState>(null);
  const [starting, setStarting] = useState(false);
  const [confirmState, confirmAction, confirming] = useActionState(confirm2fa, null);
  const [disableState, disableAction, disabling] = useActionState(disable2fa, null);

  if (enabled || confirmState?.ok)
    return (
      <div className="space-y-4">
        <Notice tone="success">La double authentification est active sur votre compte.</Notice>
        <form action={disableAction} className="flex flex-wrap items-end gap-3">
          <div>
            <Label htmlFor="off-code">Code actuel pour désactiver</Label>
            <Input id="off-code" name="code" inputMode="numeric" autoComplete="one-time-code" maxLength={7} className="w-40" required />
          </div>
          <Button type="submit" variant="danger" disabled={disabling}>Désactiver</Button>
        </form>
        <Feedback state={disableState} success="Double authentification désactivée." />
      </div>
    );

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-dark">
        Protégez votre compte avec un code à 6 chiffres généré par une application (Google Authenticator, Microsoft Authenticator, 1Password…).
      </p>
      {!setup?.qr ? (
        <Button
          variant="dark"
          disabled={starting}
          onClick={async () => {
            setStarting(true);
            setSetup(await start2fa());
            setStarting(false);
          }}
        >
          {starting && <Loader2 aria-hidden className="size-4 animate-spin" />} Activer la double authentification
        </Button>
      ) : (
        <div className="space-y-4">
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            <li>Scannez ce QR code avec votre application d&apos;authentification.</li>
            <li>Saisissez le code à 6 chiffres affiché pour confirmer.</li>
          </ol>
          {/* eslint-disable-next-line @next/next/no-img-element -- QR code généré (data URL) */}
          <img src={setup.qr} alt="QR code à scanner avec votre application d'authentification" width={180} height={180} className="rounded border border-black/10" />
          <p className="text-xs text-muted-dark">
            Saisie manuelle : <code className="rounded bg-mist px-1.5 py-0.5 font-mono break-all">{setup.secret}</code>
          </p>
          <form action={confirmAction} className="flex flex-wrap items-end gap-3">
            <div>
              <Label htmlFor="on-code">Code de vérification</Label>
              <Input id="on-code" name="code" inputMode="numeric" autoComplete="one-time-code" maxLength={7} className="w-40" required />
            </div>
            <Button type="submit" disabled={confirming}>Confirmer</Button>
          </form>
          <Feedback state={confirmState} success="Double authentification activée." />
        </div>
      )}
    </div>
  );
}

export function NewUserForm() {
  const [state, action, pending] = useActionState(createUser, null);
  return (
    <form action={action} className="space-y-4" key={state?.ok ? state.at : "new"}>
      <div>
        <Label htmlFor="u-name">Nom</Label>
        <Input id="u-name" name="name" required />
      </div>
      <div>
        <Label htmlFor="u-email">E-mail</Label>
        <Input id="u-email" name="email" type="email" required autoComplete="off" />
      </div>
      <div>
        <Label htmlFor="u-role">Rôle</Label>
        <Select id="u-role" name="role" defaultValue="EMPLOYE">
          <option value="EMPLOYE">Employé</option>
          <option value="ADMIN">Administrateur</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="u-password">Mot de passe provisoire</Label>
        <Input id="u-password" name="password" type="password" minLength={12} required autoComplete="new-password" />
        <p className="mt-1 text-xs text-muted-dark">À transmettre de façon sûre ; l&apos;utilisateur le changera dans « Mon compte ».</p>
      </div>
      <Feedback state={state} success="Utilisateur créé." />
      <Button type="submit" disabled={pending}>Créer le compte</Button>
    </form>
  );
}
