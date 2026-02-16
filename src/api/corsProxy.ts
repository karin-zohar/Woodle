/**
 * Shared CORS proxy for APIs that don't support browser CORS.
 * Uses Vercel serverless function in production, falls back to corsproxy.io in development.
 */

const CORS_PROXY_BASE = "https://corsproxy.io/?url=";

/**
 * Detects if we're in production (deployed on Vercel).
 * In production, we use our own Vercel function. In development, we use corsproxy.io.
 */
const isProduction = (): boolean => {
  // Check if we're on a Vercel deployment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Vercel deployments use vercel.app domain
    // Custom domains on Vercel will also have the /api routes available
    // Only use Vercel function if we're definitely on Vercel or a production domain
    return (
      hostname.includes('vercel.app') ||
      hostname.includes('vercel.com') ||
      // For custom domains, check if we're NOT on localhost/local IP
      (hostname !== 'localhost' &&
        hostname !== '127.0.0.1' &&
        !hostname.startsWith('192.168.') &&
        !hostname.startsWith('10.') &&
        !hostname.startsWith('172.'))
    );
  }
  // If window is undefined (SSR), assume development
  return false;
};

/**
 * Extracts the word from a dictionary API URL and decodes it.
 * Example: "https://api.dictionaryapi.dev/api/v2/entries/en/hello" -> "hello"
 * Example: "https://api.dictionaryapi.dev/api/v2/entries/en/hello%20world" -> "hello world"
 */
const extractWordFromUrl = (url: string): string | null => {
  const match = url.match(/\/api\/v2\/entries\/en\/([^\/\?]+)/);
  if (!match) return null;
  // Decode the word in case it was URL-encoded
  try {
    return decodeURIComponent(match[1]);
  } catch {
    // If decoding fails, return the raw match (shouldn't happen with valid words)
    return match[1];
  }
};

/**
 * Returns the URL to fetch via the appropriate proxy.
 * In production: Uses Vercel function at /api/dictionary/{word}
 * In development: Uses corsproxy.io
 */
export const getProxiedUrl = (targetUrl: string): string => {
  if (isProduction()) {
    // Use Vercel function in production
    const word = extractWordFromUrl(targetUrl);
    if (word) {
      return `/api/dictionary/${encodeURIComponent(word)}`;
    }
    // Fallback to corsproxy.io if URL doesn't match expected pattern
    return CORS_PROXY_BASE + encodeURIComponent(targetUrl);
  }
  // Use corsproxy.io in development (localhost)
  return CORS_PROXY_BASE + encodeURIComponent(targetUrl);
};

/**
 * Fetches the given target URL through the appropriate proxy.
 * In production: Uses Vercel serverless function (no CORS issues)
 * In development: Uses corsproxy.io (works on localhost)
 */
export const fetchViaProxy = (
  targetUrl: string,
  init?: RequestInit
): Promise<Response> => {
  const proxiedUrl = getProxiedUrl(targetUrl);
  return fetch(proxiedUrl, init);
};
