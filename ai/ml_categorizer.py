import csv

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression


def load_dataset():
    descriptions = []
    categories = []

    with open("ai/dataset.csv", "r", encoding="utf-8-sig") as file:
        reader = csv.DictReader(file)

        for row in reader:
            descriptions.append(row["Description"])
            categories.append(row["Category"])

    return descriptions, categories


def train_model():
    descriptions, categories = load_dataset()

    vectorizer = TfidfVectorizer(
        lowercase=True,
        stop_words="english",
        ngram_range=(1, 2)
    )

    X = vectorizer.fit_transform(descriptions)

    model = LogisticRegression(
        max_iter=1000,
        class_weight="balanced"
    )

    model.fit(X, categories)

    return vectorizer, model


# Train the model once when this file is loaded.
vectorizer, model = train_model()


def predict_category(problem_description):
    X = vectorizer.transform([problem_description])

    return model.predict(X)[0]


if __name__ == "__main__":
    problem = input("Enter a societal problem: ")

    category = predict_category(problem)

    print("ML Predicted Category:", category)