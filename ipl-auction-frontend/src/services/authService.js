import api from "./api";

export const loginUser = (email, password) =>
  api("/api/auth/login", "POST", { email, password });

export const registerUser = (formData) =>
  api("/api/auth/register", "POST", formData);

export const resetPassword = (email) =>
  api("/api/auth/reset-password", "POST", { email });
