import type { Letter } from './letter';

export type Tone = 'Friendly' | 'Formal' | 'Emotional' | 'Encouraging';

export const TONES: Tone[] = ['Friendly', 'Formal', 'Emotional', 'Encouraging'];

export type Gender = 'male' | 'female';

export const GENDERS: Gender[] = ['male', 'female'];

export interface GenerateLetterRequest {
  title: string;
  category: string;
  description: string;
  tone: Tone;
  gender: Gender;
}

export interface GenerateLetterResponse {
  letter: Letter;
  saved: boolean;
}

export interface LetterFormData {
  title: string;
  category: string;
  description: string;
  tone: Tone;
  gender: Gender;
}

export interface LetterFormErrors {
  title?: string;
  category?: string;
  description?: string;
  tone?: string;
  gender?: string;
}
