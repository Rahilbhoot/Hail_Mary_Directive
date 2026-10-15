from types import SimpleNamespace
from sqlalchemy.orm import Session

from utils.server_response import server_response
from schemas.postgredb_schema import Engine, GameSessions
from constants.server_codes import INTERNAL_SERVER_ERROR, SUCCESS

STATIC_TEXT = SimpleNamespace(
    GAMES_RETRIEVED_SUCCESS="All games retrieved successfully",
    GAMES_RETRIEVAL_FAILED="Failed to retrieve games",
)

async def get_all_games():
    with Session(Engine) as db:
        try:
            games = db.query(GameSessions).all()
            game_list = [
                {
                    "session_id": game.id,
                    "is_active": game.is_active,
                    "token_found": game.token_found,
                    "users": game.users,
                    "created_at": game.created_at.isoformat(),
                }
                for game in games
            ]
            return server_response(
                status_code=SUCCESS,
                message=STATIC_TEXT.GAMES_RETRIEVED_SUCCESS,
                data=game_list,
            )
        except Exception as e:
            db.rollback()
            return server_response(
                status_code=INTERNAL_SERVER_ERROR,
                message=STATIC_TEXT.GAMES_RETRIEVAL_FAILED,
            )