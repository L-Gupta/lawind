from datetime import datetime, timezone
import enum

from sqlalchemy import Column, String, DateTime, Boolean, Enum as SAEnum
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class PlanType(str, enum.Enum):
    free = "free"
    student = "student"
    individual = "individual"
    firm = "firm"
    enterprise = "enterprise"


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    plan = Column(SAEnum(PlanType), default=PlanType.free, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
