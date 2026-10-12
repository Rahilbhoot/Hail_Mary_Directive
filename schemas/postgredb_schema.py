from sqlalchemy import Integer, String, ForeignKey, DateTime, Enum, create_engine
from sqlalchemy.orm import relationship, mapped_column, Mapped, DeclarativeBase
from typing import List
from datetime import datetime

from brain.config import ENVIRONMENT_VARIABLES
from constants.enums import UserRole

Engine = create_engine(ENVIRONMENT_VARIABLES.POSTGRES_URL, echo=True)


class Base(DeclarativeBase):
    pass


class Users(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    sessions: Mapped[List["Sessions"]] = relationship(
        "Sessions", back_populates="user", cascade="all, delete-orphan"
    )


class Sessions(Base):
    __tablename__ = "sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    user: Mapped["Users"] = relationship("Users", back_populates="sessions")


class ChatMessages(Base):
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    session_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("sessions.id"), nullable=False
    )
    message: Mapped[str] = mapped_column(String(500), nullable=False)
    tampered: Mapped[bool] = mapped_column(nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    user: Mapped["Users"] = relationship("Users", back_populates="chat_messages")
    session: Mapped["Sessions"] = relationship(
        "Sessions", back_populates="chat_messages"
    )
