from fastapi import APIRouter, Depends, HTTPException, Query

from app.auth import get_current_user, get_optional_admin, is_valid_admin_password, require_admin
from app.schemas import Letter, LetterListResponse
from app.schemas.admin import AdminChangePasswordRequest, AdminDeleteResponse, AdminVerifyRequest
from app.services import LetterService
from app.services.admin_config_service import AdminConfigService

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


@router.post("/admin/verify", status_code=204)
def verify_admin(request: AdminVerifyRequest) -> None:
    if not is_valid_admin_password(request.password):
        raise HTTPException(status_code=401, detail="Invalid admin password")


@router.post("/admin/change-password", status_code=204)
def change_admin_password(
    request: AdminChangePasswordRequest,
    _admin: None = Depends(require_admin),
) -> None:
    try:
        AdminConfigService.change_password(request.current_password, request.new_password)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.delete("/admin/all", response_model=AdminDeleteResponse)
def delete_all_letters(_admin: None = Depends(require_admin)) -> AdminDeleteResponse:
    deleted = LetterService.delete_all()
    return AdminDeleteResponse(deleted=deleted)


@router.delete("/admin/users", response_model=AdminDeleteResponse)
def delete_user_generated_letters(_admin: None = Depends(require_admin)) -> AdminDeleteResponse:
    deleted = LetterService.delete_all_user_generated()
    return AdminDeleteResponse(deleted=deleted)


@router.get("/{letter_id}", response_model=Letter)
def get_letter(letter_id: int) -> Letter:
    letter = LetterService.get_by_id(letter_id)
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")
    return Letter(**letter.to_dict())


@router.delete("/{letter_id}", status_code=204)
def delete_letter(
    letter_id: int,
    current_user: str = Depends(get_current_user),
    is_admin: bool = Depends(get_optional_admin),
) -> None:
    try:
        deleted = LetterService.delete_by_id(letter_id, current_user, admin=is_admin)
    except PermissionError as exc:
        raise HTTPException(status_code=403, detail=str(exc)) from exc

    if not deleted:
        raise HTTPException(status_code=404, detail="Letter not found")
