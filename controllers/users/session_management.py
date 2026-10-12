from sqlalchemy.orm import Session
from sqlalchemy import select, update
from datetime import datetime, timezone
from typing import Optional

from schemas.postgredb_schema import Engine, Sessions
from utils.server_response import server_response
from constants.server_codes import SUCCESS, INTERNAL_SERVER_ERROR


def get_or_create_active_session(
    db: Session, user_id: Optional[int] = None
) -> Sessions:
    active_session = (
        db.query(Sessions)
        .filter(Sessions.is_active == True)
        .order_by(Sessions.id.desc())
        .first()
    )
    if active_session:
        return active_session

    new_session = Sessions(
        user_id=user_id,
        is_active=True,
        token_found=False,
        created_at=datetime.now(timezone.utc),
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session


async def init_game_session(current_user: Optional[dict] = None):
    user_id = current_user.get("user_id") if isinstance(current_user, dict) else None

    with Session(Engine) as db:
        try:
            db.query(Sessions).filter(Sessions.is_active == True).update(
                {"is_active": False}
            )

            new_session = Sessions(
                user_id=user_id,
                is_active=True,
                token_found=False,
                created_at=datetime.now(timezone.utc),
            )
            db.add(new_session)
            db.commit()
            db.refresh(new_session)

            return server_response(
                status_code=SUCCESS,
                message=f"Game session {new_session.id} initialized successfully",
                data={
                    "session_id": new_session.id,
                    "is_active": new_session.is_active,
                    "token_found": new_session.token_found,
                    "created_at": new_session.created_at.isoformat(),
                },
            )
        except Exception as e:
            db.rollback()
            return server_response(
                status_code=INTERNAL_SERVER_ERROR,
                message=f"Failed to initialize game session: {str(e)}",
            )
