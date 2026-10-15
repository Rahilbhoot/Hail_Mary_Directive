from types import SimpleNamespace
from sqlalchemy.orm import Session

from utils.server_response import server_response
from schemas.postgredb_schema import Engine, GameSessions
from constants.server_codes import SUCCESS, INTERNAL_SERVER_ERROR, NOT_FOUND

STATIC_TEXT = SimpleNamespace(
    GAME_STARTED_SUCCESS="Started Game successfully",
    GAME_NOT_FOUND="Game Not found",
    GAME_START_FAILED="Failed to start the game",
)

async def start_game(session_id: int):
    with Session(Engine) as db:
        try:
            game = db.query(GameSessions).filter(GameSessions.id == session_id).first()
            if not game:
                return server_response(
                    status_code=NOT_FOUND,
                    message=STATIC_TEXT.GAME_NOT_FOUND,
                )
            game.is_active = True
            db.commit()
            return server_response(
                status_code=SUCCESS,
                message=STATIC_TEXT.GAME_STARTED_SUCCESS,
                data={
                    "session_id": game.id,
                    "is_active": game.is_active,
                    "token_found": game.token_found,
                    "users": game.users,
                },
            )
        except Exception as e:
            db.rollback()
            return server_response(
                status_code=INTERNAL_SERVER_ERROR,
                message=STATIC_TEXT.GAME_START_FAILED,
            )