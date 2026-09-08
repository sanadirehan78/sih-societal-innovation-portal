import csv

from ml_categorizer import predict_category


def main():
    correct = 0
    total = 0

    print("UNSEEN TEST RESULTS")
    print("===================")

    with open("ai/test_dataset.csv", "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            total += 1

            description = row["description"]
            expected = row["category"]

            predicted = predict_category(description)

            result = "PASS" if predicted == expected else "FAIL"

            if predicted == expected:
                correct += 1

            print(
                f"{row['problem_id']} | "
                f"Expected: {expected} | "
                f"Predicted: {predicted} | "
                f"{result}"
            )

    accuracy = (correct / total) * 100

    print("\n===================")
    print(f"Total tests: {total}")
    print(f"Correct: {correct}")
    print(f"Incorrect: {total - correct}")
    print(f"Unseen test accuracy: {accuracy:.2f}%")
    print("===================")


if __name__ == "__main__":
    main()