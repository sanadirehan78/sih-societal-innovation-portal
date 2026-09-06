import React, { useState } from "react";

function ChallengeForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    district: "",
    location: "",
    evidence: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Challenge submitted successfully!");

    console.log(formData);
  };

  return (
    <div className="challenge-container">
      <div className="challenge-card">
        <h2>Citizen Challenge Submission</h2>
        <p className="subtitle">
          Report a societal problem and help create a better community.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Problem Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter problem title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>Problem Description</label>
          <textarea
            name="description"
            placeholder="Describe the problem in detail"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            required
          />

          <label>District</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
          >
            <option value="">Select District</option>
            <option value="Pune">Pune</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Nashik">Nashik</option>
            <option value="Nagpur">Nagpur</option>
            <option value="Kolhapur">Kolhapur</option>
            <option value="Satara">Satara</option>
          </select>

          <label>Location</label>
          <input
            type="text"
            name="location"
            placeholder="Enter location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <label>Evidence / Photo</label>
          <input
            type="file"
            name="evidence"
            accept="image/*"
            onChange={handleChange}
          />

          <button type="submit">
            Submit Challenge
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChallengeForm;
