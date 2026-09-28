// Audit SEO / accessibilité de base sur toutes les pages accessibles depuis l'accueil (crawl interne).
// Vérifie : statut HTTP, un seul <h1>, title ≤ 60, description ≤ 155, canonical, alt des images,
// liens internes cassés, titles/descriptions dupliqués.
// Usage : node scripts/check-pages.mjs [baseUrl]   (code de sortie 1 si erreur)
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const seen = new Map(); // chemin -> résultat
const queue = ["/"];
const errors = [];
const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  const res = await fetch(base + path, { redirect: "manual" });
  const html = res.headers.get("content-type")?.includes("text/html") ? await res.text() : "";
  const r = { status: res.status };
  seen.set(path, r);
  if (res.status >= 400) continue;
  if (!html) continue;

  r.title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  r.description = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
  r.canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  r.noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
  r.h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  r.imgNoAlt = (html.match(/<img(?![^>]*\balt=)[^>]*>/g) ?? []).length;

  for (const m of html.matchAll(/<a[^>]+href="([^"#?]+)[^"]*"/g)) {
    const href = m[1];
    if (href.startsWith("/") && !href.startsWith("//") && !/\.(png|svg|ico|jpg|webp|pdf)$/.test(href)) {
      if (!seen.has(href) && !queue.includes(href)) queue.push(href);
      (r.links ??= new Set()).add(href);
    }
  }
}

const rows = [];
for (const [path, r] of seen) {
  const issues = [];
  if (r.status >= 400) issues.push(`HTTP ${r.status}`);
  if (r.status < 400 && r.title !== undefined) {
    if (r.h1 !== 1) issues.push(`${r.h1} h1`);
    if (!r.title) issues.push("title manquant");
    else if (r.title.length > 60) issues.push(`title ${r.title.length} car.`);
    if (!r.noindex) {
      if (!r.description) issues.push("description manquante");
      else if (r.description.length > 155) issues.push(`description ${r.description.length} car.`);
      if (!r.canonical) issues.push("canonical manquant");
    }
    if (r.imgNoAlt) issues.push(`${r.imgNoAlt} img sans alt`);
  }
  rows.push({ page: path, status: r.status, title: r.title?.length ?? "-", desc: r.description?.length ?? "-", h1: r.h1 ?? "-", issues: issues.join(", ") || "OK" });
  if (issues.length) errors.push(`${path} : ${issues.join(", ")}`);
}

// Liens cassés : pages liées qui renvoient une erreur
for (const [path, r] of seen) {
  for (const l of r.links ?? []) if ((seen.get(l)?.status ?? 0) >= 400) errors.push(`lien cassé ${path} → ${l}`);
}
// Doublons
for (const key of ["title", "description"]) {
  const by = new Map();
  for (const [p, r] of seen) if (r[key] && !r.noindex) by.set(r[key], [...(by.get(r[key]) ?? []), p]);
  for (const [v, ps] of by) if (ps.length > 1) errors.push(`${key} dupliqué sur ${ps.join(", ")} : « ${v.slice(0, 50)}… »`);
}

console.table(rows);
if (errors.length) {
  console.error(`\n${errors.length} problème(s) :\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`\n✓ ${seen.size} pages vérifiées, aucun problème.`);
