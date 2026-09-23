const API_URL = "http://127.0.0.1:8000/api/requests";


// Get saved token
function getToken() {
  return localStorage.getItem("access_token");
}


// Common headers
function getHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}


// Customer - Create request
export async function createRequest(requestData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(requestData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to create request");
  }

  return data;
}


// Customer - Get my requests
export async function getMyRequests() {
  const response = await fetch(`${API_URL}/my`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch requests");
  }

  return data;
}


// Company/Admin - Get all requests
export async function getAllRequests() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch all requests");
  }

  return data;
}


// Get request details
export async function getRequest(requestId) {
  const response = await fetch(`${API_URL}/${requestId}`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch request");
  }

  return data;
}


// Company/Admin - Update request status
export async function updateRequestStatus(requestId, status) {
  const response = await fetch(
    `${API_URL}/${requestId}/status`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to update request status");
  }

  return data;
}
