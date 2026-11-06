import { useMemo } from 'react';
import { motion } from 'motion/react';

/**
 * Hand-drawn style olive / laurel branch, generated procedurally so it can be
 * reused at any size. When `draw` is set the stem draws itself and each leaf
 * unfurls in sequence.
 *
 * props:
 *  leaves   – number of leaves
 *  bend     – horizontal curvature of the stem (-60..60)
 *  color    – stroke/fill colour (CSS value)
 *  draw     – 'mount' | 'inView' | false
 *  delay    – seconds before drawing starts
 *  filled   – solid leaves (true) or outline leaves (false)
 */
const W = 200;
const H = 420;

function cubic(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}
function cubicD(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return 3 * u * u * (p1 - p0) + 6 * u * t * (p2 - p1) + 3 * t * t * (p3 - p2);
}

const LEAF = 'M0 0 C 9 -7.5, 30 -9, 46 0 C 30 9, 9 7.5, 0 0 Z';

export default function Branch({
  leaves = 11,
  bend = 30,
  color = 'var(--olive)',
  draw = false,
  delay = 0,
  filled = true,
  className,
  style,
  strokeWidth = 1.1,
}) {
  const { stem, items } = useMemo(() => {
    const P = {
      x: [W / 2, W / 2 + bend * 0.2, W / 2 + bend, W / 2 + bend * 0.6],
      y: [H - 6, H * 0.66, H * 0.3, 16],
    };
    const d = `M${P.x[0]} ${P.y[0]} C ${P.x[1]} ${P.y[1]}, ${P.x[2]} ${P.y[2]}, ${P.x[3]} ${P.y[3]}`;
    const list = [];
    for (let i = 0; i < leaves; i++) {
      const t = 0.1 + (i / Math.max(1, leaves - 1)) * 0.86;
      const x = cubic(...P.x, t);
      const y = cubic(...P.y, t);
      const dx = cubicD(...P.x, t);
      const dy = cubicD(...P.y, t);
      const tangent = (Math.atan2(dy, dx) * 180) / Math.PI;
      const side = i % 2 === 0 ? 1 : -1;
      const scale = 1 - t * 0.45; // smaller towards the tip
      list.push({ x, y, rot: tangent + side * 42, scale, i });
    }
    // terminal leaf at the tip
    const tx = cubicD(...P.x, 1);
    const ty = cubicD(...P.y, 1);
    list.push({ x: P.x[3], y: P.y[3], rot: (Math.atan2(ty, tx) * 180) / Math.PI, scale: 0.6, i: leaves });
    return { stem: d, items: list };
  }, [leaves, bend]);

  const animated = Boolean(draw);
  const trigger =
    draw === 'inView'
      ? { initial: 'hidden', whileInView: 'shown', viewport: { once: true, margin: '-10% 0px' } }
      : draw === 'mount'
        ? { initial: 'hidden', animate: 'shown' }
        : {};

  const stemVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    shown: { pathLength: 1, opacity: 1, transition: { duration: 2.2, delay, ease: [0.65, 0, 0.35, 1] } },
  };
  const leafVariants = {
    hidden: { scale: 0, opacity: 0 },
    shown: (i) => ({
      scale: 1,
      opacity: 1,
      transition: { duration: 1.1, delay: delay + 0.35 + i * 0.13, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <motion.svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      style={style}
      fill="none"
      aria-hidden="true"
      {...trigger}
    >
      <motion.path
        d={stem}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        variants={animated ? stemVariants : undefined}
      />
      {items.map((l) => (
        <g key={l.i} transform={`translate(${l.x} ${l.y}) rotate(${l.rot}) scale(${l.scale})`}>
          <motion.g
            variants={animated ? leafVariants : undefined}
            custom={l.i}
            style={{ originX: 0, originY: 0.5 }}
          >
            <path
              d={LEAF}
              fill={filled ? color : 'none'}
              fillOpacity={filled ? 0.9 : 0}
              stroke={color}
              strokeWidth={filled ? 0 : strokeWidth}
            />
            <path d="M2 0 L40 0" stroke={filled ? 'var(--paper)' : color} strokeOpacity={filled ? 0.35 : 0.6} strokeWidth="0.6" />
          </motion.g>
        </g>
      ))}
    </motion.svg>
  );
}
