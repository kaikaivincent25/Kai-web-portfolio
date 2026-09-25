import "./IntroCard.css";

// A tilted, hand-note-style card replacing the terminal widget.
// Updated to reflect the confident, end-to-end product engineer narrative
// while maintaining the personal, approachable aesthetic.
export default function IntroCard({ availability = "Open to collaborate" }) {
  return (
    <article className="intro-card" aria-label="Quick introduction">
      {/* Decorative tape for the sticky-note effect */}
      <div className="intro-card-tape" aria-hidden="true" />
      
      <header>
        <h2 className="intro-card-greeting">Hey, I'm Vincent 👋</h2>
      </header>

      <p className="intro-card-body">
        I craft resilient, full-stack systems from database to screen. Driven by clean architecture, I build interfaces that feel intentional rather than templated.
      </p>

      <footer className="intro-card-footer">
        <div className="availability-badge">
          <span className="availability-dot" aria-hidden="true" />
          <span className="availability-text">{availability}</span>
        </div>
      </footer>

      {/* Updated to a hand-drawn arrow pointing toward the availability or next section */}
      <svg className="intro-card-doodle" width="80" height="30" viewBox="0 0 80 30" fill="none" aria-hidden="true">
        <path
          d="M5 15 Q 40 5, 75 22"
          stroke="var(--color-accent, #10B981)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
           d="M65 12 L76 23 L62 28"
           stroke="var(--color-accent, #10B981)"
           strokeWidth="3"
           strokeLinecap="round"
           strokeLinejoin="round"
        />
      </svg>
    </article>
  );
}