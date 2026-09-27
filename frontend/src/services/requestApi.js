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
    ...(token
      ? { Authorization: `Bearer ${token}` }
      : {}),
  };
}

// --------------------------------------------------
// Customer - Create Request
// --------------------------------------------------

export async function createRequest(requestData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(requestData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to create request"
    );
  }

  return data;
}

// --------------------------------------------------
// Customer - Get My Requests
// --------------------------------------------------

export async function getMyRequests() {
  const response = await fetch(`${API_URL}/my`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to fetch requests"
    );
  }

  return data;
}

// --------------------------------------------------
// Company/Admin - Get All Requests
// Search + Filtering
// --------------------------------------------------

export async function getAllRequests(filters = {}) {
  const params = new URLSearchParams();

  // Search
  if (filters.search?.trim()) {
    params.append(
      "search",
      filters.search.trim()
    );
  }

  // Status filter
  if (filters.status) {
    params.append(
      "status",
      filters.status
    );
  }

  // Service filter
  if (filters.service) {
    params.append(
      "service",
      filters.service
    );
  }

  const queryString = params.toString();

  const url = queryString
    ? `${API_URL}?${queryString}`
    : API_URL;

  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Failed to fetch all requests"
    );
  }

  return data;
}

// --------------------------------------------------
// Get Request Details
// --------------------------------------------------

export async function getRequest(requestId) {
  const response = await fetch(
    `${API_URL}/${requestId}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Failed to fetch request"
    );
  }

  return data;
}

// --------------------------------------------------
// Company/Admin - Update Request Status
// --------------------------------------------------

export async function updateRequestStatus(
  requestId,
  status
) {
  const response = await fetch(
    `${API_URL}/${requestId}/status`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({
        status,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Failed to update request status"
    );
  }

  return data;
}