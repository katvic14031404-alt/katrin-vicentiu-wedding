import { motion } from 'motion/react';
import Branch from '../ornaments/Branch';
import venueImage from '../../assets/padurile-regale.webp';
import { wedding } from '../../config/wedding';
import { useLanguage } from '../../i18n/LanguageContext';
import './day-details.css';

/* Shared "appear when visible" props */
const inView = (delay = 0, y = 18) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-8% 0px' },
  transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] },
});

/* Twinkling four-point stars */
function Twinkles({ spots }) {
  return spots.map(([x, y, s, d], i) => (
    <span
      key={i}
      className="twinkle"
      style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, animationDelay: `${d}s` }}
      aria-hidden="true"
    />
  ));
}

/* ── 30 July 2027 ─────────────────────────────────────────── */
export function FestiveDate() {
  const { formatDate, locale } = useLanguage();
  const parts = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).formatToParts(
    new Date(`${wedding.date}T12:00:00`)
  );
  const get = (type) => parts.find((p) => p.type === type)?.value;
  const weekday = formatDate(wedding.date, { weekday: 'long' });

  return (
    <motion.div className="fdate" {...inView(0, 24)}>
      <Twinkles
        spots={[
          [6, 18, 10, 0],
          [92, 12, 12, 0.8],
          [16, 82, 8, 1.6],
          [86, 78, 9, 0.4],
          [50, 2, 7, 1.2],
        ]}
      />
      <span className="fdate__weekday label">
        <i aria-hidden="true" />
        {weekday}
        <i aria-hidden="true" />
      </span>

      <div className="fdate__row">
        <Branch leaves={7} bend={22} draw="inView" className="fdate__laurel fdate__laurel--l" color="var(--olive)" />
        <p className="fdate__main">
          <motion.span
            className="fdate__day foil"
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 140, damping: 12, delay: 0.2 }}
          >
            {get('day')}
          </motion.span>
          <span className="fdate__month foil italic">{get('month')}</span>
          <span className="fdate__year foil">{get('year')}</span>
        </p>
        <Branch leaves={7} bend={-22} draw="inView" delay={0.2} className="fdate__laurel fdate__laurel--r" color="var(--olive)" />
      </div>
      <span className="fdate__ribbon" aria-hidden="true" />
    </motion.div>
  );
}

/* ── Pădurile Regale, România — the oak forest venue ───────
   Illustration generated for this invitation (src/assets/padurile-regale.webp).
   Gentle life on top: a slow drift, glowing fireflies and a moving sun ray. */
const FIREFLIES = [
  [18, 62], [27, 48], [34, 70], [44, 58], [52, 40],
  [58, 66], [66, 52], [73, 72], [81, 47], [88, 63],
];

export function ForestVenue() {
  return (
    <motion.div className="forest" {...inView(0.05, 28)}>
      <div className="forest__frame">
        <motion.img
          src={venueImage}
          alt="Illustration of the wedding ceremony in the oak forest at Pădurile Regale"
          className="forest__img"
          loading="lazy"
          initial={{ scale: 1.08, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-8% 0px' }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <span className="forest__ray" aria-hidden="true" />
        {FIREFLIES.map(([x, y], i) => (
          <span
            key={i}
            className="forest__firefly"
            style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${(i * 0.53) % 3}s` }}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="forest__name">{wedding.venue.name}</p>
      <p className="forest__place label">{wedding.venue.place}</p>
    </motion.div>
  );
}

/* ── Ceremony 18:30 · Party 20:00 · shuttle note ──────────── */
export function Programme() {
  const { t } = useLanguage();
  const { ceremony, party, shuttle } = wedding.programme;
  return (
    <motion.div className="programme" {...inView(0.1)}>
      <div className="programme__items">
        <div className="programme__item">
          <svg viewBox="0 0 40 40" className="programme__icon" aria-hidden="true">
            {/* forest arch with rings */}
            <path d="M8 34 V18 C 8 9, 32 9, 32 18 V34" />
            <path d="M5 34 H35" />
            <circle cx="17.5" cy="24" r="4" />
            <circle cx="22.5" cy="24" r="4" />
            <path d="M12 14 l-3 -3 M28 14 l3 -3 M20 10 V6" />
          </svg>
          <span className="programme__time foil">{ceremony}</span>
          <span className="programme__label italic">{t('invite.ceremony')}</span>
        </div>
        <span className="programme__divider" aria-hidden="true" />
        <div className="programme__item">
          <svg viewBox="0 0 40 40" className="programme__icon" aria-hidden="true">
            {/* two coupes + sparkle */}
            <path d="M8 14 H18 C 18 20, 8 20, 8 14 Z M13 19 V30 M9 30 H17" />
            <path d="M22 14 H32 C 32 20, 22 20, 22 14 Z M27 19 V30 M23 30 H31" />
            <path d="M20 4 V9 M17.5 6.5 H22.5 M10 7 l1.5 1.5 M30 7 l-1.5 1.5" />
          </svg>
          <span className="programme__time foil">{party}</span>
          <span className="programme__label italic">{t('invite.party')}</span>
        </div>
      </div>
      <p className="programme__shuttle">
        <svg viewBox="0 0 24 16" className="programme__bus" aria-hidden="true">
          <rect x="1.5" y="1.5" width="21" height="10" rx="2.5" />
          <path d="M1.5 6 H22.5 M8 1.5 V6 M15 1.5 V6" />
          <circle cx="6.5" cy="13" r="1.8" />
          <circle cx="17.5" cy="13" r="1.8" />
        </svg>
        {t('invite.shuttle', { from: shuttle.from, to: shuttle.to })}
      </p>
    </motion.div>
  );
}

/* ── Godparents (nași) ────────────────────────────────────── */
export function Godparents() {
  const { t } = useLanguage();
  const [a, b] = wedding.godparents;
  return (
    <motion.div className="godparents" {...inView(0.1)}>
      <span className="label godparents__label">{t('invite.godparentsLabel')}</span>
      <p className="godparents__names">
        <span>
          {a}
          <span className="godparents__amp italic"> &amp;</span>
        </span>{' '}
        <span>{b}</span>
      </p>
    </motion.div>
  );
}
