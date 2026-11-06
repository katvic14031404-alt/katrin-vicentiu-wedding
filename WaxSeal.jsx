import { useId, useMemo } from 'react';
import { wedding } from '../../config/wedding';

/** Irregular, poured-wax outline (deterministic so it never "jumps"). */
function waxPath(cx, cy, r) {
  const pts = [];
  const n = 48;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const wobble = Math.sin(a * 5) * 2.4 + Math.sin(a * 9 + 1.3) * 1.6 + Math.cos(a * 3 + 0.7) * 2.2;
    pts.push([cx + Math.cos(a) * (r + wobble), cy + Math.sin(a) * (r + wobble)]);
  }
  return `M${pts.map((p) => p.map((v) => v.toFixed(2)).join(' ')).join(' L')} Z`;
}

export default function WaxSeal({ size = 120, className, style }) {
  const id = useId().replace(/:/g, '');
  const outline = useMemo(() => waxPath(60, 60, 54), []);
  const [a, b] = wedding.couple.initials;

  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className} style={style} aria-hidden="true">
      <defs>
        <radialGradient id={`wax-${id}`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#4d6a52" />
          <stop offset="45%" stopColor="#2c4434" />
          <stop offset="100%" stopColor="#14201a" />
        </radialGradient>
        <radialGradient id={`sheen-${id}`} cx="35%" cy="28%" r="40%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id={`emboss-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="-0.6" dy="-0.6" stdDeviation="0.3" floodColor="#000" floodOpacity="0.55" />
          <feDropShadow dx="0.6" dy="0.8" stdDeviation="0.4" floodColor="#e9d6a8" floodOpacity="0.35" />
        </filter>
        <filter id={`drop-${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1a140a" floodOpacity="0.35" />
        </filter>
      </defs>

      <g filter={`url(#drop-${id})`}>
        <path d={outline} fill={`url(#wax-${id})`} />
      </g>
      {/* pressed inner disc */}
      <circle cx="60" cy="60" r="40" fill="#1f3127" opacity="0.55" />
      <circle cx="60" cy="60" r="40" fill="none" stroke="#56755c" strokeOpacity="0.55" strokeWidth="1" />
      <circle cx="60" cy="60" r="35.5" fill="none" stroke="#0e1712" strokeOpacity="0.6" strokeWidth="0.6" strokeDasharray="1 2.2" />

      {/* monogram */}
      <g filter={`url(#emboss-${id})`} fill="#cdb386" fontFamily="'Cormorant Garamond', serif">
        <text x="45" y="68" fontSize="30" fontStyle="italic" fontWeight="500" textAnchor="middle">{a}</text>
        <text x="60" y="64" fontSize="14" fontStyle="italic" textAnchor="middle" opacity="0.85">&amp;</text>
        <text x="75" y="68" fontSize="30" fontStyle="italic" fontWeight="500" textAnchor="middle">{b}</text>
        {/* tiny laurel under monogram */}
        <path d="M48 78 Q60 84 72 78" stroke="#cdb386" strokeWidth="0.8" fill="none" />
        <circle cx="60" cy="82" r="1" />
      </g>

      <path d={outline} fill={`url(#sheen-${id})`} />
    </svg>
  );
}
