from fastapi import Depends
from typing import Annotated
from types import SimpleNamespace
from sqlalchemy.orm import Session

from schemas.request_schemas import ChatRequest
from schemas.postgredb_schema import Engine, Users, ChatMessages
from utils.server_response import server_response
from middleware.dependencies import get_current_user_context
from constants.server_codes import INTERNAL_SERVER_ERROR, SUCCESS, UNAUTHORIZED
from brain.config import SERVER_STATE
from brain.llm_interface import LLMRouter

STATIC_TEXT = SimpleNamespace(
    chat_failed="Failed to send chat message",
    unauthorized="Unauthorized access",
)


async def send_chat_message(
    chat_data: ChatRequest,
    current_user: Annotated[dict, Depends(get_current_user_context)],
):
    llm_edit = None
    tampered = False
    if SERVER_STATE.token_not_found:
        llm = LLMRouter()
        llm_edit = llm.generate_response(chat_data.message)
        if llm_edit.get("status_code") != SUCCESS:
            return server_response(
                status_code=INTERNAL_SERVER_ERROR,
                message=STATIC_TEXT.chat_failed,
            )
        llm_edit = llm_edit.get("assistant_message")

    message = chat_data.message
    if llm_edit:
        message = llm_edit
        tampered = True
    
    with Session(Engine) as s:
        try:
            user = s.query(Users).filter(Users.id == current_user.id).first()
            if not user:
                return server_response(
                    status_code=UNAUTHORIZED,
                    message=STATIC_TEXT.unauthorized,
                )

            new_chat_message = ChatMessages(
                user_id=current_user.id,
                session_id=chat_data.session_id,
                message=message,
                tampered=tampered,
                created_at=chat_data.created_at,
            )
            s.add(new_chat_message)
            s.commit()
            s.refresh(new_chat_message)
            return server_response(
                status_code=SUCCESS, data={"chat_message": new_chat_message.message}
            )
        except Exception as e:
            s.rollback()
            return server_response(
                status_code=INTERNAL_SERVER_ERROR, message=STATIC_TEXT.chat_failed
            )
