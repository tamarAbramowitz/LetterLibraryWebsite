import type { Letter } from './letter';

export type Tone = 'Friendly' | 'Formal' | 'Emotional' | 'Encouraging';

export const TONES: Tone[] = ['Friendly', 'Formal', 'Emotional', 'Encouraging'];

export interface GenerateLetterRequest {
  title: string;
  category: string;
  description: string;
  tone: Tone;
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
}

export interface LetterFormErrors {
  title?: string;
  category?: string;
  description?: string;
  tone?: string;
}
