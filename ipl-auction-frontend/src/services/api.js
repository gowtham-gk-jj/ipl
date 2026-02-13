const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function api(endpoint, method = "GET", body = null) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: body ? JSON.stringify(body) : null
  });

  // 👇 SAFELY HANDLE NON-JSON RESPONSES
  const contentType = res.headers.get("content-type");

  let data = null;

  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.message || `API Error (${res.status})`);
  }

  return data;
}

export default api;
