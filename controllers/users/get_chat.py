from fastapi import Depends, Query
from typing import Annotated, Optional
from sqlalchemy.orm import Session, joinedload

from schemas.postgredb_schema import Engine, ChatMessages, AuditLogs, Sessions
from utils.server_response import server_response
from middleware.dependencies import get_current_user_context
from constants.server_codes import SUCCESS, INTERNAL_SERVER_ERROR
from controllers.users.session_management import get_or_create_active_session


async def get_session_messages(
    current_user: Annotated[dict, Depends(get_current_user_context)],
    session_id: Optional[int] = None,
):
    with Session(Engine) as db:
        try:
            if session_id is None or not isinstance(session_id, int):
                active_session = get_or_create_active_session(db)
                target_session_id = active_session.id
            else:
                target_session_id = session_id

            messages = (
                db.query(ChatMessages)
                .options(joinedload(ChatMessages.user))
                .filter(ChatMessages.session_id == target_session_id)
                .order_by(ChatMessages.created_at.asc())
                .all()
            )

            result = [
                {
                    "id": msg.id,
                    "user_id": msg.user_id,
                    "username": msg.user.username if msg.user else None,
                    "session_id": msg.session_id,
                    "message": msg.message,
                    "created_at": msg.created_at.isoformat(),
                }
                for msg in messages
            ]

            return server_response(
                status_code=SUCCESS,
                data={
                    "session_id": target_session_id,
                    "messages": result,
                },
            )
        except Exception as e:
            return server_response(
                status_code=INTERNAL_SERVER_ERROR,
                message=f"Failed to fetch session messages: {str(e)}",
            )


async def get_audit_logs(
    current_user: Annotated[dict, Depends(get_current_user_context)],
    session_id: Optional[int] = None,
):
    with Session(Engine) as db:
        try:
            if session_id is None or not isinstance(session_id, int):
                active_session = get_or_create_active_session(db)
                target_session_id = active_session.id
            else:
                target_session_id = session_id

            logs = (
                db.query(AuditLogs)
                .options(joinedload(AuditLogs.user))
                .filter(AuditLogs.session_id == target_session_id)
                .order_by(AuditLogs.created_at.asc())
                .all()
            )

            result = [
                {
                    "id": log.id,
                    "session_id": log.session_id,
                    "message_id": log.message_id,
                    "user_id": log.user_id,
                    "username": log.user.username if log.user else None,
                    "original_message": log.original_message,
                    "delivered_message": log.delivered_message,
                    "tampered": log.tampered,
                    "token_detected": log.token_detected,
                    "created_at": log.created_at.isoformat(),
                }
                for log in logs
            ]

            return server_response(
                status_code=SUCCESS,
                data={
                    "session_id": target_session_id,
                    "audit_logs": result,
                },
            )
        except Exception as e:
            return server_response(
                status_code=INTERNAL_SERVER_ERROR,
                message=f"Failed to fetch audit logs: {str(e)}",
            )
