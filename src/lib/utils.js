export const MAX_SEARCH_LENGTH = 200;

export function sanitizeSearchQuery(raw) {
  if (typeof raw !== "string") return "";
  try {
    const decoded = decodeURIComponent(raw).trim();
    return decoded.slice(0, MAX_SEARCH_LENGTH).replace(/[\x00-\x1F\x7F]/g, "");
  } catch {
    return "";
  }
}

export function getSearchQueryFromSearch(search) {
  const q = new URLSearchParams(search).get("q");
  return q ? sanitizeSearchQuery(q) : "";
}

export const debounce = (func, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
};

export const getRatingColor = (voteAverage) => {
    const score = Number(voteAverage) || 0;
    if (score >= 7) return { text: 'text-green-400', bg: 'bg-green-400/20', color: '#4ade80' };
    if (score >= 5) return { text: 'text-yellow-400', bg: 'bg-yellow-400/20', color: '#facc15' };
    if (score >= 3) return { text: 'text-orange-400', bg: 'bg-orange-400/20', color: '#fb923c' };
    return { text: 'text-red-400', bg: 'bg-red-400/20', color: '#f87171' };
};

export function formatYear(dateStr) {
  if (!dateStr) return null;
  const year = String(dateStr).slice(0, 4);
  return /^\d{4}$/.test(year) ? year : null;
}

export function formatLongDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}