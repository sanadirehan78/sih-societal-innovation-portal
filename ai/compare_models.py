import csv

from categorizer import categorize_problem
from ml_categorizer import train_model


def normalize_rule_category(category):
    """
    Convert our application's category names
    to the dataset's category names where they
    clearly represent the same category.
    """
    mapping = {
        "Water & Sanitation": "Water",
        "Healthcare": "Health",
    }

    return mapping.get(category, category)


def main():
    # Train the ML model once
    vectorizer, model = train_model()

    rule_correct = 0
    ml_correct = 0
    total = 0

    with open("ai/dataset.csv", "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            total += 1

            description = row["description"]
            expected = row["category"]

            # Rule-based prediction
            rule_prediction = categorize_problem(description)
            rule_prediction = normalize_rule_category(rule_prediction)

            # ML prediction
            X = vectorizer.transform([description])
            ml_prediction = model.predict(X)[0]

            if rule_prediction == expected:
                rule_correct += 1

            if ml_prediction == expected:
                ml_correct += 1

            print(
                f"{row['problem_id']} | "
                f"Expected: {expected} | "
                f"Rule: {rule_prediction} | "
                f"ML: {ml_prediction}"
            )

    rule_accuracy = (rule_correct / total) * 100
    ml_accuracy = (ml_correct / total) * 100

    print("\n==============================")
    print("MODEL COMPARISON")
    print("==============================")
    print(f"Total problems: {total}")
    print(f"Rule-based correct: {rule_correct}")
    print(f"Rule-based accuracy: {rule_accuracy:.2f}%")
    print()
    print(f"ML correct: {ml_correct}")
    print(f"ML accuracy: {ml_accuracy:.2f}%")
    print("==============================")


if __name__ == "__main__":
    main()