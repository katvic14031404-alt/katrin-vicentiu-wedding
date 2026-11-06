import { useEffect, useId, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import GoldBurst from '../effects/GoldBurst';
import { wedding } from '../../config/wedding';

/**
 * Two champagne flutes — etched with K and V — glide in, tilt and clink.
 * On contact: a spark, a splash of gold, and the bubbles keep rising.
 * `start` (seconds) delays the whole performance.
 */
const FLUTE =
  'M-21 0 C -21 58, -15 98, -3 112 L -2 168 C -2 174, -22 176, -25 182 L 25 182 C 22 176, 2 174, 2 168 L 3 112 C 15 98, 21 58, 21 0 Z';
const BOWL = 'M-18.5 4 C -18.5 58, -13 95, -2 108 L 2 108 C 13 95, 18.5 58, 18.5 4 Z';

const CLINK_AT = 0.68; // fraction of the timeline where the rims touch
const DURATION = 2.6;

function Flute({ side, start, idPrefix, letter }) {
  const dir = side === 'left' ? 1 : -1;
  const bubbles = Array.from({ length: 9 }, (_, i) => ({
    x: -10 + ((i * 7) % 20),
    r: 0.9 + (i % 3) * 0.5,
    d: 2.2 + (i % 4) * 0.6,
    dl: -(i * 0.43),
  }));
  return (
    <motion.g
      initial={{ x: -dir * 80, rotate: 0, opacity: 0 }}
      animate={{
        x: [-dir * 80, 0, 0, 0, 0],
        rotate: [-dir * 6, 0, dir * 9.4, dir * 6.5, dir * 8.8],
        opacity: [0, 1, 1, 1, 1],
      }}
      transition={{ duration: DURATION, delay: start, times: [0, 0.4, CLINK_AT, 0.83, 1], ease: 'easeInOut' }}
      style={{ originX: 0.5, originY: 1 }}
    >
      <g transform={`translate(${side === 'left' ? 110 : 210} 18)`}>
        <defs>
          <clipPath id={`${idPrefix}-bowl`}>
            <path d={BOWL} />
          </clipPath>
        </defs>
        {/* glass body */}
        <path d={FLUTE} fill={`url(#${idPrefix}-glass)`} stroke="url(#gold-line)" strokeWidth="1.1" />
        {/* champagne */}
        <g clipPath={`url(#${idPrefix}-bowl)`}>
          <motion.path
            fill={`url(#${idPrefix}-wine)`}
            animate={{
              d: [
                'M-25 34 Q -12 31, 0 34 T 25 34 L 25 120 L -25 120 Z',
                'M-25 34 Q -12 37, 0 34 T 25 34 L 25 120 L -25 120 Z',
                'M-25 34 Q -12 31, 0 34 T 25 34 L 25 120 L -25 120 Z',
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          {bubbles.map((b, i) => (
            <circle
              key={i}
              className="bubble"
              cx={b.x}
              cy="104"
              r={b.r}
              style={{ animationDuration: `${b.d}s`, animationDelay: `${b.dl}s` }}
            />
          ))}
        </g>
        {/* etched initial */}
        <text x="0" y="78" textAnchor="middle" className="flute__etch">
          {letter}
        </text>
        {/* highlight */}
        <path d="M-13 10 C -13 50, -9 82, -3 98" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </g>
    </motion.g>
  );
}

export default function ChampagneToast({ start = 0, caption }) {
  const uid = useId().replace(/:/g, '');
  const reduce = useReducedMotion();
  const [clinked, setClinked] = useState(false);
  const [a, b] = wedding.couple.initials;

  useEffect(() => {
    const id = setTimeout(() => setClinked(true), (start + DURATION * CLINK_AT) * 1000);
    return () => clearTimeout(id);
  }, [start]);

  return (
    <figure className="toast">
      <div className="toast__stage">
        <svg viewBox="0 0 320 210" className="toast__svg" aria-hidden="true">
          <defs>
            <linearGradient id="gold-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#b8914f" />
              <stop offset="0.5" stopColor="#f0dca8" />
              <stop offset="1" stopColor="#a98552" />
            </linearGradient>
            {['l', 'r'].map((s) => (
              <g key={s}>
                <linearGradient id={`${uid}${s}-glass`} x1="0" x2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
                  <stop offset="0.5" stopColor="#fff" stopOpacity="0.12" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id={`${uid}${s}-wine`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f6e3a6" />
                  <stop offset="0.6" stopColor="#e2c27a" />
                  <stop offset="1" stopColor="#c99d52" />
                </linearGradient>
              </g>
            ))}
          </defs>

          <Flute side="left" start={start} idPrefix={`${uid}l`} letter={a} />
          <Flute side="right" start={start} idPrefix={`${uid}r`} letter={b} />

          {/* the clink: radiating spark */}
          {clinked && !reduce && (
            <g transform="translate(160 22)">
              {Array.from({ length: 10 }, (_, i) => {
                const ang = (i / 10) * Math.PI * 2;
                return (
                  <motion.line
                    key={i}
                    x1={Math.cos(ang) * 6}
                    y1={Math.sin(ang) * 6}
                    x2={Math.cos(ang) * 22}
                    y2={Math.sin(ang) * 22}
                    stroke="#e8c97e"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 1 }}
                    animate={{ pathLength: 1, opacity: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                  />
                );
              })}
              <motion.circle
                r="5"
                fill="#fff6dc"
                initial={{ scale: 0.2, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            </g>
          )}
        </svg>
        {clinked && (
          <GoldBurst
            className="toast__burst"
            count={44}
            radius={170}
            gravity={110}
            spread={[200, 340]}
            duration={2}
            seed={13}
          />
        )}
      </div>
      {caption && (
        <motion.figcaption
          className="toast__caption italic"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: start + DURATION * CLINK_AT + 0.2, duration: 1 }}
        >
          {caption}
        </motion.figcaption>
      )}
    </figure>
  );
}
