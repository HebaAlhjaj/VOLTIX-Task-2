const API_URL = "http://127.0.0.1:8000/api/files";

const getToken = () => {
  return localStorage.getItem("access_token");
};

// Get user's uploaded files
export const getMyFiles = async () => {
  const token = getToken();

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch files");
  }

  return response.json();
};

// Upload a file
export const uploadFile = async (file) => {
  const token = getToken();

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to upload file");
  }

  return data;
};

// Delete a file
export const deleteFile = async (fileId) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to delete file");
  }

  return data;
};