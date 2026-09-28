/**
 * Les 4 activités d'elec k. Source unique pour : menu, pied de page, accueil, formulaire de devis, dashboard.
 * La borne de recharge reste l'activité principale (référencement, hero, CTA) ; les autres sont mises en avant en second niveau.
 */
export type ServiceKey = "BORNE" | "LED" | "ELECTRICITE" | "THERMOGRAPHIE";

export type ServiceDef = {
  key: ServiceKey;
  label: string; // libellé court (menu, badges)
  title: string; // intitulé complet
  href: string;
  query: string; // valeur ?service= du formulaire de devis
  pitch: string; // accroche courte
  needs: string[]; // « nature de la demande » proposée dans le formulaire (hors bornes)
};

export const services: ServiceDef[] = [
  {
    key: "BORNE",
    label: "Bornes de recharge",
    title: "Bornes de recharge pour véhicules électriques",
    href: "/particuliers",
    query: "borne",
    pitch: "Étude, installation certifiée IRVE et maintenance, pour les particuliers, les copropriétés et les entreprises.",
    needs: [],
  },
  {
    key: "LED",
    label: "Éclairage LED",
    title: "Éclairage LED technique",
    href: "/eclairage-led",
    query: "eclairage-led",
    pitch: "Relamping et éclairage LED pour commerces, bureaux, entrepôts et collectivités : moins de consommation, moins d'entretien.",
    needs: ["Remplacement d'un éclairage existant (relamping)", "Nouvel éclairage", "Éclairage extérieur ou de parking", "Conseil / étude"],
  },
  {
    key: "ELECTRICITE",
    label: "Électricité tertiaire et industrielle",
    title: "Installation et maintenance électrique tertiaire et industrielle",
    href: "/electricite-tertiaire-industrielle",
    query: "electricite",
    pitch: "Installation, mise en conformité, maintenance préventive et dépannage de vos installations électriques professionnelles.",
    needs: ["Installation neuve", "Rénovation / mise en conformité", "Maintenance préventive (contrat)", "Dépannage"],
  },
  {
    key: "THERMOGRAPHIE",
    label: "Thermographie",
    title: "Thermographie infrarouge et maintenance prédictive",
    href: "/thermographie",
    query: "thermographie",
    pitch: "Contrôle par caméra thermique de vos tableaux et équipements, sous tension, pour détecter les anomalies avant la panne.",
    needs: ["Contrôle ponctuel", "Contrôle périodique (contrat)", "Suite à un incident", "Demande de l'assureur"],
  },
];

export const serviceByKey = (k: string) => services.find((s) => s.key === k);
export const serviceByQuery = (q?: string | null) => services.find((s) => s.query === q);
export const serviceLabels = Object.fromEntries(services.map((s) => [s.key, s.label])) as Record<ServiceKey, string>;
