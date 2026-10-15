from types import SimpleNamespace
from sqlalchemy.orm import Session

from utils.server_response import server_response
from schemas.postgredb_schema import Engine, GameSessions
from schemas.request_schemas import CreateGameSessionRequest
from constants.server_codes import CREATED, INTERNAL_SERVER_ERROR

STATIC_TEXT = SimpleNamespace(
    SESSION_CREATED_SUCCESS="New game session created successfully",
    SESSION_CONFLICT="An active session already exists. Cannot create a new session.",
    SESSION_CREATION_FAILED="Failed to create a new game session",
    ACCESS_DENIED="Access denied. Only admins can create active sessions.",
)

async def create_game_session(game_data: CreateGameSessionRequest):
    with Session(Engine) as db:
        try:
            new_session = GameSessions(
                users=game_data.users,
                is_active=False,
                token_found=False,
            )
            db.add(new_session)
            db.commit()
            db.refresh(new_session)
            return server_response(
                status_code=CREATED,
                message=STATIC_TEXT.SESSION_CREATED_SUCCESS,
                data={
                    "session_id": new_session.id,
                    "users": new_session.users,
                    "is_active": new_session.is_active,
                    "token_found": new_session.token_found,
                },
            )

        except Exception as e:
            db.rollback()
            return server_response(
                status_code=INTERNAL_SERVER_ERROR,
                message=STATIC_TEXT.SESSION_CREATION_FAILED,
                data=str(e),
            )