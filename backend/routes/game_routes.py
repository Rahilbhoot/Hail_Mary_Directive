from fastapi import APIRouter

from controllers.game.end_game import end_game
from controllers.game.create_game import create_game_session
from controllers.game.start_game import start_game
from controllers.game.get_all_games import get_all_games

GAME_ROUTER = APIRouter(prefix="/game", tags=["Game API"])

GAME_ROUTER.add_api_route("/create", create_game_session, methods=["POST"])
GAME_ROUTER.add_api_route("/start/{session_id}", start_game, methods=["POST"])
GAME_ROUTER.add_api_route("/all", get_all_games, methods=["GET"])
GAME_ROUTER.add_api_route("/end_game/{session_id}", end_game, methods=["POST"])