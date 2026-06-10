import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Locale } from './types';
import { en } from './translations/en';
import { he } from './translations/he';

const STORAGE_KEY = 'letter-library-locale';

type TranslationTree = typeof en;

interface LocaleContextValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  toggleLocale: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  translations: TranslationTree;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(vars[key] ?? ''));
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'he' ? 'he' : 'en';
  });

  const translations = locale === 'he' ? he : en;
  const dir: 'ltr' | 'rtl' = locale === 'he' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale, dir]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const value = getNestedValue(translations as unknown as Record<string, unknown>, key);
      if (typeof value === 'string') return interpolate(value, vars);
      return key;
    },
    [translations]
  );

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === 'en' ? 'he' : 'en'));
  }, []);

  const value = useMemo(
    () => ({ locale, dir, toggleLocale, t, translations }),
    [locale, dir, toggleLocale, t, translations]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
