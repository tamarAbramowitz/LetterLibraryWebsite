import type { LetterFormData, LetterFormErrors } from '../types/generate';
import { TONES } from '../types/generate';

export function validateLetterForm(data: LetterFormData): LetterFormErrors {
  const errors: LetterFormErrors = {};

  if (!data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.trim().length < 2) {
    errors.title = 'Title must be at least 2 characters';
  }

  if (!data.category.trim()) {
    errors.category = 'Category is required';
  }

  if (!data.description.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  if (!TONES.includes(data.tone)) {
    errors.tone = 'Please select a tone';
  }

  return errors;
}

export function hasFormErrors(errors: LetterFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
