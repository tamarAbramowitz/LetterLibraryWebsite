import type { Locale } from '../i18n/types';

export interface LetterContent {
  title: string;
  category: string;
  description: string;
  content: string;
}

export interface Letter {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  content: string;
  createdLocale?: Locale;
  translations?: Partial<Record<Locale, LetterContent>>;
}

export interface LetterListResponse {
  letters: Letter[];
  total: number;
  page: number;
  page_size: number;
  categories: string[];
}
