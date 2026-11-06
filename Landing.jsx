import { useState } from 'react';
import { motion } from 'motion/react';
import Envelope from './Envelope';
import Gust from '../effects/Gust';
import GoldMotes from '../effects/GoldMotes';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { wedding } from '../../config/wedding';
import { useLanguage } from '../../i18n/LanguageContext';
import './landing.css';

const rise = (delay) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] },
});

const LATER = ['gust', 'rise', 'pop'];

export default function Landing({ onOpened }) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState('idle');
  const [a, b] = wedding.couple.initials;
  const [, mm, dd] = wedding.date.split('-');
  const started = phase !== 'idle';

  return (
    <main className="landing">
      <GoldMotes />

      <motion.div
        className="landing__numerals display"
        aria-hidden="true"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {dd}
        <span className="italic">.{mm}</span>
      </motion.div>

      <header className="landing__header">
        <motion.div className="landing__mark" {...rise(0.2)}>
          <span className="landing__monogram italic">
            {a}
            <span className="gold">&amp;</span>
            {b}
          </span>
          <span className="label landing__corr">{t('landing.correspondence')}</span>
        </motion.div>
        <motion.div {...rise(0.35)}>
          <LanguageSwitcher id="landing-lang" />
        </motion.div>
      </header>

      <section className="landing__center">
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 22, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          transition={{ duration: 1.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformPerspective: 1400 }}
        >
          <Envelope onOpened={onOpened} onPhase={setPhase} />
        </motion.div>

        <motion.div
          className="landing__hint"
          initial={{ opacity: 0, y: 14 }}
          animate={started ? { opacity: 0, y: 10, transition: { duration: 0.4 } } : { opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="landing__hint-line" aria-hidden="true" />
          <span className="landing__hint-main italic">{t('landing.hint')}</span>
          <span className="label">{t('landing.hintSub')}</span>
        </motion.div>
      </section>

      <footer className="landing__footer">
        <motion.span className="label" {...rise(0.9)}>
          {t('landing.route')}
        </motion.span>
        <motion.span className="label" {...rise(1)}>
          {t('landing.season')}
        </motion.span>
      </footer>

      {LATER.includes(phase) && <Gust />}
    </main>
  );
}
