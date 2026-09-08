"""Integration test for HEI recommendation in FastAPI backend.

Invokes backend endpoints directly with database sessions and validates schemas,
HEI recommendation results, database persistence, and backwards compatibility.
"""

import json
import sys
from pathlib import Path

# Ensure project root and backend are in path
BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from database import SessionLocal, init_db
from main import create_challenge, get_challenge, list_challenges
from schemas import ChallengeCreate, ChallengeRead

# Ensure DB schema migration is applied
init_db()

db = SessionLocal()

print("=" * 80)
print("FASTAPI HEI BACKEND INTEGRATION TESTS")
print("=" * 80)

try:
    # Test 1: Verify existing challenges are preserved
    print("\n[Test 1] List Existing Challenges (Preservation Check)")
    existing = list_challenges(db=db)
    print(f"Total challenges currently in database: {len(existing)}")
    assert len(existing) >= 16, f"Expected at least 16 existing records, found {len(existing)}"
    print(f"Oldest challenge ID: {existing[-1].id} | Title: {existing[-1].title}")
    print(f"Latest challenge ID: {existing[0].id} | Title: {existing[0].title}")

    # Test 2: Create Agriculture Challenge
    print("\n[Test 2] Create Agriculture Problem")
    agri_input = ChallengeCreate(
        title="Severe pest attack causing low crop yield in dryland farming",
        description="Frequent pest infestations and poor soil fertility are causing severe crop yield drop in dryland farming areas affecting farmers and livestock health.",
        district="Ranchi",
        location="Kanke Block",
        submitted_by="Ramesh Mahto",
    )
    agri_res = create_challenge(payload=agri_input, db=db)
    agri_read = ChallengeRead.model_validate(agri_res)

    print("Created Challenge ID:", agri_read.id)
    print("Predicted Category  :", agri_read.category)
    print("Detected Priority   :", agri_read.priority)
    print("Recommended HEI     :", agri_read.recommended_hei)
    print("Match Score         :", agri_read.hei_match_score)
    print("Reason              :", agri_read.hei_recommendation_reason)

    assert "Birsa Agricultural University" in (agri_read.recommended_hei or "")
    print(">>> PASS: Agriculture problem correctly recommended Birsa Agricultural University (BAU) Ranchi")

    # Test 3: Create Healthcare Challenge
    print("\n[Test 3] Create Healthcare Problem")
    health_input = ChallengeCreate(
        title="High child malnutrition and vaccine cold chain failure",
        description="High prevalence of anemia and malnutrition among children, with severe lack of cold chain storage for vaccines in rural primary health centers.",
        district="Gumla",
        location="Bishunpur PHC",
        submitted_by="Dr. Sunita Toppo",
    )
    health_res = create_challenge(payload=health_input, db=db)
    health_read = ChallengeRead.model_validate(health_res)

    print("Created Challenge ID:", health_read.id)
    print("Predicted Category  :", health_read.category)
    print("Detected Priority   :", health_read.priority)
    print("Recommended HEI     :", health_read.recommended_hei)
    print("Match Score         :", health_read.hei_match_score)
    print("Reason              :", health_read.hei_recommendation_reason)

    assert health_read.recommended_hei == "RIMS Ranchi"
    print(">>> PASS: Healthcare problem correctly recommended RIMS Ranchi")

    # Test 4: Create Digital / Low-Bandwidth Challenge
    print("\n[Test 4] Create Digital / Low-Bandwidth Problem")
    digital_input = ChallengeCreate(
        title="Low-bandwidth connectivity issues in remote tribal school network",
        description="Lack of low-bandwidth connectivity and data pipelines, making remote tracking and multilingual communication services fail in tribal blocks.",
        district="Khunti",
        location="Torpa Village",
        submitted_by="Amit Horo",
    )
    digital_res = create_challenge(payload=digital_input, db=db)
    digital_read = ChallengeRead.model_validate(digital_res)

    print("Created Challenge ID:", digital_read.id)
    print("Predicted Category  :", digital_read.category)
    print("Detected Priority   :", digital_read.priority)
    print("Recommended HEI     :", digital_read.recommended_hei)
    print("Match Score         :", digital_read.hei_match_score)
    print("Reason              :", digital_read.hei_recommendation_reason)

    assert digital_read.recommended_hei == "IIIT Ranchi"
    print(">>> PASS: Digital Infrastructure problem correctly recommended IIIT Ranchi")

    # Test 5: Verify GET /challenges/{id} returns new HEI fields
    print(f"\n[Test 5] Fetch Challenge Details via get_challenge(id={digital_read.id})")
    fetched = get_challenge(challenge_id=digital_read.id, db=db)
    fetched_read = ChallengeRead.model_validate(fetched)

    assert fetched_read.recommended_hei == "IIIT Ranchi"
    assert fetched_read.hei_match_score == digital_read.hei_match_score
    assert fetched_read.hei_recommendation_reason == digital_read.hei_recommendation_reason

    print("Sample Serialized API Response:")
    print(json.dumps(fetched_read.model_dump(mode="json"), indent=2))
    print(">>> PASS: get_challenge returned all new HEI fields accurately")

    # Test 6: Verify all existing challenge records are still present
    print("\n[Test 6] Final Database Record Count Verification")
    all_challenges = list_challenges(db=db)
    expected_total = len(existing) + 3
    print(f"Total challenges count: {len(all_challenges)} (Expected: {expected_total})")
    assert len(all_challenges) == expected_total
    print(">>> PASS: All original records preserved plus 3 new challenges successfully stored")

    print("\n" + "=" * 80)
    print("ALL BACKEND HEI INTEGRATION TESTS COMPLETED SUCCESSFULLY!")
    print("=" * 80)

finally:
    db.close()
