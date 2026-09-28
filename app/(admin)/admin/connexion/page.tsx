import { Logo } from "@/components/brand/Logo";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Connexion" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ retour?: string }> }) {
  const { retour } = await searchParams;
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="absolute -bottom-40 -left-40 size-[32rem] rounded-full bg-brand/25 blur-[140px]" />
        <Logo className="h-10" />
        <div className="relative">
          <p className="font-display text-3xl font-semibold">Espace de gestion</p>
          <p className="mt-3 max-w-sm text-muted">Demandes de devis, messagerie et contenus du site elec k.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo tone="dark" className="h-9" />
          </div>
          <h1 className="font-display text-2xl font-semibold">Connexion</h1>
          <p className="mt-1 mb-8 text-sm text-muted-dark">Accès réservé à l&apos;équipe elec k.</p>
          <LoginForm retour={retour} />
        </div>
      </div>
    </main>
  );
}
