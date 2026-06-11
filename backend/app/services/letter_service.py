import json
from pathlib import Path

from app.models.letter import LetterModel

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "letters.json"


class LetterService:
    @staticmethod
    def _load_all() -> list[LetterModel]:
        with open(DATA_PATH, encoding="utf-8") as f:
            data = json.load(f)
        return [LetterModel.from_dict(item) for item in data]

    @classmethod
    def get_all(
        cls,
        search: str | None = None,
        category: str | None = None,
        page: int = 1,
        page_size: int = 12,
    ) -> tuple[list[LetterModel], int, list[str]]:
        letters = cls._load_all()
        categories = sorted({l.category for l in letters})

        if category:
            letters = [l for l in letters if l.category.lower() == category.lower()]

        if search:
            query = search.lower()
            letters = [
                l
                for l in letters
                if query in l.title.lower()
                or query in l.description.lower()
                or query in l.content.lower()
                or query in l.category.lower()
            ]

        total = len(letters)
        start = (page - 1) * page_size
        end = start + page_size

        return letters[start:end], total, categories

    @classmethod
    def get_by_id(cls, letter_id: int) -> LetterModel | None:
        for letter in cls._load_all():
            if letter.id == letter_id:
                return letter
        return None

    @classmethod
    def get_categories(cls) -> list[str]:
        letters = cls._load_all()
        return sorted({l.category for l in letters})

    @classmethod
    def _save_all(cls, letters: list[LetterModel]) -> None:
        data = [l.to_dict() for l in letters]
        with open(DATA_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")

    @classmethod
    def get_next_id(cls) -> int:
        letters = cls._load_all()
        return max((l.id for l in letters), default=0) + 1

    @staticmethod
    def category_to_image(category: str) -> str:
        slug = category.lower().strip().replace(" ", "-")
        known = {
            "appreciation", "congratulations", "missing-you", "encouragement",
            "check-in", "milestone-birthday", "apology", "inspiration", "memory",
            "success", "thank-you", "new-beginning", "friendship", "creative",
            "end-of-year", "education",
        }
        return slug if slug in known else "creative"

    @classmethod
    def create_letter(
        cls,
        title: str,
        category: str,
        description: str,
        content: str,
        user_id: str | None = None,
    ) -> LetterModel:
        letter = LetterModel(
            id=cls.get_next_id(),
            title=title,
            category=category,
            description=description,
            image=cls.category_to_image(category),
            content=content,
            user_id=user_id,
        )
        letters = cls._load_all()
        letters.append(letter)
        cls._save_all(letters)
        return letter

    @classmethod
    def delete_by_id(cls, letter_id: int, user_id: str) -> bool:
        letters = cls._load_all()
        letter = next((l for l in letters if l.id == letter_id), None)
        if not letter:
            return False
        if letter.user_id is None:
            raise PermissionError("Library letters cannot be deleted")
        if letter.user_id != user_id:
            raise PermissionError("Not authorized to delete this letter")
        cls._save_all([l for l in letters if l.id != letter_id])
        return True
