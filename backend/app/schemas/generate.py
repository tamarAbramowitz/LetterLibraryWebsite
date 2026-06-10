from enum import Enum

from pydantic import BaseModel, Field


class Tone(str, Enum):
    FRIENDLY = "Friendly"
    FORMAL = "Formal"
    EMOTIONAL = "Emotional"
    ENCOURAGING = "Encouraging"


class GenerateLetterRequest(BaseModel):
    title: str = Field(..., min_length=2, max_length=120)
    category: str = Field(..., min_length=2, max_length=60)
    description: str = Field(..., min_length=10, max_length=1000)
    tone: Tone


class GenerateLetterResponse(BaseModel):
    letter: "Letter"
    saved: bool = True


from app.schemas.letter import Letter  # noqa: E402

GenerateLetterResponse.model_rebuild()
