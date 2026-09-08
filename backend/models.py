from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, Text

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
    is_duplicate = Column(Boolean, nullable=True, default=False)
    similarity_score = Column(Float, nullable=True, default=0.0)
    similar_problem_id = Column(String(100), nullable=True)
    similar_problem_title = Column(String(200), nullable=True)
