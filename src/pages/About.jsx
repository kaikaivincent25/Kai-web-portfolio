import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Code2, Layers, Database, Sparkles } from "lucide-react";
import { getProfile, getSkills } from "../services/api.js";
import "./About.css";

const CATEGORY_LABELS = {
  frontend: "Frontend",
  backend: "Backend",
  mobile: "Mobile",
  ai_tools: "AI Tools",
  other: "Other",
};

function initialsFor(name) {
  if (!name) return "V";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

// Extracted the hook properly so it sits outside your component logic
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

    // Slight timeout ensures DOM is fully painted after data fetching
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(".reveal-up");
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, dependencies); // Re-runs when data (like skills) loads
}

// Reusable style builder for Unsplash backgrounds with legibility overlays
const bgStyle = (url, overlayOpacity = 0.85, isDark = true) => ({
  backgroundImage: `linear-gradient(rgba(${isDark ? '10, 10, 10' : '250, 250, 249'}, ${overlayOpacity}), rgba(${isDark ? '10, 10, 10' : '250, 250, 249'}, ${overlayOpacity})), url('${url}')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed", 
});

export default function About() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);

  // Initialize the scroll reveal observer and tell it to watch for data updates
  useScrollReveal([skills, profile]);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => setProfile(null));
    getSkills().then(setSkills).catch(() => setSkills([]));
  }, []);

  const grouped = skills.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const facts = [
    {
      icon: Layers,
      label: "Architecture",
      value: "Full-stack systems from database to screen",
    },
    {
      icon: Code2,
      label: "Frontend",
      value: "React & React Native (Expo) — deliberate, responsive UI",
    },
    {
      icon: Database,
      label: "Backend",
      value: "Django REST Framework, FastAPI & PostgreSQL",
    },
  ];

  return (
    <div className="about-page">
      {/* HERO SECTION */}
      <header 
        className="about-section about-hero theme-dark" 
        style={bgStyle("https://images.unsplash.com/photo-o0HhGwX36v0?auto=format&fit=crop&q=80&w=1920", 0.75, true)}
      >
        <div className="container">
          <div className="about-hero-content">
            {profile?.avatar ? (
              <img className="about-avatar" src={profile.avatar} alt={profile.name} />
            ) : (
              <div className="about-avatar avatar-fallback" aria-hidden="true">
                {initialsFor(profile?.name)}
              </div>
            )}
            <div className="about-hero-text">
              <span className="eyebrow">About</span>
              <h1>Hi, I'm {profile?.name ? profile.name.split(" ")[0] : "Vincent"}</h1>
              <p className="about-intro">
                {profile?.bio ||
                  "I craft resilient, full-stack systems from database to screen. Driven by clean architecture, I build interfaces that feel intentional rather than templated."}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* PHILOSOPHY SECTION */}
      <section 
        className="about-section about-philosophy theme-light"
        style={bgStyle("https://images.unsplash.com/photo-z9jMuYsjzgw?auto=format&fit=crop&q=80&w=1600", 0.9, false)}
      >
        <div className="container">
          <div className="about-facts">
            {facts.map((fact, index) => (
              {/* Added reveal-up and staggered delay classes */}
              <div 
                key={fact.label} 
                className={`about-fact-card reveal-up delay-${(index + 1) * 100}`}
              >
                <fact.icon className="about-fact-icon" size={24} strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <span className="about-fact-label">{fact.label}</span>
                  <span className="about-fact-value">{fact.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Added reveal-up here */}
          <div className="philosophy-content reveal-up delay-200">
            <Sparkles className="about-philosophy-icon" size={28} strokeWidth={1.5} aria-hidden="true" />
            <div>
              <span className="eyebrow">Philosophy</span>
              <h2>How I build</h2>
              <p>
                I use AI tools as part of my workflow — for debugging, scaffolding,
                and moving faster through repetitive work — but the goal is always
                to understand what's actually happening under the hood, not skip
                past it. I'm still learning parts of this stack, and I'd rather be
                upfront about that than pretend otherwise. It tends to make for
                better, more honest collaborations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      {Object.keys(grouped).length > 0 && (
        <section 
          className="about-section about-toolbox theme-light"
          style={bgStyle("https://images.unsplash.com/photo-vmk7e9roVlA?auto=format&fit=crop&q=80&w=1600", 0.95, false)}
        >
          <div className="container">
            <div className="reveal-up">
              <span className="eyebrow">Toolbox</span>
              <h2>Skills & Technologies</h2>
            </div>
            <div className="about-skills-groups">
              {Object.entries(grouped).map(([category, items], index) => (
                {/* Added reveal-up and staggered delays to the skill blocks */}
                <div 
                  key={category} 
                  className={`about-skills-group reveal-up delay-${(index % 3 + 1) * 100}`}
                >
                  <h3>{CATEGORY_LABELS[category] || category}</h3>
                  <ul className="skills-list">
                    {items.map((skill) => (
                      <li key={skill.id} className={`stack-item stack-item-${skill.proficiency}`}>
                        <span className="stack-item-name">{skill.name}</span>
                        <span className="stack-item-level">{skill.proficiency.replace("_", " ")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA / FOOTER SECTION */}
      <section 
        className="about-section about-cta theme-dark"
        style={bgStyle("https://images.unsplash.com/photo-AlaGaRGKj8s?auto=format&fit=crop&q=80&w=1600", 0.8, true)}
      >
        {/* Added reveal-up to the entire CTA block */}
        <div className="container cta-container reveal-up">
          <h2>Ready to build something intentional?</h2>
          <p>Want to see this architecture in practice, or discuss a collaboration?</p>
          <div className="about-cta-actions">
            <Link to="/projects" className="btn btn-primary">
              View projects
            </Link>
            <Link to="/contact" className="btn btn-ghost-light">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}