import type { VercelRequest, VercelResponse } from '@vercel/node';

const DICTIONARY_API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Vercel serverless function that proxies requests to the Free Dictionary API.
 * This solves CORS issues by making the request server-side and adding CORS headers.
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers for all requests
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const word = req.query.word as string;

  if (!word) {
    return res.status(400).json({ error: 'Word parameter is required' });
  }

  const targetUrl = `${DICTIONARY_API_BASE}/${encodeURIComponent(word)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const response = await fetch(targetUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Woodle/1.0',
      },
    });

    clearTimeout(timeoutId);

    // Forward the status code
    res.status(response.status);

    // If the response is OK, forward the JSON data
    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    } else {
      // For non-OK responses (like 404), return empty body with the status code
      return res.end();
    }
  } catch (error) {
    // Handle network errors, timeouts, etc.
    if (error instanceof Error && error.name === 'AbortError') {
      return res.status(504).json({ error: 'Request timeout' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}
