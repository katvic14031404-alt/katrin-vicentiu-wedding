import './ornaments.css';

/**
 * Vintage postage stamp with real perforated edges (CSS mask).
 * Motifs are abstract and understated — no flags, no tourist clichés:
 *  peaks – the Carpathian ridge   (România)
 *  oak   – an oak leaf & acorn    (Deutschland)
 *  tulip – a single line-drawn tulip over polder lines (Nederland)
 */
const motifs = {
  peaks: (
    <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round">
      <circle cx="44" cy="22" r="6" strokeWidth="0.9" />
      <path d="M4 58 L18 36 L25 44 L36 26 L48 46 L54 40 L68 58" />
      <path d="M16 58 L28 46 L36 52 L46 42 L60 58" opacity="0.5" />
      <path d="M4 62 H68" strokeWidth="0.6" />
    </g>
  ),
  oak: (
    <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M36 62 V20" />
      <path d="M36 22 C30 22 28 26 30 29 C25 29 23 34 27 37 C22 38 21 43 26 45 C22 47 23 52 29 52 C31 56 34 56 36 54 C38 56 41 56 43 52 C49 52 50 47 46 45 C51 43 50 38 45 37 C49 34 47 29 42 29 C44 26 42 22 36 22 Z" />
      <path d="M36 30 L31 33 M36 38 L29 41 M36 46 L31 48 M36 30 L41 33 M36 38 L43 41 M36 46 L41 48" strokeWidth="0.6" />
      <ellipse cx="50" cy="60" rx="3.2" ry="4" />
      <path d="M46.6 57.5 Q50 54 53.4 57.5" />
    </g>
  ),
  tulip: (
    <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M36 52 V30" />
      <path d="M28 18 C28 28 31 32 36 32 C41 32 44 28 44 18 L40 22 L36 16 L32 22 Z" />
      <path d="M36 44 C30 42 27 36 26 33 C31 34 34 38 36 44" />
      <path d="M6 56 H66 M10 60 H62 M14 64 H58" strokeWidth="0.6" />
    </g>
  ),
};

export default function Stamp({ motif = 'peaks', country, value, tone = 'olive', rotate = 0, className = '', style }) {
  return (
    <div className={`stamp-wrap ${className}`} style={{ transform: `rotate(${rotate}deg)`, ...style }}>
      <div className={`stamp stamp--${tone}`}>
        <div className="stamp__inner">
          <span className="stamp__value">{value}</span>
          <svg viewBox="0 0 72 72" className="stamp__motif" aria-hidden="true">
            {motifs[motif]}
          </svg>
          <span className="stamp__country">{country}</span>
        </div>
      </div>
    </div>
  );
}
