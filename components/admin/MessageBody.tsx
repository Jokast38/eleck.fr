"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImageIcon } from "lucide-react";

/**
 * Affiche le HTML d'un e-mail dans une iframe isolée :
 * aucun script ne peut s'exécuter (pas de allow-scripts), CSP stricte, liens ouverts dans un nouvel onglet.
 * Les images distantes (souvent des pixels de suivi) ne sont chargées qu'à la demande.
 */
export function MessageBody({ html, htmlWithImages, text }: { html?: string | null; htmlWithImages?: string | null; text?: string | null }) {
  const [images, setImages] = useState(false);
  const [height, setHeight] = useState(160);
  const ref = useRef<HTMLIFrameElement>(null);

  // Ajuste la hauteur au contenu. L'iframe peut finir de charger avant l'hydratation React :
  // on mesure donc aussi au montage, puis à chaque redimensionnement du contenu (images, polices).
  const measure = useCallback(() => {
    const doc = ref.current?.contentDocument;
    if (!doc?.body) return;
    setHeight(Math.min(doc.body.scrollHeight + 8, 6000));
    const w = doc.defaultView as (Window & typeof globalThis) | null;
    if (w && !doc.body.dataset.observed) {
      doc.body.dataset.observed = "1";
      new w.ResizeObserver(() => setHeight(Math.min(doc.body.scrollHeight + 8, 6000))).observe(doc.body);
    }
  }, []);

  useEffect(() => {
    if (ref.current?.contentDocument?.readyState === "complete") measure();
  }, [measure, images]);

  if (!html) return <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap">{text || "(message vide)"}</pre>;

  const body = images && htmlWithImages ? htmlWithImages : html;
  const doc = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self' data: ${images ? "https: http:" : ""}; style-src 'unsafe-inline'; font-src data:"><base target="_blank"><style>html,body{margin:0}body{font:14px/1.6 Helvetica,Arial,sans-serif;color:#171717;word-wrap:break-word}img{max-width:100%;height:auto}table{max-width:100%}</style></head><body>${body}</body></html>`;

  return (
    <div>
      {htmlWithImages && htmlWithImages !== html && !images && (
        <button type="button" onClick={() => setImages(true)} className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-mist px-3 py-1.5 text-xs font-medium hover:bg-black/10">
          <ImageIcon aria-hidden className="size-3.5" /> Afficher les images distantes
        </button>
      )}
      <iframe
        ref={ref}
        title="Contenu de l'e-mail"
        sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        srcDoc={doc}
        className="w-full border-0"
        style={{ height }}
        onLoad={measure}
      />
    </div>
  );
}
