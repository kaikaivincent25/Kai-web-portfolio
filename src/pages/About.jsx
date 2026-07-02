import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Code2, MapPin, Sparkles } from "lucide-react";
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

export default function About() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);

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
      icon: GraduationCap,
      label: "Education",
      value:
        profile?.education ||
        "BBIT, Cooperative University of Kenya — degree conferment pending",
    },
    {
      icon: Code2,
      label: "Focus",
      value: "Full-stack development — React, React Native, DRF + PostgreSQL",
    },
    {
      icon: MapPin,
      label: "Based in",
      value: "Nairobi, Kenya",
    },
  ];

  return (
    <section className="container about-page">
      <header className="about-header">
        {profile?.avatar ? (
          <img className="about-avatar" src={profile.avatar} alt={profile.name} />
        ) : (
          <div className="about-avatar avatar-fallback" aria-hidden="true">
            {initialsFor(profile?.name)}
          </div>
        )}
        <div>
          <span className="eyebrow">About</span>
          <h1>Hi, I'm {profile?.name ? profile.name.split(" ")[0] : "Vincent"}</h1>
          <p className="about-intro">
            {profile?.bio ||
              "I'm a software developer building full-stack products with React, React Native, and Django REST Framework — currently focused on tools that make sense for the East African market."}
          </p>
        </div>
      </header>

      <div className="about-facts">
        {facts.map((fact) => (
          <div key={fact.label} className="about-fact">
            <fact.icon className="about-fact-icon" size={20} strokeWidth={1.75} aria-hidden="true" />
            <div>
              <span className="about-fact-label">{fact.label}</span>
              <span className="about-fact-value">{fact.value}</span>
            </div>
          </div>
        ))}
      </div>

      <section className="about-section about-philosophy">
        <Sparkles className="about-philosophy-icon" size={22} strokeWidth={1.5} aria-hidden="true" />
        <div>
          <span className="eyebrow">Philosophy</span>
          <h2>How I build</h2>
          <p>
            I use AI tools as part of my workflow — for debugging, scaffolding,
            and moving faster through repetitive work — but the goal is always
            to understand what's actually happening under the hood, not skip
            past it. I'm still learning parts of this stack, and I'd rather be
            upfront about that than pretend otherwise. It tends to make for
            better collaborations.
          </p>
        </div>
      </section>

      {Object.keys(grouped).length > 0 && (
        <section className="about-section">
          <span className="eyebrow">Toolbox</span>
          <h2>Skills</h2>
          <div className="about-skills-groups">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="about-skills-group">
                <h3>{CATEGORY_LABELS[category] || category}</h3>
                <ul>
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
        </section>
      )}

      <div className="about-cta">
        <p>Want to see this in practice?</p>
        <div className="about-cta-actions">
          <Link to="/projects" className="btn btn-primary">
            View projects
          </Link>
          <Link to="/contact" className="btn btn-ghost">
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}