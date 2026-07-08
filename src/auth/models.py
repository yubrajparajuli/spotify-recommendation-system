from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON
from sqlalchemy.sql import func

from src.auth.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    username = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    hashed_password = Column(
        String,
        nullable=False
    )

    is_active = Column(
        Boolean,
        default=True
    )

    onboarding_complete = Column(
        Boolean,
        default=False
    )

    preferred_genres = Column(
        JSON,
        default=list
    )

    preferred_moods = Column(
        JSON,
        default=list
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )