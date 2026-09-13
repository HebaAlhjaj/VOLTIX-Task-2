const API_URL = "http://127.0.0.1:8000/api/content";

export async function getContentItems() {
  const response = await fetch(`${API_URL}/`);

  if (!response.ok) {
    throw new Error("Failed to fetch content items");
  }

  return response.json();
}