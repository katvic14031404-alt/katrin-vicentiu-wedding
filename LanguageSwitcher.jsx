import { motion } from 'motion/react';
import { languages } from '../../config/wedding';
import { useLanguage } from '../../i18n/LanguageContext';
import './ui.css';

/** Editorial language selector: RO · DE · EN with a sliding hairline. */
export default function LanguageSwitcher({ tone = 'ink', id = 'lang' }) {
  const { lang, setLang } = useLanguage();
  return (
    <nav className={`lang lang--${tone}`} aria-label="Language">
      {languages.map((l, i) => (
        <span key={l.code} className="lang__item">
          {i > 0 && <span className="lang__dot" aria-hidden="true">·</span>}
          <button
            type="button"
            className={`lang__btn ${lang === l.code ? 'is-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setLang(l.code);
            }}
            aria-pressed={lang === l.code}
            lang={l.code}
            title={l.label}
          >
            <span className="lang__short">{l.short}</span>
            <span className="lang__long">{l.label}</span>
            {lang === l.code && (
              <motion.span layoutId={`${id}-underline`} className="lang__line" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />
            )}
          </button>
        </span>
      ))}
    </nav>
  );
}
