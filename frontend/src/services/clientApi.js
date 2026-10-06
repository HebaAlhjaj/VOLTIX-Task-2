const API_URL = "http://127.0.0.1:8000/api";

const getToken = () => {
  return localStorage.getItem("access_token");
};

const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

// Get all clients
export const getClients = async () => {
  const response = await fetch(`${API_URL}/clients`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to fetch clients");
  }

  return response.json();
};

// Create client - Admin only
export const createClient = async (clientData) => {
  const response = await fetch(`${API_URL}/clients`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(clientData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to create client");
  }

  return response.json();
};

// Update client - Admin only
export const updateClient = async (clientId, clientData) => {
  const response = await fetch(`${API_URL}/clients/${clientId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(clientData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to update client");
  }

  return response.json();
};

// Delete client - Admin only
export const deleteClient = async (clientId) => {
  const response = await fetch(`${API_URL}/clients/${clientId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to delete client");
  }

  return response.json();
};