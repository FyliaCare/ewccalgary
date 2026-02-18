/**
 * In-memory rate limiter for auth endpoints.
 *
 * Uses a sliding window counter per IP address.
 * Suitable for single-instance deployments and serverless (per-instance limiting).
 * For multi-instance/distributed deployments, swap this for Redis-backed rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // Unix timestamp (ms)
}

const store = new Map<string, RateLimitEntry>();

// Periodic cleanup to prevent memory leaks (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  store.forEach((entry, key) => {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  });
}

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

/**
 * Check and consume a rate limit token for the given key (typically IP + endpoint).
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanup();

  const now = Date.now();
  const entry = store.get(key);

  // No existing entry or window expired — start a new window
  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.windowSeconds * 1000;
    store.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt,
      retryAfterSeconds: 0,
    };
  }

  // Within existing window
  if (entry.count < config.maxRequests) {
    entry.count++;
    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetAt: entry.resetAt,
      retryAfterSeconds: 0,
    };
  }

  // Rate limit exceeded
  const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
  return {
    allowed: false,
    remaining: 0,
    resetAt: entry.resetAt,
    retryAfterSeconds,
  };
}

// ─── Preset configs for different endpoint types ───

/** Auth endpoints: 10 attempts per 15 minutes */
export const AUTH_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 10,
  windowSeconds: 15 * 60,
};

/** Registration: 5 attempts per hour */
export const REGISTER_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 5,
  windowSeconds: 60 * 60,
};

/** Contact form: 5 submissions per 15 minutes */
export const CONTACT_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 5,
  windowSeconds: 15 * 60,
};
