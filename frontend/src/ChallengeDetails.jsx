import { useEffect, useState } from "react";

function ChallengeDetails({ challengeId, onBack }) {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/challenges/${challengeId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch challenge");
        }

        const data = await response.json();
        setChallenge(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load challenge details.");
      } finally {
        setLoading(false);
      }
    };

    if (challengeId) {
      fetchChallenge();
    }
  }, [challengeId]);

  if (loading) {
    return (
      <section className="details-card">
        <div className="loading-state">
          <div className="loader"></div>
          <p>Loading challenge details...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="details-card">
        <div className="error-message">
          <strong>⚠ Unable to Load Challenge</strong>
          <p>{error}</p>

          <button
            className="retry-button"
            onClick={onBack}
          >
            ← Back to Challenges
          </button>
        </div>
      </section>
    );
  }

  if (!challenge) {
    return (
      <section className="details-card">
        <div className="empty-state">
          <h3>Challenge not found</h3>

          <button
            className="retry-button"
            onClick={onBack}
          >
            ← Back to Challenges
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="details-section">

      <button
        className="back-button"
        onClick={onBack}
      >
        ← Back to Challenges
      </button>

      <div className="details-card">

        <div className="details-header">

          <div>
            <span className="category-badge">
              {challenge.category}
            </span>

            <h2>{challenge.title}</h2>

            <p className="details-location">
              📍 {challenge.location || "Location not provided"},{" "}
              {challenge.district}
            </p>
          </div>

          <span className="status-badge">
            {challenge.status || "Submitted"}
          </span>

        </div>

        <div className="details-content">

          <div className="detail-section">
            <h3>Problem Description</h3>

            <p>
              {challenge.description}
            </p>
          </div>

          <div className="detail-section">
            <h3>Citizen Information</h3>

            <div className="citizen-info">

              <div>
                <strong>Name</strong>
                <p>
                  {challenge.citizen_name || "Not provided"}
                </p>
              </div>

              <div>
                <strong>Contact</strong>
                <p>
                  {challenge.citizen_contact || "Not provided"}
                </p>
              </div>

            </div>
          </div>

          <div className="detail-section">
            <h3>Location</h3>

            <p>
              {challenge.location || "Location not provided"}
            </p>

            <p>
              District: {challenge.district}
            </p>
          </div>

          <div className="detail-section">
            <h3>Evidence</h3>

            <div className="evidence-placeholder">
              <p>
                📷 Evidence submitted by citizen
              </p>

              <small>
                Evidence preview will appear here when
                supported by the backend.
              </small>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}

export default ChallengeDetails;
