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
