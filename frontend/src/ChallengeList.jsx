import { useEffect, useState } from "react";

function ChallengeList({ onViewDetails }) {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/challenges"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch challenges");
        }

        const data = await response.json();

        setChallenges(data);
      } catch (err) {
        console.error(err);
        setError(
          "Unable to load challenges. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  if (loading) {
    return (
      <section className="list-card">
        <div className="loading-state">
          <div className="loader"></div>
          <p>Loading community challenges...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="list-card">
        <div className="error-message">
          <strong>⚠ Unable to Load Challenges</strong>
          <p>{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="challenge-list-section">

      <div className="list-header">
        <div>
          <span className="badge">
            COMMUNITY CHALLENGES
          </span>

          <h2>Explore Community Problems</h2>

          <p>
            Discover challenges submitted by citizens
            across Jharkhand.
          </p>
        </div>
      </div>

      {challenges.length === 0 ? (
        <div className="empty-state">
          <h3>No challenges found</h3>

          <p>
            Be the first citizen to submit a community
            challenge.
          </p>
        </div>
      ) : (
        <div className="challenge-grid">

          {challenges.map((challenge) => (
            <article
              className="challenge-card"
              key={challenge.id}
            >

              <div className="challenge-card-header">

                <span className="category-badge">
                  {challenge.category}
                </span>

                <span className="status-badge">
                  {challenge.status || "Submitted"}
                </span>

              </div>

              <h3>
                {challenge.title}
              </h3>

              <p className="challenge-description">
                {challenge.description}
              </p>

              <div className="challenge-location">
                📍 {challenge.location || "Jharkhand"}
              </div>

              <div className="challenge-district">
                {challenge.district}
              </div>

              <button
                className="view-button"
                onClick={() => onViewDetails(challenge.id)}
              >
                View Details →
              </button>

            </article>
          ))}

        </div>
      )}

    </section>
  );
}

export default ChallengeList;
