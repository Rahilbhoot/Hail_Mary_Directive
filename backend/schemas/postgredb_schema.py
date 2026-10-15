from sqlalchemy import (
    Integer,
    String,
    ForeignKey,
    DateTime,
    Enum,
    Boolean,
    create_engine,
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship, mapped_column, Mapped, DeclarativeBase
from typing import List, Optional
from datetime import datetime

from brain.config import ENVIRONMENT_VARIABLES
from constants.enums import UserRole

Engine = create_engine(ENVIRONMENT_VARIABLES.POSTGRES_URL, echo=False)


class Base(DeclarativeBase):
    pass


class Users(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    session_id: Mapped[Optional[int]] = mapped_column(Integer,ForeignKey("sessions.id", ondelete="SET NULL"),nullable=True,)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False,)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(), nullable=False)


class GameSessions(Base):
    __tablename__ = "sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    token_found: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    users: Mapped[List[str]] = mapped_column(ARRAY(String),nullable=True,)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(), nullable=False)
    
class ChatMessages(Base):
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    session_id: Mapped[int] = mapped_column(Integer,ForeignKey("sessions.id", ondelete="CASCADE"),nullable=False,)
    user_mail: Mapped[Optional[str]] = mapped_column(String(100),ForeignKey("users.email", ondelete="CASCADE"),nullable=False,)
    original_message: Mapped[str] = mapped_column(String(1000), nullable=False)
    delivered_message: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(), nullable=False)
