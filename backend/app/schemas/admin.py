from pydantic import BaseModel, Field


class AdminVerifyRequest(BaseModel):
    password: str = Field(..., min_length=1)


class AdminDeleteResponse(BaseModel):
    deleted: int


class AdminChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=4, max_length=128)
