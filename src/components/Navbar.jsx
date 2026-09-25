// Navbar.jsx
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Close the mobile menu on route change / link click, and on resize back to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 720) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
          Vincent<span className="navbar-logo-dot">.</span>
        </NavLink>

        <nav className="navbar-links navbar-links-desktop">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "navbar-link navbar-link-active" : "navbar-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          <NavLink to="/contact" className="navbar-cta">
            Let's talk
          </NavLink>

          <button
            type="button"
            className={`navbar-toggle ${isOpen ? "navbar-toggle-open" : ""}`}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* --- Mobile panel --- */}
      <div className={`navbar-mobile-panel ${isOpen ? "navbar-mobile-panel-open" : ""}`}>
        <nav className="navbar-links navbar-links-mobile">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                isActive ? "navbar-link navbar-link-active" : "navbar-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/contact" className="navbar-cta navbar-cta-mobile" onClick={() => setIsOpen(false)}>
            Let's talk
          </NavLink>
        </nav>
      </div>
    </header>
  );
}