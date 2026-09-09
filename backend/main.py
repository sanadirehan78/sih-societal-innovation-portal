import sys
from pathlib import Path

# Ensure backend directory has precedence for database/models/schemas,
# and project root is available for ai imports without shadowing backend modules
BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

# pyrefly: ignore [missing-import]
from fastapi import Depends, FastAPI, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
from sqlalchemy.orm import Session


from database import Base, engine, get_db, init_db
from models import Challenge
from schemas import ChallengeCreate, ChallengeRead, DashboardStats

from ai.ml_categorizer import predict_category
from ai.priority import detect_priority
from ai.duplicate_detector import find_similar_problem
from ai.hei_recommender import recommend_heis

app = FastAPI()

# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def create_tables():
    init_db()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/challenges", response_model=ChallengeRead, status_code=201)
def create_challenge(
    payload: ChallengeCreate,
    db: Session = Depends(get_db)
):
    predicted_category = predict_category(payload.description)
    detected_priority = detect_priority(payload.description)

    is_duplicate, similarity_score, similar_problem = find_similar_problem(
        payload.description
    )

    hei_recommendations = recommend_heis(payload.description, predicted_category)
    top_hei = hei_recommendations[0] if hei_recommendations else None

    challenge = Challenge(
        title=payload.title,
        description=payload.description,
        district=payload.district,
        location=payload.location,
        submitted_by=payload.submitted_by,
        category=predicted_category,
        priority=detected_priority,
        status="Submitted",
        is_duplicate=bool(is_duplicate),
        similarity_score=float(similarity_score),
        similar_problem_id=similar_problem["problem_id"],
        similar_problem_title=similar_problem["title"],
        recommended_hei=top_hei["institution"] if top_hei else None,
        hei_match_score=float(top_hei["score"]) if top_hei else 0.0,
        hei_recommendation_reason=top_hei["reason"] if top_hei else None,
    )

    db.add(challenge)
    db.commit()
    db.refresh(challenge)

    return challenge


@app.get("/challenges", response_model=list[ChallengeRead])
def list_challenges(db: Session = Depends(get_db)):
    return (
        db.query(Challenge)
        .order_by(Challenge.created_at.desc())
        .all()
    )


@app.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Calculate and return real-time societal challenge statistics for the government dashboard."""
    total_challenges = db.query(func.count(Challenge.id)).scalar() or 0

    high_priority_challenges = (
        db.query(func.count(Challenge.id))
        .filter(Challenge.priority == "High")
        .scalar()
        or 0
    )

    duplicate_challenges = (
        db.query(func.count(Challenge.id))
        .filter(Challenge.is_duplicate.is_(True))
        .scalar()
        or 0
    )

    category_counts = (
        db.query(Challenge.category, func.count(Challenge.id))
        .group_by(Challenge.category)
        .order_by(Challenge.category)
        .all()
    )
    categories = {cat: count for cat, count in category_counts}

    district_counts = (
        db.query(Challenge.district, func.count(Challenge.id))
        .group_by(Challenge.district)
        .order_by(Challenge.district)
        .all()
    )
    districts = {dist: count for dist, count in district_counts}

    status_counts = (
        db.query(Challenge.status, func.count(Challenge.id))
        .group_by(Challenge.status)
        .order_by(Challenge.status)
        .all()
    )
    statuses = {st: count for st, count in status_counts}

    return {
        "total_challenges": total_challenges,
        "high_priority_challenges": high_priority_challenges,
        "duplicate_challenges": duplicate_challenges,
        "categories": categories,
        "districts": districts,
        "statuses": statuses,
    }


@app.get("/challenges/{challenge_id}", response_model=ChallengeRead)
def get_challenge(
    challenge_id: int,
    db: Session = Depends(get_db)
):
    challenge = (
        db.query(Challenge)
        .filter(Challenge.id == challenge_id)
        .first()
    )

    if challenge is None:
        # pyrefly: ignore [missing-import]
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404,
            detail="Challenge not found"
        )

    return challenge