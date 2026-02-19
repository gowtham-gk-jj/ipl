const BASE_URL = "https://ipl-c9o8.onrender.com"; 
// If your backend routes start with /api then use:
// const BASE_URL = "https://ipl-c9o8.onrender.com/api";

async function api(endpoint, method = "GET", body = null, isFormData = false) {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body
        ? isFormData
          ? body
          : JSON.stringify(body)
        : null,
    });

    const contentType = response.headers.get("content-type");
    let data = null;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(
        typeof data === "string"
          ? data
          : data?.message || `API Error (${response.status})`
      );
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
}

export default api;
