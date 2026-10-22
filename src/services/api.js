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

// Public projects stay available even when the portfolio API is unavailable.
// Replace these entries with API records over time; matching slugs are deduped.
export const personalProjects = [
  {
    id: "portfolio-site",
    title: "Personal Portfolio",
    slug: "personal-portfolio",
    summary: "A responsive portfolio for sharing my work, skills, and the way I approach building software.",
    description: "My personal portfolio, built to present selected projects and make it easy to learn about my work and get in touch. I continue to refine its content and experience as I grow as a developer.",
    stack_tags: ["React", "Vite", "CSS"].map((name) => ({ id: name, name })),
    featured: true,
    live_url: "https://kaikaivincentwebsite-pi.vercel.app/",
    status: "Ongoing",
  },
  {
    id: "retailshop-information-system",
    title: "Retail Shop Information System",
    slug: "retail-shop-information-system",
    summary: "A deployed retail shop information system designed to make everyday shop information easier to manage.",
    description: "A retail shop information system I have built and deployed. The project is still evolving as I continue to improve its functionality and user experience.",
    stack_tags: ["React", "FastAPI", "PostgreSQL"].map((name) => ({ id: name, name })),
    featured: true,
    live_url: "https://retailshop-information-system.vercel.app/",
    status: "Ongoing",
  },
];

function mergeProjects(projects = []) {
  const bySlug = new Map(personalProjects.map((project) => [project.slug, project]));
  projects.forEach((project) => bySlug.set(project.slug, { ...bySlug.get(project.slug), ...project }));
  return [...bySlug.values()];
}

export async function getProfile() {
  const { data } = await api.get("/profile/");
  return data;
}

export async function getSkills() {
  const { data } = await api.get("/skills/");
  return data;
}

export async function getProjects(params = {}) {
  let data = [];
  try {
    const response = await api.get("/projects/", { params });
    data = response.data;
  } catch {
    // Keep the locally configured deployed projects visible if the API is offline.
  }
  const projects = mergeProjects(data);
  return params.featured ? projects.filter((project) => project.featured) : projects;
}

export async function getProjectBySlug(slug) {
  try {
    const { data } = await api.get(`/projects/${slug}/`);
    return { ...personalProjects.find((project) => project.slug === slug), ...data };
  } catch (error) {
    const project = personalProjects.find((item) => item.slug === slug);
    if (project) return project;
    throw error;
  }
}

export async function sendContactMessage(payload) {
  // payload: { name, email, phone, subject, message, intent, honeypot }
  const { data } = await api.post("/contact/", payload);
  return data;
}
