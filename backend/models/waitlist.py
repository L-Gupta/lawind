from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, String

from models.user import Base


class WaitlistEntry(Base):
    __tablename__ = "waitlist_entries"

    id = Column(String(36), primary_key=True)
    email = Column(String(255), nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    firm_name = Column(String(255), nullable=True)
    message = Column(String(2000), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
