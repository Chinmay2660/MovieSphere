const ALLOWED_PREFIXES = [
  '/movie',
  '/tv',
  '/search',
  '/trending',
  '/discover',
  '/genre',
  '/configuration',
];

export function isNumericMediaId(value) {
  return /^\d{1,10}$/.test(String(value));
}

export function assertSafeApiPath(url) {
  if (typeof url !== 'string' || !url.startsWith('/')) {
    throw new Error('Invalid API path');
  }

  const path = url.split('?')[0];
  if (path.includes('..') || path.includes('//')) {
    throw new Error('Invalid API path');
  }

  const allowed = ALLOWED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
  if (!allowed) {
    throw new Error('Invalid API path');
  }
}
