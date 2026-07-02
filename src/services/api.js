import axios from "axios";

// In dev, Vite proxies /api to http://localhost:8000 (see vite.config.js).
// In production, set VITE_API_BASE_URL to your deployed Django API root.
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getProfile() {
  const { data } = await api.get("/profile/");
  return data;
}

export async function getSkills() {
  const { data } = await api.get("/skills/");
  return data;
}

export async function getProjects(params = {}) {
  const { data } = await api.get("/projects/", { params });
  return data;
}

export async function getProjectBySlug(slug) {
  const { data } = await api.get(`/projects/${slug}/`);
  return data;
}

export async function sendContactMessage(payload) {
  // payload: { name, email, phone, subject, message, intent, honeypot }
  const { data } = await api.post("/contact/", payload);
  return data;
}