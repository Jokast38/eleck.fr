/**
 * Graphiques du dashboard, en HTML/CSS (aucune librairie) :
 * - une seule série → une seule couleur, pas de légende ; le titre nomme la série ;
 * - barres fines, extrémité arrondie de 4 px, 2 px d'espace entre barres, grille discrète ;
 * - info-bulle au survol ET au focus clavier ; chaque graphique a sa table de données.
 */

export function WeeklyBars({ data, label }: { data: { label: string; value: number; long: string }[]; label: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const ticks = niceTicks(max);
  const top = ticks[ticks.length - 1];
  return (
    <figure>
      <div className="relative h-52 pl-7">
        {/* Grille horizontale (traits fins, pleins) + graduations */}
        {ticks.map((t) => (
          <div key={t} className="absolute right-0 left-7 border-t border-black/[0.07]" style={{ bottom: `${(t / top) * 100}%` }}>
            <span className="absolute -top-2 -left-7 w-5 text-right text-[11px] text-muted-dark tabular-nums">{t}</span>
          </div>
        ))}
        <ol className="relative flex h-full items-end gap-[2px]" aria-label={label}>
          {data.map((d) => (
            <li key={d.long} className="group relative flex h-full flex-1 items-end justify-center">
              <button
                type="button"
                className="flex h-full w-full items-end justify-center focus-visible:outline-2"
                aria-label={`${d.long} : ${d.value} demande${d.value > 1 ? "s" : ""}`}
              >
                <span
                  className="block w-full max-w-6 rounded-t-[4px] bg-graphite-2 transition-colors group-hover:bg-brand group-focus-within:bg-brand"
                  style={{ height: `${(d.value / top) * 100}%`, minHeight: d.value ? 2 : 0 }}
                />
              </button>
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded-md bg-ink px-2.5 py-1.5 text-xs whitespace-nowrap text-white shadow-lg group-focus-within:block group-hover:block"
              >
                {d.long}
                <br />
                <strong>{d.value}</strong> demande{d.value > 1 ? "s" : ""}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-2 flex gap-[2px] pl-7" aria-hidden>
        {data.map((d, i) => (
          <span key={d.long} className="flex-1 text-center text-[11px] text-muted-dark">
            {i % 2 === 0 ? d.label : ""}
          </span>
        ))}
      </div>
      <DataTable caption={label} head={["Semaine", "Demandes"]} rows={data.map((d) => [d.long, String(d.value)])} />
    </figure>
  );
}

/** Barres horizontales étiquetées (répartition). Identité portée par le libellé, pas par la couleur. */
export function BarList({ data, label, total }: { data: { label: string; value: number }[]; label: string; total: number }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <figure>
      <ul className="space-y-3" aria-label={label}>
        {data.map((d) => {
          const pct = total ? Math.round((d.value / total) * 100) : 0;
          return (
            <li key={d.label}>
              <div className="flex justify-between text-sm">
                <span>{d.label}</span>
                <span className="text-muted-dark tabular-nums">
                  {d.value} · {pct} %
                </span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-black/[0.05]">
                <div className="h-2 rounded-full bg-graphite-2" style={{ width: `${(d.value / max) * 100}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
      <DataTable caption={label} head={["Catégorie", "Demandes", "Part"]} rows={data.map((d) => [d.label, String(d.value), `${total ? Math.round((d.value / total) * 100) : 0} %`])} />
    </figure>
  );
}

function DataTable({ caption, head, rows }: { caption: string; head: string[]; rows: string[][] }) {
  return (
    <details className="mt-4 text-sm">
      <summary className="cursor-pointer text-xs font-medium text-muted-dark hover:text-ink">Voir les données</summary>
      <table className="mt-2 w-full text-left text-xs">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-black/10 text-muted-dark">
            {head.map((h) => (
              <th key={h} className="py-1.5 pr-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-b border-black/5">
              {r.map((c, i) => (
                <td key={i} className="py-1.5 pr-3 tabular-nums">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

function niceTicks(max: number) {
  const step = max <= 4 ? 1 : max <= 10 ? 2 : max <= 25 ? 5 : Math.ceil(max / 5 / 10) * 10;
  const top = Math.ceil(max / step) * step;
  return Array.from({ length: top / step + 1 }, (_, i) => i * step);
}
