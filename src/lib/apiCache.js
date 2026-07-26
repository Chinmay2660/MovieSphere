const DEFAULT_TTL_MS = 5 * 60 * 1000;
const STALE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY = 'moviesphere-api-cache';
const MAX_CACHE_ENTRIES = 80;
const MAX_ENTRY_BYTES = 120_000;
const MAX_CONCURRENT_REQUESTS = 4;

const cache = new Map();
const inflight = new Map();

let activeRequests = 0;
const requestQueue = [];

function normalizePath(url) {
  const raw = String(url || '').split('?')[0];
  return raw.startsWith('/') ? raw : `/${raw}`;
}

function getCacheTtlMs(url) {
  const path = normalizePath(url);

  if (path === '/configuration') return 24 * 60 * 60 * 1000;
  if (/^\/genre\/[^/]+\/list$/.test(path)) return 24 * 60 * 60 * 1000;
  if (/^\/(movie|tv)\/\d+$/.test(path)) return 60 * 60 * 1000;
  if (/\/(credits|videos|images)$/.test(path)) return 60 * 60 * 1000;
  if (/\/season\/\d+$/.test(path)) return 60 * 60 * 1000;
  if (/\/(similar|recommendations)$/.test(path)) return 30 * 60 * 1000;
  if (path.startsWith('/search')) return 2 * 60 * 1000;
  if (path.startsWith('/trending')) return 15 * 60 * 1000;
  if (path.startsWith('/discover')) return 10 * 60 * 1000;
  if (/^\/(movie|tv)\/(popular|upcoming|now_playing|top_rated|airing_today|on_the_air)$/.test(path)) {
    return 15 * 60 * 1000;
  }

  return DEFAULT_TTL_MS;
}

function cacheKey(config) {
  const { method = 'get', url, params } = config;
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return `${method.toLowerCase()}:${url}${query}`;
}

function pruneCache() {
  if (cache.size <= MAX_CACHE_ENTRIES) return;

  const sorted = [...cache.entries()].sort((a, b) => a[1].at - b[1].at);
  const removeCount = cache.size - MAX_CACHE_ENTRIES;
  for (let i = 0; i < removeCount; i += 1) {
    cache.delete(sorted[i][0]);
  }
}

function getEntry(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.at > STALE_MAX_AGE_MS) {
    cache.delete(key);
    return null;
  }
  return entry;
}

function get(key, fallbackTtlMs = DEFAULT_TTL_MS) {
  const entry = getEntry(key);
  if (!entry) return null;
  const ttlMs = entry.ttlMs ?? fallbackTtlMs;
  if (Date.now() - entry.at > ttlMs) return null;
  return entry.data;
}

function getStale(key) {
  const entry = getEntry(key);
  return entry?.data ?? null;
}

function set(key, data, ttlMs = DEFAULT_TTL_MS) {
  cache.set(key, { data, at: Date.now(), ttlMs });
  pruneCache();
  schedulePersist();
}

let persistTimer = null;

function schedulePersist() {
  if (persistTimer || typeof sessionStorage === 'undefined') return;
  persistTimer = setTimeout(() => {
    persistTimer = null;
    persistCache();
  }, 400);
}

function persistCache() {
  try {
    const entries = [...cache.entries()]
      .sort((a, b) => b[1].at - a[1].at)
      .slice(0, MAX_CACHE_ENTRIES)
      .flatMap(([key, entry]) => {
        try {
          const payload = JSON.stringify(entry);
          if (payload.length > MAX_ENTRY_BYTES) return [];
          return [[key, entry]];
        } catch {
          return [];
        }
      });

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 1, entries }));
  } catch {
    // ponytail: quota exceeded — in-memory cache still works
  }
}

function loadPersistedCache() {
  if (typeof sessionStorage === 'undefined') return;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (!parsed?.entries?.length) return;

    const now = Date.now();
    for (const [key, entry] of parsed.entries) {
      if (!entry?.data || now - entry.at > STALE_MAX_AGE_MS) continue;
      if (!cache.has(key)) cache.set(key, entry);
    }
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

loadPersistedCache();

export function getCachedResponse(config) {
  const key = cacheKey(config);
  return get(key, getCacheTtlMs(config.url));
}

export function getStaleResponse(config) {
  const key = cacheKey(config);
  return getStale(key);
}

export function setCachedResponse(config, response) {
  const key = cacheKey(config);
  set(key, response, getCacheTtlMs(config.url));
}

export const CACHE_TTL_MS_EXPORT = DEFAULT_TTL_MS;

export function clearApiCache() {
  cache.clear();
  inflight.clear();
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

function runWithConcurrencyLimit(task) {
  return new Promise((resolve, reject) => {
    const run = async () => {
      activeRequests += 1;
      try {
        resolve(await task());
      } catch (error) {
        reject(error);
      } finally {
        activeRequests -= 1;
        const next = requestQueue.shift();
        if (next) next();
      }
    };

    if (activeRequests < MAX_CONCURRENT_REQUESTS) {
      run();
      return;
    }

    requestQueue.push(run);
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getRetryDelayMs(error, attempt) {
  const retryAfter = Number.parseInt(error.response?.headers?.['retry-after'], 10);
  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    return retryAfter * 1000;
  }
  return 1000 * (attempt + 1);
}

export async function fetchWithCachePolicy(config, fetcher, { ttlMs, maxRetries = 2 } = {}) {
  const key = cacheKey(config);
  const resolvedTtlMs = ttlMs ?? getCacheTtlMs(config.url);

  const fresh = get(key, resolvedTtlMs);
  if (fresh) return fresh;

  const pending = inflight.get(key);
  if (pending) return pending;

  const promise = runWithConcurrencyLimit(async () => {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      try {
        const response = await fetcher();
        if (response.status >= 200 && response.status < 300) {
          set(key, response, resolvedTtlMs);
        }
        return response;
      } catch (error) {
        lastError = error;
        const status = error.response?.status;
        if (status === 429 && attempt < maxRetries) {
          await sleep(getRetryDelayMs(error, attempt));
          continue;
        }

        const stale = getStale(key);
        if (stale && (status === 429 || (status >= 500 && status < 600))) {
          return stale;
        }

        throw error;
      }
    }

    throw lastError;
  })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, promise);
  return promise;
}

export { cacheKey, getCacheTtlMs };
