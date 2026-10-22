import { ArrowUpRight } from "lucide-react";
import "./ProjectCard.css";

export default function ProjectCard({ project }) {
  const { title, slug, live_url, cover_image, summary, description, stack_tags = [] } = project;
  const destination = live_url || `/projects/${slug}`;

  return (
    <article className="project-card group">
      <a href={destination} target="_blank" rel="noreferrer" className="project-card-preview-link" aria-label={`Open ${title} in a new tab`}>
        <div className="project-card-media">
          {live_url ? (
            <iframe className="project-card-preview" src={live_url} title={`${title} live preview`} tabIndex={-1} loading="lazy" />
          ) : cover_image ? (
            <img src={cover_image} alt={title} className="project-card-image" />
          ) : (
            <div className="project-card-fallback" aria-hidden="true">{title?.[0] || "?"}</div>
          )}
          <span className="project-card-preview-hint">Open live project <ArrowUpRight size={15} aria-hidden="true" /></span>
        </div>
      </a>
      <div className="project-card-body">
        <header className="project-card-header">
          <h3 className="project-card-title">
            <a href={destination} target="_blank" rel="noreferrer">{title}</a>
          </h3>
        </header>
        {summary && <p className="project-card-summary">{summary}</p>}
        {description && (
          <details className="project-card-details">
            <summary>Project details</summary>
            <p>{description}</p>
          </details>
        )}
        {stack_tags.length > 0 && (
          <ul className="project-card-tags" aria-label="Technologies used">
            {stack_tags.slice(0, 5).map((tag) => (
              <li key={tag.id || tag.name} className="project-tag-pill">{tag.name}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
