import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import ChampagneToast from './ChampagneToast';
import { FestiveDate, ForestVenue, Programme, Godparents } from './DayDetails';
import JourneyMap from '../map/JourneyMap';
import GoldBurst from '../effects/GoldBurst';
import GoldMotes from '../effects/GoldMotes';
import WaxSeal from '../ornaments/WaxSeal';
import Branch from '../ornaments/Branch';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { wedding } from '../../config/wedding';
import { useLanguage } from '../../i18n/LanguageContext';
import './invitation.css';

/**
 * The invitation: a gatefold card that pops up from the envelope, its two
 * forest-green doors swing open (splitting the gold medallion), gold bursts
 * out, and the inside reveals itself line by line.
 */
const T = {
  doors: 1.0, // doors start opening
  burst: 1.25, // gold burst as they part
  content: 1.5, // inside content begins
  toast: 2.3, // champagne glasses enter
  unlock: 2.4, // page becomes scrollable
};


function Medallion() {
  const [a, b] = wedding.couple.initials;
  return (
    <div className="medallion">
      <span className="medallion__ring" />
      <span className="medallion__ring medallion__ring--inner" />
      <span className="medallion__mono foil foil--light">
        {a}
        <small>&amp;</small>
        {b}
      </span>
      <span className="medallion__date foil foil--light">30 · VII · MMXXVII</span>
    </div>
  );
}

export default function Invitation({ onReseal }) {
  const { t, formatDate } = useLanguage();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [a, b] = wedding.couple.initials;
  const k = reduce ? 0 : 1; // collapse the timeline for reduced motion

  // lock scroll during the reveal, then hand over to smooth scrolling
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    const id = setTimeout(() => {
      document.documentElement.style.overflow = '';
      setOpen(true);
    }, T.unlock * 1000 * k);
    return () => {
      clearTimeout(id);
      document.documentElement.style.overflow = '';
    };
  }, [k]);

  useEffect(() => {
    if (reduce || !open) return undefined;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.085 });
    return () => lenis.destroy();
  }, [reduce, open]);

  const appear = (i, extra = {}) => ({
    initial: { opacity: 0, y: 18, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 1.1, delay: (T.content + i * 0.12) * k, ease: [0.22, 1, 0.36, 1] },
    ...extra,
  });

  return (
    <main className="invite-page">
      <GoldMotes count={22} seed={9} />

      <motion.header
        className="invite-header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: T.content * k, duration: 1 }}
      >
        <span className="invite-header__mark italic">
          {a}
          <span className="gold">&amp;</span>
          {b}
        </span>
        <LanguageSwitcher id="invite-lang" />
      </motion.header>

      <div className="gate-scene">
        <motion.article
          className="invite-card"
          initial={{ opacity: 0, y: 160, scale: 0.6, rotate: -3, rotateX: 18 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0, rotateX: 0 }}
          transition={{ type: 'spring', stiffness: 70, damping: 13, mass: 1 }}
        >
          {/* ── inside of the card ───────────────────────── */}
          <div className="invite-card__inner">
            <span className="invite-card__frame" aria-hidden="true" />

            <motion.div className="invite-crest" {...appear(0)}>
              <Branch leaves={6} bend={18} className="invite-crest__branch invite-crest__branch--l" color="var(--olive)" />
              <WaxSeal size={64} />
              <Branch leaves={6} bend={-18} className="invite-crest__branch invite-crest__branch--r" color="var(--olive)" />
            </motion.div>

            <h1 className="invite-names">
              <motion.span className="invite-names__first foil" {...appear(2)}>
                {wedding.couple.first}
              </motion.span>
              <motion.span
                className="invite-names__amp italic"
                initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: (T.content + 0.4) * k, type: 'spring', stiffness: 160, damping: 12 }}
              >
                &amp;
              </motion.span>
              <motion.span className="invite-names__second foil italic" {...appear(4)}>
                {wedding.couple.second}
              </motion.span>
            </h1>

            <motion.p className="invite-line italic" key={`line-${t('invite.line')}`} {...appear(5)}>
              {t('invite.line')}
            </motion.p>

            <ChampagneToast start={T.toast * k} caption={t('invite.toast')} />

            <FestiveDate />
            <ForestVenue />
            <Programme />
            <Godparents />

            <div className="invite-divider" aria-hidden="true">
              <span />
              <i>✦</i>
              <span />
            </div>

            {/* ── the map ─────────────────────────────────── */}
            <section className="invite-map">
              <motion.p className="label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                {t('invite.mapEyebrow')}
              </motion.p>
              <motion.h2
                className="invite-map__title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1 }}
              >
                {t('invite.mapTitleA')} <em className="foil">{t('invite.mapTitleB')}</em>
              </motion.h2>
              <JourneyMap />
            </section>

            {/* ── RSVP ────────────────────────────────────── */}
            <motion.section
              className="invite-rsvp"
              id="rsvp"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 1.1 }}
            >
              <h2 className="invite-rsvp__title italic">{t('invite.rsvpTitle')}</h2>
              <p className="invite-rsvp__text">{t('invite.rsvpText', { date: formatDate(wedding.rsvpDeadline) })}</p>

              <motion.a
                className="rsvp-btn"
                href={wedding.rsvpUrl}
                target="_blank"
                rel="noreferrer"
                initial="rest"
                animate="rest"
                whileHover="hover"
                whileFocus="hover"
                whileTap="press"
              >
                <motion.span
                  className="rsvp-btn__fill"
                  variants={{ rest: { scaleY: 0 }, hover: { scaleY: 1 }, press: { scaleY: 1 } }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden="true"
                />
                <motion.span
                  className="rsvp-btn__seal"
                  variants={{ rest: { rotate: -8, scale: 1 }, hover: { rotate: 4, scale: 1.08 }, press: { rotate: 0, scale: 0.9 } }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  aria-hidden="true"
                >
                  <WaxSeal size={60} />
                </motion.span>
                <span className="rsvp-btn__label">{t('invite.rsvpButton')}</span>
                <motion.span
                  className="rsvp-btn__arrow"
                  variants={{ rest: { width: 24 }, hover: { width: 42 }, press: { width: 42 } }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden="true"
                />
                <span className="rsvp-btn__shine" aria-hidden="true" />
              </motion.a>
            </motion.section>

            <footer className="invite-foot">
              <p className="invite-foot__sign italic">{t('invite.sign')},</p>
              <p className="invite-foot__names foil">
                {wedding.couple.first} &amp; {wedding.couple.second}
              </p>
            </footer>
          </div>

          {/* ── gatefold doors ───────────────────────────── */}
          {!open && (
            <>
              <motion.div
                className="gate-door gate-door--left"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -112, opacity: [1, 1, 0] }}
                transition={{
                  rotateY: { delay: T.doors * k, duration: 1.5 * k, ease: [0.65, 0, 0.35, 1] },
                  opacity: { delay: T.doors * k, duration: 1.5 * k, times: [0, 0.75, 1] },
                }}
              >
                <div className="gate-door__face">
                  <span className="gate-door__frame" />
                  <div className="gate-door__medallion gate-door__medallion--left">
                    <Medallion />
                  </div>
                </div>
                <div className="gate-door__back" />
              </motion.div>
              <motion.div
                className="gate-door gate-door--right"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 112, opacity: [1, 1, 0] }}
                transition={{
                  rotateY: { delay: T.doors * k, duration: 1.5 * k, ease: [0.65, 0, 0.35, 1] },
                  opacity: { delay: T.doors * k, duration: 1.5 * k, times: [0, 0.75, 1] },
                }}
              >
                <div className="gate-door__face">
                  <span className="gate-door__frame" />
                  <div className="gate-door__medallion gate-door__medallion--right">
                    <Medallion />
                  </div>
                </div>
                <div className="gate-door__back" />
              </motion.div>
            </>
          )}

          {/* light + gold as the doors part */}
          {!reduce && (
            <>
              <motion.span
                className="gate-light"
                initial={{ opacity: 0, scaleX: 0.05 }}
                animate={{ opacity: [0, 1, 0], scaleX: [0.05, 0.6, 1.2] }}
                transition={{ delay: T.doors, duration: 1.6, ease: 'easeOut' }}
                aria-hidden="true"
              />
              <GoldBurst
                className="gate-burst"
                count={70}
                radius={340}
                gravity={260}
                duration={2.6}
                delay={T.burst}
                seed={31}
              />
            </>
          )}
        </motion.article>
      </div>
    </main>
  );
}
