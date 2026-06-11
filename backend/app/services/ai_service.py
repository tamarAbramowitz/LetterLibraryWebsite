import os

import httpx

from app.schemas.generate import Gender, GenerateLetterRequest, Tone

TONE_GUIDANCE = {
    Tone.FRIENDLY: "warm, conversational, and approachable — like writing to a close friend",
    Tone.FORMAL: "polished, respectful, and professional — suitable for official or dignified occasions",
    Tone.EMOTIONAL: "deeply heartfelt, sincere, and emotionally expressive — let genuine feeling show",
    Tone.ENCOURAGING: "uplifting, supportive, and motivating — inspire confidence and hope",
}

GENDER_GUIDANCE = {
    Gender.MALE: (
        "The recipient is male. Address him strictly as a male throughout the entire letter — "
        "use masculine greetings, pronouns (he/him/his), and any gendered language appropriate "
        "for a male recipient."
    ),
    Gender.FEMALE: (
        "The recipient is female. Address her strictly as a female throughout the entire letter — "
        "use feminine greetings, pronouns (she/her/hers), and any gendered language appropriate "
        "for a female recipient."
    ),
}


class AIService:
    @staticmethod
    def _build_prompt(request: GenerateLetterRequest) -> str:
        tone_hint = TONE_GUIDANCE[request.tone]
        gender_hint = GENDER_GUIDANCE[request.gender]
        return f"""Write a complete personal letter with the following details:

Title: {request.title}
Category: {request.category}
Context: {request.description}
Tone: {request.tone.value} — {tone_hint}
Recipient gender: {request.gender.value} — {gender_hint}

Requirements:
- Write 300-450 words
- Start with an appropriate greeting for the recipient's gender
- End with a warm, natural closing and signature line
- Make it feel personal, realistic, and emotionally engaging
- Do NOT include a subject line or metadata — only the letter body
- Use paragraph breaks between sections (blank line between paragraphs)
- If writing in Hebrew, use grammatically correct gendered forms (זכר/נקבה) matching the recipient throughout
"""

    @classmethod
    async def generate_letter_content(cls, request: GenerateLetterRequest) -> str:
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            try:
                return await cls._generate_with_openai(request, api_key)
            except Exception:
                pass
        return cls._generate_with_template(request)

    @classmethod
    async def _generate_with_openai(cls, request: GenerateLetterRequest, api_key: str) -> str:
        prompt = cls._build_prompt(request)
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}"},
                json={
                    "model": os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a skilled writer who crafts beautiful personal letters.",
                        },
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.8,
                },
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"].strip()

    @staticmethod
    def _generate_with_template(request: GenerateLetterRequest) -> str:
        tone = request.tone
        title = request.title
        desc = request.description
        category = request.category
        is_female = request.gender == Gender.FEMALE

        openings = {
            Tone.FRIENDLY: "Dear Friend,",
            Tone.FORMAL: "Dear Madam," if is_female else "Dear Sir,",
            Tone.EMOTIONAL: "Dear Friend,",
            Tone.ENCOURAGING: "Dear Friend,",
        }
        closings = {
            Tone.FRIENDLY: "With warmth and friendship,\nYour friend",
            Tone.FORMAL: "Sincerely yours,\nWith respect",
            Tone.EMOTIONAL: "With all my heart,\nSomeone who cares deeply",
            Tone.ENCOURAGING: "Believing in you always,\nYour supporter",
        }

        pronoun = "she" if is_female else "he"
        body_styles = {
            Tone.FRIENDLY: (
                f"I wanted to take a moment to write about {title.lower()}. "
                f"{desc} "
                f"This has been on my mind, and I felt it was worth putting into words.\n\n"
                f"There is something special about moments like these — they remind us what matters most. "
                f"Whether we are celebrating, reflecting, or simply sharing what we feel, "
                f"letters have a way of capturing what spoken words sometimes cannot.\n\n"
                f"I hope this message finds you well and brings a smile to your day. "
                f"Know that you are thought of fondly, and that this {category.lower()} letter "
                f"comes from a place of genuine care."
            ),
            Tone.FORMAL: (
                f"I am writing to address the matter of {title.lower()}. "
                f"{desc}\n\n"
                f"I wish to express my thoughts on this occasion with the consideration it deserves. "
                f"Matters of {category.lower()} significance deserve to be acknowledged with clarity "
                f"and respect, and I hope these words convey that appropriately.\n\n"
                f"Please accept this letter as a sincere expression of my sentiments on the subject. "
                f"I trust it will be received in the spirit in which it was written."
            ),
            Tone.EMOTIONAL: (
                f"I have been carrying these words in my heart for some time now. "
                f"{desc}\n\n"
                f"When I think about {title.lower()}, I feel a depth of emotion that is not always easy "
                f"to express. But some feelings deserve to be spoken — or written — even when "
                f"finding the right words takes courage.\n\n"
                f"This letter is my attempt to honor what I feel. I hope you can sense the sincerity "
                f"behind every line. You matter more than you may know, and this moment — "
                f"this {category.lower()} message — is my way of telling you that."
            ),
            Tone.ENCOURAGING: (
                f"I am writing because I believe in you, and because {desc.lower().rstrip('.')}. "
                f"This is about {title.lower()}, and I want you to know that you are capable "
                f"of more than you sometimes give yourself credit for.\n\n"
                f"Every challenge carries within it the seed of growth. I have seen your strength "
                f"before — in quiet moments and in difficult ones — and I know it has not disappeared. "
                f"It is still there, waiting for you to draw on it.\n\n"
                f"Take this one step at a time. You do not need to have everything figured out today. "
                f"What you need is to keep going, and to remember that someone is cheering for "
                f"{pronoun} every step of the way."
            ),
        }

        return f"{openings[tone]}\n\n{body_styles[tone]}\n\n{closings[tone]}"
