import type { GenerateLetterRequest, Tone } from '../types/generate';

const TONE_GUIDANCE: Record<Tone, { opening: string; closing: string; body: (r: GenerateLetterRequest) => string }> = {
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

export function generateLetterContent(request: GenerateLetterRequest): string {
  const style = TONE_GUIDANCE[request.tone];
  return `${style.opening}\n\n${style.body(request)}\n\n${style.closing}`;
}

export function categoryToImage(category: string): string {
  const slug = category.toLowerCase().trim().replace(/\s+/g, '-');
  const known = new Set([
    'appreciation', 'congratulations', 'missing-you', 'encouragement', 'check-in',
    'milestone-birthday', 'apology', 'inspiration', 'memory', 'success', 'thank-you',
    'new-beginning', 'friendship', 'creative', 'end-of-year', 'education',
  ]);
  return known.has(slug) ? slug : 'creative';
}
