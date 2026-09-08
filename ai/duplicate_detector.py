import csv

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def load_existing_problems():
    problems = []

    with open("ai/dataset.csv", "r", encoding="utf-8-sig") as file:
        reader = csv.DictReader(file)

        for row in reader:
            problems.append({
                "problem_id": row["Problem ID"],
                "title": row["Title"],
                "description": row["Description"],
            })

    return problems


def find_similar_problem(new_problem, threshold=0.35):
    existing_problems = load_existing_problems()

    descriptions = [
        problem["description"]
        for problem in existing_problems
    ]

    all_text = descriptions + [new_problem]

    vectorizer = TfidfVectorizer(
        lowercase=True,
        stop_words="english",
        ngram_range=(1, 2)
    )

    vectors = vectorizer.fit_transform(all_text)

    similarities = cosine_similarity(
        vectors[-1],
        vectors[:-1]
    )[0]

    best_index = similarities.argmax()
    best_score = similarities[best_index]

    best_problem = existing_problems[best_index]

    if best_score >= threshold:
        return True, best_score, best_problem

    return False, best_score, best_problem


if __name__ == "__main__":
    problem = input("Enter a societal problem: ")

    is_duplicate, score, similar_problem = find_similar_problem(problem)

    print("\nDuplicate Detection Result")

    if is_duplicate:
        print("⚠️ Similar problem found!")
        print(f"Similarity Score: {score:.2f}")
        print(f"Problem ID: {similar_problem['problem_id']}")
        print(f"Title: {similar_problem['title']}")
        print(f"Existing Problem: {similar_problem['description']}")
    else:
        print("✅ No similar problem found.")
        print(f"Highest Similarity Score: {score:.2f}")
        print(f"Closest Problem ID: {similar_problem['problem_id']}")
        print(f"Closest Title: {similar_problem['title']}")