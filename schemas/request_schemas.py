from pydantic import BaseModel
from typing import Optional


class SignupRequest(BaseModel):
    name: str
    email: str
    password: str = "sit@123"
    role: Optional[str] = None


class SigninRequest(BaseModel):
    email: str
    password: str


class ChatRequest(BaseModel):
    message: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class SignOutRequest(BaseModel):
    refresh_token: str
