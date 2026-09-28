# elec k : site vitrine et dashboard

Site de l'installateur de bornes de recharge **elec k** (Herblay-sur-Seine, certifié IRVE) :

- **site public** optimisé pour le référencement local, avec un seul objectif : obtenir des demandes de devis ;
- **dashboard privé** (`/admin`) : demandes et pipeline commercial, **messagerie professionnelle intégrée** (envoi SMTP, réception IMAP en temps réel), réalisations, FAQ, modèles d'e-mails, utilisateurs.

Stack : Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Prisma + PostgreSQL · Auth.js v5 · Nodemailer · ImapFlow · React Email · React Hook Form + Zod · TipTap.

---

## 1. Installation locale

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
cp .env.example .env        # puis compléter (voir section 2)
npm run db:dev              # PostgreSQL local sur le port 5433 (laisser ouvert dans un terminal)
npm run db:push             # crée les tables
npm run db:seed             # compte admin, modèles d'e-mails, FAQ
npm run dev                 # http://localhost:3000
```

`npm run db:dev` lance un vrai PostgreSQL, sans Docker ni installation système (données dans `.pgdata/`). Si vous préférez Docker : `docker compose up -d`.

Le dashboard est sur `/admin`. Identifiants : `SEED_ADMIN_EMAIL` et `SEED_ADMIN_PASSWORD` (si vide, un mot de passe est généré et affiché par le seed). **Changez-le et activez la double authentification dans « Mon compte » dès la première connexion.**

### Commandes utiles

| Commande | Rôle |
|---|---|
| `npm run db:studio` | Interface de consultation de la base |
| `npm run db:migrate` | Crée une migration (à utiliser avant la mise en production) |
| `node scripts/check-pages.mjs <url>` | Audit SEO de toutes les pages (H1 unique, title, description, canonical, alt, liens cassés) |
| `node scripts/screenshots.mjs <url> <dossier> "/,/devis"` | Captures à 360, 768, 1024 et 1440 px avec détection des débordements |
| `node scripts/generate-brand-assets.mjs` | Régénère logos, favicon et icônes |

---

## 2. Variables d'environnement

Toutes sont décrites dans [`.env.example`](.env.example). Aucune clé secrète n'est exposée au navigateur : seules les variables `NEXT_PUBLIC_` le sont, et elles ne contiennent que des informations publiques.

| Variable | Obligatoire | Rôle |
|---|---|---|
| `DATABASE_URL` | oui | Connexion PostgreSQL |
| `AUTH_SECRET` | oui | Secret des sessions et du chiffrement des secrets 2FA (`npx auth secret`) |
| `AUTH_URL` | en prod | URL publique du site (ex. `https://eleck.fr`) |
| `SMTP_*`, `MAIL_FROM` | oui | Envoi des e-mails |
| `IMAP_*` | oui | Réception des e-mails dans le dashboard |
| `MAIL_NOTIFY_TO` | oui | Adresse(s) prévenue(s) à chaque nouvelle demande (modifiable ensuite dans Paramètres) |
| `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | en prod | Anti-spam du formulaire ([Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile), gratuit) |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | en prod | Limite de 5 demandes par heure et par IP ([Upstash](https://upstash.com), offre gratuite suffisante) |
| `CRON_SECRET` | en prod | Protège la tâche de synchronisation mail |
| `REQUIRE_2FA` | recommandé | `true` : double authentification obligatoire pour tous les comptes |
| `MAIL_IDLE_ALWAYS` | VPS | `true` sur un serveur permanent (voir section 3) |
| `NEXT_PUBLIC_SITE_URL` | oui | URL canonique du site |

---

## 3. Messagerie (SMTP + IMAP)

Renseignez les paramètres de la boîte `contact@eleck.fr`, fournis par votre hébergeur de messagerie :

| Fournisseur | SMTP | IMAP |
|---|---|---|
| OVHcloud (MX Plan / E-mail Pro) | `ssl0.ovh.net` : 465, SSL | `ssl0.ovh.net` : 993, SSL |
| Google Workspace | `smtp.gmail.com` : 465 (mot de passe d'application) | `imap.gmail.com` : 993 |
| Microsoft 365 | `smtp.office365.com` : 587, `SMTP_SECURE=false` (STARTTLS) | `outlook.office365.com` : 993 |
| Ionos | `smtp.ionos.fr` : 465 | `imap.ionos.fr` : 993 |

> Microsoft 365 et Google peuvent exiger l'activation de l'authentification SMTP/IMAP ou un mot de passe d'application sur le compte.

### Fonctionnement

- **Envoi** : chaque e-mail part en SMTP depuis la boîte pro, avec la signature des Paramètres. Il est ensuite **copié dans « Envoyés »** (IMAP APPEND) : il apparaît aussi dans Outlook ou sur votre téléphone.
- **Fils de discussion** : les réponses portent les en-têtes `In-Reply-To` et `References`, donc le prospect voit un seul fil dans sa messagerie.
- **Réception en temps réel** : tant qu'un dashboard est ouvert, une connexion **IMAP IDLE** est maintenue. Le serveur de messagerie signale chaque nouvel e-mail, qui est importé, **rattaché automatiquement à la demande** du prospect (par son adresse), puis poussé au navigateur (Server-Sent Events). Le dashboard affiche une notification, et une notification système si l'onglet est en arrière-plan et que vous l'avez autorisée.
- **Dashboard fermé** :
  - sur **Vercel**, la tâche planifiée `/api/cron/mail-sync` (fichier `vercel.json`) synchronise la boîte une fois par jour, seule fréquence permise par l'offre gratuite Hobby. Pour une synchronisation toutes les 5 minutes sans passer à l'offre Pro, utilisez un service gratuit comme [cron-job.org](https://cron-job.org) : il appelle `https://eleck.fr/api/cron/mail-sync` avec l'en-tête `Authorization: Bearer <CRON_SECRET>`. La réception reste instantanée quand le dashboard est ouvert.
  - sur un **VPS ou Docker**, mettez `MAIL_IDLE_ALWAYS=true` : l'écoute IMAP IDLE reste active en permanence.
- **Première synchronisation** : seuls les `IMAP_INITIAL_DAYS` derniers jours sont importés (90 par défaut).
- **Lu / non lu** : l'état est synchronisé dans les deux sens avec le serveur IMAP.
- **Sécurité de l'affichage** : les e-mails reçus s'affichent dans une zone isolée (iframe sans script, HTML nettoyé). Les images distantes, souvent des pixels de suivi, ne se chargent que sur demande.

### Test sans boîte réelle

[Ethereal](https://ethereal.email) fournit une boîte de test SMTP + IMAP gratuite : aucun message n'est réellement délivré. Pour créer un compte : `node -e "require('nodemailer').createTestAccount().then(console.log)"`.

---

## 4. DNS : délivrabilité des e-mails (SPF, DKIM, DMARC)

Sans ces enregistrements, les accusés de réception risquent d'arriver en spam. À configurer chez le gestionnaire du domaine `eleck.fr` :

| Type | Nom | Valeur (exemple, à adapter à votre hébergeur mail) |
|---|---|---|
| TXT | `eleck.fr` | `v=spf1 include:mx.ovh.com ~all` (OVH) · `include:_spf.google.com` (Google) · `include:spf.protection.outlook.com` (Microsoft) |
| TXT / CNAME | fourni par l'hébergeur | Clé **DKIM** : à activer dans l'interface de votre messagerie |
| TXT | `_dmarc.eleck.fr` | `v=DMARC1; p=quarantine; rua=mailto:contact@eleck.fr; adkim=s; aspf=s` |

Pour vérifier, envoyez un e-mail depuis le dashboard à une adresse fournie par [mail-tester.com](https://www.mail-tester.com) : visez 9/10 ou plus.

---

## 5. Déploiement sur Vercel

1. Créez une base PostgreSQL : [Neon](https://neon.tech) (région Francfort ou Paris) ou Vercel Postgres.
2. Poussez le code sur GitHub, puis importez le projet sur [vercel.com](https://vercel.com/new).
3. Ajoutez toutes les variables de la section 2 (Settings → Environment Variables), avec `AUTH_URL` et `NEXT_PUBLIC_SITE_URL` à `https://eleck.fr`.
4. Initialisez la base, une seule fois, depuis votre poste avec la `DATABASE_URL` de production : `npx prisma migrate deploy` (ou `npx prisma db push`), puis `npm run db:seed`.
5. Déployez. Vérifiez ensuite, dans Vercel → Settings → Cron Jobs, que la tâche `mail-sync` apparaît.

Limites propres à Vercel, déjà prises en compte dans le code :
- **Taille des requêtes** : 4,5 Mo maximum. Les photos du formulaire sont réduites dans le navigateur avant l'envoi, et les pièces jointes sont limitées à 4 Mo.
- **Durée des fonctions** : les connexions temps réel se ferment après environ 5 minutes. Le navigateur se reconnecte automatiquement.

### Branchement du domaine

Dans Vercel → Settings → Domains, ajoutez `eleck.fr` et `www.eleck.fr`, puis choisissez la redirection `www → eleck.fr` : une seule version canonique, en HTTPS forcé. Chez le registrar, créez les enregistrements indiqués par Vercel (A `76.76.21.21` pour la racine, CNAME `cname.vercel-dns.com` pour `www`). **Ne modifiez pas les enregistrements MX**, qui servent à votre messagerie.

### Google Search Console

1. Sur [search.google.com/search-console](https://search.google.com/search-console), ajoutez la propriété de domaine `eleck.fr` et validez-la avec l'enregistrement TXT proposé.
2. Soumettez le sitemap `https://eleck.fr/sitemap.xml` (généré à l'étape SEO).
3. Créez ou mettez à jour la fiche **Google Business Profile** avec exactement la même adresse et le même téléphone que le site (cohérence « NAP »), puis renseignez son lien dans `NEXT_PUBLIC_GOOGLE_REVIEWS_URL`.

---

## 6. Architecture

```
app/
  (site)/            site public (pages statiques régénérées : SSG / ISR)
  (admin)/admin/     dashboard (connexion + pages protégées)
  api/leads          réception des demandes de devis
  api/admin/…        API du dashboard (e-mails, fichiers, export CSV, temps réel)
  api/cron/mail-sync synchronisation planifiée de la boîte
components/          interface (site, formulaires, dashboard)
emails/              modèles d'e-mails React Email
lib/                 logique serveur : auth, mail (smtp, imap, watcher, sync), leads, contenu, sécurité
prisma/              schéma et seed
scripts/             base locale, audits, captures, génération des visuels
```

### Sécurité, en résumé

- **Formulaire** :
  - validation Zod identique côté navigateur et côté serveur ;
  - nettoyage des champs ;
  - anti-spam : Turnstile, champ piège invisible, temps de remplissage minimal, limitation de débit ;
  - type réel des fichiers contrôlé sur leur contenu (et non sur leur extension).
- **Dashboard** :
  - mots de passe hachés en Argon2id ;
  - double authentification TOTP, avec le secret chiffré en base ;
  - compte verrouillé 15 minutes après 5 échecs ;
  - sessions dans des cookies `httpOnly` / `secure` / `sameSite` ;
  - protection CSRF (Server Actions et contrôle d'origine des API) ;
  - droits revérifiés en base à chaque requête ;
  - journal d'activité ;
  - `noindex` et en-tête `X-Robots-Tag`.
- **Données personnelles** : IP des visiteurs hachée, jamais stockée en clair. Suppression définitive d'une demande possible (droit à l'effacement).
