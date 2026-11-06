import { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { seeded } from './random';
import './effects.css';

/**
 * A warm summer gust sweeping across the screen: olive leaves, ivory petals,
 * gold flecks and faint air-current lines. Plays once on mount.
 */
const LEAF = 'M0 6 C 4 0, 16 -1, 24 6 C 16 13, 4 12, 0 6 Z';

export default function Gust({ seed = 11, count = 30 }) {
  const reduce = useReducedMotion();
  const items = useMemo(() => {
    const r = seeded(seed);
    return Array.from({ length: count }, (_, i) => {
      const k = r();
      const kind = k < 0.45 ? 'leaf' : k < 0.75 ? 'petal' : 'fleck';
      const y0 = 15 + r() * 75;
      return {
        i,
        kind,
        y0,
        y1: y0 + (r() - 0.6) * 30,
        y2: y0 + (r() - 0.5) * 50,
        rot: (r() < 0.5 ? -1 : 1) * (240 + r() * 540),
        s: kind === 'leaf' ? 0.7 + r() * 0.9 : kind === 'petal' ? 0.6 + r() * 0.8 : 0.5 + r() * 0.8,
        d: 1.5 + r() * 1.1,
        dl: r() * 0.55,
        hue: ['#737a4c', '#5f6a3e', '#8d9067', '#3e5442'][Math.floor(r() * 4)],
      };
    });
  }, [seed, count]);

  if (reduce) return null;

  return (
    <div className="gust" aria-hidden="true">
      {/* air currents */}
      <svg className="gust__streaks" viewBox="0 0 1000 600" preserveAspectRatio="none">
        {[
          'M-50 220 C 200 140, 380 300, 620 210 S 900 120, 1060 200',
          'M-50 360 C 240 300, 420 420, 660 340 S 920 280, 1060 330',
          'M-50 470 C 180 430, 380 520, 600 460 S 880 400, 1060 450',
          'M-50 130 C 260 90, 460 190, 700 120 S 940 70, 1060 110',
        ].map((d, i) => (
          <motion.path
            key={i}
            d={d}
            initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
            animate={{ pathLength: [0, 0.35, 0.1], pathOffset: [0, 0.35, 1], opacity: [0, 0.7, 0] }}
            transition={{ duration: 1.5, delay: i * 0.12, ease: 'easeInOut' }}
          />
        ))}
      </svg>

      {items.map((p) => (
        <motion.div
          key={p.i}
          className={`gust__p gust__p--${p.kind}`}
          style={{ top: 0, left: 0 }}
          initial={{ x: '-8vw', y: `${p.y0}vh`, rotate: 0, opacity: 0, scale: p.s }}
          animate={{
            x: ['-8vw', '45vw', '112vw'],
            y: [`${p.y0}vh`, `${p.y1}vh`, `${p.y2}vh`],
            rotate: p.rot,
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: p.d, delay: p.dl, ease: [0.45, 0.05, 0.55, 0.95], opacity: { duration: p.d, delay: p.dl, times: [0, 0.1, 0.8, 1] } }}
        >
          {p.kind === 'leaf' ? (
            <svg width="26" height="14" viewBox="-1 -1 26 14">
              <path d={LEAF} fill={p.hue} />
              <path d="M1 6 L22 6" stroke="#f7f1e6" strokeOpacity="0.35" strokeWidth="0.6" />
            </svg>
          ) : null}
        </motion.div>
      ))}
    </div>
  );
}
