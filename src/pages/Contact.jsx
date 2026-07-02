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
} from "lucide-react";
import { getProfile, sendContactMessage } from "../services/api.js";
import { labelForPlatform, FALLBACK_SOCIALS } from "../utils/social.js";
import "./Contact.css";

const INTENTS = [
  { value: "collaboration", label: "Collaboration" },
  { value: "job", label: "Job opportunity" },
  { value: "general", label: "General inquiry" },
  { value: "other", label: "Something else" },
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

export default function Contact() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

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
        setErrorMsg("You've sent a few messages already — try again in a bit.");
      } else {
        setErrorMsg("Something went wrong sending that. Mind trying again?");
      }
    }
  }

  const socials = profile?.social_links?.length > 0 ? profile.social_links : null;
  const firstName = profile?.name ? profile.name.split(" ")[0] : "me";

  return (
    <section className="container contact-page">
      <header className="contact-header">
        <span className="contact-eyebrow">Say hello</span>
        <h1>Let's build something together</h1>
        <p>
          Whether it's a collaboration, a role, or just a good problem worth
          talking through — I read every message myself, and I'm always glad
          to hear from someone new.
        </p>
      </header>

      <div className="contact-grid">
        {status === "success" ? (
          <div className="contact-success">
            <CheckCircle2 size={40} strokeWidth={1.75} className="contact-success-icon" />
            <h2>Message sent</h2>
            <p>
              Thanks for reaching out — I'll get back to you soon, usually
              within a day.
            </p>
            <button type="button" className="btn btn-ghost" onClick={() => setStatus("idle")}>
              Send another message
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            {/* Honeypot: real users never see or fill this. Visually hidden,
                not display:none, since some bots skip fully-hidden fields. */}
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

            <div className="field">
              <label className="field-label">What's this about?</label>
              <div className="intent-picker">
                {INTENTS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={
                      form.intent === opt.value ? "intent-chip intent-chip-active" : "intent-chip"
                    }
                    onClick={() => selectIntent(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label className="field-label" htmlFor="name">Your name</label>
                <input
                  className="field-input"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Vincent Kaikai"
                  required
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label className="field-label" htmlFor="email">Email</label>
                <input
                  className="field-input"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="vkaikai44@gmail.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label className="field-label" htmlFor="phone">Phone (optional)</label>
                <input
                  className="field-input"
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+254…"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label className="field-label" htmlFor="subject">Subject</label>
                <input
                  className="field-input"
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Quick project idea"
                  required
                  value={form.subject}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="message">Message</label>
              <textarea
                className="field-input"
                id="message"
                name="message"
                placeholder="Tell me a bit about what you have in mind…"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={status === "submitting"}>
              {status === "submitting" ? "Sending…" : "Send message"}
            </button>

            {status === "error" && (
              <p className="form-feedback form-feedback-error">{errorMsg}</p>
            )}
          </form>
        )}

        <aside className="contact-aside">
          {profile?.avatar && (
            <img className="contact-avatar" src={profile.avatar} alt={profile.name} />
          )}
          <div className="availability-card">
            <span className="hero-eyebrow-dot" />
            <span>
              {profile?.availability_status === "busy"
                ? "Currently busy"
                : "Open to collaborate"}
            </span>
          </div>

          <p className="contact-response-note">
            I usually reply within a day or two — sooner if it's urgent, just
            say so in your message.
          </p>

          <div className="contact-socials">
            <h2>Find {firstName} elsewhere</h2>
            <ul>
              {(socials || FALLBACK_SOCIALS.map((s) => ({ platform: s.platform, resolved_url: s.href, id: s.platform }))).map(
                (s) => {
                  const Icon = SOCIAL_ICONS[s.platform] || Mail;
                  return (
                    <li key={s.id}>
                      <a href={s.resolved_url} target="_blank" rel="noreferrer">
                        <Icon size={18} strokeWidth={1.75} />
                        {labelForPlatform(s.platform)}
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
  );
}