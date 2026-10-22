export const EXPLORE_DEFAULT_SORT = 'popularity.desc';

export function getExploreSortOptions(isTV) {
  if (isTV) {
    return [
      { value: 'popularity.desc', labelKey: 'explore.sort.popular' },
      { value: 'vote_average.desc', labelKey: 'explore.sort.topRated' },
      { value: 'first_air_date.desc', labelKey: 'explore.sort.newest' },
      { value: 'first_air_date.asc', labelKey: 'explore.sort.oldest' },
    ];
  }
  return [
    { value: 'popularity.desc', labelKey: 'explore.sort.popular' },
    { value: 'vote_average.desc', labelKey: 'explore.sort.topRated' },
    { value: 'primary_release_date.desc', labelKey: 'explore.sort.newest' },
    { value: 'primary_release_date.asc', labelKey: 'explore.sort.oldest' },
    { value: 'revenue.desc', labelKey: 'explore.sort.boxOffice' },
  ];
}

export const EXPLORE_RATING_OPTIONS = [
  { value: '', labelKey: 'explore.rating.any' },
  { value: '6', labelKey: 'explore.rating.sixPlus' },
  { value: '7', labelKey: 'explore.rating.sevenPlus' },
  { value: '8', labelKey: 'explore.rating.eightPlus' },
];

/** ponytail: curated ISO 639-1; upgrade path = fetch /configuration/languages */
export const EXPLORE_LANGUAGE_OPTIONS = [
  { value: '', labelKey: 'explore.language.any' },
  { value: 'hi', labelKey: 'explore.language.hi' },
  { value: 'en', labelKey: 'explore.language.en' },
  { value: 'mr', labelKey: 'explore.language.mr' },
  { value: 'ta', labelKey: 'explore.language.ta' },
  { value: 'te', labelKey: 'explore.language.te' },
  { value: 'ml', labelKey: 'explore.language.ml' },
  { value: 'kn', labelKey: 'explore.language.kn' },
  { value: 'bn', labelKey: 'explore.language.bn' },
  { value: 'pa', labelKey: 'explore.language.pa' },
  { value: 'gu', labelKey: 'explore.language.gu' },
  { value: 'or', labelKey: 'explore.language.or' },
  { value: 'ur', labelKey: 'explore.language.ur' },
  { value: 'ja', labelKey: 'explore.language.ja' },
  { value: 'ko', labelKey: 'explore.language.ko' },
  { value: 'fr', labelKey: 'explore.language.fr' },
  { value: 'es', labelKey: 'explore.language.es' },
  { value: 'de', labelKey: 'explore.language.de' },
];

/** ponytail: curated ISO 3166-1 production countries */
export const EXPLORE_COUNTRY_OPTIONS = [
  { value: '', labelKey: 'explore.country.any' },
  { value: 'IN', labelKey: 'explore.country.IN' },
  { value: 'US', labelKey: 'explore.country.US' },
  { value: 'GB', labelKey: 'explore.country.GB' },
  { value: 'CA', labelKey: 'explore.country.CA' },
  { value: 'AU', labelKey: 'explore.country.AU' },
  { value: 'FR', labelKey: 'explore.country.FR' },
  { value: 'DE', labelKey: 'explore.country.DE' },
  { value: 'JP', labelKey: 'explore.country.JP' },
  { value: 'KR', labelKey: 'explore.country.KR' },
  { value: 'CN', labelKey: 'explore.country.CN' },
  { value: 'BR', labelKey: 'explore.country.BR' },
  { value: 'MX', labelKey: 'explore.country.MX' },
  { value: 'IT', labelKey: 'explore.country.IT' },
  { value: 'ES', labelKey: 'explore.country.ES' },
];

const currentYear = new Date().getFullYear();

export function getExploreYearOptions() {
  const years = [{ value: '', labelKey: 'explore.year.any' }];
  for (let y = currentYear; y >= currentYear - 15; y -= 1) {
    years.push({ value: String(y), label: String(y) });
  }
  return years;
}

export function parseExploreFilters(searchParams) {
  const genreParam = searchParams.get('genres');
  const language = searchParams.get('language') || '';
  const country = searchParams.get('country') || '';
  const validLanguage = EXPLORE_LANGUAGE_OPTIONS.some((o) => o.value === language)
    ? language
    : '';
  const validCountry = EXPLORE_COUNTRY_OPTIONS.some((o) => o.value === country)
    ? country
    : '';

  return {
    sortBy: searchParams.get('sort_by') || EXPLORE_DEFAULT_SORT,
    genres: genreParam ? genreParam.split(',').filter(Boolean) : [],
    year: searchParams.get('year') || '',
    minRating: searchParams.get('rating_min') || '',
    language: validLanguage,
    country: validCountry,
  };
}

export function filtersToSearchParams(filters) {
  const params = new URLSearchParams();
  if (filters.sortBy && filters.sortBy !== EXPLORE_DEFAULT_SORT) {
    params.set('sort_by', filters.sortBy);
  }
  if (filters.genres?.length) params.set('genres', filters.genres.join(','));
  if (filters.year) params.set('year', filters.year);
  if (filters.minRating) params.set('rating_min', filters.minRating);
  if (filters.language) params.set('language', filters.language);
  if (filters.country) params.set('country', filters.country);
  return params;
}

export function buildDiscoverParams(isTV, filters, page) {
  const queryParams = {
    page,
    sort_by: filters.sortBy || EXPLORE_DEFAULT_SORT,
  };

  if (filters.genres?.length) {
    queryParams.with_genres = filters.genres.join(',');
  }

  if (filters.minRating) {
    queryParams['vote_average.gte'] = filters.minRating;
  }

  if (filters.year) {
    if (isTV) {
      queryParams['first_air_date.gte'] = `${filters.year}-01-01`;
      queryParams['first_air_date.lte'] = `${filters.year}-12-31`;
    } else {
      queryParams.primary_release_year = filters.year;
    }
  }

  if (filters.language) {
    queryParams.with_original_language = filters.language;
  }

  if (filters.country) {
    queryParams.with_origin_country = filters.country;
  }

  return queryParams;
}

export function countActiveExploreFilters(filters) {
  let n = 0;
  if (filters.sortBy !== EXPLORE_DEFAULT_SORT) n += 1;
  if (filters.genres?.length) n += filters.genres.length;
  if (filters.year) n += 1;
  if (filters.minRating) n += 1;
  if (filters.language) n += 1;
  if (filters.country) n += 1;
  return n;
}

/** Badge on Filters control — modal fields only (sort is instant via dropdown). */
export function countActiveModalExploreFilters(filters) {
  let n = 0;
  if (filters.genres?.length) n += filters.genres.length;
  if (filters.year) n += 1;
  if (filters.minRating) n += 1;
  if (filters.language) n += 1;
  if (filters.country) n += 1;
  return n;
}

export function exploreModalFiltersEqual(a, b) {
  if (!a || !b) return false;
  if (
    a.year !== b.year ||
    a.minRating !== b.minRating ||
    a.language !== b.language ||
    a.country !== b.country
  ) {
    return false;
  }
  const ga = [...(a.genres || [])].sort().join(',');
  const gb = [...(b.genres || [])].sort().join(',');
  return ga === gb;
}

export function hasNonDefaultExploreFilters(filters) {
  return countActiveExploreFilters(filters) > 0;
}

export function exploreFiltersEqual(a, b) {
  if (!a || !b) return false;
  if (
    a.sortBy !== b.sortBy ||
    a.year !== b.year ||
    a.minRating !== b.minRating ||
    a.language !== b.language ||
    a.country !== b.country
  ) {
    return false;
  }
  const ga = [...(a.genres || [])].sort().join(',');
  const gb = [...(b.genres || [])].sort().join(',');
  return ga === gb;
}
