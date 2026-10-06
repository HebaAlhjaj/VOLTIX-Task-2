const API_URL = "http://127.0.0.1:8000/api";

const getToken = () => {
  return localStorage.getItem("access_token");
};

const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

// Get projects available to current user
export const getProjects = async () => {
  const response = await fetch(`${API_URL}/projects`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to fetch projects");
  }

  return response.json();
};

// Get single project
export const getProject = async (projectId) => {
  const response = await fetch(`${API_URL}/projects/${projectId}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to fetch project");
  }

  return response.json();
};

// Create project - Admin only
export const createProject = async (projectData) => {
  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to create project");
  }

  return response.json();
};

// Update project - Admin only
export const updateProject = async (projectId, projectData) => {
  const response = await fetch(`${API_URL}/projects/${projectId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to update project");
  }

  return response.json();
};

// Delete project - Admin only
export const deleteProject = async (projectId) => {
  const response = await fetch(`${API_URL}/projects/${projectId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to delete project");
  }

  return response.json();
};