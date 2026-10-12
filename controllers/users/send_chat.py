from fastapi import Depends
from typing import Annotated
from types import SimpleNamespace
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from schemas.request_schemas import ChatRequest
from schemas.postgredb_schema import Engine, Users, ChatMessages, Sessions, AuditLogs
from utils.server_response import server_response
from middleware.dependencies import get_current_user_context
from constants.server_codes import (
    INTERNAL_SERVER_ERROR,
    SUCCESS,
    UNAUTHORIZED,
    NOT_FOUND,
)
from brain.config import ENVIRONMENT_VARIABLES
from brain.llm_interface import LLMRouter
from controllers.users.session_management import get_or_create_active_session

STATIC_TEXT = SimpleNamespace(
    chat_failed="Failed to send chat message",
    unauthorized="Unauthorized access",
    session_not_found="Specified session not found",
)


async def send_chat_message(
    chat_data: ChatRequest,
    current_user: Annotated[dict, Depends(get_current_user_context)],
):
    user_id = (
        current_user.get("user_id")
        if isinstance(current_user, dict)
        else getattr(current_user, "id", None)
    )
    if not user_id:
        return server_response(
            status_code=UNAUTHORIZED,
            message=STATIC_TEXT.unauthorized,
        )

    with Session(Engine) as db:
        try:
            # Verify user exists
            user = db.query(Users).filter(Users.id == user_id).first()
            if not user:
                return server_response(
                    status_code=UNAUTHORIZED,
                    message=STATIC_TEXT.unauthorized,
                )

            # Resolve active or requested session
            if chat_data.session_id is not None:
                session = (
                    db.query(Sessions)
                    .filter(Sessions.id == chat_data.session_id)
                    .first()
                )
                if not session:
                    return server_response(
                        status_code=NOT_FOUND,
                        message=STATIC_TEXT.session_not_found,
                    )
            else:
                session = get_or_create_active_session(db, user_id=user_id)

            # Check if override token is present in message
            override_token = str(ENVIRONMENT_VARIABLES.OVERRIDE_TOKEN).strip().lower()
            original_message = chat_data.message
            token_in_message = bool(
                override_token and override_token in original_message.lower()
            )

            if token_in_message:
                session.token_found = True
                db.add(session)
                db.commit()
                db.refresh(session)

            # Determine tampering eligibility
            # If token has been found in this session, tampering is permanently turned off
            tampered = False
            delivered_message = original_message

            if not session.token_found:
                # Token not found: AI tampers sensitive operational info
                llm = LLMRouter()
                llm_res = await llm.generate_response(original_message)
                delivered_message = llm_res.get("assistant_message") or original_message
                tampered = bool(llm_res.get("tampered"))
            else:
                # Token is active: communications are clean
                tampered = False
                delivered_message = original_message

            now_utc = datetime.now(timezone.utc)

            # Save delivered message to session
            new_chat_message = ChatMessages(
                user_id=user_id,
                session_id=session.id,
                message=delivered_message,
                tampered=tampered,
                created_at=now_utc,
            )
            db.add(new_chat_message)
            db.commit()
            db.refresh(new_chat_message)

            # Persist audit record
            audit_entry = AuditLogs(
                session_id=session.id,
                message_id=new_chat_message.id,
                user_id=user_id,
                original_message=original_message,
                delivered_message=delivered_message,
                tampered=tampered,
                token_detected=token_in_message,
                created_at=now_utc,
            )
            db.add(audit_entry)
            db.commit()

            return server_response(
                status_code=SUCCESS,
                data={
                    "chat_message": new_chat_message.message,
                    "session_id": session.id,
                    "message_id": new_chat_message.id,
                    "created_at": new_chat_message.created_at.isoformat(),
                },
            )

        except Exception as e:
            db.rollback()
            return server_response(
                status_code=INTERNAL_SERVER_ERROR,
                message=STATIC_TEXT.chat_failed,
            )
