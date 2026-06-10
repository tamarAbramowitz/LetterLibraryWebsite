from fastapi import APIRouter, HTTPException, Query

from app.schemas import Letter, LetterListResponse
from app.services import LetterService

router = APIRouter(prefix="/letters", tags=["letters"])


@router.get("", response_model=LetterListResponse)
def get_letters(
    search: str | None = Query(None, description="Search in title, description, and content"),
    category: str | None = Query(None, description="Filter by category"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(12, ge=1, le=50, description="Items per page"),
) -> LetterListResponse:
    letters, total, categories = LetterService.get_all(
        search=search, category=category, page=page, page_size=page_size
    )

    return LetterListResponse(
        letters=[Letter(**l.to_dict()) for l in letters],
        total=total,
        page=page,
        page_size=page_size,
        categories=categories,
    )


@router.get("/categories", response_model=list[str])
def get_categories() -> list[str]:
    return LetterService.get_categories()


@router.get("/{letter_id}", response_model=Letter)
def get_letter(letter_id: int) -> Letter:
    letter = LetterService.get_by_id(letter_id)
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")
    return Letter(**letter.to_dict())
