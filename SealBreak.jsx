import { useMemo } from 'react';
import { motion } from 'motion/react';
import WaxSeal from '../ornaments/WaxSeal';
import Branch from '../ornaments/Branch';
import GoldBurst from '../effects/GoldBurst';
import { seeded } from '../effects/random';

/**
 * The wax seal and everything that happens to it.
 * phase: idle → crack (shudders, a glowing fissure runs through it)
 *              → break (splits in two, shards + gold sparks + shockwave)
 */
const CRACK = 'M61 2 L56 20 L64 34 L55 49 L63 63 L54 79 L60 95 L56 118';
// two halves follow the same jagged line
const LEFT = 'polygon(0 0, 51% 0, 47% 17%, 53% 29%, 46% 41%, 52.5% 53%, 45% 66%, 50% 79%, 46.5% 100%, 0 100%)';
const RIGHT = 'polygon(51% 0, 100% 0, 100% 100%, 46.5% 100%, 50% 79%, 45% 66%, 52.5% 53%, 46% 41%, 53% 29%, 47% 17%)';

export default function SealBreak({ phase, hover }) {
  const shards = useMemo(() => {
    const r = seeded(21);
    return Array.from({ length: 14 }, (_, i) => {
      const a = r() * Math.PI * 2;
      const d = 3 + r() * 5;
      return {
        i,
        x: `${Math.cos(a) * d}em`,
        y: `${Math.sin(a) * d + 2.5}em`,
        rot: (r() - 0.5) * 540,
        s: 0.25 + r() * 0.45,
        clip: `polygon(${r() * 30}% 0, 100% ${r() * 40}%, ${70 + r() * 30}% 100%, 0 ${50 + r() * 50}%)`,
      };
    });
  }, []);

  const broken = phase !== 'idle' && phase !== 'crack';
  const cracking = phase === 'crack';

  return (
    <div className="seal">
      {/* glow halo inviting a click */}
      {phase === 'idle' && <span className="seal__halo" aria-hidden="true" />}

      {/* olive sprig tucked beneath the wax */}
      <motion.div
        className="seal__sprig"
        animate={broken ? { y: '5em', x: '-1.5em', rotate: -70, opacity: 0 } : { y: 0, x: 0, rotate: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.5, 0, 0.75, 0] }}
      >
        <Branch leaves={5} bend={14} color="var(--olive)" />
      </motion.div>
      <motion.div
        className="seal__sprig seal__sprig--b"
        animate={broken ? { y: '5em', x: '1.5em', rotate: 60, opacity: 0 } : { y: 0, x: 0, rotate: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.5, 0, 0.75, 0] }}
      >
        <Branch leaves={5} bend={-12} color="var(--forest)" />
      </motion.div>

      {/* the wax: two halves that start perfectly aligned */}
      <motion.div
        className="seal__wax"
        animate={
          cracking
            ? { x: [0, -2, 3, -3, 2, -1, 0], rotate: [0, -2, 2, -1, 1, 0], scale: 1.04 }
            : { x: 0, rotate: hover && phase === 'idle' ? -5 : 0, scale: hover && phase === 'idle' ? 1.06 : 1 }
        }
        transition={cracking ? { duration: 0.45 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="seal__half"
          style={{ clipPath: LEFT }}
          animate={broken ? { x: '-2.6em', y: '6em', rotate: -38, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.4, 0, 0.8, 0.4], opacity: { duration: 1.1, ease: 'easeIn' } }}
        >
          <WaxSeal size="100%" />
        </motion.div>
        <motion.div
          className="seal__half"
          style={{ clipPath: RIGHT }}
          animate={broken ? { x: '2.8em', y: '6.5em', rotate: 34, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
          transition={{ duration: 1.15, ease: [0.4, 0, 0.8, 0.4], opacity: { duration: 1.15, ease: 'easeIn' } }}
        >
          <WaxSeal size="100%" />
        </motion.div>

        {/* glowing fissure */}
        <svg className="seal__crack" viewBox="0 0 120 120" aria-hidden="true">
          <motion.path
            d={CRACK}
            initial={false}
            animate={cracking ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: cracking ? 0.38 : 0.2, ease: 'easeOut' }}
          />
        </svg>
      </motion.div>

      {/* break: flash, shockwave, shards, gold sparks */}
      {broken && (
        <>
          <motion.span
            className="seal__flash"
            initial={{ scale: 0.4, opacity: 0.95 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
          <motion.span
            className="seal__ring"
            initial={{ scale: 0.5, opacity: 0.9 }}
            animate={{ scale: 3.4, opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.span
            className="seal__ring seal__ring--b"
            initial={{ scale: 0.5, opacity: 0.6 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          />
          {shards.map((s) => (
            <motion.span
              key={s.i}
              className="seal__shard"
              style={{ clipPath: s.clip }}
              initial={{ x: 0, y: 0, rotate: 0, scale: s.s, opacity: 1 }}
              animate={{ x: s.x, y: s.y, rotate: s.rot, opacity: 0 }}
              transition={{ duration: 1, ease: [0.2, 0.7, 0.4, 1], opacity: { duration: 1, ease: 'easeIn' } }}
            />
          ))}
          <GoldBurst className="seal__burst" count={34} radius={150} gravity={90} duration={1.6} seed={5} />
        </>
      )}
    </div>
  );
}
