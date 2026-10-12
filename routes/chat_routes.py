from fastapi import APIRouter

from constants.server_codes import SERVER_BASE_URL
from controllers.users.send_chat import send_chat_message
from controllers.users.get_chat import get_session_messages, get_audit_logs
from controllers.users.session_management import init_game_session

CHAT_ROUTER = APIRouter(prefix=f"{SERVER_BASE_URL}/users/chat", tags=["Chat API"])

CHAT_ROUTER.add_api_route("/send", send_chat_message, methods=["POST"])
CHAT_ROUTER.add_api_route("/messages", get_session_messages, methods=["GET"])
CHAT_ROUTER.add_api_route("/session/init", init_game_session, methods=["POST"])
CHAT_ROUTER.add_api_route("/game/init", init_game_session, methods=["POST"])
CHAT_ROUTER.add_api_route("/audit-logs", get_audit_logs, methods=["GET"])
