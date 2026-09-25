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

// Reusable background style builder
const bgStyle = (url, overlayOpacity = 0.95, isDark = true) => ({
  backgroundImage: `linear-gradient(rgba(10, 10, 10, ${overlayOpacity}), rgba(10, 10, 10, ${overlayOpacity})), url('${url}')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
});

// Reusable scroll animation hook
function useScrollReveal(dependencies = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px 50px 0px" } // triggers slightly earlier for footer
    );

    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(".footer-reveal-up");
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, dependencies);
}

export default function Footer() {
  const [profile, setProfile] = useState(null);

  useScrollReveal([profile]);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(() => setProfile(null));
  }, []);

  const socials = profile?.social_links;
  const showFallback = !socials || socials.length === 0;
  const year = new Date().getFullYear();
  const availabilityLabel =
    profile?.availability_status === "busy" ? "Currently busy" : "Open to collaborate";

  return (
    <footer 
      className="footer theme-dark"
      style={bgStyle("https://images.unsplash.com/photo-MoQTcn9KLjQ?auto=format&fit=crop&q=80&w=1600", 0.92, true)}
    >
      <div className="container footer-grid">
        {/* Brand Column */}
        <div className="footer-brand footer-reveal-up">
          <Link to="/" className="footer-logo">
            {profile?.name ? profile.name.split(" ")[0] : "Vincent"}<span className="footer-logo-dot">.</span>
          </Link>
          <p className="footer-tagline">
            Product engineer crafting resilient, full-stack systems from database to screen.
          </p>
          <div className="footer-status">
            <span className={`footer-status-dot ${profile?.availability_status === "busy" ? "busy" : "open"}`} aria-hidden="true" />
            {availabilityLabel}
          </div>
        </div>

        {/* Site Links Column */}
        <div className="footer-column footer-reveal-up delay-100">
          <h2 className="footer-heading">Site</h2>
          <ul className="footer-nav">
            {SITE_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Socials Column */}
        <div className="footer-column footer-reveal-up delay-200">
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

      {/* Bottom Legal / Tech Note */}
      <div className="container footer-bottom footer-reveal-up delay-300">
        <p className="footer-note">
          © {year} {profile?.name || "Vincent"}. All rights reserved.
        </p>
        <p className="footer-note footer-note-muted">
          Built with React, React Native &amp; FastAPI.DRF
        </p>
      </div>
    </footer>
  );
}