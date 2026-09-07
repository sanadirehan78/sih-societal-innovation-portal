import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [challenges, setChallenges] = useState([]);
  const [showChallenges, setShowChallenges] = useState(false);
  const [loadingChallenges, setLoadingChallenges] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);


  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    district: "",
    location: "",
    citizenName: "",
    citizenContact: "",
    evidence: null,
  });

  const categories = [
    "Education",
    "Healthcare",
    "Agriculture",
    "Water Resources",
    "Sanitation",
    "Environment",
    "Energy",
    "Urban Development",
    "Accessibility",
    "Public Administration",
    "Rural Livelihood",
  ];

  const districts = [
    "Ranchi",
    "Bokaro",
    "Dhanbad",
    "East Singhbhum",
    "West Singhbhum",
    "Hazaribagh",
    "Deoghar",
    "Dumka",
    "Giridih",
    "Gumla",
    "Khunti",
    "Koderma",
    "Latehar",
    "Lohardaga",
    "Palamu",
    "Ramgarh",
    "Sahibganj",
    "Seraikela-Kharsawan",
    "Simdega",
    "Chatra",
    "Garhwa",
    "Jamtara",
    "Pakur",
  ];

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };
  const fetchChallenges = async () => {
    setLoadingChallenges(true);
  
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/challenges"
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch challenges");
      }
  
      const data = await response.json();
  
      setChallenges(data);
      setShowChallenges(true);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      setErrorMessage(
        "Failed to load challenges. Please make sure the backend is running."
      );
    } finally {
      setLoadingChallenges(false);
    }
  };
  const fetchChallengeDetails = async (challengeId) => {
    setLoadingDetails(true);
  
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/challenges/${challengeId}`
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch challenge details");
      }
  
      const data = await response.json();
  
      setSelectedChallenge(data);
    } catch (error) {
      console.error("Error fetching challenge details:", error);
      setErrorMessage(
        "Failed to load challenge details. Please make sure the backend is running."
      );
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const challenge = {
      title: formData.title,
      description: formData.description,
      district: formData.district,
      location: formData.location,
      submitted_by: `${formData.citizenName} - ${formData.citizenContact}`,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/challenges",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(challenge),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        console.error("Backend error:", errorData);

        throw new Error("Failed to submit challenge");
      }

      const result = await response.json();

      setSuccessMessage(
        `Challenge submitted successfully! Your Challenge ID is #${result.id}.`
      );

      setFormData({
        title: "",
        description: "",
        category: "",
        district: "",
        location: "",
        citizenName: "",
        citizenContact: "",
        evidence: null,
      });
    } catch (error) {
      console.error("Submission error:", error);

      setErrorMessage(
        "Failed to submit challenge. Please make sure the backend is running."
      );
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">SI</div>

          <div>
            <h1>Societal Innovation Collaboration Portal</h1>
            <p>Turn community challenges into innovation</p>
          </div>
        </div>
      </header>

      <main className="main-container">
        {/* Hero */}
        <section className="hero">
          <span className="badge">CITIZEN ENGAGEMENT</span>

          <h2>Submit a Community Challenge</h2>

          <p>
            Help identify real problems in your community and connect them
            with universities, industry partners and innovators.
          </p>
        </section>

        {/* Form */}
        <section className="form-card">
          {/* Success Message */}
          {successMessage && (
            <div className="success-message">
              <strong>✓ Challenge Submitted Successfully!</strong>
              <p>{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="error-message">
              <strong>✕ Submission Failed</strong>
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Problem Title */}
            <div className="form-group">
              <label htmlFor="title">
                Problem Title <span>*</span>
              </label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="Example: Drinking water shortage in village"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Problem Description */}
            <div className="form-group">
              <label htmlFor="description">
                Problem Description <span>*</span>
              </label>

              <textarea
                id="description"
                name="description"
                rows="5"
                placeholder="Describe the problem, who is affected, and how it impacts the community..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category and District */}
            <div className="two-column">
              <div className="form-group">
                <label htmlFor="category">
                  Domain / Category <span>*</span>
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a domain</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="district">
                  District <span>*</span>
                </label>

                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select district</option>

                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="form-group">
              <label htmlFor="location">Location</label>

              <input
                id="location"
                name="location"
                type="text"
                placeholder="Village / Ward / Area"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            {/* Citizen Information */}
            <div className="section-title personal-info">
              <h3>Citizen Information</h3>
              <p>Provide your contact information for follow-up.</p>
            </div>

            <div className="two-column">
              <div className="form-group">
                <label htmlFor="citizenName">
                  Citizen Name <span>*</span>
                </label>

                <input
                  id="citizenName"
                  name="citizenName"
                  type="text"
                  placeholder="Your name"
                  value={formData.citizenName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="citizenContact">
                  Contact <span>*</span>
                </label>

                <input
                  id="citizenContact"
                  name="citizenContact"
                  type="text"
                  placeholder="Phone or email"
                  value={formData.citizenContact}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Evidence */}
            <div className="form-group">
              <label htmlFor="evidence">Evidence / Photo</label>

              <div className="upload-box">
                <input
                  id="evidence"
                  name="evidence"
                  type="file"
                  accept="image/*,video/*,.pdf"
                  onChange={handleChange}
                />

                <p>Upload a photo, video or supporting document</p>
              </div>
            </div>

            {/* Information Box */}
            <div className="info-box">
              <div className="info-icon">AI</div>

              <div>
                <strong>What happens after submission?</strong>

                <p>
                  Your challenge will be analyzed and can be connected with
                  suitable academic and industry partners for innovative
                  solutions.
                </p>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="submit-button">
              Submit Challenge
              <span>→</span>
            </button>
            <button 
              type="button"
              className="view-challenges-button"
              onClick={fetchChallenges}
          >
            View Submitted Challenges
        </button>
          </form>
          </section>

{/* Challenge List */}
{showChallenges && (
  <section className="form-card challenge-list">
    <h2>Submitted Challenges</h2>

    {loadingChallenges ? (
      <p>Loading challenges...</p>
    ) : challenges.length === 0 ? (
      <p>No challenges submitted yet.</p>
    ) : (
      challenges.map((challenge) => (
        <div className="challenge-item" key={challenge.id}>
          <h3
             className="challenge-title"
             onClick={() => fetchChallengeDetails(challenge.id)}
           >
             #{challenge.id} - {challenge.title}
           </h3>

          <p>{challenge.description}</p>

          <p>
            <strong>District:</strong> {challenge.district}
          </p>

          <p>
            <strong>Priority:</strong> {challenge.priority}
          </p>

          <p>
            <strong>Status:</strong> {challenge.status}
          </p>
        </div>
      ))
    )}
  </section>
)}
{/* Challenge Details */}
{selectedChallenge && (
  <section className="form-card challenge-details">
    <button
      type="button"
      className="back-button"
      disabled={loadingDetails}
      onClick={() => setSelectedChallenge(null)}
     >
      ← Back to Challenges
    </button>
    <h2>Challenge Details</h2>

    {loadingDetails ? (
      <p>Loading details...</p>
    ) : (
      <>
        <h3>
          #{selectedChallenge.id} - {selectedChallenge.title}
        </h3>

        <p>
          <strong>Description:</strong>
        </p>
        <p>{selectedChallenge.description}</p>

        <p>
          <strong>District:</strong> {selectedChallenge.district}
        </p>

        <p>
          <strong>Location:</strong> {selectedChallenge.location}
        </p>

        <p>
          <strong>Category:</strong> {selectedChallenge.category}
        </p>

        <p>
          <strong>Priority:</strong> {selectedChallenge.priority}
        </p>

        <p>
          <strong>Status:</strong> {selectedChallenge.status}
        </p>

        <p>
          <strong>Submitted By:</strong> {selectedChallenge.submitted_by}
        </p>

        <p>
          <strong>Created At:</strong>{" "}
          {new Date(selectedChallenge.created_at).toLocaleString()}
        </p>
      </>
    )}
  </section>
)}

</main>

      {/* Footer */}
      <footer>
        <p>
          Societal Innovation Collaboration Portal • Smart India Hackathon MVP
        </p>
      </footer>
    </div>
  );
}

export default App;