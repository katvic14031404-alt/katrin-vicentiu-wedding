import { useId } from 'react';
import { wedding } from '../../config/wedding';

/** Circular cancellation postmark with wavy lines. */
export default function Postmark({ city = wedding.postmark.city, date = wedding.postmark.date, waves = true, className, style }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 230 110" className={className} style={style} aria-hidden="true">
      <defs>
        <path id={`top-${id}`} d="M 17 55 A 38 38 0 0 1 93 55" />
        <path id={`bot-${id}`} d="M 14 55 A 41 41 0 0 0 96 55" />
      </defs>
      <g fill="none" stroke="currentColor">
        <circle cx="55" cy="55" r="47" strokeWidth="1.4" />
        <circle cx="55" cy="55" r="29" strokeWidth="0.8" />
        {waves &&
          [0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M108 ${33 + i * 11} q 10 -6 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0`}
              strokeWidth="1.2"
            />
          ))}
      </g>
      <g fill="currentColor" fontFamily="'Jost', sans-serif" fontSize="8.2" letterSpacing="2.6">
        <text>
          <textPath href={`#top-${id}`} startOffset="50%" textAnchor="middle">{city}</textPath>
        </text>
        <text dominantBaseline="hanging">
          <textPath href={`#bot-${id}`} startOffset="50%" textAnchor="middle">EUROPA</textPath>
        </text>
        <text x="55" y="53" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="12" letterSpacing="0.5" fontStyle="italic">
          {date.split(' · ').slice(0, 2).join(' · ')}
        </text>
        <text x="55" y="66" textAnchor="middle" fontSize="7" letterSpacing="2">{date.split(' · ')[2]}</text>
      </g>
    </svg>
  );
}
