from sqlalchemy import (
    Integer,
    String,
    ForeignKey,
    DateTime,
    Enum,
    Boolean,
    create_engine,
)
from sqlalchemy.orm import relationship, mapped_column, Mapped, DeclarativeBase
from typing import List, Optional
from datetime import datetime, timezone

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
    password: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole), nullable=False, default=UserRole.MC
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    sessions: Mapped[List["Sessions"]] = relationship(
        "Sessions", back_populates="user", cascade="all, delete-orphan"
    )
    chat_messages: Mapped[List["ChatMessages"]] = relationship(
        "ChatMessages", back_populates="user", cascade="all, delete-orphan"
    )
    audit_logs: Mapped[List["AuditLogs"]] = relationship(
        "AuditLogs", back_populates="user", cascade="all, delete-orphan"
    )


class Sessions(Base):
    __tablename__ = "sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=True
    )
    token_found: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    user: Mapped[Optional["Users"]] = relationship("Users", back_populates="sessions")
    chat_messages: Mapped[List["ChatMessages"]] = relationship(
        "ChatMessages", back_populates="session", cascade="all, delete-orphan"
    )
    audit_logs: Mapped[List["AuditLogs"]] = relationship(
        "AuditLogs", back_populates="session", cascade="all, delete-orphan"
    )


class ChatMessages(Base):
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    session_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("sessions.id"), nullable=False
    )
    message: Mapped[str] = mapped_column(String(1000), nullable=False)
    tampered: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    user: Mapped["Users"] = relationship("Users", back_populates="chat_messages")
    session: Mapped["Sessions"] = relationship(
        "Sessions", back_populates="chat_messages"
    )
    audit_logs: Mapped[List["AuditLogs"]] = relationship(
        "AuditLogs", back_populates="chat_message", cascade="all, delete-orphan"
    )


class AuditLogs(Base):
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    session_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("sessions.id"), nullable=False
    )
    message_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("chat_messages.id"), nullable=True
    )
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    original_message: Mapped[str] = mapped_column(String(1000), nullable=False)
    delivered_message: Mapped[str] = mapped_column(String(1000), nullable=False)
    tampered: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    token_detected: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    session: Mapped["Sessions"] = relationship("Sessions", back_populates="audit_logs")
    user: Mapped["Users"] = relationship("Users", back_populates="audit_logs")
    chat_message: Mapped[Optional["ChatMessages"]] = relationship(
        "ChatMessages", back_populates="audit_logs"
    )
