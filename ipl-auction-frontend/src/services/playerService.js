import api from "./api";

export const getPlayers = () => api("/api/players");

export const createPlayer = (data) =>
  api("/api/players", "POST", data);

export const updatePlayer = (id, data) =>
  api(`/api/players/${id}`, "PUT", data);

export const deletePlayer = (id) =>
  api(`/api/players/${id}`, "DELETE");
