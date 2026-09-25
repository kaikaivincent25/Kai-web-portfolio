import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getProfile, getProjects, getSkills } from "../services/api.js";
import IntroCard from "../components/IntroCard.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import "./Home.css";

const CATEGORY_LABELS = {
  frontend: "Frontend",
  backend: "Backend",
  mobile: "Mobile",
  ai_tools: "AI Tools",
};

const CATEGORY_ORDER = ["frontend", "backend", "mobile", "ai_tools"];

function groupSkillsByCategory(skills) {
  const groups = {};
  skills.forEach((skill) => {
    if (!groups[skill.category]) groups[skill.category] = [];
    groups[skill.category].push(skill);
  });
  return CATEGORY_ORDER.filter((cat) => groups[cat]?.length).map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat] || cat,
    skills: groups[cat],
  }));
}

// Reusable scroll animation hook
function useScrollReveal(dependencies = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(".reveal-up");
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, dependencies);
}

// Reusable background style builder
const bgStyle = (url, overlayOpacity = 0.85, isDark = true) => ({
  backgroundImage: `linear-gradient(rgba(${isDark ? '10, 10, 10' : '250, 250, 249'}, ${overlayOpacity}), rgba(${isDark ? '10, 10, 10' : '250, 250, 249'}, ${overlayOpacity})), url('${url}')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
});

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useScrollReveal([projects, skills]);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => setProfile(null));
    getSkills().then(setSkills).catch(() => setSkills([]));
    getProjects({ featured: true })
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoadingProjects(false));
  }, []);

  const skillGroups = groupSkillsByCategory(skills);
  const availabilityLabel =
    profile?.availability_status === "busy" ? "Currently busy" : "Open to collaborate";

  return (
    <div className="home-page">
      {/* HERO SECTION: Dark concentric circles for a striking first impression */}
      <section 
        className="home-section hero theme-dark"
        style={bgStyle("https://images.unsplash.com/photo-eg-fYTwjFXY?auto=format&fit=crop&q=80&w=1920", 0.8, true)}
      >
        <div className="container hero-grid">
          <div className="hero-copy reveal-up">
            <span className="hero-eyebrow">
              <span className="hero-eyebrow-dot" aria-hidden="true" />
              {availabilityLabel}
            </span>
            <h1 className="hero-title">
              {profile?.name || "Vincent"} — Product Engineer
              <span className="hero-title-accent"> Crafting resilient full-stack systems.</span>
            </h1>
            <p className="hero-tagline">
              {profile?.tagline ||
                "I build intentional digital products, handling everything from system architecture and database design to responsive, deliberate user interfaces."}
            </p>
            <div className="hero-actions">
              <Link to="/projects" className="btn btn-primary">
                View projects
              </Link>
              <Link to="/contact" className="btn btn-ghost-light">
                Get in touch
              </Link>
            </div>
          </div>

          <div className="hero-visual reveal-up delay-200">
            <div className="hero-photo-card">
              <IntroCard availability={availabilityLabel} />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED WORK: Light, soft geometric lighting */}
      <section 
        className="home-section theme-light"
        style={bgStyle("https://images.unsplash.com/photo-RV1wrv498Uo?auto=format&fit=crop&q=80&w=1600", 0.95, false)}
      >
        <div className="container">
          <div className="section-heading reveal-up">
            <div>
              <span className="section-kicker">01 / Selected work</span>
              <h2>Featured projects</h2>
            </div>
            <Link to="/projects" className="section-heading-link">
              See all projects <ArrowRight size={16} />
            </Link>
          </div>

          {loadingProjects ? (
            <p className="section-note reveal-up delay-100">Loading projects…</p>
          ) : projects.length === 0 ? (
            <div className="empty-state reveal-up delay-100">
              <p>No featured projects yet — check back soon.</p>
            </div>
          ) : (
            <div className="project-grid">
              {projects.slice(0, 3).map((project, index) => (
                <div key={project.id} className={`reveal-up delay-${(index + 1) * 100}`}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* STACK: Light minimal geometric */}
      <section 
        className="home-section stack-section theme-light"
        style={bgStyle("https://images.unsplash.com/photo-z9jMuYsjzgw?auto=format&fit=crop&q=80&w=1600", 0.95, false)}
      >
        <div className="container">
          <div className="section-heading reveal-up">
            <div>
              <span className="section-kicker">02 / The toolkit</span>
              <h2>Currently building with</h2>
            </div>
          </div>

          {skillGroups.length === 0 ? (
            <p className="section-note reveal-up">Stack details coming soon.</p>
          ) : (
            <div className="stack-columns">
              {skillGroups.map((group, index) => (
                <div 
                  className={`stack-column reveal-up delay-${(index % 4 + 1) * 100}`} 
                  key={group.category}
                >
                  <h3 className="stack-column-label">{group.label}</h3>
                  <ul className="stack-list">
                    {group.skills.map((skill) => (
                      <li key={skill.id} className={`stack-item stack-item-${skill.proficiency}`}>
                        <span className="stack-item-name">{skill.name}</span>
                        <span className="stack-item-level">{skill.proficiency.replace("_", " ")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CLOSING CTA: Dark curved ribbon pattern */}
      <section 
        className="home-section cta-band theme-dark"
        style={bgStyle("https://images.unsplash.com/photo-AlaGaRGKj8s?auto=format&fit=crop&q=80&w=1600", 0.85, true)}
      >
        <div className="container cta-container reveal-up">
          <h2>Have a project in mind?</h2>
          <p>Whether it's a collaboration, a role, or a complex system to build — let's connect.</p>
          <Link to="/contact" className="btn btn-primary">
            Start a conversation
          </Link>
        </div>
      </section>
    </div>
  );
}