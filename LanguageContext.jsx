import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from './translations';
import { languages, defaultLanguage } from '../config/wedding';

const STORAGE_KEY = 'kv-invitation-lang';
const LanguageContext = createContext(null);

function initialLanguage() {
  const valid = (c) => languages.some((l) => l.code === c);
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (valid(fromUrl)) return fromUrl;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (valid(stored)) return stored;
  } catch {
    /* storage unavailable — fall through */
  }
  const browser = (navigator.language || '').slice(0, 2);
  return valid(browser) ? browser : defaultLanguage;
}

const lookup = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(initialLanguage);

  const setLang = useCallback((code) => {
    setLangState(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
  }, []);

  const meta = languages.find((l) => l.code === lang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = translations[lang].meta.title;
  }, [lang]);

  const value = useMemo(() => {
    /** t('hero.intro') — falls back to English, then to the key itself. */
    const t = (key, vars) => {
      let s = lookup(translations[lang], key) ?? lookup(translations.en, key) ?? key;
      if (vars && typeof s === 'string') {
        Object.entries(vars).forEach(([k, v]) => (s = s.replace(`{${k}}`, v)));
      }
      return s;
    };
    const formatDate = (iso, opts = { day: 'numeric', month: 'long', year: 'numeric' }) =>
      new Intl.DateTimeFormat(meta.locale, opts).format(new Date(`${iso}T12:00:00`));
    return { lang, setLang, t, formatDate, locale: meta.locale };
  }, [lang, setLang, meta]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
