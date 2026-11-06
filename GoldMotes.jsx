import { useMemo } from 'react';
import { seeded } from './random';
import './effects.css';

/** Slow floating specks of gold dust, like sunlight through leaves. CSS-only. */
export default function GoldMotes({ count = 26, seed = 3 }) {
  const motes = useMemo(() => {
    const r = seeded(seed);
    return Array.from({ length: count }, (_, i) => ({
      i,
      left: r() * 100,
      top: r() * 100,
      size: 1.5 + r() * 3.5,
      dur: 14 + r() * 18,
      delay: -r() * 30,
      dx: (r() - 0.5) * 120,
      blur: r() < 0.3 ? 1.5 : 0,
    }));
  }, [count, seed]);

  return (
    <div className="motes" aria-hidden="true">
      {motes.map((m) => (
        <span
          key={m.i}
          className="motes__m"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            filter: m.blur ? `blur(${m.blur}px)` : undefined,
            animationDuration: `${m.dur}s, ${m.dur / 4}s`,
            animationDelay: `${m.delay}s, ${m.delay}s`,
            '--dx': `${m.dx}px`,
          }}
        />
      ))}
    </div>
  );
}
