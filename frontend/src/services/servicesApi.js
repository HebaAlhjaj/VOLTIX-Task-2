const API_URL = "http://127.0.0.1:8000/api/services";

export async function getServices() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch services");
  }

  return response.json();
}

export async function createService(serviceData, token) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(serviceData),
  });

  if (!response.ok) {
    throw new Error("Failed to create service");
  }

  return response.json();
}

export async function updateService(serviceId, serviceData, token) {
  const response = await fetch(`${API_URL}/${serviceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(serviceData),
  });

  if (!response.ok) {
    throw new Error("Failed to update service");
  }

  return response.json();
}

export async function deleteService(serviceId, token) {
  const response = await fetch(`${API_URL}/${serviceId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete service");
  }

  return response.json();
}