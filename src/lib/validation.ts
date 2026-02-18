/**
 * Shared validation and sanitization utilities
 * Used across API routes and client-side code
 */

// ─── HTML Escaping (for email templates) ───────────────────

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
};

/**
 * Escape HTML entities to prevent HTML injection in email templates
 */
export function escapeHtml(str: string): string {
  return str.replace(/[&<>"'/]/g, (char) => HTML_ESCAPE_MAP[char] || char);
}

// ─── Input Sanitization ───────────────────

/**
 * Sanitize a string input: trim, and enforce max length
 */
export function sanitizeString(
  input: unknown,
  maxLength: number = 500
): string {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, maxLength);
}

/**
 * Sanitize text content (chat messages, bios, etc.)
 * Removes null bytes, trims whitespace, enforces max length
 */
export function sanitizeContent(
  input: unknown,
  maxLength: number = 5000
): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/\0/g, "") // Remove null bytes
    .trim()
    .slice(0, maxLength);
}

// ─── Email Validation ───────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: unknown): boolean {
  if (typeof email !== "string") return false;
  return EMAIL_REGEX.test(email) && email.length <= 254;
}

// ─── Password Validation ───────────────────

export interface PasswordValidation {
  valid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  if (password.length > 128) {
    errors.push("Password must be at most 128 characters");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  return { valid: errors.length === 0, errors };
}

// ─── Avatar URL Validation ───────────────────

const ALLOWED_AVATAR_PROTOCOLS = ["https:"];
const BLOCKED_AVATAR_EXTENSIONS = [".svg", ".html", ".htm"];

/**
 * Validate an avatar URL to prevent XSS and tracking
 * Only allows HTTPS URLs pointing to image resources
 */
export function isValidAvatarUrl(url: unknown): boolean {
  if (typeof url !== "string" || url.length === 0) return true; // empty is OK
  if (url.length > 2048) return false;
  try {
    const parsed = new URL(url);
    if (!ALLOWED_AVATAR_PROTOCOLS.includes(parsed.protocol)) return false;
    // Block dangerous file extensions
    const path = parsed.pathname.toLowerCase();
    if (BLOCKED_AVATAR_EXTENSIONS.some((ext) => path.endsWith(ext)))
      return false;
    return true;
  } catch {
    return false;
  }
}

// ─── Donation Validation ───────────────────

export function isValidDonationAmount(amount: unknown): boolean {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (typeof num !== "number" || isNaN(num)) return false;
  if (num <= 0) return false;
  if (num > 1000000) return false; // $1M max
  return true;
}

// ─── General ───────────────────

/**
 * Shared timeAgo function to avoid duplication across components.
 * Compact format: "now", "5m", "2h", "3d"
 */
export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

/**
 * Verbose variant: "just now", "5m ago", "2h ago", "3d ago",
 * or the localized date for 7+ days.
 */
export function timeAgoVerbose(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}


