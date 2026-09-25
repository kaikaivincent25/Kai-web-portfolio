import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X, MessageSquare } from "lucide-react";
import "./Navbar.css";

// "Contact" is removed from this array so we can feature it as a distinct CTA button
const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Work" }, // Changed "Projects" to "Work" for a more professional tone
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Detect scroll to apply frosted glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu if window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu automatically when the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open so the user doesn't accidentally scroll the page behind it
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <header className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="container navbar-inner">
        {/* Brand / Logo */}
        <NavLink to="/" className="navbar-brand" onClick={() => setIsOpen(false)}>
          Vincent<span className="brand-dot">.</span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="navbar-nav desktop-only">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions (CTA & Mobile Toggle) */}
        <div className="navbar-actions">
          <NavLink to="/contact" className="btn btn-primary nav-cta desktop-only">
            <MessageSquare size={18} /> Let's talk
          </NavLink>

          <button
            type="button"
            className="mobile-toggle mobile-only"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Full-Screen Panel */}
      <div className={`mobile-panel ${isOpen ? "is-open" : ""}`}>
        <nav className="mobile-nav">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "mobile-link active" : "mobile-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="mobile-nav-divider" />
          <NavLink to="/contact" className="btn btn-primary mobile-cta">
            <MessageSquare size={20} /> Let's talk
          </NavLink>
        </nav>
      </div>
    </header>
  );
}