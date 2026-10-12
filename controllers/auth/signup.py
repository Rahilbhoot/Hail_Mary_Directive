from sqlalchemy.orm import Session
from types import SimpleNamespace
from datetime import datetime

from schemas.postgredb_schema import Users
from schemas.postgredb_schema import Engine
from schemas.request_schemas import SignupRequest
from constants.server_codes import SUCCESS, INTERNAL_SERVER_ERROR
from utils.server_response import server_response
from utils.pass_hash import hash_password

STATIC_TEXT = SimpleNamespace(
    user_created="User created successfully",
    user_creation_error="Error creating user",
)


async def sign_up(user_data: SignupRequest):
    with Session(Engine) as s:
        try:
            user_data = user_data.model_dump()
            user_role = user_data.get("role") or "mc"
            from constants.enums import UserRole

            try:
                role_enum = UserRole(user_role.lower())
            except Exception:
                role_enum = UserRole.MC

            raw_name = user_data.get("name") or "User"
            new_user = Users(
                username=raw_name,
                name=raw_name,
                email=user_data.get("email"),
                password=hash_password(user_data.get("password")),
                role=role_enum,
                created_at=datetime.now(),
            )
            s.add(new_user)
            s.commit()
            s.refresh(new_user)
            return server_response(
                status_code=SUCCESS,
                data={"user": new_user.id},
                message=STATIC_TEXT.user_created,
            )
        except Exception as e:
            s.rollback()
            return server_response(
                status_code=INTERNAL_SERVER_ERROR,
                message=STATIC_TEXT.user_creation_error,
            )
