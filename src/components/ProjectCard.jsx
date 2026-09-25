import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import "./ProjectCard.css";

export default function ProjectCard({ project }) {
  const { title, slug, summary, cover_image, stack_tags = [], featured } = project;

  return (
    <Link to={`/projects/${slug}`} className="project-card group" aria-label={`View project: ${title}`}>
      <div className="project-card-media">
        {cover_image ? (
          <img src={cover_image} alt={title} className="project-card-image" />
        ) : (
          <div className="project-card-fallback" aria-hidden="true">
            {title?.[0] || "?"}
          </div>
        )}
        
        {featured && (
          <span className="project-card-badge">
            <span className="badge-dot" aria-hidden="true" />
            Featured
          </span>
        )}
      </div>

      <div className="project-card-body">
        <header className="project-card-header">
          <h3 className="project-card-title">{title}</h3>
          <ArrowUpRight className="project-card-icon" size={20} strokeWidth={2} />
        </header>
        
        <p className="project-card-summary">{summary}</p>
        
        {stack_tags.length > 0 && (
          <ul className="project-card-tags">
            {stack_tags.slice(0, 4).map((tag) => (
              <li key={tag.id} className="project-tag-pill">{tag.name}</li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}