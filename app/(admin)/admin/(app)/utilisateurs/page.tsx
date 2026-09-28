import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { updateUser } from "@/lib/users/actions";
import { formatDateTime } from "@/lib/format";
import { Badge, Card, CardHeader, PageHeader, buttonClass } from "@/components/admin/ui";
import { NewUserForm } from "@/components/admin/AccountForms";

export const metadata = { title: "Utilisateurs" };

function Op({ id, op, label, extra }: { id: string; op: string; label: string; extra?: React.ReactNode }) {
  return (
    <form action={updateUser}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="op" value={op} />
      {extra}
      <button type="submit" className={buttonClass("outline", "sm")}>{label}</button>
    </form>
  );
}

export default async function UsersPage() {
  const me = await requireUser({ role: "ADMIN" });
  const users = await db.user.findMany({ orderBy: [{ active: "desc" }, { name: "asc" }] });
  const now = new Date();
  return (
    <>
      <PageHeader title="Utilisateurs" description="Accès au dashboard. Les administrateurs gèrent les comptes et consultent le journal d'activité." />
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <caption className="sr-only">Comptes utilisateurs</caption>
            <thead className="border-b border-black/10 text-xs text-muted-dark uppercase">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Utilisateur</th>
                <th scope="col" className="px-4 py-3 font-medium">Rôle</th>
                <th scope="col" className="px-4 py-3 font-medium">Sécurité</th>
                <th scope="col" className="px-4 py-3 font-medium">Dernière connexion</th>
                <th scope="col" className="px-4 py-3 font-medium"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {users.map((u) => {
                const locked = u.lockedUntil && u.lockedUntil > now;
                const self = u.id === me.id;
                return (
                  <tr key={u.id} className={u.active ? "" : "opacity-60"}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{u.name}{self && <span className="text-muted-dark"> (vous)</span>}</p>
                      <p className="text-xs text-muted-dark">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">{u.role === "ADMIN" ? "Administrateur" : "Employé"}</td>
                    <td className="space-x-1 px-4 py-3">
                      <Badge className={u.totpEnabled ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}>{u.totpEnabled ? "2FA active" : "Sans 2FA"}</Badge>
                      {locked && <Badge className="bg-brand text-white">Verrouillé</Badge>}
                      {!u.active && <Badge className="bg-neutral-200 text-neutral-700">Désactivé</Badge>}
                    </td>
                    <td className="px-4 py-3 text-muted-dark">{formatDateTime(u.lastLoginAt) || "Jamais"}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-2">
                        {locked && <Op id={u.id} op="unlock" label="Déverrouiller" />}
                        {u.totpEnabled && <Op id={u.id} op="reset2fa" label="Réinitialiser la 2FA" />}
                        {!self && (
                          <>
                            <Op id={u.id} op="role" label={u.role === "ADMIN" ? "Passer employé" : "Passer admin"} extra={<input type="hidden" name="role" value={u.role === "ADMIN" ? "EMPLOYE" : "ADMIN"} />} />
                            <Op id={u.id} op={u.active ? "deactivate" : "activate"} label={u.active ? "Désactiver" : "Réactiver"} />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
        <Card className="h-fit">
          <CardHeader title="Ajouter un utilisateur" />
          <div className="p-5">
            <NewUserForm />
          </div>
        </Card>
      </div>
    </>
  );
}
