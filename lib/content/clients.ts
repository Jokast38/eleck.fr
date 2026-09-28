/**
 * Références clients affichées dans le bandeau défilant.
 * ⚠ Afficher le logo d'une entreprise comme référence suppose son accord : obtenir une validation
 * écrite (un simple e-mail) de chaque client avant la mise en ligne, puis passer `approved` à true.
 * Sans fichier logo, le nom est affiché en texte sobre (aucun faux logo n'est dessiné).
 * Pour ajouter un logo officiel : déposer le fichier dans /public/clients et renseigner `logo`.
 */
export type Client = {
  name: string;
  logo?: { src: string; width: number; height: number };
  /** Source et licence du fichier (crédits dans les mentions légales) */
  credit?: string;
  approved: boolean;
};

export const clients: Client[] = [
  { name: "Porsche", logo: { src: "/clients/porsche.svg", width: 360, height: 38 }, credit: "Wikimedia Commons, domaine public", approved: false },
  { name: "STG", approved: false },
  { name: "Kuehne + Nagel", logo: { src: "/clients/kuehne-nagel.svg", width: 360, height: 76 }, credit: "Wikimedia Commons, domaine public", approved: false },
  { name: "GreenYellow", logo: { src: "/clients/greenyellow.png", width: 326, height: 90 }, credit: "Wikimedia Commons, licence CC BY-SA 4.0", approved: false },
  { name: "Bouygues", logo: { src: "/clients/bouygues.svg", width: 179, height: 90 }, credit: "Wikimedia Commons, domaine public", approved: false },
  { name: "Géant Casino", logo: { src: "/clients/geant-casino.svg", width: 241, height: 90 }, credit: "Wikimedia Commons, domaine public", approved: false },
  { name: "Monoprix", logo: { src: "/clients/monoprix.svg", width: 360, height: 83 }, credit: "Wikimedia Commons, domaine public", approved: false },
  { name: "SA COGNE", approved: false },
  { name: "Driveco", approved: false },
  { name: "Wallbox", approved: false },
];
