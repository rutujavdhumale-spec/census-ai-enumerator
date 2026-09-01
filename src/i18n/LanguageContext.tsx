import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, TRANSLATIONS, LanguageMeta } from './translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  languages: LanguageMeta[];
  currentLanguageMeta: LanguageMeta;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('census_app_lang');
      if (saved && ['en', 'hi', 'mr', 'bn', 'ta', 'te', 'kn', 'gu'].includes(saved)) {
        return saved as SupportedLanguage;
      }
    } catch (e) {
      // localStorage may be disabled
    }
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('census_app_lang', lang);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict && key in langDict) {
      return langDict[key];
    }
    const enDict = TRANSLATIONS.en;
    if (enDict && key in enDict) {
      return enDict[key];
    }
    return fallback || key;
  };

  const currentLanguageMeta = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: SUPPORTED_LANGUAGES, currentLanguageMeta }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
