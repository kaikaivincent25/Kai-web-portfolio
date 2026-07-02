import "./IntroCard.css";

// A tilted, hand-note-style card — the "signature element" for the hero,
// replacing the old terminal widget with something that reads as personal
// rather than technical/corporate.
export default function IntroCard({ availability = "Open to collaborate" }) {
  return (
    <div className="intro-card">
      <span className="intro-card-tape" aria-hidden="true" />
      <p className="intro-card-greeting">Hey, I'm Vincent 👋</p>
      <p className="intro-card-body">
        I build with React, React Native, and Django — still learning parts
        of it as I go, with AI as a tool I use, not a shortcut I hide behind.
      </p>
      <div className="intro-card-footer">
        <span className="intro-card-dot" aria-hidden="true" />
        <span>{availability}</span>
      </div>
      <svg className="intro-card-doodle" width="60" height="40" viewBox="0 0 60 40" fill="none" aria-hidden="true">
        <path
          d="M2 30C10 10 18 34 26 18C34 2 42 30 50 14C54 6 56 10 58 6"
          stroke="var(--color-green)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}