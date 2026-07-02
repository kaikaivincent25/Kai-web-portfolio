import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "../services/api.js";
import { labelForPlatform, FALLBACK_SOCIALS } from "../utils/social.js";
import "./Footer.css";

const SITE_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

export default function Footer() {
  const [socials, setSocials] = useState(null); // null = still loading

  useEffect(() => {
    getProfile()
      .then((profile) => setSocials(profile?.social_links || []))
      .catch(() => setSocials([]));
  }, []);

  const showFallback = !socials || socials.length === 0;
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <span className="footer-logo">
            Vincent<span className="footer-logo-dot">.</span>
          </span>
          <p className="footer-tagline">
            Full-stack developer building with React, React Native, and
            Django REST Framework — learning in public, one project at a
            time.
          </p>
        </div>

        <div className="footer-column">
          <h2 className="footer-heading">Site</h2>
          <ul className="footer-nav">
            {SITE_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h2 className="footer-heading">Elsewhere</h2>
          <ul className="footer-socials">
            {showFallback
              ? FALLBACK_SOCIALS.map((s) => (
                  <li key={s.platform}>
                    <a href={s.href} target="_blank" rel="noreferrer">
                      {labelForPlatform(s.platform)}
                    </a>
                  </li>
                ))
              : socials.map((s) => (
                  <li key={s.id}>
                    <a href={s.resolved_url} target="_blank" rel="noreferrer">
                      {labelForPlatform(s.platform)}
                    </a>
                  </li>
                ))}
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p className="footer-note">© {year} Vincent Kaikai. All rights reserved.</p>
      </div>
    </footer>
  );
}