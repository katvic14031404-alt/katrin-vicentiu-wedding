import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import SealBreak from './SealBreak';
import Stamp from '../ornaments/Stamp';
import Postmark from '../ornaments/Postmark';
import { wedding } from '../../config/wedding';
import { useLanguage } from '../../i18n/LanguageContext';
import './envelope.css';

/**
 * The envelope — real layers in 3D space (back → card → pocket → flap → seal).
 *
 * Sequence:  idle → crack → break → gust → rise → pop → onOpened()
 *   crack  the seal shudders, a gold fissure runs through it
 *   break  it splits in two; wax shards, sparks and a shockwave
 *   gust   a summer wind sweeps through and blows the flap open
 *   rise   the invitation slides up out of the envelope
 *   pop    it lifts towards you and the invitation takes over the screen
 */
const EASE = [0.22, 1, 0.36, 1];
const TIMELINE = { break: 450, gust: 1000, rise: 2050, pop: 3150, done: 3700 };
const TIMELINE_REDUCED = { break: 0, gust: 0, rise: 0, pop: 0, done: 900 };
const ORDER = ['idle', 'crack', 'break', 'gust', 'rise', 'pop'];

export default function Envelope({ onOpened, onPhase }) {
  const { t, formatDate } = useLanguage();
  const reduce = useReducedMotion();
  const [phase, setPhaseState] = useState('idle');
  const [hover, setHover] = useState(false);
  const timers = useRef([]);
  const at = (p) => ORDER.indexOf(phase) >= ORDER.indexOf(p);

  const setPhase = (p) => {
    setPhaseState(p);
    onPhase?.(p);
  };

  // ── Pointer-driven tilt ──────────────────────────────────
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-1, 1], [-8, 8]), { stiffness: 80, damping: 16 });
  const rotX = useSpring(useTransform(my, [-1, 1], [7, -7]), { stiffness: 80, damping: 16 });
  const glareX = useTransform(mx, [-1, 1], ['15%', '85%']);
  const glareY = useTransform(my, [-1, 1], ['5%', '75%']);

  useEffect(() => {
    if (reduce) return undefined;
    const onMove = (e) => {
      if (phase !== 'idle') return;
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduce, phase, mx, my]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const open = () => {
    if (phase !== 'idle') return;
    mx.set(0);
    my.set(0);
    const tl = reduce ? TIMELINE_REDUCED : TIMELINE;
    setPhase('crack');
    timers.current.push(
      setTimeout(() => setPhase('break'), tl.break),
      setTimeout(() => setPhase('gust'), tl.gust),
      setTimeout(() => setPhase('rise'), tl.rise),
      setTimeout(() => setPhase('pop'), tl.pop),
      setTimeout(() => onOpened?.(), tl.done)
    );
  };

  const dateLong = formatDate(wedding.date);
  const [a, b] = wedding.couple.initials;

  // whole-envelope motion per phase
  const floatAnim =
    phase === 'idle'
      ? reduce
        ? {}
        : { y: [0, -10, 0], rotate: [-0.5, 0.5, -0.5] }
      : phase === 'break'
        ? { y: [0, 6, 0], rotate: 0, scale: [1, 0.985, 1] }
        : phase === 'gust'
          ? { x: [0, 14, -6, 3, 0], y: [0, -6, 2, 0], rotate: [0, -2.6, 1.6, -0.6, 0] }
          : at('rise')
            ? { y: '16%', x: 0, rotate: 0 }
            : { y: 0, rotate: 0 };
  const floatTransition =
    phase === 'idle'
      ? { duration: 7, repeat: Infinity, ease: 'easeInOut' }
      : phase === 'gust'
        ? { duration: 1.2, ease: 'easeInOut' }
        : { duration: 1.1, ease: EASE };

  return (
    <div className="env-stage">
      <motion.div className="env-float" animate={floatAnim} transition={floatTransition}>
        <div className="env-scene">
          <motion.div
            className={`envelope phase-${phase}`}
            role="button"
            tabIndex={0}
            aria-label={t('landing.openLabel')}
            onClick={open}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open())}
            onHoverStart={() => setHover(true)}
            onHoverEnd={() => setHover(false)}
            style={{ rotateX: rotX, rotateY: rotY }}
            animate={{ scale: phase === 'idle' && hover ? 1.015 : 1 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {/* 0 — back panel + liner */}
            <div className="env-layer env-back">
              <div className="env-liner" />
            </div>

            {/* 1 — the invitation card (a forest-green gatefold, gold foil) */}
            <motion.div
              className="env-layer env-card"
              initial={false}
              animate={
                phase === 'pop'
                  ? { y: '-86%', scale: 1.08, rotate: -1.5 }
                  : at('rise')
                    ? { y: '-74%', scale: 1, rotate: 0 }
                    : { y: '0%', scale: 1, rotate: 0 }
              }
              transition={
                phase === 'pop'
                  ? { duration: 0.6, ease: EASE }
                  : { type: 'spring', stiffness: 46, damping: 13, mass: 1 }
              }
              style={{ z: 1 }}
            >
              <div className="env-card__face">
                <span className="env-card__border" aria-hidden="true" />
                <span className="label env-card__kicker">{t('landing.correspondence')}</span>
                <p className="env-card__mono foil foil--light">
                  {a}
                  <span className="env-card__amp">&amp;</span>
                  {b}
                </p>
                <span className="env-card__date foil foil--light">{dateLong}</span>
              </div>
              {phase === 'pop' && (
                <motion.span
                  className="env-card__glow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.8] }}
                  transition={{ duration: 0.6 }}
                  aria-hidden="true"
                />
              )}
            </motion.div>

            {/* 2 — front pocket */}
            <div className="env-layer env-pocket-wrap" style={{ transform: 'translateZ(2px)' }}>
              <div className="env-pocket">
                <span className="env-sheen" aria-hidden="true" />
                <svg className="env-creases" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 100 L50 60 L100 100" />
                  <path d="M0 0 L50 54 L100 0" className="env-creases__edge" />
                  <path d="M2.2 3.4 L50 51 L97.8 3.4 L97.8 96.6 L2.2 96.6 Z" className="env-creases__foil" />
                </svg>


                <div className="env-airmail" aria-hidden="true">
                  <span>Par Avion</span>
                </div>

                <div className="env-address">
                  <span className="label">{t('landing.addressee')}</span>
                  <p className="env-address__names">
                    <span className="foil">{wedding.couple.first}</span>
                    <span className="foil env-address__amp"> &amp; </span>
                    <span className="foil">{wedding.couple.second}</span>
                  </p>
                  <span className="env-address__date label">{dateLong}</span>
                </div>

                <div className="env-postage">
                  <Stamp motif="oak" country="Deutschland" value="80 Pf" tone="forest" rotate={-5} className="env-stamp env-stamp--a" />
                  <Stamp motif="peaks" country="România" value="50 B" tone="olive" rotate={4} className="env-stamp env-stamp--b" />
                  <Stamp motif="tulip" country="Nederland" value="25 c" tone="gold" rotate={-2} className="env-stamp env-stamp--c" />
                  <Postmark className="env-postmark" />
                </div>
              </div>
            </div>

            {/* 3 — top flap: outer paper with gold edge + ribbon / inner liner */}
            <motion.div
              className="env-layer env-flap"
              initial={false}
              animate={
                at('gust')
                  ? { rotateX: 180, z: [3, 3, -1] }
                  : at('break')
                    ? { rotateX: 6, z: 3 }
                    : { rotateX: hover && phase === 'idle' ? 9 : 0, z: 3 }
              }
              transition={
                at('gust')
                  ? {
                      rotateX: reduce ? { duration: 0.01 } : { type: 'spring', stiffness: 55, damping: 7.5, mass: 1, delay: 0.15 },
                      z: { duration: reduce ? 0.01 : 0.6, times: [0, 0.5, 0.5], delay: 0.15 },
                    }
                  : { duration: 0.5, ease: EASE }
              }
            >
              <div className="env-flap__face env-flap__face--outer">
                <span className="env-sheen" aria-hidden="true" />
                <span className="env-ribbon env-ribbon--flap" aria-hidden="true" />
                <svg className="env-flap__foil" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M3 0.5 L50 93 L97 0.5" />
                </svg>
                <motion.div className="env-glare" style={{ '--gx': glareX, '--gy': glareY }} />
              </div>
              <div className="env-flap__face env-flap__face--inner" />
            </motion.div>

            {/* 4 — wax seal */}
            <div className="env-seal-anchor" style={{ transform: 'translateZ(40px)' }}>
              <SealBreak phase={phase} hover={hover} />
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="env-shadow"
        aria-hidden="true"
        animate={
          phase === 'idle' && !reduce
            ? { scaleX: [1, 0.93, 1], opacity: [0.6, 0.42, 0.6] }
            : { opacity: at('rise') ? 0.25 : 0.55, scaleX: 1 }
        }
        transition={phase === 'idle' ? { duration: 7, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.8 }}
      />
    </div>
  );
}
