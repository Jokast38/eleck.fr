/**
 * FAQ de départ. À l'étape 4, ces questions seront importées en base (seed) et
 * modifiables depuis le dashboard ; ce fichier reste la source par défaut.
 * Les réponses marquées [À CONFIRMER] doivent être validées par elec k avant la mise en ligne.
 */
export type FaqCategory = "general" | "particuliers" | "coproprietes" | "entreprises" | "maintenance" | "eclairage" | "electricite" | "thermographie";

export type FaqItem = { q: string; a: string; category: FaqCategory; home?: boolean };

export const faqCategories: Record<FaqCategory, string> = {
  general: "Questions générales",
  particuliers: "Borne à domicile",
  coproprietes: "Borne en copropriété",
  entreprises: "Borne pour entreprises",
  maintenance: "Maintenance des bornes",
  eclairage: "Éclairage LED",
  electricite: "Électricité tertiaire et industrielle",
  thermographie: "Thermographie infrarouge",
};

export const faq: FaqItem[] = [
  {
    category: "general",
    home: true,
    q: "Pourquoi faire appel à un installateur certifié IRVE ?",
    a: "La réglementation impose un installateur qualifié IRVE pour toute borne de recharge d'une puissance supérieure à 3,7 kW. C'est aussi une condition pour bénéficier des aides financières et pour faire valoir la garantie du fabricant. elec k détient la qualification IRVE délivrée sous l'égide de l'AFNOR.",
  },
  {
    category: "general",
    home: true,
    q: "Le devis est-il gratuit ?",
    a: "Oui. Décrivez votre projet via le formulaire de demande de devis : nous vous recontactons pour préciser vos besoins, organiser si nécessaire une visite technique, puis vous remettre un devis détaillé, sans engagement.",
  },
  {
    category: "general",
    home: true,
    q: "Quelle puissance de borne choisir ?",
    a: "Tout dépend de votre véhicule, de vos trajets et de votre installation électrique. Une borne de 7 kW en monophasé suffit le plus souvent pour recharger complètement pendant la nuit. Les puissances de 11 et 22 kW nécessitent une alimentation triphasée et se justifient surtout en entreprise ou pour des besoins de recharge rapide. Nous vous conseillons la bonne puissance lors de l'étude.",
  },
  {
    category: "general",
    home: true,
    q: "Faut-il augmenter la puissance de mon abonnement électrique ?",
    a: "Pas nécessairement. Nous analysons votre consommation et votre tableau électrique. Une borne pilotable ou un système de délestage peut adapter la puissance de charge à votre consommation et éviter de changer d'abonnement.",
  },
  {
    category: "general",
    home: true,
    q: "Existe-t-il des aides pour financer une borne de recharge ?",
    a: "Plusieurs dispositifs existent selon votre profil : le programme ADVENIR (copropriétés, entreprises, collectivités), des avantages fiscaux pour les particuliers, ou encore des aides locales. Leurs montants et conditions évoluent régulièrement : nous vous indiquons ceux auxquels vous avez droit au moment du devis.",
  },
  {
    category: "general",
    q: "Combien de temps dure l'installation ?",
    a: "La durée dépend de la distance entre le tableau électrique et l'emplacement de la borne, du type de pose et des éventuels travaux d'adaptation. Elle est précisée dans votre devis, et nous convenons ensemble d'une date d'intervention.",
  },
  {
    category: "general",
    home: true,
    q: "Dans quelle zone intervenez-vous ?",
    a: "Nous sommes basés à Herblay-sur-Seine et intervenons dans tout le Val-d'Oise (95) ainsi qu'en Île-de-France. Consultez notre page zone d'intervention ou indiquez votre code postal dans la demande de devis.",
  },
  {
    category: "particuliers",
    q: "Prise renforcée ou borne murale : que choisir ?",
    a: "Une prise renforcée est une solution d'appoint : la recharge reste lente. Une borne murale (wallbox) recharge plus vite, plus sûrement et peut être pilotée (programmation en heures creuses, suivi de consommation). Pour un usage quotidien, la borne est recommandée.",
  },
  {
    category: "particuliers",
    q: "Ma borne peut-elle être installée à l'extérieur ?",
    a: "Oui, à condition de choisir un matériel dont l'indice de protection est adapté à l'extérieur et de réaliser une pose conforme (fixation, passage des câbles, protections électriques). Nous en tenons compte dès l'étude.",
  },
  {
    category: "particuliers",
    q: "Puis-je programmer la recharge en heures creuses ?",
    a: "Oui. La plupart des bornes actuelles permettent de programmer la recharge, directement ou via une application, afin de profiter des heures creuses si votre contrat en comporte.",
  },
  {
    category: "coproprietes",
    home: true,
    q: "Puis-je installer une borne dans le parking de ma copropriété ?",
    a: "Oui. Le « droit à la prise » permet à tout copropriétaire ou locataire d'installer, à ses frais, une borne sur sa place de stationnement. Il suffit d'informer le syndic, qui ne peut s'y opposer que pour un motif sérieux et légitime. La copropriété peut aussi faire le choix d'une infrastructure collective votée en assemblée générale. Nous vous accompagnons dans les deux cas.",
  },
  {
    category: "coproprietes",
    q: "Solution individuelle ou collective : que choisir pour la copropriété ?",
    a: "Une solution individuelle répond à un besoin ponctuel. Une infrastructure collective anticipe l'arrivée de nouveaux véhicules électriques, répartit mieux la puissance disponible et facilite l'ajout de bornes ensuite. Nous présentons les deux options au conseil syndical avec un chiffrage clair.",
  },
  {
    category: "coproprietes",
    q: "Comment la consommation de chaque borne est-elle facturée ?",
    a: "Chaque borne peut être raccordée à un compteur individuel ou équipée d'un système de mesure permettant de refacturer la consommation au bon utilisateur. La solution retenue est définie lors de l'étude.",
  },
  {
    category: "entreprises",
    q: "Pouvez-vous équiper un parking d'entreprise ou une flotte de véhicules ?",
    a: "Oui. Nous dimensionnons l'installation selon le nombre de véhicules, leur usage et la puissance disponible sur le site, avec gestion dynamique de la charge si nécessaire. Les bornes peuvent être réservées aux salariés, à la flotte ou ouvertes aux visiteurs et clients.",
  },
  {
    category: "entreprises",
    q: "Est-il possible de contrôler l'accès aux bornes ?",
    a: "Oui. Les bornes peuvent être équipées d'un contrôle d'accès par badge et d'une supervision pour suivre les consommations par utilisateur ou par véhicule.",
  },
  {
    category: "maintenance",
    q: "Intervenez-vous sur des bornes que vous n'avez pas installées ?",
    a: "Oui, après un diagnostic de l'installation existante. Nous vous indiquons ensuite les réparations ou mises en conformité nécessaires. [À CONFIRMER]",
  },
  {
    category: "maintenance",
    q: "Une borne de recharge a-t-elle besoin d'entretien ?",
    a: "Une vérification régulière permet de s'assurer du bon état des protections électriques, des connecteurs et du câble, et de garantir la sécurité et la disponibilité de la borne. C'est particulièrement important pour les bornes partagées en copropriété ou en entreprise.",
  },
];

faq.push(
  {
    category: "general",
    home: true,
    q: "Intervenez-vous pour d'autres travaux que les bornes de recharge ?",
    a: "Oui. Au-delà des bornes, elec k réalise des installations d'éclairage LED, des travaux d'installation et de maintenance électrique pour le tertiaire et l'industrie, ainsi que des contrôles par thermographie infrarouge.",
  },
  {
    category: "eclairage",
    q: "Quels sont les avantages de l'éclairage LED pour un professionnel ?",
    a: "Un éclairage LED consomme nettement moins qu'un éclairage traditionnel (tubes fluorescents, halogènes, iodures métalliques) et dure beaucoup plus longtemps, ce qui réduit aussi les interventions de remplacement. Il améliore le confort visuel et le rendu des couleurs, selon l'usage : rayons, ateliers, bureaux. Nous évaluons le gain attendu pour votre site lors de l'étude.",
  },
  {
    category: "eclairage",
    q: "Qu'est-ce que le relamping ?",
    a: "Le relamping consiste à remplacer un éclairage existant par des sources ou des luminaires LED, en conservant ou en adaptant les emplacements. Nous organisons les travaux pour limiter la gêne pour votre activité.",
  },
  {
    category: "eclairage",
    q: "Existe-t-il des aides pour passer à l'éclairage LED ?",
    a: "Selon votre activité et votre bâtiment, certains travaux d'éclairage performant peuvent être financés en partie par les certificats d'économies d'énergie (CEE). Les conditions évoluent : nous vérifions votre éligibilité au moment du devis.",
  },
  {
    category: "electricite",
    q: "Quels types de travaux électriques réalisez-vous ?",
    a: "Installations neuves et rénovations, mises en conformité, tableaux électriques, alimentation d'équipements et de machines, éclairage, ainsi que la maintenance préventive et curative des installations tertiaires et industrielles.",
  },
  {
    category: "electricite",
    q: "Pouvez-vous lever les observations d'un rapport de vérification électrique ?",
    a: "Oui. Transmettez-nous le rapport de vérification périodique établi par l'organisme de contrôle : nous chiffrons puis réalisons les travaux nécessaires pour lever les observations.",
  },
  {
    category: "electricite",
    q: "Proposez-vous des contrats de maintenance ?",
    a: "Oui, pour les sites tertiaires et industriels : visites préventives planifiées, rapport après chaque intervention et dépannage sur demande. Le contenu du contrat est adapté à votre installation.",
  },
  {
    category: "thermographie",
    q: "À quoi sert une thermographie infrarouge ?",
    a: "Une caméra thermique rend visibles les échauffements anormaux d'une installation électrique (serrage insuffisant, surcharge, déséquilibre entre phases, composant défaillant) avant qu'ils ne provoquent une panne ou un départ de feu. C'est la base d'une maintenance prédictive.",
  },
  {
    category: "thermographie",
    q: "Faut-il couper le courant pendant le contrôle ?",
    a: "Non. La thermographie se réalise sur une installation en fonctionnement, idéalement à un niveau de charge représentatif de votre activité, qui n'est donc pas interrompue.",
  },
  {
    category: "thermographie",
    q: "Que contient le rapport de thermographie ?",
    a: "Les anomalies relevées, localisées et classées par priorité, avec les images thermiques correspondantes et nos recommandations de correction. Si votre assureur exige un format de rapport particulier, précisez-le lors de votre demande.",
  },
);

export const homeFaq = faq.filter((f) => f.home);
