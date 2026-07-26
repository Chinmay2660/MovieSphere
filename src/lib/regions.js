/** ponytail: TMDB region codes; upgrade path = add code when expanding markets */
export const REGION_STORAGE_KEY = 'moviesphere-region';

export const DEFAULT_REGION = 'IN';

export const APP_REGIONS = [
  { code: 'IN', label: 'India' },
  { code: 'US', label: 'United States' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'CA', label: 'Canada' },
  { code: 'AU', label: 'Australia' },
];

export function isSupportedRegion(code) {
  return APP_REGIONS.some((region) => region.code === code);
}

export function getStoredRegion() {
  if (typeof window === 'undefined') return DEFAULT_REGION;
  const stored = window.localStorage.getItem(REGION_STORAGE_KEY);
  return isSupportedRegion(stored) ? stored : DEFAULT_REGION;
}
