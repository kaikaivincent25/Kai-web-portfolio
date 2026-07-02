import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProjectBySlug } from "../services/api.js";
import "./ProjectDetail.css";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | not_found | error

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

  if (status === "loading") {
    return (
      <section className="container project-detail">
        <p className="section-note">Loading project…</p>
      </section>
    );
  }

  if (status === "not_found") {
    return (
      <section className="container project-detail">
        <div className="empty-state">
          <p>Couldn't find that project.</p>
          <Link to="/projects" className="btn btn-ghost">
            ← Back to projects
          </Link>
        </div>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="container project-detail">
        <div className="empty-state">
          <p>Something went wrong loading this project. Try again shortly.</p>
          <Link to="/projects" className="btn btn-ghost">
            ← Back to projects
          </Link>
        </div>
      </section>
    );
  }

  const { title, summary, description, stack_tags = [], cover_image, gallery_images = [], repo_url, live_url } = project;

  return (
    <section className="project-detail">
      <div className="container">
        <Link to="/projects" className="back-link">
          ← Back to projects
        </Link>

        <header className="project-detail-header">
          <h1>{title}</h1>
          <p className="project-detail-summary">{summary}</p>

          {stack_tags.length > 0 && (
            <ul className="project-detail-tags">
              {stack_tags.map((tag) => (
                <li key={tag.id}>{tag.name}</li>
              ))}
            </ul>
          )}

          <div className="project-detail-links">
            {live_url && (
              <a href={live_url} target="_blank" rel="noreferrer" className="btn btn-primary">
                View live
              </a>
            )}
            {repo_url && (
              <a href={repo_url} target="_blank" rel="noreferrer" className="btn btn-ghost">
                View code
              </a>
            )}
          </div>
        </header>
      </div>

      {cover_image && (
        <div className="project-detail-cover">
          <img src={cover_image} alt={title} />
        </div>
      )}

      <div className="container project-detail-body">
        <p className="project-detail-description">{description}</p>

        {gallery_images.length > 0 && (
          <div className="project-detail-gallery">
            {gallery_images.map((img) => (
              <figure key={img.id}>
                <img src={img.image} alt={img.caption || title} />
                {img.caption && <figcaption>{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}
      </div>

      <div className="container">
        <div className="project-detail-cta">
          <p>Want to talk through how this was built, or start something similar?</p>
          <Link to="/contact" className="btn btn-primary">
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}