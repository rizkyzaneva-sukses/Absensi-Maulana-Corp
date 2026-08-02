declare global {
  interface Window {
    __API_KEY__?: string;
  }
}

// The server inlines API_KEY into the served index.html (see server/index.mjs)
// since a browser can't read process.env directly.
export function apiHeaders(extra?: Record<string, string>): Record<string, string> {
  const apiKey = typeof window !== 'undefined' ? window.__API_KEY__ : undefined;
  return {
    'Content-Type': 'application/json',
    ...(apiKey ? { 'X-API-Key': apiKey } : {}),
    ...extra,
  };
}
