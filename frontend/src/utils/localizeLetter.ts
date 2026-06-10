import { categoryToEnglish, translateCategory } from '../i18n/categories';
import { letterTranslationsHe } from '../i18n/data/letters.he';
import type { Locale } from '../i18n/types';
import type { Letter } from '../types/letter';
import { ensureBilingualLetter, isLibraryLetter } from './bilingualLetter';

export function localizeLetter(letter: Letter, locale: Locale): Letter {
  if (isLibraryLetter(letter.id)) {
    if (locale === 'en') return letter;

    const translation = letterTranslationsHe[letter.id];
    if (!translation) {
      return {
        ...letter,
        category: translateCategory(letter.category, 'he'),
      };
    }

    return {
      ...letter,
      title: translation.title,
      category: translation.category,
      description: translation.description,
      content: translation.content,
    };
  }

  const bilingual = ensureBilingualLetter(letter);
  const localized = bilingual.translations?.[locale];

  if (localized) {
    return {
      ...bilingual,
      title: localized.title,
      category: localized.category,
      description: localized.description,
      content: localized.content,
    };
  }

  if (locale === 'en') return bilingual;

  return {
    ...bilingual,
    category: translateCategory(categoryToEnglish(bilingual.category), 'he'),
  };
}

export function localizeLetters(letters: Letter[], locale: Locale): Letter[] {
  return letters.map((letter) => localizeLetter(letter, locale));
}

export function getCanonicalCategory(category: string, locale: Locale): string {
  if (locale === 'he') return categoryToEnglish(category);
  return category;
}
