import React, { useState } from "react";

function ChallengeForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="form-card">
      <div className="form-heading">
        <h2>Submit a Citizen Challenge</h2>
        <p>
          Help identify a local problem that can be solved through innovation
          and collaboration.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Problem Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter the problem title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Problem Description</label>
          <textarea
            id="description"
            rows="6"
            placeholder="Describe the problem in detail..."
            required
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="district">District</label>
            <select id="district" required>
              <option value="">Select District</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Nashik">Nashik</option>
              <option value="Nagpur">Nagpur</option>
              <option value="Kolhapur">Kolhapur</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              placeholder="Enter location"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="evidence">Evidence / Photo</label>

          <div className="upload-box">
            <input
              id="evidence"
              type="file"
              accept="image/*"
            />

            <span>Upload a photo showing the problem</span>
            <small>Supported format: JPG, PNG</small>
          </div>
        </div>

        <button type="submit" className="submit-button">
          Submit Challenge
        </button>

        {submitted && (
          <p style={{ marginTop: "15px", color: "green" }}>
            Challenge submitted successfully!
          </p>
        )}
      </form>
    </section>
  );
}

export default ChallengeForm;
