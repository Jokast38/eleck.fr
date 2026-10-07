/**
 * Configuration centrale de l'entreprise (cohérence NAP : nom, adresse, téléphone).
 * Toute information affichée sur le site doit venir d'ici.
 * Les valeurs [À COMPLÉTER] sont à renseigner avant la mise en ligne.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.eleck.fr").replace(/\/$/, "");

export const site = {
  name: "elec k",
  // Source : plaquette commerciale elec k (page « Contact »). À revérifier sur l'extrait Kbis / annuaire-entreprises.data.gouv.fr
  legalName: "elec k",
  legalForm: "Société par actions simplifiée unipersonnelle (SASU)",
  siret: "817 638 513 00017",
  siren: "817 638 513",
  ape: "4321A (Travaux d'installation électrique dans tous locaux)",
  shareCapital: "[À COMPLÉTER]",
  rcs: "[À COMPLÉTER] (ex. RCS Pontoise 817 638 513)",
  vatNumber: "[À COMPLÉTER]",
  director: "Khaled KACED",
  businessManager: "Thierry MERCIER",
  tagline: "Bornes de recharge, éclairage LED et électricité",
  description:
    "Électricien certifié IRVE dans le Val-d'Oise : bornes de recharge, éclairage LED, installation et maintenance électrique tertiaire et industrielle, thermographie.",
  url: SITE_URL,
  email: "contact@eleck.fr",
  phone: {
    display: "06 51 90 83 52",
    href: "tel:+33651908352",
    international: "+33 6 51 90 83 52",
  },
  address: {
    street: "10 rue Pierre Loti",
    postalCode: "95220",
    city: "Herblay-sur-Seine",
    region: "Île-de-France",
    country: "FR",
  },
  // Coordonnées APPROXIMATIVES (centre d'Herblay) : utilisées pour centrer la carte.
  // Passer geoVerified à true après vérification sur Google Business Profile pour les publier en JSON-LD.
  geo: { lat: 48.9896, lng: 2.1653 },
  geoVerified: false as boolean,
  // Horaires : [À COMPLÉTER]. Non affichés ni publiés tant qu'ils ne sont pas confirmés.
  // Format schema.org, ex. : { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday"], opens: "08:00", closes: "18:00" }
  openingHoursSpec: [] as Record<string, unknown>[],
  areaServed: ["Herblay-sur-Seine", "Val-d'Oise (95)", "Île-de-France"],
  certification: "Qualification IRVE (AFNOR)",
  social: [] as { label: string; href: string }[], // à compléter (LinkedIn, Facebook, Instagram…)
} as const;

/** Libellé unique du CTA principal (règle « un seul CTA »). Ne pas dupliquer ailleurs. */
export const CTA_LABEL = "Demander un devis gratuit";
export const CTA_SHORT_LABEL = "Devis gratuit";
export const CTA_HREF = "/devis";

export type NavItem = { label: string; href: string; description?: string };
export type NavGroup = { label: string; items: NavItem[] };

/** Menu principal : deux menus déroulants + liens directs. */
export const mainNav: (NavItem | NavGroup)[] = [
  {
    label: "Bornes de recharge",
    items: [
      { label: "Particuliers", href: "/particuliers", description: "Borne à domicile, maison individuelle" },
      { label: "Copropriétés", href: "/coproprietes", description: "Droit à la prise, projet collectif" },
      { label: "Entreprises", href: "/entreprises", description: "Flottes, parkings salariés et visiteurs" },
      { label: "Maintenance des bornes", href: "/maintenance", description: "Contrôle, diagnostic et dépannage" },
    ],
  },
  {
    label: "Autres services",
    items: [
      { label: "Éclairage LED", href: "/eclairage-led", description: "Relamping et éclairage technique" },
      { label: "Électricité tertiaire et industrielle", href: "/electricite-tertiaire-industrielle", description: "Installation et maintenance" },
      { label: "Thermographie", href: "/thermographie", description: "Maintenance prédictive par caméra thermique" },
    ],
  },
  { label: "Réalisations", href: "/realisations" },
  { label: "À propos", href: "/a-propos" },
];

export const isNavGroup = (i: NavItem | NavGroup): i is NavGroup => "items" in i;

export const footerNav = {
  solutions: [
    { label: "Borne pour particuliers", href: "/particuliers" },
    { label: "Borne en copropriété", href: "/coproprietes" },
    { label: "Borne pour entreprises", href: "/entreprises" },
    { label: "Maintenance des bornes", href: "/maintenance" },
    { label: "Éclairage LED", href: "/eclairage-led" },
    { label: "Électricité tertiaire et industrielle", href: "/electricite-tertiaire-industrielle" },
    { label: "Thermographie infrarouge", href: "/thermographie" },
  ],
  company: [
    { label: "À propos", href: "/a-propos" },
    { label: "Réalisations", href: "/realisations" },
    { label: "Zone d'intervention", href: "/zone-intervention" },
    { label: "Questions fréquentes", href: "/faq" },
  ],
  legal: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
    { label: "CGU", href: "/cgu" },
    { label: "Gestion des cookies", href: "/gestion-cookies" },
  ],
} as const;
