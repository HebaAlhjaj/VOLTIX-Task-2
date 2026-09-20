const API_URL = "http://127.0.0.1:8000/api/content";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}


// GET - Public
export async function getContentItems() {
  const response = await fetch(`${API_URL}/`);

  if (!response.ok) {
    throw new Error("Failed to fetch content items");
  }

  return response.json();
}


// POST - Protected
export async function createContentItem(content) {
  const response = await fetch(`${API_URL}/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(content),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Failed to create content item");
  }

  return response.json();
}


// PUT - Protected
export async function updateContentItem(contentId, content) {
  const response = await fetch(`${API_URL}/${contentId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(content),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Failed to update content item");
  }

  return response.json();
}


// DELETE - Protected
export async function deleteContentItem(contentId) {
  const response = await fetch(`${API_URL}/${contentId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Failed to delete content item");
  }

  return response.json();
}