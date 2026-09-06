from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text

from database import Base


class Challenge(Base):
    """One row in the challenges table = one societal problem reported by a citizen."""

    __tablename__ = "challenges"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(80), nullable=False)
    priority = Column(String(40), nullable=False)
    district = Column(String(120), nullable=False)
    location = Column(String(200), nullable=False)
    status = Column(String(40), nullable=False, default="Submitted")
    submitted_by = Column(String(120), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
