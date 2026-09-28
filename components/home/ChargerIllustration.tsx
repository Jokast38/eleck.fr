/** Illustration vectorielle d'une borne murale aux couleurs d'elec k (décorative). */
export function ChargerIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 480" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id="ci-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#343434" />
          <stop offset="1" stopColor="#141414" />
        </linearGradient>
        <linearGradient id="ci-cable" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1c1c1c" />
          <stop offset="1" stopColor="#303030" />
        </linearGradient>
        <filter id="ci-glow" x="-50%" y="-200%" width="200%" height="500%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Ombre au sol */}
      <ellipse cx="205" cy="455" rx="150" ry="14" fill="#000" opacity="0.6" />

      {/* Plaque murale */}
      <rect x="92" y="40" width="216" height="300" rx="44" fill="#fff" opacity="0.035" />

      {/* Corps de la borne */}
      <rect x="110" y="58" width="180" height="264" rx="36" fill="url(#ci-body)" stroke="#fff" strokeOpacity="0.12" />
      <rect x="110" y="58" width="180" height="264" rx="36" fill="none" stroke="#fff" strokeOpacity="0.06" strokeWidth="8" />

      {/* Écran */}
      <rect x="138" y="96" width="124" height="76" rx="12" fill="#0A0A0A" stroke="#fff" strokeOpacity="0.08" />
      <path d="M204 110l-18 26h14l-6 22 20-30h-14l4-18z" fill="#E30613" />
      <rect x="152" y="160" width="96" height="4" rx="2" fill="#fff" opacity="0.12" />
      <rect x="152" y="160" width="64" height="4" rx="2" fill="#E30613" />

      {/* Bandeau lumineux */}
      <rect x="150" y="198" width="100" height="6" rx="3" fill="#E30613" filter="url(#ci-glow)" opacity="0.9" />
      <rect x="150" y="198" width="100" height="6" rx="3" fill="#FF4D57" />

      {/* Prise / support de pistolet */}
      <circle cx="200" cy="258" r="30" fill="#0A0A0A" stroke="#fff" strokeOpacity="0.14" />
      <circle cx="200" cy="258" r="16" fill="#1f1f1f" />
      <circle cx="193" cy="253" r="3" fill="#444" />
      <circle cx="207" cy="253" r="3" fill="#444" />
      <circle cx="200" cy="265" r="3" fill="#444" />

      {/* Rappel du logo : « k » souligné */}
      <g stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.85">
        <path d="M195 290v16M204 295l-9 7M198.5 300.5l6 5.5" />
      </g>
      <rect x="191" y="309" width="17" height="3" fill="#E30613" />

      {/* Câble */}
      <path
        d="M200 322c0 40-8 58-44 70-40 13-78 30-60 52 22 26 150 18 196-6 40-21 28-62-14-66-30-3-44 10-44 28"
        fill="none"
        stroke="url(#ci-cable)"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M200 322c0 40-8 58-44 70-40 13-78 30-60 52 22 26 150 18 196-6 40-21 28-62-14-66-30-3-44 10-44 28"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.08"
        strokeWidth="3"
        strokeLinecap="round"
        transform="translate(-2 -3)"
      />
      {/* Pistolet */}
      <rect x="220" y="392" width="30" height="46" rx="10" fill="#222" stroke="#fff" strokeOpacity="0.15" transform="rotate(-18 235 415)" />
    </svg>
  );
}
