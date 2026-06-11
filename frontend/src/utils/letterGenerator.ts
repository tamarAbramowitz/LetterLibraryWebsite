import type { Locale } from '../i18n/types';
import type { Gender, GenerateLetterRequest, Tone } from '../types/generate';

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

const TONE_GUIDANCE_HE_MALE: Record<Tone, ToneStyle> = {
  Friendly: {
    opening: 'חבר יקר,',
    closing: 'בחום ובידידות,\nחבר שלך',
    body: (r) =>
      `רציתי לקחת רגע ולכתוב על ${r.title}. ${r.description}\n\n` +
      `יש משהו מיוחד ברגעים כאלה — הם מזכירים לנו מה באמת חשוב. ` +
      `בין אם אנחנו חוגגים, מהרהרים או פשוט משתפים את מה שאנחנו מרגישים, ` +
      `למכתבים יש דרך לתפוס דברים שמילים מדוברות לפעמים לא מצליחות.\n\n` +
      `אני מקווה שהמסר הזה מגיע אליך בשלום ומביא חיוך ליום שלך. ` +
      `דע שאתה נמצא במחשבות שלי, ושהמכתב הזה בנושא ${r.category} ` +
      `מגיע ממקום של אכפתיות אמיתית.`,
  },
  Formal: {
    opening: 'לכבוד,',
    closing: 'בכבוד רב,\nבברכה',
    body: (r) =>
      `אני פונה אליך בנושא ${r.title}. ${r.description}\n\n` +
      `אבקש לבטא את מחשבותיי באירוע זה בכבוד ובהתאם לחשיבותו. ` +
      `נושאים של ${r.category} ראויים להכרה ברורה ומכובדת, ואני מקווה שהמילים הללו משקפות זאת.\n\n` +
      `אנא קבל מכתב זה כביטוי כן של רגשותיי בנושא. ` +
      `אני מאמין שהוא יתקבל ברוח שבה נכתב.`,
  },
  Emotional: {
    opening: 'חבר יקר,',
    closing: 'מכל הלב,\nמישהו שאכפת לו ממך מאוד',
    body: (r) =>
      `אני נושא את המילים האלה בלב כבר זמן מה. ${r.description}\n\n` +
      `כשאני חושב על ${r.title}, אני מרגיש עומק רגשי שלא תמיד קל לבטא. ` +
      `אבל יש רגשות שמגיעים להיאמר — או להיכתב — גם כשמציאת המילים הנכונות דורשת אומץ.\n\n` +
      `המכתב הזה הוא הניסיון שלי לכבד את מה שאני מרגיש. אני מקווה שתרגיש את הכנות שבכל שורה. ` +
      `אתה חשוב יותר ממה שאולי נדמה לך, והמסר הזה בנושא ${r.category} ` +
      `הוא הדרך שלי להגיד לך את זה.`,
  },
  Encouraging: {
    opening: 'חבר יקר,',
    closing: 'תמיד מאמין בך,\nהמעודד שלך',
    body: (r) =>
      `אני כותב כי אני מאמין בך, וכי ${r.description.replace(/\.$/, '')}. ` +
      `זה עוסק ב${r.title}, ואני רוצה שתדע שאתה מסוגל ` +
      `להרבה יותר ממה שאתה לפעמים נותן לעצמך.\n\n` +
      `כל אתגר נושא בתוכו זרע של צמיחה. ראיתי את הכוח שלך בעבר — ברגעים שקטים וגם בקשים — ` +
      `והוא לא נעלם. הוא עדיין שם, מחכה שתשתמש בו.\n\n` +
      `קח את זה צעד אחרי צעד. לא חייבים להבין הכול היום. ` +
      `מה שצריך זה להמשיך, ולזכור שמישהו מעודד אותך בכל צעד.`,
  },
};

const TONE_GUIDANCE_HE_FEMALE: Record<Tone, ToneStyle> = {
  Friendly: {
    opening: 'חברה יקרה,',
    closing: 'בחום ובידידות,\nחברה שלך',
    body: (r) =>
      `רציתי לקחת רגע ולכתוב על ${r.title}. ${r.description}\n\n` +
      `יש משהו מיוחד ברגעים כאלה — הם מזכירים לנו מה באמת חשוב. ` +
      `בין אם אנחנו חוגגים, מהרהרים או פשוט משתפים את מה שאנחנו מרגישים, ` +
      `למכתבים יש דרך לתפוס דברים שמילים מדוברות לפעמים לא מצליחות.\n\n` +
      `אני מקווה שהמסר הזה מגיע אלייך בשלום ומביא חיוך ליום שלך. ` +
      `דעי שאת נמצאת במחשבות שלי, ושהמכתב הזה בנושא ${r.category} ` +
      `מגיע ממקום של אכפתיות אמיתית.`,
  },
  Formal: {
    opening: 'לכבוד,',
    closing: 'בכבוד רב,\nבברכה',
    body: (r) =>
      `אני פונה אלייך בנושא ${r.title}. ${r.description}\n\n` +
      `אבקשי לבטא את מחשבותיי באירוע זה בכבוד ובהתאם לחשיבותו. ` +
      `נושאים של ${r.category} ראויים להכרה ברורה ומכובדת, ואני מקווה שהמילים הללו משקפות זאת.\n\n` +
      `אנא קבלי מכתב זה כביטוי כן של רגשותיי בנושא. ` +
      `אני מאמינה שהוא יתקבל ברוח שבה נכתב.`,
  },
  Emotional: {
    opening: 'חברה יקרה,',
    closing: 'מכל הלב,\nמישהי שאכפת לה ממך מאוד',
    body: (r) =>
      `אני נושאת את המילים האלה בלב כבר זמן מה. ${r.description}\n\n` +
      `כשאני חושבת על ${r.title}, אני מרגישה עומק רגשי שלא תמיד קל לבטא. ` +
      `אבל יש רגשות שמגיעים להיאמר — או להיכתב — גם כשמציאת המילים הנכונות דורשת אומץ.\n\n` +
      `המכתב הזה הוא הניסיון שלי לכבד את מה שאני מרגישה. אני מקווה שתרגישי את הכנות שבכל שורה. ` +
      `את חשובה יותר ממה שאולי נדמה לך, והמסר הזה בנושא ${r.category} ` +
      `הוא הדרך שלי להגיד לך את זה.`,
  },
  Encouraging: {
    opening: 'חברה יקרה,',
    closing: 'תמיד מאמינה בך,\nהמעודדת שלך',
    body: (r) =>
      `אני כותבת כי אני מאמינה בך, וכי ${r.description.replace(/\.$/, '')}. ` +
      `זה עוסק ב${r.title}, ואני רוצה שתדעי שאת מסוגלת ` +
      `להרבה יותר ממה שאת לפעמים נותנת לעצמך.\n\n` +
      `כל אתגר נושא בתוכו זרע של צמיחה. ראיתי את הכוח שלך בעבר — ברגעים שקטים וגם בקשים — ` +
      `והוא לא נעלם. הוא עדיין שם, מחכה שתשתמשי בו.\n\n` +
      `קחי את זה צעד אחרי צעד. לא חייבים להבין הכול היום. ` +
      `מה שצריך זה להמשיך, ולזכור שמישהי מעודדת אותך בכל צעד.`,
  },
};

function getToneGuidance(locale: Locale, gender: Gender): Record<Tone, ToneStyle> {
  if (locale === 'he') {
    return gender === 'female' ? TONE_GUIDANCE_HE_FEMALE : TONE_GUIDANCE_HE_MALE;
  }

  if (gender === 'female') {
    return {
      ...TONE_GUIDANCE_EN,
      Formal: { ...TONE_GUIDANCE_EN.Formal, opening: 'Dear Madam,' },
      Encouraging: {
        ...TONE_GUIDANCE_EN.Encouraging,
        body: (r) =>
          `I am writing because I believe in you, and because ${r.description.replace(/\.$/, '').toLowerCase()}. ` +
          `This is about ${r.title.toLowerCase()}, and I want you to know that you are capable ` +
          `of more than you sometimes give yourself credit for.\n\n` +
          `Every challenge carries within it the seed of growth. I have seen your strength ` +
          `before — in quiet moments and in difficult ones — and I know it has not disappeared. ` +
          `It is still there, waiting for you to draw on it.\n\n` +
          `Take this one step at a time. You do not need to have everything figured out today. ` +
          `What you need is to keep going, and to remember that someone is cheering for her ` +
          `every step of the way.`,
      },
    };
  }

  return {
    ...TONE_GUIDANCE_EN,
    Formal: { ...TONE_GUIDANCE_EN.Formal, opening: 'Dear Sir,' },
    Encouraging: {
      ...TONE_GUIDANCE_EN.Encouraging,
      body: (r) =>
        `I am writing because I believe in you, and because ${r.description.replace(/\.$/, '').toLowerCase()}. ` +
        `This is about ${r.title.toLowerCase()}, and I want you to know that you are capable ` +
        `of more than you sometimes give yourself credit for.\n\n` +
        `Every challenge carries within it the seed of growth. I have seen your strength ` +
        `before — in quiet moments and in difficult ones — and I know it has not disappeared. ` +
        `It is still there, waiting for you to draw on it.\n\n` +
        `Take this one step at a time. You do not need to have everything figured out today. ` +
        `What you need is to keep going, and to remember that someone is cheering for him ` +
        `every step of the way.`,
    },
  };
}

export function generateLetterContent(request: GenerateLetterRequest, locale: Locale = 'en'): string {
  const guidance = getToneGuidance(locale, request.gender);
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
