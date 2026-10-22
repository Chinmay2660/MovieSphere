import { Navigate, useParams, useSearchParams } from "react-router-dom";
import axiosInstance from "../lib/axiosConfig";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Card from "../components/Home/Card";
import Loader from "../components/Reusables/Loader";
import MovieGrid from "../components/Reusables/MovieGrid";
import { setGenres } from "../reduxStore/Reducer/movieSlice";
import { useDispatch, useSelector } from "react-redux";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useLocale } from "../context/LocaleContext";
import ExploreFilterBar from "../components/Explore/ExploreFilterBar";
import {
  parseExploreFilters,
  filtersToSearchParams,
  buildDiscoverParams,
  exploreModalFiltersEqual,
} from "../lib/exploreFilters";

const ExplorePage = () => {
  const { t } = useLocale();
  const params = useParams();
  const isValidExplore = params.explore === "movie" || params.explore === "tv";
  const isTV = params.explore === 'tv';
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const [totalPageNo, setTotalPageNo] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  const appliedFilters = useMemo(
    () => parseExploreFilters(searchParams),
    [searchParams]
  );
  const [draftFilters, setDraftFilters] = useState(appliedFilters);

  const dispatch = useDispatch();
  const genres = useSelector((state) => state.movieData.genres[params.explore] || []);

  const fetchGenres = useCallback(async () => {
    if (!isValidExplore) return;
    try {
      const response = await axiosInstance.get(`/genre/${params.explore}/list`);
      dispatch(setGenres({ type: params.explore, genres: response.data.genres }));
    } catch {
      // Genre list is optional for explore filters
    }
  }, [dispatch, isValidExplore, params.explore]);

  const fetchData = useCallback(async (currentPage, nextFilters, reset = false) => {
    if (params.explore !== "movie" && params.explore !== "tv") return;
    const isFirstPage = currentPage === 1;
    if (isFirstPage) setIsInitialLoading(true);
    else setIsLoadingMore(true);
    setError(null);
    try {
      const queryParams = buildDiscoverParams(isTV, nextFilters, currentPage);
      const response = await axiosInstance.get(`/discover/${params.explore}`, {
        params: queryParams,
      });

      const results = response.data?.results ?? [];
      if (reset) {
        setData(results);
      } else {
        setData((prev) => [...prev, ...results]);
      }
      setTotalPageNo(response.data?.total_pages ?? 0);
    } catch {
      setError(t('explore.fetchError'));
    } finally {
      if (isFirstPage) setIsInitialLoading(false);
      else setIsLoadingMore(false);
    }
  }, [isTV, params.explore, t]);

  const applySort = useCallback(
    (sortBy) => {
      setSearchParams(filtersToSearchParams({ ...appliedFilters, sortBy }));
    },
    [appliedFilters, setSearchParams]
  );

  const commitModalFilters = useCallback(
    (modalDraft) => {
      setSearchParams(
        filtersToSearchParams({
          ...appliedFilters,
          genres: modalDraft.genres,
          year: modalDraft.year,
          minRating: modalDraft.minRating,
          language: modalDraft.language,
          country: modalDraft.country,
        })
      );
      setShowFilterSheet(false);
    },
    [appliedFilters, setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setShowFilterSheet(false);
    setSearchParams({});
  }, [setSearchParams]);

  const filtersKey = searchParams.toString();

  useEffect(() => {
    setDraftFilters((prev) => {
      if (showFilterSheet && !exploreModalFiltersEqual(prev, appliedFilters)) {
        return { ...prev, sortBy: appliedFilters.sortBy };
      }
      return appliedFilters;
    });
  }, [filtersKey, params.explore, appliedFilters, showFilterSheet]);
  const prevExploreRef = useRef(params.explore);

  const hasMore = totalPageNo > 0 && pageNo < totalPageNo;
  const isLoading = isInitialLoading || isLoadingMore;

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setPageNo((prev) => prev + 1);
    }
  }, [hasMore, isLoading]);

  const sentinelRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading,
  });

  useEffect(() => {
    if (genres.length === 0) {
      fetchGenres();
    }
  }, [params.explore, genres.length, fetchGenres]);

  useEffect(() => {
    if (prevExploreRef.current !== params.explore) {
      prevExploreRef.current = params.explore;
      setSearchParams({});
      setShowFilterSheet(false);
    }
  }, [params.explore, setSearchParams]);

  useEffect(() => {
    setPageNo(1);
    setData([]);
    setTotalPageNo(0);
    fetchData(1, appliedFilters, true);
  }, [params.explore, filtersKey, fetchData, appliedFilters]);

  useEffect(() => {
    if (pageNo > 1) {
      fetchData(pageNo, appliedFilters);
    }
  }, [pageNo, fetchData, appliedFilters]);

  const getHeading = () => {
    const type = isTV ? t('nav.series') : t('nav.movies');
    if (appliedFilters.genres.length === 1) {
      const genreName = genres.find((g) => g.id.toString() === appliedFilters.genres[0])?.name;
      if (genreName) return `${genreName} · ${type}`;
    }
    if (appliedFilters.genres.length > 1) {
      return t('explore.multiGenreTitle', { count: appliedFilters.genres.length, type });
    }
    return t('explore.title', { type });
  };

  if (!isValidExplore) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="apple-page">
      <div className="apple-container page-content-footer">
        <header className="apple-section-header mt-2 sm:mt-4">
          <h1 className="apple-large-title text-text">{getHeading()}</h1>
          <p className="apple-subheadline mt-2 max-w-2xl">{t('explore.subtitle')}</p>
        </header>

        <ExploreFilterBar
          isTV={isTV}
          genres={genres}
          draftFilters={draftFilters}
          appliedFilters={appliedFilters}
          onDraftChange={setDraftFilters}
          onSortChange={applySort}
          onApply={commitModalFilters}
          onClear={clearFilters}
          showSheet={showFilterSheet}
          onToggleSheet={() => {
            setShowFilterSheet((open) => {
              if (!open) setDraftFilters(appliedFilters);
              return !open;
            });
          }}
          onCloseSheet={() => setShowFilterSheet(false)}
        />

        {error && (
          <div className="apple-content-box mb-6 apple-footnote text-text/90">{error}</div>
        )}
        <MovieGrid>
          {data.map((item, index) => (
            <div key={`${item.id}-${index}`} className="movie-grid-item">
              <Card data={item} trending={false} media_type={params.explore} />
            </div>
          ))}
        </MovieGrid>
        <div ref={sentinelRef} className="h-px" aria-hidden="true" />
        {isInitialLoading && data.length === 0 && (
          <Loader
            size="lg"
            label={isTV ? t('loading.webSeries') : t('loading.movies')}
            className="py-20"
          />
        )}
        {isLoadingMore && (
          <Loader
            label={isTV ? t('loading.moreWebSeries') : t('loading.moreMovies')}
            className="py-8"
          />
        )}
        {!isLoading && data.length === 0 && !error && (
          <div className="apple-empty-state">
            <p className="apple-headline text-secondary">{t('explore.noResults')}</p>
            <button
              type="button"
              onClick={clearFilters}
              className="btn-ghost mt-5 px-5"
            >
              {t('explore.clearAndRetry')}
            </button>
          </div>
        )}
        {!isLoading && pageNo >= totalPageNo && data.length > 0 && (
          <div className="text-center py-8">
            <p className="apple-footnote">{t('explore.end')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
