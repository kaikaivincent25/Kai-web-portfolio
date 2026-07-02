import { Link } from "react-router-dom";
import "./ProjectCard.css";

export default function ProjectCard({ project }) {
  const { title, slug, summary, cover_image, stack_tags = [], featured } = project;

  return (
    <Link to={`/projects/${slug}`} className="project-card">
      <div className="project-card-media">
        {cover_image ? (
          <img src={cover_image} alt={title} />
        ) : (
          <div className="project-card-media-fallback" aria-hidden="true">
            {title?.[0] || "?"}
          </div>
        )}
        {featured && <span className="project-card-badge">Featured</span>}
      </div>
      <div className="project-card-body">
        <h3>{title}</h3>
        <p className="project-card-summary">{summary}</p>
        {stack_tags.length > 0 && (
          <ul className="project-card-tags">
            {stack_tags.slice(0, 4).map((tag) => (
              <li key={tag.id}>{tag.name}</li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}