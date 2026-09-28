/** Illustrations vectorielles (décoratives) des activités d'elec k, aux couleurs de la marque. */

/** Luminaire LED linéaire et son faisceau. */
export function LedArt({ className, uid = "h" }: { className?: string; uid?: string }) {
  return (
    <svg viewBox="0 0 160 100" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${uid}-led-beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${uid}-led-glow`} x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <path d="M8 14H152" stroke="#fff" strokeOpacity="0.12" strokeWidth="2" />
      <path d="M44 14V27M116 14V27" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" />
      <path d="M26 36H134L156 100H4Z" fill={`url(#${uid}-led-beam)`} />
      <rect x="22" y="26" width="116" height="9" rx="3" fill="#2a2a2a" stroke="#fff" strokeOpacity="0.2" />
      <rect x="26" y="33" width="108" height="3" rx="1.5" fill="#fff" filter={`url(#${uid}-led-glow)`} />
      <rect x="26" y="33" width="108" height="3" rx="1.5" fill="#fff" />
      <rect x="22" y="26" width="10" height="9" rx="2" fill="#E30613" />
    </svg>
  );
}

/** Tableau électrique : rangées de disjoncteurs sur rail. */
export function PanelArt({ className }: { className?: string; uid?: string }) {
  const rows = [26, 52, 78];
  return (
    <svg viewBox="0 0 160 100" className={className} aria-hidden focusable="false">
      <rect x="26" y="6" width="108" height="90" rx="7" fill="#1c1c1c" stroke="#fff" strokeOpacity="0.15" />
      {rows.map((y, r) => (
        <g key={y}>
          <path d={`M34 ${y}H126`} stroke="#fff" strokeOpacity="0.12" strokeWidth="2" />
          {Array.from({ length: 8 }).map((_, i) => {
            const red = r === 0 && i === 0;
            return (
              <g key={i}>
                <rect x={35 + i * 11.2} y={y - 9} width="9" height="18" rx="1.5" fill={red ? "#E30613" : "#2e2e2e"} stroke="#fff" strokeOpacity="0.1" />
                <rect x={37.5 + i * 11.2} y={y - 4 + ((i + r) % 3 === 0 ? 3 : 0)} width="4" height="5" rx="1" fill="#fff" fillOpacity={red ? 0.95 : 0.6} />
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

/** Image thermique d'un tableau : point chaud, viseur et échelle de température. */
export function ThermoArt({ className, uid = "h" }: { className?: string; uid?: string }) {
  return (
    <svg viewBox="0 0 320 100" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${uid}-th-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1b1a4a" />
          <stop offset="1" stopColor="#3a1553" />
        </linearGradient>
        <radialGradient id={`${uid}-th-hot`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff7b0" />
          <stop offset="0.25" stopColor="#ffb300" />
          <stop offset="0.5" stopColor="#ff3b30" />
          <stop offset="0.78" stopColor="#8e24aa" stopOpacity="0.8" />
          <stop offset="1" stopColor="#8e24aa" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-th-scale`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#1b1a4a" />
          <stop offset="0.35" stopColor="#8e24aa" />
          <stop offset="0.65" stopColor="#ff3b30" />
          <stop offset="0.85" stopColor="#ffb300" />
          <stop offset="1" stopColor="#fff7b0" />
        </linearGradient>
        <clipPath id={`${uid}-th-clip`}>
          <rect x="6" y="6" width="270" height="88" rx="8" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}-th-clip)`}>
        <rect x="6" y="6" width="270" height="88" fill={`url(#${uid}-th-bg)`} />
        {/* silhouettes des disjoncteurs (plus froids) */}
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x={30 + i * 22} y="30" width="16" height="40" rx="2" fill="#4a2a78" fillOpacity="0.8" />
        ))}
        <circle cx="162" cy="50" r="46" fill={`url(#${uid}-th-hot)`} />
      </g>
      <rect x="6" y="6" width="270" height="88" rx="8" fill="none" stroke="#fff" strokeOpacity="0.15" />
      {/* viseur */}
      <g stroke="#fff" strokeWidth="1.5" fill="none">
        <circle cx="162" cy="50" r="9" />
        <path d="M162 34v8M162 58v8M146 50h8M170 50h8" />
      </g>
      <rect x="182" y="16" width="52" height="18" rx="4" fill="#0A0A0A" fillOpacity="0.75" />
      <text x="208" y="29" textAnchor="middle" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600" fill="#fff">
        Point chaud
      </text>
      {/* échelle */}
      <rect x="288" y="10" width="10" height="80" rx="3" fill={`url(#${uid}-th-scale)`} />
      <path d="M302 14h8M302 86h8" stroke="#fff" strokeOpacity="0.4" />
    </svg>
  );
}
