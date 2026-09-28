// Génère logo.svg, logo-white.svg, icon.svg, favicon.ico, apple-icon.png et icônes du manifest.
// Usage : node scripts/generate-brand-assets.mjs
import { writeFileSync } from "node:fs";
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { LOGO_VIEWBOX, LOGO_STROKE, LOGO_LETTERS, LOGO_UNDERLINE, RED } from "../brand/logo-paths.mjs";

const logo = (color, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bg ? "-20 -16 268 120" : LOGO_VIEWBOX}" role="img" aria-label="elec k">
${bg ? `<rect x="-20" y="-16" width="268" height="120" fill="${bg}"/>` : ""}<g fill="none" stroke="${color}" stroke-width="${LOGO_STROKE}" stroke-linecap="round" stroke-linejoin="round">
${LOGO_LETTERS.map((d) => `<path d="${d}"/>`).join("\n")}
</g>
<rect x="${LOGO_UNDERLINE.x}" y="${LOGO_UNDERLINE.y}" width="${LOGO_UNDERLINE.width}" height="${LOGO_UNDERLINE.height}" rx="1.5" fill="${RED}"/>
</svg>
`;

// Icône : « k » blanc souligné de rouge sur carré noir arrondi.
const icon = (radius = 12) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="${radius}" fill="#0A0A0A"/>
<g fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
<path d="M23 11V43M42 22L23 37M30 31.5L43 43"/>
</g>
<rect x="14" y="49" width="36" height="6" rx="1" fill="${RED}"/>
</svg>
`;

writeFileSync("public/logo.svg", logo("#0A0A0A")); // lettres noires (fond clair)
writeFileSync("public/logo-white.svg", logo("#FFFFFF")); // lettres blanches (fond sombre)
writeFileSync("public/logo-on-black.svg", logo("#FFFFFF", "#0A0A0A")); // version principale avec fond
writeFileSync("app/icon.svg", icon());

const png = (svg, size) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
writeFileSync("app/apple-icon.png", await png(icon(0), 180)); // iOS arrondit lui-même
writeFileSync("public/icon-192.png", await png(icon(), 192));
writeFileSync("public/icon-512.png", await png(icon(), 512));
writeFileSync("public/icon-maskable-512.png", await png(icon(0), 512));
writeFileSync("app/favicon.ico", await pngToIco([await png(icon(), 16), await png(icon(), 32), await png(icon(), 48)]));
await sharp(Buffer.from(logo("#FFFFFF", "#0A0A0A"))).resize(1072).png().toFile("brand/logo-on-black.png");
console.log("Assets de marque générés.");
