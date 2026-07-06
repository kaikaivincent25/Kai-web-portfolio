import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile, getProjects, getSkills } from "../services/api.js";
import IntroCard from "../components/Introcard.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import "./Home.css";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => setProfile(null));
    getSkills().then(setSkills).catch(() => setSkills([]));
    getProjects({ featured: true })
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoadingProjects(false));
  }, []);

  return (
    <>
      {/* --- Hero --- */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              {profile?.availability_status === "busy"
                ? "Currently busy"
                : "Open to collaborate"}
            </span>
            <h1 className="hero-title">
              {profile?.name || "Vincent"} — building products with
              <span className="hero-title-accent"> React, React Native &amp; DRF</span>
            </h1>
            <p className="hero-tagline">
              {profile?.tagline ||
                "Full-stack developer learning in public, building software for East Africa — with AI as part of the toolkit, not a shortcut around learning it."}
            </p>
            <div className="hero-actions">
              <Link to="/projects" className="btn btn-primary">
                View projects
              </Link>
              <Link to="/contact" className="btn btn-ghost">
                Get in touch
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <IntroCard
              availability={
                profile?.availability_status === "busy" ? "Currently busy" : "Open to collaborate"
              }
            />
          </div>
        </div>
      </section>

      {/* --- Featured projects --- */}
      <section className="container section">
        <div className="section-heading">
          <h2>Featured work</h2>
          <Link to="/projects" className="section-heading-link">
            See all projects →
          </Link>
        </div>

        {loadingProjects ? (
          <p className="section-note">Loading projects…</p>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <p>No featured projects yet — check back soon, or mark one as featured in the admin.</p>
          </div>
        ) : (
          <div className="project-grid">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* --- Stack & honesty strip --- */}
      <section className="container section stack-section">
        <div className="section-heading">
          <h2>Currently building with</h2>
        </div>
        {skills.length === 0 ? (
          <p className="section-note">Stack details coming soon.</p>
        ) : (
          <ul className="stack-list">
            {skills.map((skill) => (
              <li key={skill.id} className={`stack-item stack-item-${skill.proficiency}`}>
                <span className="stack-item-name">{skill.name}</span>
                <span className="stack-item-level">{skill.proficiency.replace("_", " ")}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* --- Closing CTA --- */}
      <section className="container cta-band">
        <h2>Have a project in mind?</h2>
        <p>Whether it's a collaboration, a role, or just a good problem to solve — I'd like to hear about it.</p>
        <Link to="/contact" className="btn btn-primary">
          Start a conversation
        </Link>
      </section>
    </>
  );
}