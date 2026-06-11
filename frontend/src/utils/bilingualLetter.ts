import { categoryToEnglish, translateCategory } from '../i18n/categories';
import type { Locale } from '../i18n/types';
import type { GenerateLetterRequest } from '../types/generate';
import type { Letter, LetterContent } from '../types/letter';
import { categoryToImage, generateLetterContent } from './letterGenerator';

function inferLocale(text: string): Locale {
  return /[\u0590-\u05FF]/.test(text) ? 'he' : 'en';
}

function buildLocaleVersion(
  form: GenerateLetterRequest,
  locale: Locale,
  contentOverride?: string
): LetterContent {
  const enCategory = categoryToEnglish(form.category);
  const category = locale === 'he' ? translateCategory(enCategory, 'he') : enCategory;

  return {
    title: form.title,
    category,
    description: form.description,
    content: contentOverride ?? generateLetterContent({ ...form, category: enCategory }, locale),
  };
}

export function attachBilingualTranslations(
  letter: Letter,
  form: GenerateLetterRequest,
  createdLocale: Locale
): Letter {
  const enCategory = categoryToEnglish(form.category);
  const translations: Partial<Record<Locale, LetterContent>> = {
    en: letter.translations?.en ?? buildLocaleVersion(form, 'en', letter.createdLocale === 'en' ? letter.content : undefined),
    he: letter.translations?.he ?? buildLocaleVersion(form, 'he', letter.createdLocale === 'he' ? letter.content : undefined),
  };

  const active = translations[createdLocale]!;

  return {
    ...letter,
    title: active.title,
    category: active.category,
    description: active.description,
    content: active.content,
    image: letter.image || categoryToImage(enCategory),
    createdLocale,
    translations,
  };
}

export function ensureBilingualLetter(letter: Letter): Letter {
  if (letter.translations?.en && letter.translations?.he) {
    return letter;
  }

  const createdLocale = letter.createdLocale ?? inferLocale(`${letter.title} ${letter.description}`);
  const form: GenerateLetterRequest = {
    title: letter.title,
    category: categoryToEnglish(letter.category),
    description: letter.description,
    tone: 'Friendly',
    gender: 'male',
  };

  return attachBilingualTranslations(letter, form, createdLocale);
}

export function isLibraryLetter(id: number): boolean {
  return id >= 1 && id <= 16;
}
