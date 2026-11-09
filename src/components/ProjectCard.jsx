import { ArrowUpRight, ExternalLink, FileText, Github, MonitorPlay } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./ProjectCard.css";

export default function ProjectCard({ project }) {
  const { title, slug, live_url, repo_url, cover_image, summary, stack_tags = [] } = project;
  const detailPath = `/projects/${slug}`;
  const [previewFailed, setPreviewFailed] = useState(false);
  const [coverFailed, setCoverFailed] = useState(false);
  const pagePreview = previewUrlFor(live_url);
  const previewImage =
    pagePreview && !previewFailed
      ? pagePreview
      : cover_image && !coverFailed
        ? cover_image
        : null;

  return (
    <article className="project-card">
      <Link to={detailPath} className="project-card-preview-link" aria-label={`View details for ${title}`}>
        <div className="project-card-media">
          {previewImage ? (
            <img
              src={previewImage}
              alt={`${title} live website preview`}
              className="project-card-image"
              loading="lazy"
              decoding="async"
              onError={() => {
                if (pagePreview && !previewFailed) setPreviewFailed(true);
                else setCoverFailed(true);
              }}
            />
          ) : (
            <div className="project-card-fallback">
              <MonitorPlay size={28} strokeWidth={1.5} aria-hidden="true" />
              <span>Live preview unavailable</span>
            </div>
          )}
          <span className="project-card-preview-hint">
            {previewImage ? "Live page preview" : "View project"}
            <ArrowUpRight size={15} aria-hidden="true" />
          </span>
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

function previewUrlFor(liveUrl) {
  if (!liveUrl) return null;

  try {
    const url = new URL(liveUrl);
    if (url.protocol !== "https:" || url.username || url.password) return null;

    // Screenshots work for sites that block iframes with a frame-ancestors policy.
    return `https://image.thum.io/get/width/1200/crop/750/noanimate/${url.href}`;
  } catch {
    return null;
  }
}
