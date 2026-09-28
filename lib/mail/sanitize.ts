import "server-only";
import sanitizeHtml from "sanitize-html";
import { SITE_URL } from "@/lib/site";

/** HTML rédigé dans l'éditeur du dashboard : liste blanche stricte avant envoi. */
export function sanitizeOutgoing(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "s", "a", "ul", "ol", "li", "blockquote", "h2", "h3", "hr"],
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    transformTags: { a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" }) },
  });
}

/**
 * HTML d'un e-mail reçu, affiché dans une iframe isolée (sandbox, sans script).
 * On conserve la mise en forme (tableaux, styles en ligne) mais on retire scripts, formulaires,
 * iframes et gestionnaires d'événements. Les images distantes sont bloquées par défaut (pixels de suivi).
 */
export function sanitizeIncoming(html: string, { remoteImages = false } = {}) {
  // Nos propres images (logo des e-mails envoyés) : URL relatives, donc affichées sans charger de ressource tierce
  const own = html.replaceAll(`src="${SITE_URL}/`, 'src="/');
  return sanitizeHtml(own, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "font", "center", "span", "div", "table", "thead", "tbody", "tfoot", "tr", "td", "th", "style"]),
    allowedAttributes: {
      "*": ["style", "align", "valign", "width", "height", "bgcolor", "color", "border", "cellpadding", "cellspacing", "dir", "class"],
      a: ["href", "title", "target"],
      img: ["src", "alt", "title", "width", "height"],
      font: ["face", "size", "color"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel", "cid"],
    allowedSchemesByTag: { img: remoteImages ? ["http", "https", "data"] : ["data"] },
    allowVulnerableTags: true, // <style> est autorisé : l'iframe sandbox empêche toute exécution
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" }),
    },
    // Les pièces jointes intégrées, réécrites en /api/admin/files/… à l'import, sont des URL relatives : conservées
    exclusiveFilter: (frame) => frame.tag === "img" && !frame.attribs.src,
  });
}

/** Échappe du texte brut pour l'insérer dans du HTML (citation d'un message texte). */
export const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
