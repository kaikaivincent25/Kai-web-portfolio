import { ArrowUpRight } from "lucide-react";
import "./ProjectCard.css";

export default function ProjectCard({ project }) {
  const { title, slug, live_url, cover_image } = project;
  const destination = live_url || `/projects/${slug}`;

  return (
    <article className="project-card group">
      <a href={destination} target="_blank" rel="noreferrer" className="project-card-main" aria-label={`Open ${title} in a new tab`}>
      <div className="project-card-media">
        {live_url ? (
          <iframe className="project-card-preview" src={live_url} title={`${title} live preview`} tabIndex={-1} loading="lazy" />
        ) : cover_image ? (
          <img src={cover_image} alt={title} className="project-card-image" />
        ) : (
          <div className="project-card-fallback" aria-hidden="true">
            {title?.[0] || "?"}
          </div>
        )}
        
      </div>

      <div className="project-card-body">
        <header className="project-card-header">
          <h3 className="project-card-title">{title}</h3>
          <ArrowUpRight className="project-card-icon" size={20} strokeWidth={2} />
        </header>
      </div>
      </a>
    </article>
  );
}
