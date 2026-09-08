def detect_priority(problem_description):
    text = problem_description.lower()

    high_keywords = [
        "death",
        "dying",
        "life threatening",
        "emergency",
        "drinking water",
        "clean drinking water",
        "unsafe water",
        "hospital",
        "medicines",
        "medical emergency",
        "fire",
        "flood",
        "accident",
        "dangerous",
        "critical",
    ]

    medium_keywords = [
        "shortage",
        "not enough",
        "damaged",
        "broken",
        "frequent",
        "poor",
        "unavailable",
        "lack of",
    ]

    for keyword in high_keywords:
        if keyword in text:
            return "High"

    for keyword in medium_keywords:
        if keyword in text:
            return "Medium"

    return "Low"


if __name__ == "__main__":
    problem = input("Enter a societal problem: ")

    priority = detect_priority(problem)

    print("Detected Priority:", priority)