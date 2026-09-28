/**
 * Données de départ : compte administrateur, modèles de réponses, FAQ, paramètres.
 * Usage : npm run db:seed   (idempotent : n'écrase pas ce qui existe déjà)
 */
import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";
import { faq } from "../lib/content/faq";

const db = new PrismaClient();

const templates = [
  {
    name: "Demande de photos du tableau",
    subject: "Votre projet de borne · quelques photos pour préparer le devis ({{reference}})",
    body: `<p>Bonjour {{prenom}},</p><p>Merci pour votre demande. Afin de préparer un devis précis, pourriez-vous nous envoyer en réponse à cet e-mail quelques photos :</p><ul><li>de votre tableau électrique (porte ouverte) ;</li><li>de l'emplacement souhaité pour la borne ;</li><li>du trajet approximatif entre le tableau et cet emplacement.</li></ul><p>Si vous le connaissez, merci de nous indiquer aussi la puissance de votre abonnement (en kVA, visible sur votre facture).</p>`,
  },
  {
    name: "Proposition de visite technique",
    subject: "Visite technique pour votre borne de recharge ({{reference}})",
    body: `<p>Bonjour {{prenom}},</p><p>Pour vous proposer la solution la plus adaptée, nous vous proposons une visite technique à {{ville}}. Elle nous permet de vérifier votre installation électrique et l'emplacement de la borne.</p><p>Quels créneaux vous conviendraient dans les prochains jours ?</p>`,
  },
  {
    name: "Envoi du devis",
    subject: "Votre devis elec k ({{reference}})",
    body: `<p>Bonjour {{prenom}},</p><p>Suite à notre échange, vous trouverez ci-joint notre devis pour l'installation de votre solution de recharge.</p><p>Il détaille le matériel, les travaux et les aides auxquelles vous pouvez prétendre. Nous restons à votre disposition pour toute question.</p>`,
  },
  {
    name: "Relance J+7",
    subject: "Suite à notre devis ({{reference}})",
    body: `<p>Bonjour {{prenom}},</p><p>Nous revenons vers vous au sujet du devis que nous vous avons transmis. Avez-vous pu en prendre connaissance ?</p><p>Si vous avez des questions ou souhaitez ajuster votre projet, nous en discutons volontiers.</p>`,
  },
];

async function main() {
  // Compte administrateur
  const email = (process.env.SEED_ADMIN_EMAIL ?? "contact@eleck.fr").toLowerCase();
  if (!(await db.user.findUnique({ where: { email } }))) {
    const password = process.env.SEED_ADMIN_PASSWORD || randomBytes(12).toString("base64url");
    await db.user.create({
      data: {
        email,
        name: process.env.SEED_ADMIN_NAME ?? "Administrateur",
        role: "ADMIN",
        passwordHash: await hash(password, { memoryCost: 19456, timeCost: 2, parallelism: 1 }),
      },
    });
    console.log(`✓ Administrateur créé : ${email}`);
    if (!process.env.SEED_ADMIN_PASSWORD) console.log(`  Mot de passe généré (à changer dès la première connexion) : ${password}`);
  } else console.log(`• Administrateur ${email} déjà présent`);

  if ((await db.template.count()) === 0) {
    await db.template.createMany({ data: templates.map((t, order) => ({ ...t, order })) });
    console.log(`✓ ${templates.length} modèles de réponses`);
  }

  // FAQ : ajoute les questions absentes (par intitulé), sans toucher à celles modifiées dans le dashboard
  const existing = new Set((await db.faqItem.findMany({ select: { question: true } })).map((f) => f.question));
  const missing = faq.map((f, order) => ({ ...f, order })).filter((f) => !existing.has(f.q));
  if (missing.length) {
    await db.faqItem.createMany({
      data: missing.map((f) => ({ question: f.q, answer: f.a, category: f.category, showOnHome: Boolean(f.home), order: f.order })),
    });
    console.log(`✓ ${missing.length} question(s) de FAQ ajoutée(s)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
