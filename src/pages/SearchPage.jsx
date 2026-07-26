import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../lib/axiosConfig";
import Card from "../components/Home/Card";
import LoadMoreIndicator from "../components/Reusables/LoadMoreIndicator";
import Loader from "../components/Reusables/Loader";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { getSearchQueryFromSearch } from "../lib/utils";
import { USER_MESSAGES } from "../lib/userFriendlyError";
import { useLocale } from "../context/LocaleContext";

const SearchPage = () => {
  const { language, t } = useLocale();
  const location = useLocation();
  const query = getSearchQueryFromSearch(location?.search || "");
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const [totalPageNo, setTotalPageNo] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [resolvedQuery, setResolvedQuery] = useState("");

  const fetchPage = useCallback(async (currentPage, searchQuery) => {
    if (!searchQuery) return;
    const isFirstPage = currentPage === 1;
    if (isFirstPage) setIsInitialLoading(true);
    else setIsLoadingMore(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/search/multi`, {
        params: { query: searchQuery, page: currentPage },
      });
      const results = response.data.results || [];
      const filtered = results.filter(
        (item) => item.media_type === "movie" || item.media_type === "tv"
      );
      setData((prev) =>
        currentPage === 1 ? filtered : [...prev, ...filtered]
      );
      setTotalPageNo(response.data.total_pages ?? 0);
      if (isFirstPage) setResolvedQuery(searchQuery);
    } catch (err) {
      setError(USER_MESSAGES.search);
      console.error("Search fetch error", err);
      if (isFirstPage) setResolvedQuery(searchQuery);
    } finally {
      if (isFirstPage) setIsInitialLoading(false);
      else setIsLoadingMore(false);
    }
  }, []);

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
  }, [query, language, fetchPage]);

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

  return (
    <div className="apple-page">
      <div className="apple-container pb-12">
        <h1 className="apple-large-title mt-4 mb-6 text-text sm:mt-6 lg:text-left">
          {hasSearched ? t('search.resultsFor', { query }) : t('search.title')}
        </h1>

        {error && (
          <div className="apple-content-box mb-6 apple-footnote text-text/90">{error}</div>
        )}

        {showInitialEmpty && (
          <div className="apple-empty-state">
            <p className="apple-headline text-secondary">
              {t('search.hint')}
            </p>
          </div>
        )}

        {showNoResults && (
          <div className="apple-empty-state">
            <p className="apple-headline text-secondary">
              No results for <span className="text-text">{query}</span>
            </p>
            <p className="apple-footnote mt-2">Try different keywords or check the spelling.</p>
          </div>
        )}

        {data.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-5">
            {data.map((item) => (
              <div
                key={`${item.id}-${item.media_type}-search`}
                className="flex justify-center"
              >
                <Card
                  data={item}
                  trending={false}
                  media_type={item.media_type}
                />
              </div>
            ))}
          </div>
        )}

        <div ref={sentinelRef} className="h-px" aria-hidden="true" />

        {isInitialLoading && data.length === 0 && (
          <Loader size="lg" label={t('search.searching')} className="py-20" />
        )}

        <LoadMoreIndicator
          isLoading={isLoadingMore}
          label={t('loading.moreResults')}
        />

        {!isLoading && data.length > 0 && pageNo >= totalPageNo && (
          <div className="text-center py-8">
            <p className="apple-footnote">You&apos;ve reached the end of results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;