# Societal Innovation Collaboration Portal

A Smart India Hackathon (SIH) MVP that lets **citizens report societal challenges** so universities, industry, and government can later collaborate on solutions.

**Day 1 scope:** backend foundation + citizen challenge submission only.  
Not included yet: AI, login, dashboards, university/industry modules, or notifications.

## Project folders

| Folder | What it is for |
| --- | --- |
| `backend/` | The server. It receives form data from the web app, checks it, and saves it. |
| `frontend/` | The website citizens will use (forms and pages). Empty until a later day. |
| `ai/` | Future matching/classification code. Empty for Day 1. |
| `database/` | The SQLite database file and the table design (`schema.sql`). |
| `docs/` | Notes for the team (architecture, API examples, presentation). |

Root files:

- `.gitignore` — tells Git which files not to upload (virtualenv, secrets, generated DB).
- `README.md` — this file.

## Day 1 API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Check the server is running |
| `POST` | `/challenges` | Citizen submits a challenge |
| `GET` | `/challenges` | List all saved challenges |

On startup, the app creates `database/challenges.db` and the `challenges` table.

`POST /challenges` body example:

```json
{
  "title": "Unsafe street lighting near school",
  "description": "Several street lights near the government school stay off after 7 PM.",
  "district": "Pune",
  "location": "Ward 12",
  "submitted_by": "Asha Patil"
}
```

## Run the backend (Windows)

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
cd backend
uvicorn main:app --reload
```

Then visit [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health).
