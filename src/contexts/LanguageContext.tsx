import React, { createContext, useContext, useState, useEffect } from 'react';
import { en, TranslationKey } from '../locales/en';
import { mr } from '../locales/mr';
import { hi } from '../locales/hi';

export type Language = 'EN' | 'MR' | 'HI';

export type { TranslationKey };

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, fallback?: string) => string;
  tOr: (key: string, fallback: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  EN: en,
  MR: mr,
  HI: hi,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('washmitra_lang') as Language) || 'EN';
  });

  // Sync html lang attribute whenever language changes or on initial mount
  useEffect(() => {
    document.documentElement.lang = language.toLowerCase();
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('washmitra_lang', lang);
  };

  /**
   * t(key: TranslationKey, fallback?)
   * - Strongly typed: accepts only statically verified keys from `en.ts`.
   * - Resolves key in active language, then falls back to English.
   * - If missing in all languages, returns `fallback` (if provided) or empty string `""`.
   * - Never displays a raw translation key on screen.
   * - In development, logs a warning if a key is missing.
   */
  const t = (key: TranslationKey, fallback?: string): string => {
    const val = translations[language]?.[key] || translations['EN']?.[key];
    if (val !== undefined && val !== '') {
      return val;
    }

    if (fallback !== undefined) {
      if (import.meta.env.DEV) {
        console.warn(`[i18n] Missing translation for key: "${key}", using fallback: "${fallback}"`);
      }
      return fallback;
    }

    if (import.meta.env.DEV) {
      console.warn(`[i18n] Missing translation for key: "${key}" with no fallback provided`);
    }
    return '';
  };

  /**
   * tOr(key, fallback)
   * - Specifically designed for dynamic / database-driven content.
   * - Looks up a stable slug or ID key (e.g. `category.plumbing`).
   * - If translated in active language, returns it.
   * - If translated in English, returns it.
   * - If not found, safely returns the `fallback` string (never the raw key).
   * - In development, logs a warning.
   */
  const tOr = (key: string, fallback: string): string => {
    const val = translations[language]?.[key] || translations['EN']?.[key];
    if (val !== undefined && val !== '') {
      return val;
    }
    if (import.meta.env.DEV) {
      console.warn(`[i18n] Dynamic translation not found for key: "${key}", falling back to: "${fallback}"`);
    }
    return fallback;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tOr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
