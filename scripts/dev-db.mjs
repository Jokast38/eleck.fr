// Base PostgreSQL locale pour le développement, sans Docker ni installation système.
// Usage : npm run db:dev   (laisser tourner dans un terminal)
// Données dans ./.pgdata — URL : postgresql://eleck:eleck@localhost:5433/eleck
import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "node:fs";

const pg = new EmbeddedPostgres({
  databaseDir: "./.pgdata",
  user: "eleck",
  password: "eleck",
  port: 5433,
  persistent: true,
  // UTF-8 obligatoire (sinon Windows initialise la base en WIN1252 et refuse certains caractères)
  initdbFlags: ["--encoding=UTF8", "--locale=C"],
});

const fresh = !existsSync("./.pgdata/PG_VERSION");
if (fresh) await pg.initialise();
await pg.start();
if (fresh) await pg.createDatabase("eleck");
console.log("PostgreSQL prêt : postgresql://eleck:eleck@localhost:5433/eleck (Ctrl+C pour arrêter)");

const stop = async () => {
  await pg.stop();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
