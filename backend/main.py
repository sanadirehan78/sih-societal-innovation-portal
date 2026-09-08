# pyrefly: ignore [missing-import]
from fastapi import Depends, FastAPI, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session


from database import Base, engine, get_db, init_db
from models import Challenge
from schemas import ChallengeCreate, ChallengeRead

from ai.ml_categorizer import predict_category
from ai.priority import detect_priority
from ai.duplicate_detector import find_similar_problem

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