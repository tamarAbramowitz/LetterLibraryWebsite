from fastapi import Header, HTTPException

from app.services.admin_config_service import AdminConfigService


def get_current_user(x_user_id: str | None = Header(None, alias="X-User-Id")) -> str:
    if not x_user_id or not x_user_id.strip():
        raise HTTPException(status_code=401, detail="Authentication required")
    return x_user_id.strip()


def is_valid_admin_password(password: str | None) -> bool:
    return AdminConfigService.verify_password(password)


def require_admin(x_admin_password: str | None = Header(None, alias="X-Admin-Password")) -> None:
    if not is_valid_admin_password(x_admin_password):
        raise HTTPException(status_code=401, detail="Admin authentication required")


def get_optional_admin(
    x_admin_password: str | None = Header(None, alias="X-Admin-Password"),
) -> bool:
    return is_valid_admin_password(x_admin_password)
