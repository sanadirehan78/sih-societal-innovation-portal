import csv

from categorizer import categorize_problem


def main():
    total = 0
    correct = 0

    with open("ai/dataset.csv", "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            total += 1

            predicted = categorize_problem(row["description"])
            expected = row["category"]

            category_mapping = {
                "Water": "Water & Sanitation",
                "Health": "Healthcare",
            }
            expected = category_mapping.get(expected, expected)

            if predicted == expected:
                correct += 1
                result = "PASS"
            else:
                result = "FAIL"

            print(
                f"{row['problem_id']} | "
                f"Expected: {expected} | "
                f"Predicted: {predicted} | "
                f"{result}"
            )

    accuracy = (correct / total) * 100 if total else 0

    print("\n-------------------------")
    print(f"Total problems: {total}")
    print(f"Correct: {correct}")
    print(f"Incorrect: {total - correct}")
    print(f"Accuracy: {accuracy:.2f}%")
    print("-------------------------")


if __name__ == "__main__":
    main()