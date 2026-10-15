from types import SimpleNamespace
from sqlalchemy.orm import Session

from utils.server_response import server_response
from schemas.request_schemas import SigninRequest
from schemas.postgredb_schema import Engine, Users
from constants.server_codes import SUCCESS, INTERNAL_SERVER_ERROR

STATIC_TEXT = SimpleNamespace(
    USER_SIGNIN_SUCCESS="User signed in successfully",
    USER_SIGNIN_FAILED="Failed to sign in user",
)

async def user_signin(signin_data: SigninRequest):
    with Session(Engine) as db:
        try:
            user = db.query(Users).filter(Users.email == signin_data.email).first()
            if not user:
                return server_response(
                    status_code=INTERNAL_SERVER_ERROR,
                    message=STATIC_TEXT.USER_SIGNIN_FAILED,
                )

            return server_response(
                status_code=SUCCESS,
                message=STATIC_TEXT.USER_SIGNIN_SUCCESS,
                data={
                    "user_id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role.value,
                },
            )

        except Exception as e:
            db.rollback()
            return server_response(
                status_code=INTERNAL_SERVER_ERROR,
                message=STATIC_TEXT.USER_SIGNIN_FAILED,
            )