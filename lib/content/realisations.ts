/**
 * Réalisations (chantiers). À l'étape 4, elles seront gérées depuis le dashboard (table Realisation)
 * et lues en base. Tant qu'aucune réalisation réelle n'est publiée, la liste reste vide et le site
 * affiche un message neutre : aucun chantier fictif n'est présenté.
 */
import type { ServiceKey } from "./services";

export type Realisation = {
  slug: string;
  title: string;
  city: string;
  clientType: "Particulier" | "Copropriété" | "Entreprise";
  service: ServiceKey;
  serviceLabel: string;
  description: string;
  image?: { src: string; alt: string; width: number; height: number };
};

export const realisations: Realisation[] = [];
