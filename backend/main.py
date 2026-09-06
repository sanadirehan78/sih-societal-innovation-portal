from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Challenge
from schemas import ChallengeCreate, ChallengeRead

app = FastAPI()


@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/challenges", response_model=ChallengeRead, status_code=201)
def create_challenge(payload: ChallengeCreate, db: Session = Depends(get_db)):
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
    return db.query(Challenge).order_by(Challenge.created_at.desc()).all()
