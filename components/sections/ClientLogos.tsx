import Image from "next/image";
import { clients, type Client } from "@/lib/content/clients";

function Item({ c, decorative }: { c: Client; decorative?: boolean }) {
  return (
    <li className="flex h-16 shrink-0 items-center px-8 sm:px-10">
      {c.logo ? (
        <Image
          src={c.logo.src}
          alt={decorative ? "" : c.name}
          width={c.logo.width}
          height={c.logo.height}
          unoptimized={c.logo.src.endsWith(".svg")}
          className="h-9 w-auto max-w-[10rem] object-contain opacity-75 grayscale transition duration-300 group-hover/marquee:opacity-90 hover:!opacity-100 hover:grayscale-0"
        />
      ) : (
        // Pas de logo officiel disponible : nom en texte, sans imitation de charte graphique
        <span className="font-display text-xl font-semibold tracking-wide whitespace-nowrap text-[#737373] uppercase">
          {c.name}
        </span>
      )}
    </li>
  );
}

/**
 * Bandeau défilant des références clients (CSS pur, aucun JavaScript).
 * La liste est dupliquée pour une boucle continue ; la copie est masquée aux lecteurs d'écran.
 * Pause au survol ; avec prefers-reduced-motion, les logos s'affichent en grille fixe.
 */
export function ClientLogos({ title = "Ils nous ont fait confiance" }: { title?: string }) {
  if (clients.length === 0) return null;
  return (
    <section aria-labelledby="clients" className="on-light border-b border-black/10 bg-white py-10 text-ink">
      <h2 id="clients" className="text-center text-sm font-semibold tracking-[0.14em] text-muted-dark uppercase">
        {title}
      </h2>
      <div className="marquee group/marquee mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee-track flex w-max">
          <ul className="flex">
            {clients.map((c) => (
              <Item key={c.name} c={c} />
            ))}
          </ul>
          <ul className="marquee-copy flex" aria-hidden="true">
            {clients.map((c) => (
              <Item key={c.name} c={c} decorative />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
