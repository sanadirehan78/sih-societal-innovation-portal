import { useState } from "react";
import "./App.css";

function App() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  // Problem categories
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

  // Jharkhand districts
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
    "Jamtara",
  ];

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Submit challenge
  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const challenge = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      district: formData.district,
      location: formData.location,
      citizen_name: formData.citizenName,
      citizen_contact: formData.citizenContact,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/challenges",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(challenge),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit challenge");
      }

      const result = await response.json();

      setSuccessMessage(
        `Challenge submitted successfully! Your Challenge ID is #${result.id}.`
      );

      // Clear form after successful submission
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
      console.error(error);

      setErrorMessage(
        "Unable to submit your challenge. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div className="header-content">

          <div className="logo">
            SI
          </div>

          <div>
            <h1>
              Societal Innovation Collaboration Portal
            </h1>

            <p>
              Turn community challenges into innovation
            </p>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="main-container">

        {/* Hero Section */}
        <section className="hero">

          <span className="badge">
            CITIZEN ENGAGEMENT
          </span>

          <h2>
            Submit a Community Challenge
          </h2>

          <p>
            Help identify real problems in your community and connect them
            with universities, industry partners and innovators.
          </p>

        </section>

        {/* Form Card */}
        <section className="form-card">

          {/* Success Message */}
          {successMessage && (
            <div className="success-message">
              <strong>
                ✓ Challenge Submitted Successfully!
              </strong>

              <p>
                {successMessage}
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="error-message">
              <strong>
                ⚠ Submission Failed
              </strong>

              <p>
                {errorMessage}
              </p>
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

              {/* Category */}
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

                  <option value="">
                    Select a domain
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}

                </select>

              </div>

              {/* District */}
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

                  <option value="">
                    Select district
                  </option>

                  {districts.map((district) => (
                    <option
                      key={district}
                      value={district}
                    >
                      {district}
                    </option>
                  ))}

                </select>

              </div>

            </div>

            {/* Location */}
            <div className="form-group">

              <label htmlFor="location">
                Location
              </label>

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

              <h3>
                Citizen Information
              </h3>

              <p>
                Provide your contact information for follow-up.
              </p>

            </div>

            <div className="two-column">

              {/* Citizen Name */}
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

              {/* Contact */}
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

            {/* Evidence Upload */}
            <div className="form-group">

              <label htmlFor="evidence">
                Evidence / Photo
              </label>

              <div className="upload-box">

                <input
                  id="evidence"
                  name="evidence"
                  type="file"
                  accept="image/*,video/*,.pdf"
                  onChange={handleChange}
                />

                <p>
                  Upload a photo, video or supporting document
                </p>

                {formData.evidence && (
                  <small>
                    Selected file: {formData.evidence.name}
                  </small>
                )}

              </div>

            </div>

            {/* Information Box */}
            <div className="info-box">

              <div className="info-icon">
                AI
              </div>

              <div>

                <strong>
                  What happens after submission?
                </strong>

                <p>
                  Your challenge will be analyzed and can be connected with
                  suitable academic and industry partners for innovative
                  solutions.
                </p>

              </div>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >

              {isLoading
                ? "Submitting..."
                : "Submit Challenge"}

              {!isLoading && (
                <span>
                  →
                </span>
              )}

            </button>

          </form>

        </section>

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
