import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL?.replace(/\/+$/, "") || (process.env.NODE_ENV === "development" ? "http://localhost:8000" : "");
export const API = BACKEND_URL;
export const api = axios.create({ baseURL: API || undefined });

export const submitContact = (p) => api.post("/contact", p).then((r) => r.data);
export const adminLogin = (password) => api.post("/admin/login", { password }).then((r) => r.data);

const auth = (t) => ({ headers: { "X-Admin-Token": t } });
export const fetchContacts = (t, { page = 1, perPage = 10, sort = "latest", search = "" } = {}) =>
  api.get("/admin/contacts", { params: { page, per_page: perPage, sort, search }, ...auth(t) }).then((r) => r.data);
export const deleteContact = (t, id) => api.delete(`/admin/contacts/${id}`, auth(t)).then((r) => r.data);
export const updateStatus = (t, id, status) => api.patch(`/admin/contacts/${id}/status`, null, { params: { status }, ...auth(t) }).then((r) => r.data);
export const fetchAnalytics = (t) => api.get("/admin/analytics", auth(t)).then((r) => r.data);
export const fetchVisitors = (t, { page = 1, perPage = 10 } = {}) =>
  api.get("/admin/visitors", { params: { page, per_page: perPage }, ...auth(t) }).then((r) => r.data);
export const fetchBrochures = (t, { page = 1, perPage = 10 } = {}) =>
  api.get("/admin/brochures", { params: { page, per_page: perPage }, ...auth(t) }).then((r) => r.data);

export const brochureURL = `${API}/brochure`;
export { trackBrochure } from "./tracking";
