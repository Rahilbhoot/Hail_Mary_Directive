from pydantic import BaseModel


class SignupRequest(BaseModel):
    name: str
    email: str
    role: str

class SigninRequest(BaseModel):
    email: str

class ChatRequest(BaseModel):
    user: str
    message: str
    session_id: int

class CreateGameSessionRequest(BaseModel):
    users: list[str]