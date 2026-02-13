import api from "./api";

// Get all players
export const getPlayers = () =>
  api("/api/players");

// Create player (FormData for image upload)
export const createPlayer = (data) =>
  api("/api/players", "POST", data, true);

// Update player (FormData)
export const updatePlayer = (id, data) =>
  api(`/api/players/${id}`, "PUT", data, true);

// Delete player
export const deletePlayer = (id) =>
  api(`/api/players/${id}`, "DELETE");

export const createBulkPlayers = (data) =>
  api("/api/players/bulk-form", "POST", data, true);
