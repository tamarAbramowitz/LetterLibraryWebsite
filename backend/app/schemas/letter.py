from pydantic import BaseModel, Field


class Letter(BaseModel):
    id: int
    title: str
    category: str
    description: str
    image: str
    content: str
    user_id: str | None = None


class LetterListResponse(BaseModel):
    letters: list[Letter]
    total: int
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=12, ge=1)
    categories: list[str]
