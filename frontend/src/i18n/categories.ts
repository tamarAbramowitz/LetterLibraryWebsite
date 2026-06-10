const CATEGORY_MAP: Record<string, string> = {
  Greeting: 'ברכה',
  Appreciation: 'הערכה',
  Congratulations: 'ברכות',
  'Missing You': 'מתגעגעים',
  Encouragement: 'עידוד',
  'Surprise Check-In': 'בדיקת מצב',
  'Milestone Birthday': 'יום הולדת אבן דרך',
  Apology: 'התנצלות',
  Inspiration: 'השראה',
  Memory: 'זיכרון',
  Success: 'הצלחה',
  'Thank You': 'תודה',
  'New Beginning': 'התחלה חדשה',
  Friendship: 'חברות',
  Creative: 'יצירתי',
  'End-of-Year Wishes': 'ברכות לסוף השנה',
  Education: 'חינוך',
};

const REVERSE_MAP = Object.fromEntries(
  Object.entries(CATEGORY_MAP).map(([en, he]) => [he, en])
);

function findEnglishCategory(category: string): string | undefined {
  if (category in CATEGORY_MAP) return category;
  const match = Object.keys(CATEGORY_MAP).find(
    (key) => key.toLowerCase() === category.toLowerCase()
  );
  return match;
}

export function translateCategory(category: string, locale: 'en' | 'he'): string {
  if (locale === 'en') {
    return findEnglishCategory(category) ?? category;
  }
  const english = findEnglishCategory(category);
  if (english) return CATEGORY_MAP[english];
  return REVERSE_MAP[category] ?? category;
}

export function categoryToEnglish(category: string): string {
  const english = findEnglishCategory(category);
  if (english) return english;
  return REVERSE_MAP[category] ?? category;
}

export const CATEGORY_SUGGESTIONS_EN = Object.keys(CATEGORY_MAP);
