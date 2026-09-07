from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Challenge
from schemas import ChallengeCreate, ChallengeRead

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
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/challenges", response_model=ChallengeRead, status_code=201)
def create_challenge(
    payload: ChallengeCreate,
    db: Session = Depends(get_db)
):
    challenge = Challenge(
        title=payload.title,
        description=payload.description,
        district=payload.district,
        location=payload.location,
        submitted_by=payload.submitted_by,
        category="Pending AI Analysis",
        priority="Pending",
        status="Submitted",
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
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404,
            detail="Challenge not found"
        )

    return challenge