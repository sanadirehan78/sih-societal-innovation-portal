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


def init_db():
    """Create tables if missing and safely add any missing columns to SQLite."""
    from sqlalchemy import inspect, text

    Base.metadata.create_all(bind=engine)

    with engine.begin() as conn:
        inspector = inspect(conn)
        tables = inspector.get_table_names()
        if "challenges" in tables:
            columns = {col["name"] for col in inspector.get_columns("challenges")}
            if "is_duplicate" not in columns:
                conn.execute(text("ALTER TABLE challenges ADD COLUMN is_duplicate BOOLEAN DEFAULT 0"))
            if "similarity_score" not in columns:
                conn.execute(text("ALTER TABLE challenges ADD COLUMN similarity_score FLOAT DEFAULT 0.0"))
            if "similar_problem_id" not in columns:
                conn.execute(text("ALTER TABLE challenges ADD COLUMN similar_problem_id VARCHAR(100)"))
            if "similar_problem_title" not in columns:
                conn.execute(text("ALTER TABLE challenges ADD COLUMN similar_problem_title VARCHAR(200)"))
            if "recommended_hei" not in columns:
                conn.execute(text("ALTER TABLE challenges ADD COLUMN recommended_hei VARCHAR(200)"))
            if "hei_match_score" not in columns:
                conn.execute(text("ALTER TABLE challenges ADD COLUMN hei_match_score FLOAT DEFAULT 0.0"))
            if "hei_recommendation_reason" not in columns:
                conn.execute(text("ALTER TABLE challenges ADD COLUMN hei_recommendation_reason TEXT"))
