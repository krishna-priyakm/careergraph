import { useEffect, useState } from "react";

import {
  getPeople,
  getPersonSkills,
  getRecommendations,
  getMissingSkills,
  getCareerGraph,
} from "../api/api";

function Dashboard() {
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");

  const [skills, setSkills] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [careerGraph, setCareerGraph] = useState(null);

  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  

  const [error, setError] = useState("");

  // ---------------------------------------
  // Load all people
  // ---------------------------------------
  useEffect(() => {
    const loadPeople = async () => {
      try {
        const response = await getPeople();

        setPeople(response.data);

        if (response.data.length > 0) {
          setSelectedPerson(response.data[0].id);
        }
      } catch (error) {
        console.error("Error loading people:", error);
        setError("Unable to load candidates.");
      }
    };

    loadPeople();
  }, []);

  // ---------------------------------------
  // Load skills and recommendations
  // ---------------------------------------
  useEffect(() => {
    if (!selectedPerson) return;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        // Close previously opened job details
        setSelectedJob(null);
        setJobDetails(null);

    const [
        skillsResponse,
        recommendationsResponse,
        graphResponse,
    ] = await Promise.all([
        getPersonSkills(selectedPerson),
        getRecommendations(selectedPerson),
        getCareerGraph(selectedPerson),
    ]);

        setSkills(skillsResponse.data);
        setRecommendations(recommendationsResponse.data);
        setCareerGraph(graphResponse.data);

        setSkills(skillsResponse.data);
        setRecommendations(recommendationsResponse.data);
      } catch (error) {
        console.error(
          "Error loading dashboard:",
          error
        );

        setError(
          "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [selectedPerson]);

  // ---------------------------------------
  // View job details
  // ---------------------------------------
  const handleViewDetails = async (job) => {
    try {
      setSelectedJob(job);
      setJobDetails(null);
      setCareerGraph(null);
      setDetailsLoading(true);
      setError("");

      const response = await getMissingSkills(
        selectedPerson,
        job.jobId
      );

      setJobDetails(response.data);
    } catch (error) {
      console.error(
        "Error loading job details:",
        error
      );

      setError(
        "Unable to load job details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // ---------------------------------------
  // Close job details
  // ---------------------------------------
  const handleCloseDetails = () => {
    setSelectedJob(null);
    setJobDetails(null);
  };

  return (
    <div className="dashboard">

      {/* ---------------------------------- */}
      {/* HERO */}
      {/* ---------------------------------- */}

      <header className="hero">
        <p className="eyebrow">
          CAREERGRAPH
        </p>

        <h1>
          Discover your next
          <span>
            career opportunity.
          </span>
        </h1>

        <p className="hero-text">
          Explore jobs through skills,
          relationships and career
          connections.
        </p>
      </header>

      {/* ---------------------------------- */}
      {/* CANDIDATE SELECTOR */}
      {/* ---------------------------------- */}

        <section className="candidate-section">
    <div>
        <label htmlFor="candidate">
        Select candidate
        </label>

        <p className="candidate-hint">
        Choose a candidate to explore their career graph
        </p>
    </div>

    <select
        id="candidate"
        value={selectedPerson}
        onChange={(event) => {
        setSelectedPerson(event.target.value);
        }}
    >
        <option value="" disabled>
        Select a candidate
        </option>

        {people.map((person) => (
        <option
            key={person.id}
            value={person.id}
        >
            {person.name} — {person.experience} years experience
        </option>
        ))}
    </select>
    </section>

      {/* ---------------------------------- */}
      {/* ERROR */}
      {/* ---------------------------------- */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* ---------------------------------- */}
      {/* LOADING */}
      {/* ---------------------------------- */}

      {loading ? (
        <div className="loading">
          Loading career opportunities...
        </div>
      ) : (
        <>
          {/* -------------------------------- */}
          {/* STATISTICS */}
          {/* -------------------------------- */}

          <section className="stats">

            <div className="stat-card">
              <span>Skills</span>

              <strong>
                {skills.length}
              </strong>
            </div>

            <div className="stat-card">
              <span>
                Matching Jobs
              </span>

              <strong>
                {recommendations.length}
              </strong>
            </div>

            <div className="stat-card">
              <span>
                Career Connections
              </span>

              <strong>
                {
                  new Set(
                    recommendations.map(
                      (item) =>
                        item.companyId
                    )
                  ).size
                }
              </strong>
            </div>

          </section>

          {/* -------------------------------- */}
          {/* CURRENT SKILLS */}
          {/* -------------------------------- */}

          <section className="skills-section">

            <div className="section-heading">

              <div>
                <p className="eyebrow">
                  YOUR PROFILE
                </p>

                <h2>
                  Current skills
                </h2>
              </div>

            </div>

            {skills.length === 0 ? (
              <div className="empty-state">
                No skills found for this
                candidate.
              </div>
            ) : (
              <div className="skill-list">

                {skills.map((skill) => (
                  <span
                    className="skill-badge"
                    key={skill.id}
                  >
                    {skill.name}
                  </span>
                ))}

              </div>
            )}

            </section>
            
            <section className="graph-section">

    <div className="section-heading">
        <div>
        <p className="eyebrow">
            CAREER GRAPH
        </p>

        <h2>
            Your career connections
        </h2>
        </div>

        <span>
        Powered by CognoDB
        </span>
    </div>

    {careerGraph ? (
        <div className="graph-container">

        {/* Person */}

        <div className="graph-node person-node">
            <span className="node-type">
            PERSON
            </span>

            <strong>
            {careerGraph.person.name}
            </strong>

            <small>
            {careerGraph.person.experience} years
            experience
            </small>
        </div>

        <div className="graph-arrow">
            ↓ HAS_SKILL
        </div>

        {/* Skills */}

        <div className="graph-group">

            <p>SKILLS</p>

            <div className="graph-items">

            {careerGraph.skills.map(
                (skill) => (
                <div
                    className="graph-node skill-node"
                    key={skill.id}
                >
                    <span className="node-type">
                    SKILL
                    </span>

                    <strong>
                    {skill.name}
                    </strong>

                    <small>
                    {skill.category}
                    </small>
                </div>
                )
            )}

            </div>

        </div>

        <div className="graph-arrow">
            ↓ REQUIRES
        </div>

        {/* Jobs */}

        <div className="graph-group">

            <p>RELATED JOBS</p>

            <div className="graph-items">

            {careerGraph.jobs.map(
                (job) => (
                <div
                    className="graph-node job-node"
                    key={job.id}
                >
                    <span className="node-type">
                    JOB
                    </span>

                    <strong>
                    {job.title}
                    </strong>

                    <small>
                    {job.experienceLevel}
                    </small>
                </div>
                )
            )}

            </div>

        </div>

        <div className="graph-arrow">
            ↓ OFFERS
        </div>

        {/* Companies */}

        <div className="graph-group">

            <p>COMPANIES</p>

            <div className="graph-items">

            {careerGraph.companies.map(
                (company) => (
                <div
                    className="graph-node company-node"
                    key={company.id}
                >
                    <span className="node-type">
                    COMPANY
                    </span>

                    <strong>
                    {company.name}
                    </strong>

                    <small>
                    {company.location}
                    </small>
                </div>
                )
            )}

            </div>

        </div>

        </div>
    ) : (
        <div className="empty-state">
        No career graph data available.
        </div>
    )}

    </section>

          {/* -------------------------------- */}
          {/* JOB RECOMMENDATIONS */}
          {/* -------------------------------- */}

          <section className="jobs-section">

            <div className="section-heading">

              <div>
                <p className="eyebrow">
                  RECOMMENDATIONS
                </p>

                <h2>
                  Jobs that match your
                  skills
                </h2>
              </div>

              <span>
                {recommendations.length}{" "}
                opportunities
              </span>

            </div>

            {recommendations.length === 0 ? (
              <div className="empty-state">
                No matching jobs found.
              </div>
            ) : (
              <div className="job-grid">

                {recommendations.map(
                  (job) => (

                    <div
                      className="job-card"
                      key={`${job.jobId}-${job.companyId}`}
                    >

                      {/* Job information */}

                      <div className="job-card-top">

                        <div>

                          <p className="company">
                            {job.company}
                          </p>

                          <h3>
                            {job.job}
                          </h3>

                          <p className="location">
                            {job.location}
                          </p>

                        </div>

                        <span className="level">
                          {job.experienceLevel}
                        </span>

                      </div>

                      {/* Match percentage */}

                      <div className="match">

                        <span>
                          {
                            job.matchPercentage
                          }%
                          {" "}
                          skill match
                        </span>

                        <div className="match-bar">

                          <div
                            className="match-fill"
                            style={{
                              width: `${job.matchPercentage}%`,
                            }}
                          />

                        </div>

                      </div>

                      {/* View details button */}

                      <button
                        className="details-button"
                        onClick={() =>
                          handleViewDetails(
                            job
                          )
                        }
                      >
                        View Details →
                      </button>

                    </div>

                  )
                )}

              </div>
            )}

          </section>

          {/* -------------------------------- */}
          {/* JOB DETAILS */}
          {/* -------------------------------- */}

          {selectedJob && (
            <section className="details-section">

              {detailsLoading ? (

                <div className="loading">
                  Loading job details...
                </div>

              ) : jobDetails ? (

                <div className="details-card">

                  {/* Details header */}

                  <div className="details-header">

                    <div>

                      <p className="eyebrow">
                        JOB DETAILS
                      </p>

                      <h2>
                        {jobDetails.job}
                      </h2>

                      <p>
                        {selectedJob.company}
                        {" · "}
                        {selectedJob.location}
                      </p>

                    </div>

                    <button
                      className="close-button"
                      onClick={
                        handleCloseDetails
                      }
                      aria-label="Close job details"
                    >
                      ×
                    </button>

                  </div>

                  {/* Match percentage */}

                  <div className="details-match">

                    <strong>
                      {
                        jobDetails.matchPercentage
                      }%
                    </strong>

                    <span>
                      Skill Match
                    </span>

                  </div>

                  {/* Skills */}

                  <div className="details-grid">

                    {/* Existing skills */}

                    <div>

                      <h3>
                        Your skills
                      </h3>

                      <div className="skill-list">

                        {jobDetails.ownedSkills.map(
                          (skill) => (
                            <span
                              className="skill-badge"
                              key={skill}
                            >
                              ✓ {skill}
                            </span>
                          )
                        )}

                      </div>

                    </div>

                    {/* Missing skills */}

                    <div>

                      <h3>
                        Skills to develop
                      </h3>

                      {jobDetails.missingSkills
                        .length === 0 ? (

                        <p className="success-text">
                          You have all the
                          required skills!
                        </p>

                      ) : (

                        <div className="missing-list">

                          {jobDetails.missingSkills.map(
                            (skill) => (
                              <span
                                className="missing-badge"
                                key={skill}
                              >
                                ○ {skill}
                              </span>
                            )
                          )}

                        </div>

                      )}

                    </div>

                  </div>

                  {/* Required skill summary */}

                  <div className="required-summary">

                    <strong>
                      {
                        jobDetails.matchedSkills
                      }{" "}
                      of{" "}
                      {
                        jobDetails.totalRequiredSkills
                      }
                    </strong>

                    <span>
                      required skills
                      matched
                    </span>

                  </div>

                </div>

              ) : null}

            </section>
          )}

        </>
      )}

    </div>
  );
}

export default Dashboard;