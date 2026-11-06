import { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { geoConicConformal } from 'd3-geo';
import { countries, MAP_W, MAP_H, projectionSettings } from './europeShapes';
import { wedding } from '../../config/wedding';
import { useLanguage } from '../../i18n/LanguageContext';
import './map.css';

/**
 * Hairline map of Europe with Germany, Romania and the Netherlands lit up,
 * connected by hand-drawn flight paths. A little airmail plane keeps flying
 * the last leg — back to Romania for the wedding.
 */
const projection = geoConicConformal()
  .parallels(projectionSettings.parallels)
  .rotate(projectionSettings.rotate)
  .scale(projectionSettings.scale)
  .translate(projectionSettings.translate);

const TINT = { de: '#4f6b52', ro: 'var(--gold)', nl: 'var(--olive)' };

function arc([x1, y1], [x2, y2], bend = 0.28) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  // control point perpendicular to the segment, always bulging "upwards"
  let nx = -dy;
  let ny = dx;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  return `M${x1} ${y1} Q ${mx + nx * bend} ${my + ny * bend} ${x2} ${y2}`;
}

// Caption tag positions live in map.css (.jmap__tag--nl/de/ro), with a
// separate, more compact arrangement for phones.

export default function JourneyMap() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();

  const pts = useMemo(() => Object.fromEntries(wedding.places.map((p) => [p.key, projection(p.coords)])), []);
  const routes = useMemo(
    () => wedding.route.map(([a, b], i) => ({ d: arc(pts[a], pts[b], i === 2 ? -0.22 : 0.3), last: i === wedding.route.length - 1 })),
    [pts]
  );

  const view = { initial: 'hidden', whileInView: 'shown', viewport: { once: true, margin: '-15% 0px' } };

  return (
    <div className="jmap">
      <div className="jmap__stage">
      <motion.svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="jmap__svg" role="img" aria-label="Germany, Romania, the Netherlands" {...view}>
        <defs>
          <radialGradient id="jmap-pin" cx="35%" cy="35%" r="70%">
            <stop offset="0" stopColor="#fff3cf" />
            <stop offset="0.5" stopColor="#d6b676" />
            <stop offset="1" stopColor="#9c7a43" />
          </radialGradient>
          <radialGradient id="jmap-fade" cx="50%" cy="50%" r="58%">
            <stop offset="0.62" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          <mask id="jmap-mask">
            <rect width={MAP_W} height={MAP_H} fill="url(#jmap-fade)" />
          </mask>
        </defs>

        {/* countries (edges fade softly into the paper) */}
        <g mask="url(#jmap-mask)">
          {countries.map((c, i) => (
            <motion.path
              key={i}
              d={c.d}
              className={c.id ? 'jmap__land jmap__land--focus' : 'jmap__land'}
              style={c.id ? { '--tint': TINT[c.id] } : undefined}
              variants={{
                hidden: { pathLength: 0, fillOpacity: 0 },
                shown: {
                  pathLength: 1,
                  fillOpacity: c.id ? 0.24 : 0.55,
                  transition: { pathLength: { duration: 2.2, ease: 'easeInOut' }, fillOpacity: { duration: 1.2, delay: c.id ? 1.4 : 0.8 } },
                },
              }}
            />
          ))}
        </g>

        {/* routes */}
        {routes.map((r, i) => (
          <g key={i}>
            <motion.path
              d={r.d}
              className={`jmap__route ${r.last ? 'jmap__route--wedding' : ''}`}
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                shown: { pathLength: 1, opacity: 1, transition: { duration: 1.3, delay: 1.8 + i * 1.1, ease: 'easeInOut' } },
              }}
            />
            {r.last && !reduce && (
              <motion.g
                variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { delay: 1.8 + i * 1.1 + 1.2 } } }}
              >
                <path id="jmap-wedding-route" d={r.d} fill="none" stroke="none" />
                {/* airmail paper plane */}
                <g className="jmap__plane">
                  <path d="M-9 -6 L10 0 L-9 6 L-5 0 Z" />
                  <path d="M-5 0 L10 0" className="jmap__plane-fold" />
                  <animateMotion dur="5s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.55 1">
                    <mpath href="#jmap-wedding-route" />
                  </animateMotion>
                </g>
              </motion.g>
            )}
          </g>
        ))}

        {/* pins */}
        {wedding.places.map((p, i) => {
          const [x, y] = pts[p.key];
          const isWedding = p.key === 'ro';
          return (
            <motion.g
              key={p.key}
              variants={{ hidden: { opacity: 0, y: -14 }, shown: { opacity: 1, y: 0, transition: { delay: 1.2 + i * 0.25, type: 'spring', stiffness: 220, damping: 12 } } }}
            >
              <circle cx={x} cy={y} r="13" className="jmap__pulse" />
              <circle cx={x} cy={y} r="13" className="jmap__pulse jmap__pulse--late" />
              <circle cx={x} cy={y} r="6" fill="url(#jmap-pin)" stroke="#fbf7ef" strokeWidth="1.5" />
              {isWedding && (
                // two interlocking rings — where we say yes
                <g transform={`translate(${x + 15} ${y - 20})`} className="jmap__rings">
                  <circle cx="-4" cy="0" r="6.5" />
                  <circle cx="4" cy="0" r="6.5" />
                  <path d="M4 -10 l1.4 2.2 l-1.4 1.6 l-1.4 -1.6 Z" className="jmap__gem" />
                </g>
              )}
            </motion.g>
          );
        })}
      </motion.svg>

      {/* captions, pinned onto the map like little paper tags */}
      {wedding.places.map((p, i) => (
        <motion.div
          key={p.key}
          className={`jmap__tag jmap__tag--${p.key}`}
          style={{ '--tint': TINT[p.key] }}
          initial={{ opacity: 0, y: 10, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ delay: 1.4 + i * 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="jmap__tag-name">
            <i aria-hidden="true" />
            {t(`invite.places.${p.key}.name`)}
          </span>
          <span className="jmap__tag-note italic">{t(`invite.places.${p.key}.note`)}</span>
        </motion.div>
      ))}
      </div>
    </div>
  );
}
