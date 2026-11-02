import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'sw';

const STORAGE_KEY = 'qt-lang';

// Swahili strings are a first draft for review by a native speaker and a
// laboratory professional before wider use. Keep this table small: only copy
// that has been reviewed should be added.
const DICT = {
  'nav.product': { en: 'Product', sw: 'Bidhaa' },
  'nav.solutions': { en: 'Solutions', sw: 'Suluhisho' },
  'nav.docs': { en: 'Docs', sw: 'Nyaraka' },
  'nav.company': { en: 'Company', sw: 'Kampuni' },
  'nav.talk': { en: 'Talk to the team', sw: 'Ongea na timu' },
  'nav.beta': { en: 'Beta interest', sw: 'Nia ya beta' },
  'hero.eyebrow': { en: 'Private beta · Testing begins mid-November 2026', sw: 'Beta ya faragha · Majaribio yanaanza katikati ya Novemba 2026' },
  'hero.lead': {
    en: 'Document control, corrective actions, and an AI assistant that only answers from your lab\'s own records, with the source shown, or a plain "not found" instead of a guess.',
    sw: 'Udhibiti wa nyaraka, hatua za kurekebisha, na msaidizi wa AI anayejibu kutoka kwenye rekodi za maabara yako pekee, akionyesha chanzo, au kusema wazi "haipatikani" badala ya kubahatisha.',
  },
  'hero.cta': { en: 'Register beta interest', sw: 'Onyesha nia ya beta' },
  'hero.cta2': { en: 'Talk to the team', sw: 'Ongea na timu' },
  'hero.status': {
    en: 'Pre-revenue. The eQMS is being tested with a small cohort of laboratories, not sold.',
    sw: 'Bado hatujaanza kuuza. eQMS inajaribiwa na kundi dogo la maabara, haiuzwi.',
  },
  'hiw.label': { en: 'How it works', sw: 'Inavyofanya kazi' },
  'hiw.1.title': { en: 'One map of the lab', sw: 'Ramani moja ya maabara' },
  'hiw.1.copy': {
    en: 'Documents, records, and actions live in one place, versioned and findable, so nobody has to remember which binder holds the answer.',
    sw: 'Nyaraka, rekodi na hatua ziko mahali pamoja, zikiwa na matoleo na rahisi kupatikana, ili mtu asilazimike kukumbuka faili lipi lina jibu.',
  },
  'hiw.2.title': { en: 'A trail for every change', sw: 'Alama ya kila mabadiliko' },
  'hiw.2.copy': {
    en: 'Every edit, review, and sign-off is recorded with who did it and when, which is the evidence an accreditation audit asks to see.',
    sw: 'Kila mabadiliko, mapitio na idhini hurekodiwa pamoja na nani aliyefanya na lini, ambayo ndiyo ushahidi unaoombwa katika ukaguzi wa ithibati.',
  },
  'hiw.3.title': { en: 'Findings that close', sw: 'Matokeo yanayofungwa' },
  'hiw.3.copy': {
    en: 'A finding becomes an assigned action with two independent reviews, so problems are closed with a trail instead of quietly dropped.',
    sw: 'Tatizo hugeuka kuwa hatua aliyopewa mtu, yenye mapitio mawili huru, ili matatizo yafungwe kwa alama badala ya kuachwa kimya.',
  },
  'lang.switch': { en: 'Kiswahili', sw: 'English' },
  'lang.switchLabel': { en: 'Switch language to Swahili', sw: 'Badilisha lugha kuwa Kiingereza' },
} as const;

export type DictKey = keyof typeof DICT;

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: DictKey) => string;
}

const I18nContext = createContext<I18nValue>({
  lang: 'en',
  setLang: () => undefined,
  t: (key) => DICT[key].en,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'sw' || saved === 'en') setLangState(saved);
    } catch {
      // Storage can be blocked; English remains the default.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore: the choice just will not persist.
    }
  }, []);

  const value = useMemo<I18nValue>(() => ({ lang, setLang, t: (key) => DICT[key][lang] }), [lang, setLang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
