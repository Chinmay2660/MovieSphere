/** ponytail: supported app + TMDB locales; upgrade path = add code + translations entry */
export const LANGUAGE_STORAGE_KEY = 'moviesphere-language';

export const DEFAULT_LANGUAGE = 'en-IN';

export const APP_LANGUAGES = [
  { code: 'en-IN', label: 'English', nativeLabel: 'English' },
  { code: 'hi-IN', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'mr-IN', label: 'Marathi', nativeLabel: 'मराठी' },
];

export function isSupportedLanguage(code) {
  return APP_LANGUAGES.some((lang) => lang.code === code);
}

export function getStoredLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return isSupportedLanguage(stored) ? stored : DEFAULT_LANGUAGE;
}
