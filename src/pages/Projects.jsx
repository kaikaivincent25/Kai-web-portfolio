import { useEffect, useMemo, useState } from "react";
import { getProjects, getSkills } from "../services/api.js";
import ProjectCard from "../components/ProjectCard.jsx";
import "./Projects.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [activeStack, setActiveStack] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getProjects(), getSkills()])
      .then(([projectData, skillData]) => {
        setProjects(projectData);
        setSkills(skillData);
      })
      .catch(() => setError("Couldn't load projects right now. Try again in a moment."))
      .finally(() => setLoading(false));
  }, []);

  // Only show filter chips for skills that are actually tagged on at least
  // one project, so the filter bar never has dead options.
  const availableStacks = useMemo(() => {
    const names = new Set();
    projects.forEach((p) => (p.stack_tags || []).forEach((t) => names.add(t.name)));
    return skills.filter((s) => names.has(s.name));
  }, [projects, skills]);

  const filteredProjects = useMemo(() => {
    if (activeStack === "all") return projects;
    return projects.filter((p) =>
      (p.stack_tags || []).some((t) => t.name === activeStack)
    );
  }, [projects, activeStack]);

  return (
    <section className="container projects-page">
      <header className="projects-header">
        <h1>Projects</h1>
        <p>
          Case studies from what I've built — spanning React, React Native,
          and Django REST Framework, with AI woven into the build process.
        </p>
      </header>

      {availableStacks.length > 0 && (
        <div className="stack-filter" role="tablist" aria-label="Filter projects by stack">
          <button
            className={activeStack === "all" ? "chip chip-active" : "chip"}
            onClick={() => setActiveStack("all")}
          >
            All
          </button>
          {availableStacks.map((skill) => (
            <button
              key={skill.id}
              className={activeStack === skill.name ? "chip chip-active" : "chip"}
              onClick={() => setActiveStack(skill.name)}
            >
              {skill.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="section-note">Loading projects…</p>
      ) : error ? (
        <div className="empty-state">
          <p>{error}</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="empty-state">
          <p>
            {projects.length === 0
              ? "No projects published yet — add one in the admin to see it here."
              : "No projects match that filter yet."}
          </p>
        </div>
      ) : (
        <div className="project-grid">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}