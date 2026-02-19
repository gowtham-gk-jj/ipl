const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function api(endpoint, method = "GET", body = null, isFormData = false) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` })
  };

  // ❗ Only set JSON header if NOT FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body
      ? isFormData
        ? body // send FormData directly
        : JSON.stringify(body)
      : null
  });

  const contentType = res.headers.get("content-type");

  let data = null;

  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  }

  if (!res.ok) {
    throw new Error(data?.message || `API Error (${res.status})`);
  }

  return data;
}

export default api;
