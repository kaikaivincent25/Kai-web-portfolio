import { useEffect, useState } from "react";
import {
  Twitter,
  Facebook,
  Instagram,
  MessageCircle,
  Mail,
  Github,
  Linkedin,
  CheckCircle2,
  Send,
  AlertCircle
} from "lucide-react";
import { getProfile, sendContactMessage } from "../services/api.js";
import { labelForPlatform, FALLBACK_SOCIALS } from "../utils/social.js";
import "./Contact.css";

const INTENTS = [
  { value: "collaboration", label: "Collaboration" },
  { value: "job", label: "Job Opportunity" },
  { value: "general", label: "General Inquiry" },
  { value: "other", label: "Something Else" },
];

const SOCIAL_ICONS = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  whatsapp: MessageCircle,
  email: Mail,
  github: Github,
  linkedin: Linkedin,
};

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  intent: "collaboration",
  honeypot: "",
};

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
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(".reveal-up");
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, dependencies);
}

// Reusable style builder for Unsplash backgrounds
const bgStyle = (url, overlayOpacity = 0.85, isDark = true) => ({
  backgroundImage: `linear-gradient(rgba(${isDark ? '10, 10, 10' : '250, 250, 249'}, ${overlayOpacity}), rgba(${isDark ? '10, 10, 10' : '250, 250, 249'}, ${overlayOpacity})), url('${url}')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
});

export default function Contact() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  useScrollReveal([status, profile]);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => setProfile(null));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function selectIntent(value) {
    setForm((prev) => ({ ...prev, intent: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      await sendContactMessage(form);
      setStatus("success");
      setForm(INITIAL_FORM);
    } catch (err) {
      setStatus("error");
      if (err?.response?.status === 429) {
        setErrorMsg("You've sent a few messages already — please try again later.");
      } else {
        setErrorMsg("Something went wrong sending that. Mind trying again?");
      }
    }
  }

  const socials = profile?.social_links?.length > 0 ? profile.social_links : null;
  const firstName = profile?.name ? profile.name.split(" ")[0] : "Vincent";

  return (
    <div className="contact-page">
      {/* HERO SECTION: Dark, tech-forward abstract lines */}
      <header 
        className="contact-hero theme-dark"
        style={bgStyle("https://images.unsplash.com/photo-o0HhGwX36v0?auto=format&fit=crop&q=80&w=1920", 0.75, true)}
      >
        <div className="container reveal-up">
          <span className="eyebrow">Contact</span>
          <h1>Let's build something intentional.</h1>
          <p className="contact-intro">
            Whether you need to architect a resilient backend, design a deliberate user interface, or discuss a full-stack role — I'd love to hear about it. I read and reply to every message.
          </p>
        </div>
      </header>

      {/* BODY SECTION: Light, soft neutral geometric */}
      <section 
        className="contact-body theme-light"
        style={bgStyle("https://images.unsplash.com/photo-vmk7e9roVlA?auto=format&fit=crop&q=80&w=1600", 0.95, false)}
      >
        <div className="container contact-grid">
          
          {/* Main Form Area */}
          <div className="contact-main reveal-up delay-100">
            {status === "success" ? (
              <div className="contact-success">
                <div className="success-icon-wrapper">
                  <CheckCircle2 size={48} strokeWidth={1.5} />
                </div>
                <h2>Message Sent</h2>
                <p>Thanks for reaching out. I usually reply within a day or two. Talk soon!</p>
                <button type="button" className="btn btn-ghost" onClick={() => setStatus("idle")}>
                  Send another message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                {/* Honeypot: Visually hidden, keeps bots away */}
                <div className="honeypot-field" aria-hidden="true">
                  <label htmlFor="honeypot">Leave this field empty</label>
                  <input
                    type="text"
                    id="honeypot"
                    name="honeypot"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.honeypot}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">What's this about?</label>
                  <div className="intent-picker">
                    {INTENTS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`intent-chip ${form.intent === opt.value ? "active" : ""}`}
                        onClick={() => selectIntent(opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">Your Name</label>
                    <input
                      className="form-input"
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Jane Doe"
                      required
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <input
                      className="form-input"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jane@example.com"
                      required
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">Phone (Optional)</label>
                    <input
                      className="form-input"
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+254..."
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="subject">Subject</label>
                    <input
                      className="form-input"
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="New project inquiry"
                      required
                      value={form.subject}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">Message</label>
                  <textarea
                    className="form-input form-textarea"
                    id="message"
                    name="message"
                    placeholder="Tell me a bit about what you have in mind..."
                    required
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary btn-large" disabled={status === "submitting"}>
                    {status === "submitting" ? "Sending..." : "Send Message"}
                    {!status === "submitting" && <Send size={18} />}
                  </button>

                  {status === "error" && (
                    <div className="form-feedback error">
                      <AlertCircle size={18} />
                      <p>{errorMsg}</p>
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Aside Section */}
          <aside className="contact-aside reveal-up delay-200">
            <div className="aside-card">
              {profile?.avatar ? (
                <img className="contact-avatar" src={profile.avatar} alt={profile.name} />
              ) : (
                <div className="contact-avatar fallback-avatar">
                  {firstName.charAt(0)}
                </div>
              )}
              
              <div className="availability-badge">
                <span className={`availability-dot ${profile?.availability_status === "busy" ? "busy" : "open"}`} aria-hidden="true" />
                <span>{profile?.availability_status === "busy" ? "Currently busy" : "Open to collaborate"}</span>
              </div>

              <p className="response-note">
                I generally reply within 24–48 hours. If your request is urgent, please note that in your message.
              </p>
            </div>

            <div className="social-links-container">
              <h3>Connect elsewhere</h3>
              <ul className="social-links-list">
                {(socials || FALLBACK_SOCIALS.map((s) => ({ platform: s.platform, resolved_url: s.href, id: s.platform }))).map(
                  (s) => {
                    const Icon = SOCIAL_ICONS[s.platform] || Mail;
                    return (
                      <li key={s.id}>
                        <a href={s.resolved_url} target="_blank" rel="noreferrer" className="social-link-item">
                          <Icon size={20} strokeWidth={1.5} />
                          <span>{labelForPlatform(s.platform)}</span>
                        </a>
                      </li>
                    );
                  }
                )}
              </ul>
            </div>
          </aside>

        </div>
      </section>
    </div>
  );
}