const API_BASE_URL = "http://localhost:5000/api";

export const getPeople = async () => {
  const response = await fetch(`${API_BASE_URL}/people`);

  if (!response.ok) {
    throw new Error("Failed to fetch people");
  }

  return response.json();
};

export const getPersonSkills = async (personId) => {
  const response = await fetch(
    `${API_BASE_URL}/people/${personId}/skills`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch person skills");
  }

  return response.json();
};

export const getRecommendations = async (personId) => {
  const response = await fetch(
    `${API_BASE_URL}/people/${personId}/recommendations`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch recommendations");
  }

  return response.json();
};

export const getMissingSkills = async (personId, jobId) => {
  const response = await fetch(
    `${API_BASE_URL}/people/${personId}/missing-skills/${jobId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch missing skills");
  }

  return response.json();
};

export const getJobs = async () => {
  const response = await fetch(`${API_BASE_URL}/jobs`);

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return response.json();
};

export const getSkills = async () => {
  const response = await fetch(`${API_BASE_URL}/skills`);

  if (!response.ok) {
    throw new Error("Failed to fetch skills");
  }

  return response.json();
};

export const getCareerGraph = async (personId) => {
  const response = await fetch(
    `${API_BASE_URL}/people/${personId}/graph`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch career graph");
  }

  return response.json();
};