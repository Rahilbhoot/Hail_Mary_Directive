from fastapi import APIRouter

from constants.server_codes import SERVER_BASE_URL
from controllers.users.send_chat import send_chat_message

CHAT_ROUTER = APIRouter(prefix=f"{SERVER_BASE_URL}/users/chat", tags=["Chat API"])

CHAT_ROUTER.add_api_route("/send", send_chat_message, methods=["POST"])