import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Inbox,
  KeyRound,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  createAdminSession,
  getAdminMessages,
  getProfile,
  updateAdminMessageStatus,
  updateAdminProfile,
} from "../services/api.js";
import "./Admin.css";

const MESSAGE_STATUSES = ["new", "read", "replied", "archived"];
const SOCIAL_PLATFORMS = [
  "github",
  "linkedin",
  "twitter",
  "instagram",
  "facebook",
  "email",
  "website",
  "other",
];

function profileFormFrom(profile) {
  return {
    name: profile.name || "",
    tagline: profile.tagline || "",
    bio: profile.bio || "",
    education: profile.education || "",
    availability_status: profile.availability_status || "open_to_offers",
    avatar_url: profile.avatar_url || profile.avatar || "",
    resume_url: profile.resume_url || "",
    social_links: (profile.social_links || []).map(({ platform, value }) => ({
      platform,
      value,
    })),
  };
}

function messageDate(value) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem("portfolio-admin-session") || "");
  const [apiKey, setApiKey] = useState("");
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState(null);
  const [activeTab, setActiveTab] = useState("messages");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadDashboard = useCallback(async (sessionToken) => {
    setLoading(true);
    setError("");
    const [profileResult, messageResult] = await Promise.allSettled([
      getProfile(),
      getAdminMessages(sessionToken),
    ]);

    if (profileResult.status === "fulfilled") {
      setForm(profileFormFrom(profileResult.value));
    } else {
      setError("Could not load your profile. Check the API connection and try again.");
    }

    if (messageResult.status === "fulfilled") {
      setMessages(messageResult.value);
      setMessagesLoaded(true);
    } else if (messageResult.reason?.response?.status === 401) {
      sessionStorage.removeItem("portfolio-admin-session");
      setToken("");
      setError("Your admin session expired. Sign in again to continue.");
    } else {
      setError((current) =>
        current
          ? `${current} Messages could not be loaded.`
          : "Could not load messages. Check the API connection and try again."
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) loadDashboard(token);
  }, [token, loadDashboard]);

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const session = await createAdminSession(apiKey);
      sessionStorage.setItem("portfolio-admin-session", session.access_token);
      setApiKey("");
      setToken(session.access_token);
    } catch (loginError) {
      setError(
        loginError?.response?.status === 401
          ? "That admin key was not accepted."
          : "Sign-in failed. Check that the API is available and try again."
      );
      setLoading(false);
    }
  }

  function signOut() {
    sessionStorage.removeItem("portfolio-admin-session");
    setToken("");
    setMessages([]);
    setMessagesLoaded(false);
    setForm(null);
    setNotice("");
    setError("");
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function updateSocialLink(index, key, value) {
    setForm((current) => ({
      ...current,
      social_links: current.social_links.map((link, linkIndex) =>
        linkIndex === index ? { ...link, [key]: value } : link
      ),
    }));
  }

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const payload = {
      ...form,
      avatar_url: form.avatar_url.trim() || null,
      resume_url: form.resume_url.trim() || null,
      social_links: form.social_links
        .filter((link) => link.value.trim())
        .map((link, display_order) => ({
          ...link,
          value: link.value.trim(),
          display_order,
        })),
    };

    try {
      const updatedProfile = await updateAdminProfile(token, payload);
      setForm(profileFormFrom(updatedProfile));
      setNotice("Profile changes saved and published.");
    } catch (saveError) {
      if (saveError?.response?.status === 401) {
        signOut();
        setError("Your admin session expired. Sign in again to continue.");
      } else {
        setError("Profile could not be saved. Check the fields and try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function changeMessageStatus(message, status) {
    setError("");
    setNotice("");
    try {
      const updated = await updateAdminMessageStatus(token, message.id, status);
      setMessages((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
      setNotice("Message status updated.");
    } catch (statusError) {
      if (statusError?.response?.status === 401) {
        signOut();
        setError("Your admin session expired. Sign in again to continue.");
      } else {
        setError("Could not update that message. Please try again.");
      }
    }
  }

  if (!token) {
    return (
      <main className="admin-page admin-login-page">
        <section className="admin-login-card">
          <Link className="admin-back-link" to="/">
            <ArrowLeft size={16} /> Back to portfolio
          </Link>
          <span className="admin-kicker">Private area</span>
          <h1>Owner sign in</h1>
          <p>Use your admin API key to open your private portfolio dashboard.</p>
          <form onSubmit={handleLogin}>
            <label htmlFor="admin-key">Admin API key</label>
            <div className="admin-key-field">
              <KeyRound size={18} aria-hidden="true" />
              <input
                autoComplete="current-password"
                id="admin-key"
                name="apiKey"
                onChange={(event) => setApiKey(event.target.value)}
                placeholder="Enter your admin key"
                required
                type="password"
                value={apiKey}
              />
            </div>
            {error && <p className="admin-alert admin-alert-error" role="alert">{error}</p>}
            <button className="admin-button admin-button-primary" disabled={loading} type="submit">
              {loading ? "Signing in…" : "Sign in securely"}
            </button>
          </form>
          <p className="admin-login-note">
            Your key is exchanged for a temporary session and is not saved in this browser.
          </p>
        </section>
      </main>
    );
  }

  const visibleMessages = statusFilter === "all"
    ? messages
    : messages.filter((message) => message.status === statusFilter);
  const newMessageCount = messages.filter((message) => message.status === "new").length;

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div className="admin-header-inner">
          <div>
            <Link className="admin-back-link" to="/">
              <ArrowLeft size={16} /> View portfolio
            </Link>
            <span className="admin-kicker">Portfolio workspace</span>
            <h1>Owner dashboard</h1>
          </div>
          <button className="admin-button admin-button-quiet" onClick={signOut} type="button">
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </header>

      <div className="admin-content">
        <nav className="admin-tabs" aria-label="Dashboard sections">
          <button
            aria-current={activeTab === "messages" ? "page" : undefined}
            className={activeTab === "messages" ? "admin-tab active" : "admin-tab"}
            onClick={() => setActiveTab("messages")}
            type="button"
          >
            <Inbox size={18} /> Messages <span>{newMessageCount}</span>
          </button>
          <button
            aria-current={activeTab === "profile" ? "page" : undefined}
            className={activeTab === "profile" ? "admin-tab active" : "admin-tab"}
            onClick={() => setActiveTab("profile")}
            type="button"
          >
            <UserRound size={18} /> Profile
          </button>
          <button
            aria-label="Refresh dashboard"
            className="admin-refresh"
            disabled={loading}
            onClick={() => loadDashboard(token)}
            type="button"
          >
            <RefreshCw size={17} className={loading ? "is-spinning" : ""} /> Refresh
          </button>
        </nav>

        {error && <p className="admin-alert admin-alert-error" role="alert">{error}</p>}
        {notice && <p className="admin-alert admin-alert-success" role="status"><Check size={17} />{notice}</p>}

        {activeTab === "messages" ? (
          <section className="admin-section">
            <div className="admin-section-heading">
              <div>
                <span className="admin-kicker">Your inbox</span>
                <h2>Contact messages</h2>
                <p>Messages are stored here even when email notifications fail.</p>
              </div>
              <label className="admin-filter">
                <span>Show</span>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="all">All messages</option>
                  {MESSAGE_STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>
            </div>

            {loading && !messagesLoaded ? (
              <p className="admin-empty">Loading your inbox…</p>
            ) : !messagesLoaded ? (
              <p className="admin-empty">Your inbox could not be loaded. Use Refresh to try again.</p>
            ) : visibleMessages.length === 0 ? (
              <div className="admin-empty">
                <Inbox size={25} />
                <p>{messages.length ? "No messages match this filter." : "No messages yet."}</p>
              </div>
            ) : (
              <div className="admin-message-list">
                {visibleMessages.map((message) => (
                  <article className="admin-message" key={message.id}>
                    <div className="admin-message-top">
                      <div>
                        <span className={`admin-status status-${message.status}`}>{message.status}</span>
                        <time dateTime={message.created_at}>{messageDate(message.created_at)}</time>
                      </div>
                      <label className="admin-status-control">
                        <span className="sr-only">Update message status</span>
                        <select
                          aria-label={`Status for message from ${message.name}`}
                          onChange={(event) => changeMessageStatus(message, event.target.value)}
                          value={message.status}
                        >
                          {MESSAGE_STATUSES.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <h3>{message.subject || "No subject"}</h3>
                    <p className="admin-message-sender">
                      {message.name} · <a href={`mailto:${message.email}`}>{message.email}</a>
                      {message.phone && <> · <a href={`tel:${message.phone}`}>{message.phone}</a></>}
                    </p>
                    {message.intent && <p className="admin-message-intent">{message.intent}</p>}
                    <p className="admin-message-body">{message.message}</p>
                    <a className="admin-reply-link" href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject || "Your message"}`)}`}>
                      Reply by email
                    </a>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="admin-section">
            <div className="admin-section-heading">
              <div>
                <span className="admin-kicker">Public portfolio</span>
                <h2>Edit profile</h2>
                <p>Changes are published immediately on your portfolio.</p>
              </div>
            </div>
            {form ? (
              <form className="admin-profile-form" onSubmit={saveProfile}>
                <div className="admin-form-grid">
                  <label className="admin-field">
                    <span>Name</span>
                    <input maxLength="150" name="name" onChange={updateField} required value={form.name} />
                  </label>
                  <label className="admin-field">
                    <span>Tagline</span>
                    <input maxLength="255" name="tagline" onChange={updateField} value={form.tagline} />
                  </label>
                  <label className="admin-field admin-field-wide">
                    <span>Bio</span>
                    <textarea name="bio" onChange={updateField} rows="5" value={form.bio} />
                  </label>
                  <label className="admin-field admin-field-wide">
                    <span>Education</span>
                    <textarea name="education" onChange={updateField} rows="3" value={form.education} />
                  </label>
                  <label className="admin-field">
                    <span>Availability</span>
                    <select name="availability_status" onChange={updateField} value={form.availability_status}>
                      <option value="available">Available</option>
                      <option value="open_to_offers">Open to offers</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </label>
                  <label className="admin-field">
                    <span>Avatar image URL</span>
                    <input name="avatar_url" onChange={updateField} type="url" value={form.avatar_url} />
                  </label>
                  <label className="admin-field admin-field-wide">
                    <span>Resume URL</span>
                    <input name="resume_url" onChange={updateField} type="url" value={form.resume_url} />
                  </label>
                </div>

                <div className="admin-social-heading">
                  <div>
                    <h3>Social links</h3>
                    <p>Use a full URL or a handle for supported platforms.</p>
                  </div>
                  <button
                    className="admin-button admin-button-quiet"
                    onClick={() => setForm((current) => ({
                      ...current,
                      social_links: [...current.social_links, { platform: "other", value: "" }],
                    }))}
                    type="button"
                  >
                    <Plus size={16} /> Add link
                  </button>
                </div>
                <div className="admin-social-list">
                  {form.social_links.map((link, index) => (
                    <div className="admin-social-row" key={`${index}-${link.platform}`}>
                      <label>
                        <span className="sr-only">Social platform</span>
                        <select
                          onChange={(event) => updateSocialLink(index, "platform", event.target.value)}
                          value={link.platform}
                        >
                          {SOCIAL_PLATFORMS.map((platform) => (
                            <option key={platform} value={platform}>{platform}</option>
                          ))}
                        </select>
                      </label>
                      <label className="admin-social-value">
                        <span className="sr-only">Link or handle</span>
                        <input
                          onChange={(event) => updateSocialLink(index, "value", event.target.value)}
                          placeholder="URL or username"
                          value={link.value}
                        />
                      </label>
                      <button
                        aria-label="Remove social link"
                        className="admin-remove-link"
                        onClick={() => setForm((current) => ({
                          ...current,
                          social_links: current.social_links.filter((_, linkIndex) => linkIndex !== index),
                        }))}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button className="admin-button admin-button-primary" disabled={saving} type="submit">
                  <Save size={17} /> {saving ? "Saving…" : "Save profile"}
                </button>
              </form>
            ) : (
              <p className="admin-empty">{loading ? "Loading profile…" : "Profile is not available."}</p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
