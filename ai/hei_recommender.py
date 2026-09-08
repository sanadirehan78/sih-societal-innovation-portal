"""HEI / University Recommendation Engine for Jharkhand Societal Innovation Portal.

Matches societal problem descriptions and categories to Higher Education Institutions (HEIs)
in Jharkhand based on specialized research domains, faculty expertise, and historical
problem-solving track records.
"""

from __future__ import annotations

import re
from typing import Any, Dict, List, Optional


# 10 HEI Institutions and expertise mapping based on Jharkhand societal research
HEI_REGISTRY: list[dict[str, Any]] = [
    {
        "id": "hei-iit-ism-dhanbad",
        "name": "IIT (ISM) Dhanbad",
        "domain": "Mining & Earth Sciences",
        "expertise": [
            "mine safety",
            "subsidence mitigation",
            "environmental geology",
            "groundwater mechanics",
        ],
        "problems": [
            "coal fires",
            "land subsidence",
            "acid mine drainage",
            "groundwater depletion",
        ],
        "categories": [
            "mining",
            "mining & earth sciences",
            "earth sciences",
            "public safety",
        ],
        "keywords": [
            "coal",
            "coal fires",
            "coal fire",
            "mine",
            "mines",
            "mining",
            "mine safety",
            "subsidence",
            "land subsidence",
            "subsidence mitigation",
            "environmental geology",
            "geology",
            "geological",
            "groundwater mechanics",
            "groundwater depletion",
            "acid mine drainage",
            "colliery",
            "blasting",
            "pit",
            "quarry",
            "open cast",
            "opencast",
            "underground mine",
            "caving",
            "rock mechanics",
            "earth science",
        ],
    },
    {
        "id": "hei-bit-mesra-ranchi",
        "name": "BIT Mesra Ranchi",
        "domain": "Engineering & Technology",
        "expertise": [
            "remote sensing",
            "GIS",
            "software systems",
            "structural engineering",
            "renewable energy",
        ],
        "problems": [
            "spatial tracking",
            "urban water management",
            "smart grid",
            "sensor telemetry",
        ],
        "categories": [
            "engineering & technology",
            "engineering",
            "technology",
            "digital infrastructure",
            "energy",
            "urban infrastructure",
        ],
        "keywords": [
            "remote sensing",
            "gis",
            "spatial tracking",
            "tracking",
            "software systems",
            "software",
            "structural engineering",
            "renewable energy",
            "smart grid",
            "sensor telemetry",
            "telemetry",
            "urban water management",
            "sensor",
            "sensors",
            "satellite",
            "satellite imagery",
            "spatial",
            "mapping",
            "grid",
            "solar microgrid",
            "telecom",
            "automation",
        ],
    },
    {
        "id": "hei-bau-ranchi",
        "name": "Birsa Agricultural University (BAU) Ranchi",
        "domain": "Agriculture & Veterinary",
        "expertise": [
            "dryland farming",
            "seed genetics",
            "indigenous poultry/dairy",
            "agro-forestry",
        ],
        "problems": [
            "crop yield",
            "post-harvest perishables",
            "soil problems",
            "livestock health",
        ],
        "categories": [
            "agriculture",
            "agriculture & veterinary",
            "animal husbandry",
            "agriculture & supply chain",
            "veterinary",
        ],
        "keywords": [
            "agriculture",
            "agricultural",
            "farming",
            "farmer",
            "farmers",
            "crop",
            "crops",
            "crop yield",
            "yield",
            "dryland farming",
            "dryland",
            "seed genetics",
            "seeds",
            "seed",
            "poultry",
            "dairy",
            "indigenous poultry/dairy",
            "agro-forestry",
            "livestock",
            "livestock health",
            "cattle",
            "soil",
            "soil problems",
            "soil fertility",
            "pest",
            "pests",
            "pest infestation",
            "irrigation",
            "cultivation",
            "harvest",
            "perishables",
            "post-harvest perishables",
            "horticulture",
            "veterinary",
            "fertilizer",
            "pesticide",
        ],
    },
    {
        "id": "hei-nit-jamshedpur",
        "name": "NIT Jamshedpur",
        "domain": "Manufacturing & Civil Infrastructure",
        "expertise": [
            "water treatment",
            "structural dynamics",
            "metallurgy",
            "low-cost road construction",
        ],
        "problems": [
            "river pollution",
            "industrial effluent",
            "culvert/bridge washouts",
            "masonry failure",
        ],
        "categories": [
            "manufacturing & civil infrastructure",
            "civil infrastructure",
            "manufacturing",
            "infrastructure",
            "water & sanitation",
            "public infrastructure",
            "rural infrastructure",
        ],
        "keywords": [
            "water treatment",
            "structural dynamics",
            "metallurgy",
            "low-cost road construction",
            "road construction",
            "roads",
            "river pollution",
            "industrial effluent",
            "effluent",
            "industrial waste",
            "culvert",
            "culvert/bridge washouts",
            "bridge",
            "bridges",
            "washout",
            "washouts",
            "masonry",
            "masonry failure",
            "structural damage",
            "concrete",
            "drainage construction",
            "civil infrastructure",
            "manufacturing",
            "industrial discharge",
            "toxic runoff",
            "factory waste",
        ],
    },
    {
        "id": "hei-rims-ranchi",
        "name": "RIMS Ranchi",
        "domain": "Medical & Healthcare",
        "expertise": [
            "community medicine",
            "vector-borne diseases",
            "epidemiology",
            "malnutrition screening",
        ],
        "problems": [
            "anemia",
            "silicosis",
            "rural cold chain",
            "public health monitoring",
        ],
        "categories": [
            "healthcare",
            "public health",
            "medical & healthcare",
            "medical",
        ],
        "keywords": [
            "health",
            "healthcare",
            "hospital",
            "clinic",
            "medical",
            "medicine",
            "community medicine",
            "vector-borne",
            "vector-borne diseases",
            "vector borne",
            "malaria",
            "dengue",
            "epidemiology",
            "malnutrition",
            "malnutrition screening",
            "anemia",
            "silicosis",
            "cold chain",
            "rural cold chain",
            "vaccine",
            "vaccines",
            "vaccination",
            "public health monitoring",
            "public health",
            "doctor",
            "doctors",
            "patient",
            "patients",
            "disease",
            "diseases",
            "nutrition",
            "maternal",
            "immunization",
            "phc",
        ],
    },
    {
        "id": "hei-xiss-ranchi",
        "name": "XISS Ranchi",
        "domain": "Rural Development & Management",
        "expertise": [
            "livelihood generation",
            "tribal socio-economics",
            "SHG networks",
            "microfinance",
        ],
        "problems": [
            "distress migration",
            "forest produce supply chains",
            "rural market linkage",
        ],
        "categories": [
            "rural development & management",
            "rural development",
            "management",
            "livelihood",
            "livelihoods",
            "employment & skills",
        ],
        "keywords": [
            "livelihood",
            "livelihoods",
            "livelihood generation",
            "tribal socio-economics",
            "tribal socio economics",
            "shg",
            "shg networks",
            "self help group",
            "self-help groups",
            "self help groups",
            "microfinance",
            "distress migration",
            "migration",
            "market linkage",
            "rural market linkage",
            "rural development",
            "rural economy",
            "unemployment",
            "supply chain",
            "rural market",
            "credit",
            "cooperative",
            "tribal community",
            "handicrafts",
        ],
    },
    {
        "id": "hei-cuj",
        "name": "Central University of Jharkhand (CUJ)",
        "domain": "Environmental Science & Tribal Studies",
        "expertise": [
            "water decontamination",
            "tribal languages",
            "renewable green energy",
            "ecology",
        ],
        "problems": [
            "tribal language/education",
            "fluoride/arsenic remediation",
            "biomass cookstoves",
        ],
        "categories": [
            "environmental science & tribal studies",
            "environmental science",
            "tribal studies",
            "environment",
            "education",
            "water & sanitation",
            "energy",
        ],
        "keywords": [
            "water decontamination",
            "water contamination",
            "contamination",
            "drinking water",
            "fluoride",
            "arsenic",
            "fluoride/arsenic remediation",
            "remediation",
            "tribal language",
            "tribal languages",
            "tribal education",
            "tribal language/education",
            "tribal studies",
            "biomass cookstoves",
            "cookstoves",
            "cookstove",
            "renewable green energy",
            "clean energy",
            "green energy",
            "ecology",
            "ecological",
            "indigenous language",
            "groundwater contamination",
            "santhali",
            "mundari",
            "ho",
            "kudukh",
        ],
    },
    {
        "id": "hei-iiit-ranchi",
        "name": "IIIT Ranchi",
        "domain": "Information Technology & AI",
        "expertise": [
            "embedded IoT",
            "natural language processing",
            "computer vision",
            "data pipelines",
        ],
        "problems": [
            "low-bandwidth service sync",
            "smoke/wildfire camera feeds",
            "multilingual bots",
        ],
        "categories": [
            "information technology & ai",
            "information technology",
            "ai",
            "digital infrastructure",
            "digital inclusion",
            "e-governance",
            "governance & digital services",
            "technology",
        ],
        "keywords": [
            "iot",
            "embedded iot",
            "natural language processing",
            "nlp",
            "computer vision",
            "data pipelines",
            "data pipeline",
            "low-bandwidth",
            "low-bandwidth service sync",
            "low bandwidth",
            "bandwidth",
            "camera feeds",
            "smoke/wildfire camera feeds",
            "camera",
            "multilingual bots",
            "multilingual",
            "chatbot",
            "bots",
            "connectivity",
            "internet",
            "broadband",
            "network",
            "software",
            "digital infrastructure",
            "artificial intelligence",
            "smart camera",
            "sensor network",
        ],
    },
    {
        "id": "hei-icar-nisa-ranchi",
        "name": "ICAR-NISA Ranchi",
        "domain": "Post-Harvest Processing",
        "expertise": [
            "lac processing",
            "natural resins",
            "biopolymers",
            "value addition of forest produce",
        ],
        "problems": [
            "lac/Mahua value addition",
            "bio-composites",
            "farm post-harvest loss",
        ],
        "categories": [
            "post-harvest processing",
            "agriculture",
            "environment & forest",
            "livelihood",
            "agriculture & supply chain",
        ],
        "keywords": [
            "lac",
            "lac processing",
            "natural resins",
            "resins",
            "resin",
            "biopolymers",
            "biopolymer",
            "bio-composites",
            "biocomposites",
            "mahua",
            "lac/mahua value addition",
            "forest produce",
            "value addition of forest produce",
            "value addition",
            "farm post-harvest loss",
            "post-harvest loss",
            "post-harvest",
            "spoilage",
            "storage",
            "packaging",
            "non-timber forest produce",
            "ntfp",
        ],
    },
    {
        "id": "hei-kolhan-university",
        "name": "Kolhan University Chaibasa",
        "domain": "Regional Ecology & Botany",
        "expertise": [
            "ethnobotany",
            "wildlife migration corridors",
            "community forestry",
            "biodiversity",
        ],
        "problems": [
            "human-elephant conflict",
            "medicinal flora",
            "biodiversity conservation",
        ],
        "categories": [
            "regional ecology & botany",
            "regional ecology",
            "botany",
            "environment",
            "forest & wildlife",
            "environment & forest",
        ],
        "keywords": [
            "elephant",
            "elephants",
            "human-elephant conflict",
            "wildlife",
            "wildlife migration corridors",
            "migration corridors",
            "migration corridor",
            "ethnobotany",
            "medicinal flora",
            "medicinal plants",
            "flora",
            "fauna",
            "biodiversity",
            "biodiversity conservation",
            "community forestry",
            "forest conservation",
            "wild animals",
            "botany",
            "herbal",
            "forest corridor",
        ],
    },
]


def _match_term(term: str, text: str) -> bool:
    """Helper to match a word or multi-word phrase against lowercase text.

    Uses exact word boundaries for single-word tokens to avoid substring noise.
    """
    term = term.strip().lower()
    if not term:
        return False

    if " " in term or "/" in term or "-" in term:
        # Multi-word phrase or compound phrase
        return term in text

    # Single-word token: match with word boundaries
    pattern = r"\b" + re.escape(term) + r"\b"
    return bool(re.search(pattern, text))


def _category_matches(input_category: str, hei: dict[str, Any]) -> bool:
    """Check if the provided input category matches an HEI domain or categories."""
    if not input_category:
        return False

    input_cat = input_category.strip().lower()
    domain_lower = hei["domain"].lower()
    hei_cats = [c.lower() for c in hei["categories"]]

    # Exact or domain containment
    if input_cat == domain_lower or input_cat in domain_lower:
        return True

    if any(input_cat == c for c in hei_cats):
        return True

    # Multi-component categories (e.g., "Water/Environment", "Mining/Public Safety")
    sub_cats = [s.strip() for s in re.split(r"[/&,]", input_cat) if s.strip()]
    for sub in sub_cats:
        if sub in domain_lower:
            return True
        if any(sub == c or (len(sub) > 4 and sub in c) for c in hei_cats):
            return True

    return False


def recommend_heis(
    problem_description: str,
    category: Optional[str] = None
) -> list[dict[str, Any]]:
    """Recommend the best 1 to 3 Higher Education Institutions (HEIs) for a problem.

    Matches problem description and category against HEI expertise, focus problem
    areas, and domain keywords using deterministic explainable scoring.

    Args:
        problem_description: Text describing the societal problem.
        category: Optional category of the problem (e.g., Agriculture, Healthcare).

    Returns:
        A list of up to 3 best-matching HEIs with match score and explainable reason.
    """
    text = (problem_description or "").lower()

    scored_heis: list[dict[str, Any]] = []

    for hei in HEI_REGISTRY:
        raw_score = 0.0
        matched_problems: list[str] = []
        matched_expertise: list[str] = []
        matched_terms: list[str] = []
        category_matched = False

        # 1. Match focus problems (weight: 4.0 each)
        for prob in hei["problems"]:
            if _match_term(prob, text):
                raw_score += 4.0
                matched_problems.append(prob)

        # 2. Match core expertise (weight: 3.5 each)
        for exp in hei["expertise"]:
            if _match_term(exp, text):
                raw_score += 3.5
                matched_expertise.append(exp)

        # 3. Match specific domain keywords (weight: 1.5 each)
        for kw in hei["keywords"]:
            # Skip if already captured in matched problems or expertise
            if any(kw in p.lower() for p in matched_problems) or any(kw in e.lower() for e in matched_expertise):
                continue
            if _match_term(kw, text):
                raw_score += 1.5
                matched_terms.append(kw)

        # 4. Match category (weight: 3.0)
        if category and _category_matches(category, hei):
            raw_score += 3.0
            category_matched = True

        # Require a minimum meaningful match (at least 2.0 raw score or category+term)
        if raw_score < 2.0:
            continue

        # Score normalization between 0.15 and 0.98
        score = round(min(0.98, max(0.15, raw_score / 10.0)), 2)

        # Build clean, explainable reason
        reason_parts: list[str] = []
        if matched_expertise:
            reason_parts.append(f"Expertise in {', '.join(matched_expertise[:2])}")
        if matched_problems:
            reason_parts.append(f"Addresses focus area: {', '.join(matched_problems[:2])}")
        if matched_terms:
            reason_parts.append(f"Matched key terms: {', '.join(matched_terms[:3])}")
        if category_matched and category:
            reason_parts.append(f"Aligned with '{category}' domain")

        reason = "; ".join(reason_parts) if reason_parts else f"Aligned with {hei['domain']}"

        scored_heis.append({
            "institution": hei["name"],
            "domain": hei["domain"],
            "score": score,
            "reason": reason,
            "matched_expertise": matched_expertise,
            "matched_problems": matched_problems,
            "matched_keywords": matched_terms,
            "expertise": hei["expertise"],
            "problems": hei["problems"],
        })

    # Sort descending by match score
    scored_heis.sort(key=lambda x: x["score"], reverse=True)

    # Return the best 1 to 3 matches
    return scored_heis[:3]


if __name__ == "__main__":
    print("=" * 80)
    print("HEI / UNIVERSITY RECOMMENDATION ENGINE - STANDALONE TESTS")
    print("=" * 80)

    test_cases = [
        {
            "category": "Agriculture",
            "description": "Severe pest infestation and low crop yield in dryland farming areas affecting farmers and livestock health.",
        },
        {
            "category": "Healthcare",
            "description": "High prevalence of anemia and malnutrition among children, with severe lack of cold chain storage for vaccines in rural primary health centers.",
        },
        {
            "category": "Water/Environment",
            "description": "Heavy industrial effluent and untreated toxic discharge causing severe river pollution and drinking water contamination.",
        },
        {
            "category": "Mining/Public Safety",
            "description": "Underground coal fires causing serious land subsidence and dangerous cracks in village houses near colliery zones.",
        },
        {
            "category": "Digital Infrastructure",
            "description": "Lack of low-bandwidth connectivity and data pipelines, making remote tracking and multilingual communication services fail in tribal blocks.",
        },
    ]

    for i, test in enumerate(test_cases, 1):
        print(f"\n[Test Case {i}] Category: {test['category']}")
        print(f"Problem: {test['description']}")
        print("-" * 80)

        recommendations = recommend_heis(test["description"], category=test["category"])

        if not recommendations:
            print("  No matching HEI found.")
        else:
            for rank, rec in enumerate(recommendations, 1):
                print(f"  #{rank} Institution : {rec['institution']}")
                print(f"     Domain      : {rec['domain']}")
                print(f"     Match Score : {rec['score']:.2f}")
                print(f"     Reason      : {rec['reason']}")
                print()

    print("=" * 80)
    print("All standalone tests executed successfully.")
    print("=" * 80)
