from dataclasses import dataclass


@dataclass
class LetterModel:
    id: int
    title: str
    category: str
    description: str
    image: str
    content: str
    user_id: str | None = None

    @classmethod
    def from_dict(cls, data: dict) -> "LetterModel":
        return cls(
            id=data["id"],
            title=data["title"],
            category=data["category"],
            description=data["description"],
            image=data["image"],
            content=data["content"],
            user_id=data.get("user_id"),
        )

    def to_dict(self) -> dict:
        result = {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "description": self.description,
            "image": self.image,
            "content": self.content,
        }
        if self.user_id is not None:
            result["user_id"] = self.user_id
        return result
