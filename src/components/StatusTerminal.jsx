import "./StatusTerminal.css";

// Static build-log entries for now. If/when the backend exposes something
// like a "currently building / currently learning" field on Profile, swap
// these for real data — the markup won't need to change.
const LOG = [
  { label: "currently_building", value: "IN4 — verified expert knowledge hub" },
  { label: "currently_learning", value: "JWT refresh flows, DRF nested writes" },
  { label: "status", value: "open_to_collab", accent: true },
];

export default function StatusTerminal() {
  return (
    <div className="status-terminal" role="img" aria-label="Developer status terminal">
      <div className="status-terminal-dots">
        <span className="dot dot-gold" />
        <span className="dot dot-clay" />
        <span className="dot dot-teal" />
      </div>
      {LOG.map((entry) => (
        <div key={entry.label} className="status-terminal-row">
          <p className="status-terminal-prompt">$ {entry.label}</p>
          <p className={entry.accent ? "status-terminal-value status-terminal-value-accent" : "status-terminal-value"}>
            {entry.value}
          </p>
        </div>
      ))}
    </div>
  );
}