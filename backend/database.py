from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Save the database file in the project's database/ folder.
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATABASE_PATH = PROJECT_ROOT / "database" / "challenges.db"
DATABASE_URL = f"sqlite:///{DATABASE_PATH.as_posix()}"

# The engine is the connection to SQLite.
# check_same_thread=False is needed because FastAPI can use more than one thread.
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# SessionLocal is used later when we read or write rows.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base is the parent class for all database models (tables).
Base = declarative_base()


def get_db():
    """Open a database session for one request, then close it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
