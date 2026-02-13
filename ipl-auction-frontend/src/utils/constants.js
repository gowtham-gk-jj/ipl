const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ROLES = {
  ADMIN: "admin",
  HOST: "host",
  TEAM: "team",
  VIEWER: "viewer"
};

export { BASE_URL, ROLES };
export default ROLES;
