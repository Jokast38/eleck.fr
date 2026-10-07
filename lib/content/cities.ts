/**
 * Pages locales « /borne-recharge-[ville] » et « /electricien-[ville] ».
 * Chaque ville a un contenu rédigé spécifiquement (pas de simple remplacement du nom) :
 * contexte local, types de logements et de besoins, proximité avec Herblay-sur-Seine.
 * Pour ajouter une ville : ajouter une entrée ici, elle est générée automatiquement (SSG) et ajoutée au sitemap.
 */
export type City = {
  slug: string; // utilisé dans l'URL : /borne-recharge-{slug}
  name: string;
  postalCode: string;
  department: string;
  metaDescription: string;
  headline: string;
  intro: string[];
  focus: { title: string; text: string }[];
  nearby: string[]; // slugs des villes voisines (maillage interne)
};

export const cities: City[] = [
  {
    slug: "herblay-sur-seine",
    name: "Herblay-sur-Seine",
    postalCode: "95220",
    department: "Val-d'Oise (95)",
    metaDescription:
      "Installateur de bornes de recharge certifié IRVE basé à Herblay-sur-Seine. Maisons, copropriétés, entreprises : étude, pose et maintenance. Devis gratuit.",
    headline: "Votre installateur de bornes de recharge à Herblay-sur-Seine",
    intro: [
      "elec k est installé rue Pierre Loti, à Herblay-sur-Seine. Nos clients herblaysiens bénéficient d'un interlocuteur de proximité, disponible pour la visite technique comme pour le suivi après installation.",
      "Entre les quartiers pavillonnaires, les résidences plus récentes et les zones d'activités de la commune, les besoins varient : nous adaptons chaque solution à votre logement, à votre véhicule et à votre installation électrique.",
    ],
    focus: [
      {
        title: "Maisons avec garage ou allée",
        text: "Pose d'une borne murale au plus près de votre place, avec un cheminement de câble propre depuis le tableau électrique.",
      },
      {
        title: "Résidences et petits collectifs",
        text: "Accompagnement du droit à la prise ou d'un projet collectif, en lien avec le syndic et le conseil syndical.",
      },
      {
        title: "Artisans et commerces locaux",
        text: "Recharge des véhicules professionnels et, si vous le souhaitez, borne accessible à votre clientèle.",
      },
    ],
    nearby: ["montigny-les-cormeilles", "conflans-sainte-honorine", "cormeilles-en-parisis"],
  },
  {
    slug: "cergy",
    name: "Cergy",
    postalCode: "95000",
    department: "Val-d'Oise (95)",
    metaDescription:
      "Borne de recharge à Cergy : installation certifiée IRVE pour copropriétés, entreprises et maisons. Étude sur place et devis gratuit par elec k.",
    headline: "Installation de bornes de recharge à Cergy",
    intro: [
      "Ville nouvelle et siège de la préfecture du Val-d'Oise, Cergy compte de nombreuses résidences en copropriété avec parkings souterrains, ainsi que des parcs d'activités et des sièges d'entreprises.",
      "Ces configurations demandent une étude sérieuse de la puissance disponible et du cheminement des câbles. C'est précisément le rôle de notre visite technique, préalable à tout devis.",
    ],
    focus: [
      {
        title: "Parkings souterrains de copropriété",
        text: "Infrastructure collective pensée pour évoluer, ou borne individuelle au titre du droit à la prise.",
      },
      {
        title: "Parcs d'activités et bureaux",
        text: "Bornes pour les salariés et les véhicules de service, avec contrôle d'accès et suivi des consommations.",
      },
      {
        title: "Maisons de ville",
        text: "Borne murale adaptée à votre abonnement, programmable pour recharger aux heures les plus avantageuses.",
      },
    ],
    nearby: ["conflans-sainte-honorine", "herblay-sur-seine"],
  },
  {
    slug: "argenteuil",
    name: "Argenteuil",
    postalCode: "95100",
    department: "Val-d'Oise (95)",
    metaDescription:
      "Installation de borne de recharge à Argenteuil par un électricien certifié IRVE : maisons, copropriétés et entreprises. Étude sur place et devis gratuit.",
    headline: "Borne de recharge à Argenteuil : une installation dans les règles",
    intro: [
      "Commune la plus peuplée du Val-d'Oise, Argenteuil mêle quartiers pavillonnaires, grands ensembles et zones commerciales. Chaque type de bâtiment impose ses propres contraintes électriques.",
      "Maison ancienne dont le tableau doit être mis à niveau, parking collectif à équiper ou site professionnel : nous commençons toujours par un diagnostic de l'existant pour vous proposer une solution sûre et durable.",
    ],
    focus: [
      {
        title: "Maisons anciennes",
        text: "Vérification du tableau électrique et mise à niveau si nécessaire, avant la pose de la borne.",
      },
      {
        title: "Grandes copropriétés",
        text: "Présentation du projet en assemblée générale, gestion de la puissance partagée entre les places équipées.",
      },
      {
        title: "Commerces et zones d'activités",
        text: "Bornes pour véhicules utilitaires ou pour vos clients, dimensionnées selon la fréquentation du site.",
      },
    ],
    nearby: ["cormeilles-en-parisis", "montigny-les-cormeilles"],
  },
  {
    slug: "conflans-sainte-honorine",
    name: "Conflans-Sainte-Honorine",
    postalCode: "78700",
    department: "Yvelines (78)",
    metaDescription:
      "Borne de recharge à Conflans-Sainte-Honorine : elec k, installateur IRVE voisin d'Herblay, équipe maisons, copropriétés et entreprises. Devis gratuit.",
    headline: "Borne de recharge à Conflans-Sainte-Honorine",
    intro: [
      "Située au confluent de la Seine et de l'Oise, côté Yvelines, Conflans-Sainte-Honorine est limitrophe d'Herblay-sur-Seine. Nos équipes s'y rendent rapidement, pour la visite technique comme pour une intervention de maintenance.",
      "Maisons sur les coteaux, résidences du centre-ville ou locaux professionnels : nous étudions votre configuration pour placer la borne au bon endroit et avec la bonne puissance.",
    ],
    focus: [
      {
        title: "Maisons individuelles",
        text: "Borne murale en garage ou en extérieur, avec un matériel adapté aux conditions de pose.",
      },
      {
        title: "Résidences du centre-ville",
        text: "Droit à la prise ou projet collectif, avec un accompagnement auprès du syndic.",
      },
      {
        title: "Professionnels",
        text: "Recharge de véhicules de société et bornes pour les salariés, avec supervision si besoin.",
      },
    ],
    nearby: ["herblay-sur-seine", "cergy"],
  },
  {
    slug: "montigny-les-cormeilles",
    name: "Montigny-lès-Cormeilles",
    postalCode: "95370",
    department: "Val-d'Oise (95)",
    metaDescription:
      "Installation de borne de recharge à Montigny-lès-Cormeilles, commune voisine d'Herblay : elec k, installateur certifié IRVE. Étude et devis gratuits.",
    headline: "Borne de recharge à Montigny-lès-Cormeilles",
    intro: [
      "Commune voisine d'Herblay-sur-Seine, Montigny-lès-Cormeilles se trouve à quelques minutes de nos locaux. Cette proximité facilite l'organisation de la visite technique et le suivi de votre installation dans le temps.",
      "Pour une maison comme pour une résidence, nous vous aidons à choisir la borne adaptée à votre véhicule et à votre installation, sans surdimensionner inutilement votre projet.",
    ],
    focus: [
      {
        title: "Quartiers résidentiels",
        text: "Conseil sur la puissance réellement utile et programmation de la recharge en heures creuses.",
      },
      {
        title: "Copropriétés",
        text: "Étude de la puissance disponible dans le parking et solution évolutive pour les futurs utilisateurs.",
      },
      {
        title: "Entretien de proximité",
        text: "Contrôle périodique et dépannage de votre borne par une équipe basée à côté de chez vous.",
      },
    ],
    nearby: ["herblay-sur-seine", "cormeilles-en-parisis", "argenteuil"],
  },
  {
    slug: "cormeilles-en-parisis",
    name: "Cormeilles-en-Parisis",
    postalCode: "95240",
    department: "Val-d'Oise (95)",
    metaDescription:
      "Borne de recharge à Cormeilles-en-Parisis : étude, pose certifiée IRVE et maintenance pour particuliers, copropriétés et entreprises. Devis gratuit.",
    headline: "Installation de bornes de recharge à Cormeilles-en-Parisis",
    intro: [
      "À proximité immédiate d'Herblay-sur-Seine, Cormeilles-en-Parisis voit se développer de nouveaux programmes résidentiels à côté de ses quartiers pavillonnaires historiques.",
      "Dans une résidence récente, l'infrastructure de recharge est parfois déjà prévue : nous vérifions ce qui existe et le complétons. Dans une maison plus ancienne, nous contrôlons d'abord votre tableau électrique.",
    ],
    focus: [
      {
        title: "Résidences récentes",
        text: "Raccordement de votre borne sur les pré-équipements existants lorsqu'ils sont présents et conformes.",
      },
      {
        title: "Maisons individuelles",
        text: "Diagnostic du tableau électrique et pose d'une borne murale au plus près de votre stationnement.",
      },
      {
        title: "Petites entreprises",
        text: "Une ou plusieurs bornes pour vos véhicules professionnels, avec suivi des consommations.",
      },
    ],
    nearby: ["montigny-les-cormeilles", "argenteuil", "herblay-sur-seine"],
  },
];

/** Autres communes desservies (sans page dédiée pour l'instant). Liste à valider par elec k. */
export const otherTowns = [
  "Pontoise",
  "Saint-Ouen-l'Aumône",
  "Franconville",
  "Taverny",
  "Beauchamp",
  "Sannois",
  "Ermont",
  "Eaubonne",
  "Bezons",
  "Sartrouville",
  "Maisons-Laffitte",
  "Houilles",
];

export const cityPath = (slug: string) => `/borne-recharge-${slug}`;
export const electricianPath = (slug: string) => `/electricien-${slug}`;
export const getCity = (slug: string) => cities.find((c) => c.slug === slug);

/** Contenu des pages « Électricien [ville] » (rédigé par ville, comme les pages bornes). */
export type LocalContent = Pick<City, "metaDescription" | "headline" | "intro" | "focus">;

export const electricianPages: Record<string, LocalContent> = {
  "herblay-sur-seine": {
    metaDescription:
      "Électricien à Herblay-sur-Seine : dépannage, rénovation et mise aux normes, tableau électrique, bornes de recharge. Entreprise locale, devis gratuit.",
    headline: "Votre électricien à Herblay-sur-Seine",
    intro: [
      "elec k est installé rue Pierre Loti, à Herblay-sur-Seine. Pour un dépannage, des travaux de rénovation ou le remplacement d'un tableau électrique, vous faites appel à une entreprise de votre commune.",
      "Pavillons, résidences, commerces et locaux d'activités : nous intervenons sur tous types de bâtiments, avec le même souci de sécurité et de conformité.",
    ],
    focus: [
      { title: "Dépannage de proximité", text: "Panne de courant, disjoncteur qui saute, circuit hors service : nos électriciens sont basés à Herblay." },
      { title: "Rénovation des pavillons", text: "Mise en sécurité et rénovation des installations anciennes, selon la norme NF C 15-100." },
      { title: "Commerces et artisans", text: "Installation, mise en conformité et maintenance électrique de vos locaux professionnels." },
    ],
  },
  cergy: {
    metaDescription:
      "Électricien à Cergy : dépannage, rénovation et mise aux normes, tableau électrique, électricité tertiaire. elec k, entreprise du Val-d'Oise.",
    headline: "Électricien à Cergy pour particuliers et professionnels",
    intro: [
      "Préfecture du Val-d'Oise, Cergy rassemble des résidences en copropriété, des maisons de ville et de nombreux parcs d'activités et bureaux.",
      "Appartement à remettre en sécurité, tableau électrique à remplacer ou locaux professionnels à entretenir : nous étudions votre installation et vous proposons des travaux adaptés.",
    ],
    focus: [
      { title: "Appartements et maisons de ville", text: "Dépannage, mise en sécurité, remplacement de tableau et rénovation électrique." },
      { title: "Bureaux et parcs d'activités", text: "Installation, mise en conformité et contrats de maintenance électrique." },
      { title: "Avant une vente ou une location", text: "Correction des anomalies relevées par le diagnostic électrique du logement." },
    ],
  },
  argenteuil: {
    metaDescription:
      "Électricien à Argenteuil : dépannage, rénovation de maisons anciennes, mise aux normes, tableau électrique et électricité tertiaire. Devis gratuit.",
    headline: "Électricien à Argenteuil : dépannage et rénovation",
    intro: [
      "Commune la plus peuplée du Val-d'Oise, Argenteuil mêle quartiers pavillonnaires, grands ensembles et zones commerciales.",
      "Dans les maisons anciennes, l'installation électrique a souvent besoin d'une remise à niveau : nous commençons toujours par un diagnostic de l'existant avant de vous proposer des travaux.",
    ],
    focus: [
      { title: "Maisons anciennes", text: "Mise à la terre, protection différentielle, remplacement des circuits vétustes et du tableau." },
      { title: "Dépannage", text: "Recherche de panne et remise en service, en maison comme en appartement." },
      { title: "Commerces et zones d'activités", text: "Travaux et maintenance électrique pour vos locaux professionnels." },
    ],
  },
  "conflans-sainte-honorine": {
    metaDescription:
      "Électricien à Conflans-Sainte-Honorine, voisin d'Herblay : dépannage, rénovation électrique, tableau, électricité pour les pros. Devis gratuit.",
    headline: "Électricien à Conflans-Sainte-Honorine",
    intro: [
      "Limitrophe d'Herblay-sur-Seine, Conflans-Sainte-Honorine se trouve à quelques minutes de nos locaux : un atout pour un dépannage comme pour le suivi d'un chantier.",
      "Maisons sur les coteaux, résidences du centre-ville ou locaux professionnels : nous intervenons sur les installations récentes comme anciennes.",
    ],
    focus: [
      { title: "Une équipe à proximité", text: "Nos électriciens sont basés dans la commune voisine, à Herblay-sur-Seine." },
      { title: "Rénovation et mise aux normes", text: "Remise en sécurité des installations anciennes et rénovation selon la norme NF C 15-100." },
      { title: "Professionnels", text: "Installation et maintenance électrique de vos bureaux, commerces et ateliers." },
    ],
  },
  "montigny-les-cormeilles": {
    metaDescription:
      "Électricien à Montigny-lès-Cormeilles, commune voisine d'Herblay : dépannage, mise aux normes, tableau électrique, rénovation. Devis gratuit.",
    headline: "Électricien à Montigny-lès-Cormeilles",
    intro: [
      "Commune voisine d'Herblay-sur-Seine, Montigny-lès-Cormeilles se trouve à quelques minutes de nos locaux.",
      "Pour une panne, un tableau électrique à remplacer ou une rénovation, vous bénéficiez d'un interlocuteur de proximité, du diagnostic jusqu'à la fin des travaux.",
    ],
    focus: [
      { title: "Dépannage", text: "Panne de courant, disjoncteur qui saute, prise ou éclairage hors service." },
      { title: "Tableau électrique", text: "Remplacement des tableaux anciens et ajout de protections différentielles 30 mA." },
      { title: "Rénovation", text: "Mise en sécurité et rénovation de l'installation, pièce par pièce ou complète." },
    ],
  },
  "cormeilles-en-parisis": {
    metaDescription:
      "Électricien à Cormeilles-en-Parisis : dépannage, rénovation et mise aux normes, tableau électrique, maisons et résidences. Devis gratuit.",
    headline: "Électricien à Cormeilles-en-Parisis",
    intro: [
      "À proximité immédiate d'Herblay-sur-Seine, Cormeilles-en-Parisis associe quartiers pavillonnaires historiques et programmes résidentiels récents.",
      "Dans une maison ancienne, nous contrôlons d'abord votre installation et votre tableau ; dans un logement récent, nous intervenons pour un dépannage, un ajout de circuits ou une modification.",
    ],
    focus: [
      { title: "Maisons anciennes", text: "Diagnostic, mise en sécurité et rénovation de l'installation électrique." },
      { title: "Logements récents", text: "Ajout de prises, de circuits dédiés ou de points lumineux, dans le respect de la norme." },
      { title: "Dépannage", text: "Recherche de panne et remise en service de votre installation." },
    ],
  },
};
