import type { TranslationKey } from '../i18n/translations/en';
import type { LetterFormData, LetterFormErrors } from '../types/generate';
import { TONES } from '../types/generate';

type FormErrors = TranslationKey['form']['errors'];

export function validateLetterForm(data: LetterFormData, messages: FormErrors): LetterFormErrors {
  const errors: LetterFormErrors = {};

  if (!data.title.trim()) {
    errors.title = messages.titleRequired;
  } else if (data.title.trim().length < 2) {
    errors.title = messages.titleMin;
  }

  if (!data.category.trim()) {
    errors.category = messages.categoryRequired;
  }

  if (!data.description.trim()) {
    errors.description = messages.descriptionRequired;
  } else if (data.description.trim().length < 10) {
    errors.description = messages.descriptionMin;
  }

  if (!TONES.includes(data.tone)) {
    errors.tone = messages.toneRequired;
  }

  return errors;
}

export function hasFormErrors(errors: LetterFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
