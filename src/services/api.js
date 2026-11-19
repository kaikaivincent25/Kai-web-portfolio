import axios from "axios";

// In dev, Vite proxies /api to http://localhost:8000 (see vite.config.js).
// Production requests go directly to the deployed FastAPI service.
const configuredBaseURL = import.meta.env.VITE_API_BASE_URL || "";
const baseURL = import.meta.env.DEV
  ? configuredBaseURL || "/api"
  : /^https?:\/\//i.test(configuredBaseURL)
    ? configuredBaseURL
    : "https://p-backend-bukd.onrender.com/api";

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
    slug: "personal-portfolio-api",
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
  {
    id: "in4",
    title: "IN4",
    slug: "in4",
    summary: "A mobile-first knowledge and professional networking platform connecting readers with verified experts.",
    description: "IN4 is a mobile-first digital knowledge and professional networking platform built with React Native, Expo, FastAPI, PostgreSQL, and Supabase. Users can discover credible articles, search by category, interact with experts, save content, and participate in discussions. The platform also includes expert verification, content publishing, secure authentication, and M-Pesa-powered verification payments.",
    stack_tags: ["React Native (Expo)", "FastAPI", "PostgreSQL", "Supabase"].map((name) => ({ id: name, name })),
    featured: true,
    live_url: "https://expo.dev/accounts/kaikaivincent25/projects/in4/builds/f03e3999-d16c-4873-94e1-9cba27457745",
    repo_url: "https://github.com/kaikaivincent25/IN4-frontend",
    status: "Ongoing",
  },
];

export const personalSkills = [
  { id: "react", name: "React", category: "frontend", proficiency: "confident" },
  { id: "javascript", name: "JavaScript", category: "frontend", proficiency: "confident" },
  { id: "css", name: "CSS", category: "frontend", proficiency: "confident" },
  { id: "fastapi", name: "FastAPI", category: "backend", proficiency: "confident" },
  { id: "python", name: "Python", category: "backend", proficiency: "confident" },
  { id: "postgresql", name: "PostgreSQL", category: "backend", proficiency: "confident" },
  { id: "react-native", name: "React Native (Expo)", category: "mobile", proficiency: "confident" },
];

function normalizeProject(project) {
  return {
    ...project,
    cover_image: project.cover_image ?? project.cover_image_url,
    gallery_images:
      project.gallery_images ??
      (project.images || []).map((image) => ({
        ...image,
        image: image.image ?? image.image_url,
      })),
  };
}

function mergeProjects(projects = []) {
  const merged = [...personalProjects];
  projects.forEach((project) => {
    const matchIndex = merged.findIndex((item) =>
      item.slug === project.slug || (item.live_url && project.live_url &&
        item.live_url.replace(/\/$/, "") === project.live_url.replace(/\/$/, ""))
    );
    if (matchIndex >= 0) merged[matchIndex] = { ...merged[matchIndex], ...project };
    else merged.push(project);
  });
  return merged.map(normalizeProject);
}

export async function getProfile() {
  const { data } = await api.get("/profile/");
  return { ...data, avatar: data.avatar ?? data.avatar_url };
}

export async function getSkills() {
  try {
    const { data } = await api.get("/skills/");
    return data?.length ? data : personalSkills;
  } catch {
    return personalSkills;
  }
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
    return normalizeProject({
      ...personalProjects.find((project) => project.slug === slug),
      ...data,
    });
  } catch (error) {
    const project = personalProjects.find((item) => item.slug === slug);
    if (project) return normalizeProject(project);
    throw error;
  }
}

export async function sendContactMessage(payload) {
  // payload: { name, email, phone, subject, message, intent, honeypot }
  const { data } = await api.post("/contact/", payload);
  return data;
}

export async function createAdminSession(apiKey) {
  const { data } = await api.post("/admin/session/", { api_key: apiKey });
  return data;
}

export async function updateAdminProfile(token, profile) {
  const { data } = await api.patch("/profile/", profile, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function getAdminMessages(token) {
  const { data } = await api.get("/messages/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function updateAdminMessageStatus(token, id, status) {
  const { data } = await api.patch(
    `/messages/${id}/`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}
