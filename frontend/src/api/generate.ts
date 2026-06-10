import { categoryToEnglish } from '../i18n/categories';
import type { Locale } from '../i18n/types';
import type { GenerateLetterRequest, GenerateLetterResponse } from '../types/generate';
import type { Letter } from '../types/letter';
import { attachBilingualTranslations } from '../utils/bilingualLetter';
import { categoryToImage, generateLetterContent } from '../utils/letterGenerator';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081';
const USE_STATIC_DATA = import.meta.env.VITE_USE_STATIC_DATA === 'true';

async function generateLocally(
  request: GenerateLetterRequest,
  locale: Locale
): Promise<GenerateLetterResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const canonicalCategory = categoryToEnglish(request.category);
  const content = generateLetterContent({ ...request, category: canonicalCategory }, locale);
  const baseLetter: Letter = {
    id: 0,
    title: request.title,
    category: locale === 'he' ? request.category : canonicalCategory,
    description: request.description,
    image: categoryToImage(canonicalCategory),
    content,
    createdLocale: locale,
  };
  const letter = attachBilingualTranslations(
    baseLetter,
    { ...request, category: canonicalCategory },
    locale
  );
  return { letter, saved: false };
}

export async function generateLetter(
  request: GenerateLetterRequest,
  locale: Locale = 'en'
): Promise<GenerateLetterResponse> {
  const canonicalRequest = { ...request, category: categoryToEnglish(request.category) };

  if (USE_STATIC_DATA) {
    return generateLocally(canonicalRequest, locale);
  }

  try {
    const response = await fetch(`${API_BASE}/generate-letter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(canonicalRequest),
    });

    if (response.ok) {
      const result: GenerateLetterResponse = await response.json();
      const content =
        locale === 'he'
          ? generateLetterContent(canonicalRequest, 'he')
          : result.letter.content;
      const baseLetter: Letter = {
        ...result.letter,
        content,
        createdLocale: locale,
      };
      return {
        letter: attachBilingualTranslations(baseLetter, canonicalRequest, locale),
        saved: result.saved,
      };
    }

    if (response.status === 404) {
      console.warn('Generate API not found — using local generation. Restart the backend with .\\start.ps1');
      return generateLocally(canonicalRequest, locale);
    }

    const error = await response.json().catch(() => ({}));
    throw new Error(
      typeof error.detail === 'string' ? error.detail : 'Failed to generate letter'
    );
  } catch (err) {
    if (err instanceof TypeError) {
      console.warn('Backend unreachable — using local generation');
      return generateLocally(canonicalRequest, locale);
    }
    throw err;
  }
}
