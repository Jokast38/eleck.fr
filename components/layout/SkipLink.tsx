/** Lien d'évitement : premier élément focusable, mène directement au contenu. */
export function SkipLink() {
  return (
    <a
      href="#contenu"
      className="sr-only z-[60] rounded-md bg-white px-4 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      Aller au contenu
    </a>
  );
}
