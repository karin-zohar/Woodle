/**
 * Shared CORS proxy for APIs that don't support browser CORS.
 * Use when calling from the client and the API does not send Access-Control-Allow-Origin.
 */

const CORS_PROXY_BASE = "https://corsproxy.io/?url=";

/** Returns the URL to fetch via the CORS proxy (target URL encoded as query param). */
export const getProxiedUrl = (targetUrl: string): string =>
  CORS_PROXY_BASE + encodeURIComponent(targetUrl);

/** Fetches the given target URL through the CORS proxy. */
export const fetchViaProxy = (
  targetUrl: string,
  init?: RequestInit
): Promise<Response> => fetch(getProxiedUrl(targetUrl), init);
