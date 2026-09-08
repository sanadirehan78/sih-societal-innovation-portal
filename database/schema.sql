-- Matches the SQLAlchemy Challenge model. The app also creates this table on startup.

CREATE TABLE IF NOT EXISTS challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(80) NOT NULL,
    priority VARCHAR(40) NOT NULL,
    district VARCHAR(120) NOT NULL,
    location VARCHAR(200) NOT NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'Submitted',
    submitted_by VARCHAR(120) NOT NULL,
    created_at DATETIME NOT NULL,
    is_duplicate BOOLEAN DEFAULT 0,
    similarity_score FLOAT DEFAULT 0.0,
    similar_problem_id VARCHAR(100),
    similar_problem_title VARCHAR(200),
    recommended_hei VARCHAR(200),
    hei_match_score FLOAT DEFAULT 0.0,
    hei_recommendation_reason TEXT
);
