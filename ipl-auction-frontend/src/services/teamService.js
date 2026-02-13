import api from "./api";

export const getTeams = () => api("/api/teams");

export const createTeam = (data) =>
  api("/api/teams", "POST", data);

export const updateTeam = (id, data) =>
  api(`/api/teams/${id}`, "PUT", data);

export const deleteTeam = (id) =>
  api(`/api/teams/${id}`, "DELETE");
