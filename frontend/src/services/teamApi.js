const API_URL = "http://127.0.0.1:8000/api";

const getToken = () => {
  return localStorage.getItem("access_token");
};

export const getTeamMembers = async () => {
  const response = await fetch(`${API_URL}/team-members`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to fetch team members");
  }

  return response.json();
};