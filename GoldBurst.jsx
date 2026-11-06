import { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { seeded } from './random';
import './effects.css';

/**
 * A celebratory burst of gold-foil confetti, glitter and tiny stars.
 * Mount it (or flip `fire`) to play once. Positioned by its parent.
 *
 * props: count, radius (px), gravity (px), duration (s), delay (s), seed, palette
 */
const GOLDS = ['#c9a96a', '#e8d29c', '#b8914f', '#f3e2b3', '#a98552', '#fffaf0'];

export default function GoldBurst({
  fire = true,
  count = 36,
  radius = 180,
  gravity = 120,
  duration = 1.8,
  delay = 0,
  seed = 7,
  spread = [0, 360],
  palette = GOLDS,
  className = '',
  style,
}) {
  const reduce = useReducedMotion();
  const parts = useMemo(() => {
    const r = seeded(seed);
    return Array.from({ length: count }, (_, i) => {
      const a = ((spread[0] + r() * (spread[1] - spread[0])) * Math.PI) / 180;
      const dist = radius * (0.35 + r() * 0.75);
      const kind = r() < 0.5 ? 'foil' : r() < 0.7 ? 'star' : 'dot';
      return {
        i,
        kind,
        x: Math.cos(a) * dist,
        y: Math.sin(a) * dist,
        g: gravity * (0.5 + r()),
        rot: (r() - 0.5) * 720,
        size: kind === 'foil' ? 5 + r() * 7 : kind === 'star' ? 8 + r() * 8 : 2 + r() * 4,
        color: palette[Math.floor(r() * palette.length)],
        d: duration * (0.7 + r() * 0.5),
        dl: delay + r() * 0.12,
      };
    });
  }, [count, radius, gravity, duration, delay, seed, spread, palette]);

  if (!fire || reduce) return null;

  return (
    <div className={`burst ${className}`} style={style} aria-hidden="true">
      {parts.map((p) => (
        <motion.span
          key={p.i}
          className={`burst__p burst__p--${p.kind}`}
          style={{ width: p.size, height: p.kind === 'foil' ? p.size * 0.45 : p.size, '--c': p.color }}
          initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0.4 }}
          animate={{
            x: [0, p.x * 0.85, p.x],
            y: [0, p.y * 0.85, p.y + p.g],
            opacity: [0, 1, 1, 0],
            rotate: p.rot,
            scale: [0.4, 1, p.kind === 'star' ? 0.2 : 0.8],
          }}
          transition={{ duration: p.d, delay: p.dl, ease: [0.16, 1, 0.3, 1], times: [0, 0.45, 1], opacity: { duration: p.d, delay: p.dl, times: [0, 0.08, 0.7, 1] } }}
        />
      ))}
    </div>
  );
}
