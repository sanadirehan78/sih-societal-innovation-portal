from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ChallengeCreate(BaseModel):
    """Data a citizen sends when reporting a problem."""

    title: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=10, max_length=4000)
    district: str = Field(min_length=2, max_length=120)
    location: str = Field(min_length=2, max_length=200)
    submitted_by: str = Field(min_length=2, max_length=120)


class ChallengeRead(BaseModel):
    """Data the API returns after saving or listing challenges."""

    id: int
    title: str
    description: str
    category: str
    priority: str
    district: str
    location: str
    status: str
    submitted_by: str
    created_at: datetime
    is_duplicate: Optional[bool] = False
    similarity_score: Optional[float] = 0.0
    similar_problem_id: Optional[str] = None
    similar_problem_title: Optional[str] = None

    model_config = {"from_attributes": True}
