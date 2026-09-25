import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github, MonitorPlay } from "lucide-react";
import { getProjectBySlug } from "../services/api.js";
import "./ProjectDetail.css";

// Reusable scroll animation hook (matches your About page)
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

// Reusable style builder for Unsplash backgrounds with legibility overlays
const bgStyle = (url, overlayOpacity = 0.85, isDark = true) => ({
  backgroundImage: `linear-gradient(rgba(${isDark ? '10, 10, 10' : '250, 250, 249'}, ${overlayOpacity}), rgba(${isDark ? '10, 10, 10' : '250, 250, 249'}, ${overlayOpacity})), url('${url}')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
});

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState("loading");

  useScrollReveal([status, project]);

  useEffect(() => {
    setStatus("loading");
    getProjectBySlug(slug)
      .then((data) => {
        setProject(data);
        setStatus("ready");
      })
      .catch((err) => {
        setStatus(err?.response?.status === 404 ? "not_found" : "error");
      });
  }, [slug]);

  // Loading & Error States (Dark Minimalist)
  if (status === "loading" || status === "not_found" || status === "error") {
    return (
      <section 
        className="project-state-page theme-dark"
        style={bgStyle("https://images.unsplash.com/photo-MoQTcn9KLjQ?auto=format&fit=crop&q=80&w=1600", 0.9, true)}
      >
        <div className="container empty-state reveal-up">
          {status === "loading" && <p>Loading project details…</p>}
          {status === "not_found" && <p>Couldn't find that project.</p>}
          {status === "error" && <p>Something went wrong loading this project. Try again shortly.</p>}
          
          {status !== "loading" && (
            <Link to="/projects" className="btn btn-ghost-light state-back-btn">
              <ArrowLeft size={18} /> Back to projects
            </Link>
          )}
        </div>
      </section>
    );
  }

  const { title, summary, description, stack_tags = [], cover_image, gallery_images = [], repo_url, live_url } = project;

  return (
    <div className="project-detail-page">
      {/* HERO SECTION: Dark swirling purple */}
      <header 
        className="project-section project-hero theme-dark"
        style={bgStyle("https://images.unsplash.com/photo-ffTJoV2Nh4c?auto=format&fit=crop&q=80&w=1920", 0.8, true)}
      >
        <div className="container">
          <Link to="/projects" className="back-link reveal-up">
            <ArrowLeft size={18} /> Back to projects
          </Link>

          <div className="project-hero-content reveal-up delay-100">
            <h1>{title}</h1>
            <p className="project-summary">{summary}</p>

            {stack_tags.length > 0 && (
              <ul className="project-tags">
                {stack_tags.map((tag) => (
                  <li key={tag.id} className="tag-pill">{tag.name}</li>
                ))}
              </ul>
            )}

            <div className="project-links">
              {live_url && (
                <a href={live_url} target="_blank" rel="noreferrer" className="btn btn-primary">
                  <MonitorPlay size={18} /> View Live
                </a>
              )}
              {repo_url && (
                <a href={repo_url} target="_blank" rel="noreferrer" className="btn btn-ghost-light">
                  <Github size={18} /> View Code
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* COVER IMAGE: Overlaps the hero and body section */}
      {cover_image && (
        <section className="project-cover-section">
          <div className="container reveal-up delay-200">
            <div className="project-cover-wrapper">
              <img src={cover_image} alt={title} className="project-cover-image" />
            </div>
          </div>
        </section>
      )}

      {/* BODY / DESCRIPTION: Light, minimal geometric */}
      <section 
        className="project-section project-body theme-light"
        style={bgStyle("https://images.unsplash.com/photo-z9jMuYsjzgw?auto=format&fit=crop&q=80&w=1600", 0.95, false)}
      >
        <div className="container project-description-container reveal-up">
          <span className="eyebrow">Overview</span>
          <div className="project-description text-content">
            {/* If your API returns markdown/HTML later, this is where you'd inject it */}
            <p>{description}</p>
          </div>
        </div>
      </section>

      {/* GALLERY: Soft-lit geometric shapes */}
      {gallery_images.length > 0 && (
        <section 
          className="project-section project-gallery-section theme-light"
          style={bgStyle("https://images.unsplash.com/photo-RV1wrv498Uo?auto=format&fit=crop&q=80&w=1600", 0.95, false)}
        >
          <div className="container">
            <div className="reveal-up">
              <span className="eyebrow">Gallery</span>
              <h2>Project Screens</h2>
            </div>
            <div className="project-gallery">
              {gallery_images.map((img, index) => (
                <figure key={img.id} className={`gallery-figure reveal-up delay-${(index % 3 + 1) * 100}`}>
                  <div className="gallery-image-wrapper">
                    <img src={img.image} alt={img.caption || title} />
                  </div>
                  {img.caption && <figcaption>{img.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA / FOOTER: Dark curved ribbon */}
      <section 
        className="project-section project-cta theme-dark"
        style={bgStyle("https://images.stockcake.com/public/6/9/6/696d9385-95e7-4415-b3c7-3c90bf75b9a6_large/modern-developer-workspace-stockcake.jpg", 0.85, true)}
      >
        <div className="container cta-container reveal-up">
          <h2>Interested in the architecture?</h2>
          <p>Want to talk through how this was built, or start something similar?</p>
          <div className="cta-actions">
            <Link to="/contact" className="btn btn-primary">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}