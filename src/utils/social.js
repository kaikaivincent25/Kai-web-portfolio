/**
 * Centralized configuration for social platforms.
 * Grouped to reflect an engineering portfolio's priorities.
 */
export const SOCIAL_LABELS = {
  // Professional & Development
  github: "GitHub",
  linkedin: "LinkedIn",
  email: "Email",
  
  // Public & Social
  twitter: "X",
  x: "X",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  facebook: "Facebook",
};

/**
 * Resolves the human-readable label for a given platform key.
 * 
 * @param {string} platform - The raw platform key from the API.
 * @returns {string} The formatted label, or the raw key if unmapped.
 */
export function labelForPlatform(platform) {
  // Safer lookup than direct bracket notation to avoid prototype property conflicts
  if (Object.prototype.hasOwnProperty.call(SOCIAL_LABELS, platform)) {
    return SOCIAL_LABELS[platform];
  }
  
  // Optional: Capitalize the first letter as a fallback for unknown platforms
  return platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : "";
}
