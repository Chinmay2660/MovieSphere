/** ponytail: single source for India-first TMDB + UI defaults */
import { DEFAULT_LANGUAGE, getStoredLanguage } from './languages';
import { DEFAULT_REGION, getStoredRegion } from './regions';

export { DEFAULT_LANGUAGE as LANGUAGE, DEFAULT_REGION as REGION };
export { APP_LANGUAGES, getStoredLanguage } from './languages';
export { APP_REGIONS, getStoredRegion } from './regions';

let requestLanguage = getStoredLanguage();
let requestRegion = getStoredRegion();

export function getRequestLanguage() {
  return requestLanguage;
}

export function setRequestLanguage(language) {
  requestLanguage = language;
}

export function getRequestRegion() {
  return requestRegion;
}

export function setRequestRegion(region) {
  requestRegion = region;
}

export const TMDB_DEFAULTS = {
  region: requestRegion,
  language: requestLanguage,
};
