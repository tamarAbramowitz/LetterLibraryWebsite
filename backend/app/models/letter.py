from dataclasses import dataclass


@dataclass
class LetterModel:
    id: int
    title: str
    category: str
    description: str
    image: str
    content: str

    @classmethod
    def from_dict(cls, data: dict) -> "LetterModel":
        return cls(**data)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "description": self.description,
            "image": self.image,
            "content": self.content,
        }
