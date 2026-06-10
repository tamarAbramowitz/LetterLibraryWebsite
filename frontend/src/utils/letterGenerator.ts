import type { Locale } from '../i18n/types';
import type { GenerateLetterRequest, Tone } from '../types/generate';

type ToneStyle = {
  opening: string;
  closing: string;
  body: (r: GenerateLetterRequest) => string;
};

const TONE_GUIDANCE_EN: Record<Tone, ToneStyle> = {
  Friendly: {
    opening: 'Dear Friend,',
    closing: 'With warmth and friendship,\nYour friend',
    body: (r) =>
      `I wanted to take a moment to write about ${r.title.toLowerCase()}. ${r.description} ` +
      `This has been on my mind, and I felt it was worth putting into words.\n\n` +
      `There is something special about moments like these — they remind us what matters most. ` +
      `Whether we are celebrating, reflecting, or simply sharing what we feel, ` +
      `letters have a way of capturing what spoken words sometimes cannot.\n\n` +
      `I hope this message finds you well and brings a smile to your day. ` +
      `Know that you are thought of fondly, and that this ${r.category.toLowerCase()} letter ` +
      `comes from a place of genuine care.`,
  },
  Formal: {
    opening: 'Dear Sir or Madam,',
    closing: 'Sincerely yours,\nWith respect',
    body: (r) =>
      `I am writing to address the matter of ${r.title.toLowerCase()}. ${r.description}\n\n` +
      `I wish to express my thoughts on this occasion with the consideration it deserves. ` +
      `Matters of ${r.category.toLowerCase()} significance deserve to be acknowledged with clarity ` +
      `and respect, and I hope these words convey that appropriately.\n\n` +
      `Please accept this letter as a sincere expression of my sentiments on the subject. ` +
      `I trust it will be received in the spirit in which it was written.`,
  },
  Emotional: {
    opening: 'Dear Friend,',
    closing: 'With all my heart,\nSomeone who cares deeply',
    body: (r) =>
      `I have been carrying these words in my heart for some time now. ${r.description}\n\n` +
      `When I think about ${r.title.toLowerCase()}, I feel a depth of emotion that is not always easy ` +
      `to express. But some feelings deserve to be spoken — or written — even when ` +
      `finding the right words takes courage.\n\n` +
      `This letter is my attempt to honor what I feel. I hope you can sense the sincerity ` +
      `behind every line. You matter more than you may know, and this moment — ` +
      `this ${r.category.toLowerCase()} message — is my way of telling you that.`,
  },
  Encouraging: {
    opening: 'Dear Friend,',
    closing: 'Believing in you always,\nYour supporter',
    body: (r) =>
      `I am writing because I believe in you, and because ${r.description.replace(/\.$/, '').toLowerCase()}. ` +
      `This is about ${r.title.toLowerCase()}, and I want you to know that you are capable ` +
      `of more than you sometimes give yourself credit for.\n\n` +
      `Every challenge carries within it the seed of growth. I have seen your strength ` +
      `before — in quiet moments and in difficult ones — and I know it has not disappeared. ` +
      `It is still there, waiting for you to draw on it.\n\n` +
      `Take this one step at a time. You do not need to have everything figured out today. ` +
      `What you need is to keep going, and to remember that someone is cheering for you ` +
      `every step of the way.`,
  },
};

const TONE_GUIDANCE_HE: Record<Tone, ToneStyle> = {
  Friendly: {
    opening: 'חבר/ה יקר/ה,',
    closing: 'בחום ובידידות,\nחבר/ה שלך',
    body: (r) =>
      `רציתי לקחת רגע ולכתוב על ${r.title}. ${r.description}\n\n` +
      `יש משהו מיוחד ברגעים כאלה — הם מזכירים לנו מה באמת חשוב. ` +
      `בין אם אנחנו חוגגים, מהרהרים או פשוט משתפים את מה שאנחנו מרגישים, ` +
      `למכתבים יש דרך לתפוס דברים שמילים מדוברות לפעמים לא מצליחות.\n\n` +
      `אני מקווה שהמסר הזה מגיע אליך בשלום ומביא חיוך ליום שלך. ` +
      `דע/י שאת/ה נמצא/ת במחשבות שלי, ושהמכתב הזה בנושא ${r.category} ` +
      `מגיע ממקום של אכפתיות אמיתית.`,
  },
  Formal: {
    opening: 'לכבוד,',
    closing: 'בכבוד רב,\nבברכה',
    body: (r) =>
      `אני פונה אליך בנושא ${r.title}. ${r.description}\n\n` +
      `אבקש לבטא את מחשבותיי באירוע זה בכבוד ובהתאם לחשיבותו. ` +
      `נושאים של ${r.category} ראויים להכרה ברורה ומכובדת, ואני מקווה שהמילים הללו משקפות זאת.\n\n` +
      `אנא קבל/י מכתב זה כביטוי כן של רגשותיי בנושא. ` +
      `אני מאמין/ה שהוא יתקבל ברוח שבה נכתב.`,
  },
  Emotional: {
    opening: 'חבר/ה יקר/ה,',
    closing: 'מכל הלב,\nמישהו שאכפת לו ממך מאוד',
    body: (r) =>
      `אני נושא/ת את המילים האלה בלב כבר זמן מה. ${r.description}\n\n` +
      `כשאני חושב/ת על ${r.title}, אני מרגיש/ה עומק רגשי שלא תמיד קל לבטא. ` +
      `אבל יש רגשות שמגיעים להיאמר — או להיכתב — גם כשמציאת המילים הנכונות דורשת אומץ.\n\n` +
      `המכתב הזה הוא הניסיון שלי לכבד את מה שאני מרגיש/ה. אני מקווה שתרגיש/י את הכנות שבכל שורה. ` +
      `את/ה חשוב/ה יותר ממה שאולי נדמה לך, והמסר הזה בנושא ${r.category} ` +
      `הוא הדרך שלי להגיד לך את זה.`,
  },
  Encouraging: {
    opening: 'חבר/ה יקר/ה,',
    closing: 'תמיד מאמין/ה בך,\nהמעודד/ת שלך',
    body: (r) =>
      `אני כותב/ת כי אני מאמין/ה בך, וכי ${r.description.replace(/\.$/, '')}. ` +
      `זה עוסק ב${r.title}, ואני רוצה שתדע/י שאת/ה מסוגל/ת ` +
      `להרבה יותר ממה שאת/ה לפעמים נותן/ת לעצמך.\n\n` +
      `כל אתגר נושא בתוכו זרע של צמיחה. ראיתי את הכוח שלך בעבר — ברגעים שקטים וגם בקשים — ` +
      `והוא לא נעלם. הוא עדיין שם, מחכה שתשתמש/י בו.\n\n` +
      `קח/י את זה צעד אחרי צעד. לא חייבים להבין הכול היום. ` +
      `מה שצריך זה להמשיך, ולזכור שמישהו מעודד אותך בכל צעד.`,
  },
};

export function generateLetterContent(request: GenerateLetterRequest, locale: Locale = 'en'): string {
  const guidance = locale === 'he' ? TONE_GUIDANCE_HE : TONE_GUIDANCE_EN;
  const style = guidance[request.tone];
  return `${style.opening}\n\n${style.body(request)}\n\n${style.closing}`;
}

export function categoryToImage(category: string): string {
  const slug = category.toLowerCase().trim().replace(/\s+/g, '-');
  const known = new Set([
    'appreciation', 'congratulations', 'missing-you', 'encouragement', 'check-in',
    'milestone-birthday', 'apology', 'inspiration', 'memory', 'success', 'thank-you',
    'new-beginning', 'friendship', 'creative', 'end-of-year', 'education',
    'הערכה', 'ברכות', 'מתגעגעים', 'עידוד', 'בדיקת-מצב',
    'יום-הולדת-אבן-דרך', 'התנצלות', 'השראה', 'זיכרון', 'הצלחה', 'תודה',
    'התחלה-חדשה', 'חברות', 'יצירתי', 'ברכות-לסוף-השנה', 'חינוך',
  ]);
  return known.has(slug) ? slug : 'creative';
}
