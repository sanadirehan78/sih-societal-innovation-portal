import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [challenges, setChallenges] = useState([]);
  const [showChallenges, setShowChallenges] = useState(false);
  const [loadingChallenges, setLoadingChallenges] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Government Dashboard state
  const [currentView, setCurrentView] = useState("citizen");
  const [dashboardStats, setDashboardStats] = useState(null);
  const [dashboardChallenges, setDashboardChallenges] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState("");


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

  const fetchDashboardData = async () => {
    setLoadingDashboard(true);
    setDashboardError("");

    try {
      const [statsRes, challengesRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/dashboard/stats"),
        fetch("http://127.0.0.1:8000/challenges"),
      ]);

      if (!statsRes.ok) {
        throw new Error(`Failed to load statistics (HTTP ${statsRes.status})`);
      }
      if (!challengesRes.ok) {
        throw new Error(`Failed to load challenges (HTTP ${challengesRes.status})`);
      }

      const statsData = await statsRes.json();
      const challengesData = await challengesRes.json();

      setDashboardStats(statsData);
      setDashboardChallenges(challengesData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setDashboardError(
        "Failed to load government dashboard data. Please make sure the backend is running."
      );
    } finally {
      setLoadingDashboard(false);
    }
  };

  const openDashboard = () => {
    setSelectedChallenge(null);
    setCurrentView("dashboard");
    fetchDashboardData();
  };

  const closeDashboard = () => {
    setSelectedChallenge(null);
    setCurrentView("citizen");
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
          <div className="header-brand">
            <div className="logo">SI</div>

            <div>
              <h1>Societal Innovation Collaboration Portal</h1>
              <p>Turn community challenges into innovation</p>
            </div>
          </div>

          <nav className="header-nav">
            <button
              type="button"
              className={`nav-button ${currentView === "citizen" ? "nav-active" : ""}`}
              onClick={closeDashboard}
            >
              Citizen Portal
            </button>
            <button
              type="button"
              className={`nav-button ${currentView === "dashboard" ? "nav-active" : ""}`}
              onClick={openDashboard}
            >
              🏛️ Government Dashboard
            </button>
          </nav>
        </div>
      </header>

      <main className={`main-container ${currentView === "dashboard" ? "main-dashboard" : ""}`}>
        {/* Citizen Engagement View */}
        {currentView === "citizen" && !selectedChallenge && (
          <>
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
                <div className="button-row">
                  <button 
                    type="button"
                    className="view-challenges-button"
                    onClick={fetchChallenges}
                  >
                    View Submitted Challenges
                  </button>
                  <button
                    type="button"
                    className="open-dashboard-button"
                    onClick={openDashboard}
                  >
                    🏛️ Open Government Dashboard →
                  </button>
                </div>
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
          </>
        )}

        {/* Government Dashboard View */}
        {currentView === "dashboard" && !selectedChallenge && (
          <div className="dashboard-container">
            {/* Dashboard Header Bar */}
            <div className="dashboard-header-bar">
              <div>
                <div className="dashboard-header-actions">
                  <button
                    type="button"
                    className="back-button"
                    onClick={closeDashboard}
                    style={{ marginBottom: 0 }}
                  >
                    ← Back to Citizen Portal
                  </button>
                  <span className="badge">GOVERNMENT DASHBOARD</span>
                </div>
                <h2 className="dashboard-title">Government Dashboard</h2>
                <p className="dashboard-subtitle">
                  Real-time analytics and monitoring of citizen-reported societal challenges across districts
                </p>
              </div>

              <button
                type="button"
                className="refresh-button"
                onClick={fetchDashboardData}
                disabled={loadingDashboard}
              >
                {loadingDashboard ? "Refreshing..." : "🔄 Refresh Data"}
              </button>
            </div>

            {/* Loading State */}
            {loadingDashboard && (
              <div className="dashboard-loading-card">
                <div className="spinner"></div>
                <p>Loading real-time government statistics and challenges...</p>
              </div>
            )}

            {/* Error State */}
            {dashboardError && !loadingDashboard && (
              <div className="error-message">
                <strong>✕ Dashboard Data Error</strong>
                <p>{dashboardError}</p>
                <button
                  type="button"
                  className="retry-button"
                  onClick={fetchDashboardData}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Dashboard Content */}
            {dashboardStats && !loadingDashboard && (
              <>
                {/* 1. Four Summary Cards */}
                <section className="summary-cards-grid">
                  <div className="summary-card card-total">
                    <div className="card-icon">📋</div>
                    <div className="card-info">
                      <span className="card-label">Total Problems</span>
                      <span className="card-value">{dashboardStats.total_challenges}</span>
                      <span className="card-hint">Total reported challenges</span>
                    </div>
                  </div>

                  <div className="summary-card card-priority">
                    <div className="card-icon">🚨</div>
                    <div className="card-info">
                      <span className="card-label">High Priority</span>
                      <span className="card-value">{dashboardStats.high_priority_challenges}</span>
                      <span className="card-hint">Urgent community issues</span>
                    </div>
                  </div>

                  <div className="summary-card card-duplicates">
                    <div className="card-icon">🔄</div>
                    <div className="card-info">
                      <span className="card-label">Duplicate Problems</span>
                      <span className="card-value">{dashboardStats.duplicate_challenges}</span>
                      <span className="card-hint">Identified by duplicate AI</span>
                    </div>
                  </div>

                  <div className="summary-card card-districts">
                    <div className="card-icon">📍</div>
                    <div className="card-info">
                      <span className="card-label">Districts Covered</span>
                      <span className="card-value">
                        {Object.keys(dashboardStats.districts || {}).length}
                      </span>
                      <span className="card-hint">Regions with active reports</span>
                    </div>
                  </div>
                </section>

                {/* 2. Problems by Category & Status/District Column */}
                <div className="dashboard-two-column">
                  {/* Problems by Category */}
                  <section className="dashboard-card">
                    <div className="card-section-header">
                      <div>
                        <h3>Problems by Category</h3>
                        <p className="section-desc">Distribution of citizen reports across innovation domains</p>
                      </div>
                      <span className="section-badge">
                        {Object.keys(dashboardStats.categories || {}).length} Categories
                      </span>
                    </div>
                    <div className="stats-breakdown-list">
                      {Object.entries(dashboardStats.categories || {}).map(([category, count]) => {
                        const percentage = dashboardStats.total_challenges
                          ? Math.round((count / dashboardStats.total_challenges) * 100)
                          : 0;
                        return (
                          <div key={category} className="breakdown-row">
                            <div className="breakdown-label-group">
                              <span className="breakdown-name">{category}</span>
                              <span className="breakdown-count-badge">
                                {count} {count === 1 ? "problem" : "problems"} ({percentage}%)
                              </span>
                            </div>
                            <div className="progress-bar-bg">
                              <div
                                className="progress-bar-fill category-fill"
                                style={{ width: `${Math.max(percentage, 5)}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Problem Status & District Stack */}
                  <div className="dashboard-vertical-stack">
                    {/* Problem Status */}
                    <section className="dashboard-card">
                      <div className="card-section-header">
                        <div>
                          <h3>Problem Status</h3>
                          <p className="section-desc">Workflow resolution progress</p>
                        </div>
                        <span className="section-badge">Status</span>
                      </div>
                      <div className="status-cards-grid">
                        {Object.entries(dashboardStats.statuses || {}).map(([status, count]) => (
                          <div key={status} className="status-metric-card">
                            <span className="status-name">{status}</span>
                            <span className="status-count">{count}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Problems by District */}
                    <section className="dashboard-card">
                      <div className="card-section-header">
                        <div>
                          <h3>Problems by District</h3>
                          <p className="section-desc">Geographic concentration of reported challenges</p>
                        </div>
                        <span className="section-badge">
                          {Object.keys(dashboardStats.districts || {}).length} Districts
                        </span>
                      </div>
                      <div className="district-tag-grid">
                        {Object.entries(dashboardStats.districts || {}).map(([district, count]) => (
                          <div key={district} className="district-tag">
                            <span className="district-name">{district}</span>
                            <span className="district-count">{count}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>

                {/* 3. All Challenges Table */}
                <section className="dashboard-card challenges-table-card">
                  <div className="card-section-header">
                    <div>
                      <h3>All Challenges</h3>
                      <p className="section-desc">
                        Comprehensive registry of reported issues with AI categorization, priority, and recommended Higher Education Institutions (HEIs).
                      </p>
                    </div>
                    <span className="section-badge">
                      {dashboardChallenges.length} Total Records
                    </span>
                  </div>

                  <div className="table-responsive">
                    <table className="dashboard-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Priority</th>
                          <th>District</th>
                          <th>Status</th>
                          <th>Recommended HEI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardChallenges.length === 0 ? (
                          <tr>
                            <td colSpan="7" style={{ textAlign: "center", padding: "24px" }}>
                              No challenges found.
                            </td>
                          </tr>
                        ) : (
                          dashboardChallenges.map((ch) => (
                            <tr
                              key={ch.id}
                              onClick={() => fetchChallengeDetails(ch.id)}
                              className="clickable-row"
                              title="Click to view detailed AI analysis"
                            >
                              <td className="id-cell">#{ch.id}</td>
                              <td className="title-cell">
                                <strong>{ch.title}</strong>
                                {ch.is_duplicate && (
                                  <span className="table-duplicate-tag" title="Potential duplicate detected">
                                    ⚠️ Duplicate
                                  </span>
                                )}
                              </td>
                              <td>
                                <span className="category-tag">{ch.category}</span>
                              </td>
                              <td>
                                <span
                                  className={`ai-priority-badge priority-${(ch.priority || "low").toLowerCase()}`}
                                >
                                  {ch.priority}
                                </span>
                              </td>
                              <td>{ch.district}</td>
                              <td>
                                <span className="status-badge-pill">{ch.status}</span>
                              </td>
                              <td className="hei-cell">
                                {ch.recommended_hei ? (
                                  <span className="hei-tag" title={ch.recommended_hei}>
                                    🎓 {ch.recommended_hei}
                                  </span>
                                ) : (
                                  <span className="hei-none">—</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}
          </div>
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
              ← Back {currentView === "dashboard" ? "to Dashboard" : "to Challenges"}
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
          <strong>Status:</strong> {selectedChallenge.status}
        </p>

        <p>
          <strong>Submitted By:</strong> {selectedChallenge.submitted_by}
        </p>

        <p>
          <strong>Created At:</strong>{" "}
          {new Date(selectedChallenge.created_at).toLocaleString()}
        </p>

        {/* AI Analysis Section */}
        <div className="ai-analysis-section">
          <div className="ai-analysis-header">
            <span className="ai-badge">AI Analysis</span>
            <h4>Intelligent Classification & HEI Recommendation</h4>
          </div>

          <div className="ai-grid">
            <div className="ai-field">
              <span className="ai-field-label">Category</span>
              <span className="ai-field-value">{selectedChallenge.category || "Not available"}</span>
            </div>

            <div className="ai-field">
              <span className="ai-field-label">Priority</span>
              <span className={`ai-priority-badge priority-${(selectedChallenge.priority || "low").toLowerCase()}`}>
                {selectedChallenge.priority || "Low"}
              </span>
            </div>

            <div className="ai-field ai-field-full">
              <span className="ai-field-label">Duplicate Status</span>
              <span className="ai-field-value">
                {selectedChallenge.is_duplicate ? (
                  <span className="duplicate-warning">
                    ⚠️ Potential Duplicate ({Math.round((selectedChallenge.similarity_score || 0) * 100)}% match with #{selectedChallenge.similar_problem_id} - "{selectedChallenge.similar_problem_title}")
                  </span>
                ) : (
                  <span className="duplicate-safe">
                    ✅ Unique Challenge (No duplicate detected)
                  </span>
                )}
              </span>
            </div>

            <div className="ai-field ai-field-full hei-card">
              <span className="ai-field-label">Recommended HEI / University</span>
              {selectedChallenge.recommended_hei ? (
                <div className="hei-details">
                  <div className="hei-header">
                    <strong className="hei-name">{selectedChallenge.recommended_hei}</strong>
                    {selectedChallenge.hei_match_score != null && (
                      <span className="hei-score-badge">
                        {Math.round(selectedChallenge.hei_match_score * 100)}% Match
                      </span>
                    )}
                  </div>
                  {selectedChallenge.hei_recommendation_reason && (
                    <p className="hei-reason">
                      <strong>Recommendation Reason:</strong> {selectedChallenge.hei_recommendation_reason}
                    </p>
                  )}
                </div>
              ) : (
                <p className="hei-empty">No HEI recommendation available for this challenge.</p>
              )}
            </div>
          </div>
        </div>
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