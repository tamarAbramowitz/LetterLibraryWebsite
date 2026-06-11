from fastapi import APIRouter, Depends, HTTPException

from app.auth import get_current_user
from app.schemas.generate import GenerateLetterRequest, GenerateLetterResponse
from app.schemas.letter import Letter
from app.services.ai_service import AIService
from app.services.letter_service import LetterService

router = APIRouter(tags=["generate"])


@router.post("/generate-letter", response_model=GenerateLetterResponse)
async def generate_letter(
    request: GenerateLetterRequest,
    current_user: str = Depends(get_current_user),
) -> GenerateLetterResponse:
    try:
        content = await AIService.generate_letter_content(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to generate letter: {exc}") from exc

    if not content.strip():
        raise HTTPException(status_code=500, detail="Generated letter content was empty")

    letter = LetterService.create_letter(
        title=request.title,
        category=request.category,
        description=request.description,
        content=content,
        user_id=current_user,
    )

    return GenerateLetterResponse(letter=Letter(**letter.to_dict()), saved=True)
