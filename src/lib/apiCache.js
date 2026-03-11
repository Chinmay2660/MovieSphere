const CACHE_TTL_MS = 5 * 60 * 1000;

const cache = new Map();

function cacheKey(config) {
  const { method = "get", url, params } = config;
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  return `${method.toLowerCase()}:${url}${query}`;
}

function get(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function set(key, data) {
  cache.set(key, { data, at: Date.now() });
}

export function getCachedResponse(config) {
  const key = cacheKey(config);
  return get(key);
}

export function setCachedResponse(config, response) {
  const key = cacheKey(config);
  set(key, response);
}

export const CACHE_TTL_MS_EXPORT = CACHE_TTL_MS;
