import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axiosConfig";
import Card from "../components/Home/Card";
import Loader from "../components/Reusables/Loader";
import MovieGrid from "../components/Reusables/MovieGrid";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { getSearchQueryFromSearch, getSearchTypeFromSearch } from "../lib/utils";
import { USER_MESSAGES } from "../lib/userFriendlyError";
import { useLocale } from "../context/LocaleContext";

const SEARCH_TYPES = ['all', 'movie', 'tv'];

const SearchPage = () => {
  const { language, t } = useLocale();
  const location = useLocation();
  const navigate = useNavigate();
  const query = getSearchQueryFromSearch(location?.search || "");
  const mediaType = getSearchTypeFromSearch(location?.search || "");
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const [totalPageNo, setTotalPageNo] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [resolvedQuery, setResolvedQuery] = useState("");

  const searchEndpoint = useMemo(() => {
    if (mediaType === 'movie') return '/search/movie';
    if (mediaType === 'tv') return '/search/tv';
    return '/search/multi';
  }, [mediaType]);

  const fetchPage = useCallback(async (currentPage, searchQuery) => {
    if (!searchQuery) return;
    const isFirstPage = currentPage === 1;
    if (isFirstPage) setIsInitialLoading(true);
    else setIsLoadingMore(true);
    setError(null);
    try {
      const response = await axiosInstance.get(searchEndpoint, {
        params: { query: searchQuery, page: currentPage },
      });
      let results = response.data.results || [];
      if (mediaType === 'all') {
        results = results.filter(
          (item) => item.media_type === "movie" || item.media_type === "tv"
        );
      }
      setData((prev) =>
        currentPage === 1 ? results : [...prev, ...results]
      );
      setTotalPageNo(response.data.total_pages ?? 0);
      if (isFirstPage) setResolvedQuery(searchQuery);
    } catch {
      setError(USER_MESSAGES.search);
      if (isFirstPage) setResolvedQuery(searchQuery);
    } finally {
      if (isFirstPage) setIsInitialLoading(false);
      else setIsLoadingMore(false);
    }
  }, [searchEndpoint, mediaType]);

  const setMediaType = (type) => {
    const params = new URLSearchParams(location.search);
    if (type === 'all') params.delete('type');
    else params.set('type', type);
    navigate({ pathname: '/search', search: params.toString() }, { replace: true });
  };

  const hasMore = totalPageNo > 0 && pageNo < totalPageNo;
  const isLoading = isInitialLoading || isLoadingMore;

  const loadMore = useCallback(() => {
    if (query && hasMore && !isLoading) {
      setPageNo((prev) => prev + 1);
    }
  }, [query, hasMore, isLoading]);

  const sentinelRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore: Boolean(query) && hasMore,
    isLoading,
  });

  const queryKey = `${query}|${mediaType}`;

  useEffect(() => {
    if (!query) {
      setData([]);
      setTotalPageNo(0);
      setError(null);
      setPageNo(1);
      setResolvedQuery("");
      setIsInitialLoading(false);
      return;
    }
    setPageNo(1);
    setData([]);
    setTotalPageNo(0);
    setError(null);
    setResolvedQuery("");
    setIsInitialLoading(true);
    fetchPage(1, query);
  }, [queryKey, language, fetchPage, query]);

  useEffect(() => {
    if (query && pageNo > 1) {
      fetchPage(pageNo, query);
    }
  }, [pageNo, query, fetchPage]);

  const hasSearched = query.length > 0;
  const showNoResults =
    !isLoading &&
    hasSearched &&
    data.length === 0 &&
    !error &&
    resolvedQuery === query;
  const showInitialEmpty = !isLoading && !hasSearched && !error;

  const typeLabel = (type) => {
    if (type === 'movie') return t('nav.movies');
    if (type === 'tv') return t('nav.series');
    return t('search.typeAll');
  };

  return (
    <div className="apple-page">
      <div className="apple-container page-content-footer">
        <header className="apple-section-header mt-2 sm:mt-4">
          <h1 className="apple-large-title text-text">
            {hasSearched ? t('search.resultsFor', { query }) : t('search.title')}
          </h1>
          {!hasSearched && (
            <p className="apple-subheadline mt-2 max-w-xl">{t('search.hint')}</p>
          )}
        </header>

        <div
          className="search-type-tabs mb-6 w-full"
          role="tablist"
          aria-label={t('search.filterByType')}
        >
          {SEARCH_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              role="tab"
              aria-selected={mediaType === type}
              onClick={() => setMediaType(type)}
              className={`search-type-tab ${mediaType === type ? 'search-type-tab-active' : ''}`}
            >
              {typeLabel(type)}
            </button>
          ))}
        </div>

        {error && (
          <div className="apple-content-box mb-6 apple-footnote text-text/90">{error}</div>
        )}

        {showInitialEmpty && (
          <div className="apple-content-box apple-empty-state py-12">
            <p className="apple-footnote text-muted">{t('search.hintBrowse')}</p>
          </div>
        )}

        {showNoResults && (
          <div className="apple-empty-state">
            <p className="apple-headline text-secondary">
              {t('search.noResults', { query })}
            </p>
            <p className="apple-footnote mt-2">{t('search.tryDifferent')}</p>
          </div>
        )}

        {data.length > 0 && (
          <MovieGrid>
            {data.map((item) => (
              <div
                key={`${item.id}-${item.media_type ?? mediaType}-search`}
                className="movie-grid-item"
              >
                <Card
                  data={item}
                  trending={false}
                  media_type={item.media_type ?? (mediaType === 'all' ? 'movie' : mediaType)}
                />
              </div>
            ))}
          </MovieGrid>
        )}

        <div ref={sentinelRef} className="h-px" aria-hidden="true" />

        {isInitialLoading && data.length === 0 && (
          <Loader size="lg" label={t('search.searching')} className="py-20" />
        )}

        {isLoadingMore && (
          <Loader label={t('loading.moreResults')} className="py-8" />
        )}

        {!isLoading && data.length > 0 && pageNo >= totalPageNo && (
          <div className="text-center py-8">
            <p className="apple-footnote">{t('search.end')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
