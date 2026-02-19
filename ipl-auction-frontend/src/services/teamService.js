import api from "./api";

/* ================= GET LOGGED-IN TEAM ================= */
export const getMyTeam = () =>
  api("/api/teams/my-team", "GET");

/* ================= GET ALL TEAMS ================= */
export const getTeams = () =>
  api("/api/teams", "GET");

/* ================= CREATE TEAM ================= */
export const createTeam = (data) =>
  api("/api/teams", "POST", data);

/* ================= UPDATE TEAM ================= */
export const updateTeam = (id, data) =>
  api(`/api/teams/${id}`, "PUT", data);

/* ================= DELETE TEAM ================= */
export const deleteTeam = (id) =>
  api(`/api/teams/${id}`, "DELETE");
