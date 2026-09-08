def categorize_problem(text: str) -> str:
    text = text.lower()

    if any(word in text for word in ["farmer", "agriculture", "crop", "irrigation"]):
        return "Agriculture"

    if any(word in text for word in ["water", "drinking", "well", "pipeline"]):
        return "Water & Sanitation"

    if any(word in text for word in ["hospital", "health", "medicine", "doctor", "disease"]):
        return "Healthcare"

    if any(word in text for word in ["school", "education", "teacher", "student"]):
        return "Education"

    if any(word in text for word in ["road", "bridge", "street", "transport"]):
        return "Infrastructure"

    if any(word in text for word in ["forest", "wildlife", "tree", "deforestation"]):
        return "Environment"

    if any(word in text for word in ["job", "employment", "livelihood", "business"]):
        return "Livelihood"

    return "Other"


if __name__ == "__main__":
    problem = input("Enter a societal problem: ")

    category = categorize_problem(problem)

    print("Predicted Category:", category)