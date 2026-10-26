import { ArrowUpRight, ExternalLink, FileText, Github } from "lucide-react";
import { Link } from "react-router-dom";
import "./ProjectCard.css";

export default function ProjectCard({ project }) {
  const { title, slug, live_url, repo_url, cover_image, summary, stack_tags = [] } = project;
  const detailPath = `/projects/${slug}`;

  return (
    <article className="project-card">
      <Link to={detailPath} className="project-card-preview-link" aria-label={`View details for ${title}`}>
        <div className="project-card-media">
          {live_url ? (
            <iframe className="project-card-preview" src={live_url} title={`${title} live preview`} tabIndex={-1} loading="lazy" />
          ) : cover_image ? (
            <img src={cover_image} alt={title} className="project-card-image" />
          ) : (
            <div className="project-card-fallback" aria-hidden="true">{title?.[0] || "?"}</div>
          )}
          <span className="project-card-preview-hint">View case study <ArrowUpRight size={15} aria-hidden="true" /></span>
        </div>
      </Link>
      <div className="project-card-body">
        <header className="project-card-header">
          <h3 className="project-card-title">
            <Link to={detailPath}>{title}</Link>
          </h3>
          <ArrowUpRight className="project-card-icon" size={20} aria-hidden="true" />
        </header>
        {summary && <p className="project-card-summary">{summary}</p>}
        {stack_tags.length > 0 && (
          <ul className="project-card-tags" aria-label="Technologies used">
            {stack_tags.slice(0, 5).map((tag) => (
              <li key={tag.id || tag.name} className="project-tag-pill">{tag.name}</li>
            ))}
          </ul>
        )}
        <div className="project-card-actions">
          <Link to={detailPath} className="project-card-details-link">
            <FileText size={16} aria-hidden="true" /> Details
          </Link>
          {live_url && (
            <a href={live_url} target="_blank" rel="noreferrer" className="project-card-live-link">
              <ExternalLink size={15} aria-hidden="true" /> Live site
            </a>
          )}
          {repo_url && (
            <a href={repo_url} target="_blank" rel="noreferrer" className="project-card-live-link">
              <Github size={15} aria-hidden="true" /> Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
