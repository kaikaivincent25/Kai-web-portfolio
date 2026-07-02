export const SOCIAL_LABELS = {
  twitter: "Twitter / X",
  facebook: "Facebook",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  email: "Email",
  github: "GitHub",
  linkedin: "LinkedIn",
};

export function labelForPlatform(platform) {
  return SOCIAL_LABELS[platform] || platform;
}

// Used anywhere the API hasn't returned social links yet (loading, error,
// or no rows created in the admin so far).
export const FALLBACK_SOCIALS = [
  { platform: "twitter", href: "#" },
  { platform: "facebook", href: "#" },
  { platform: "instagram", href: "#" },
  { platform: "whatsapp", href: "#" },
  { platform: "email", href: "mailto:you@example.com" },
];