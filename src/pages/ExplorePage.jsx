import { useParams, useSearchParams } from "react-router-dom";
import axiosInstance from "../lib/axiosConfig";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Card from "../components/Home/Card";
import Loader from "../components/Reusables/Loader";
import { setGenres } from "../reduxStore/Reducer/movieSlice";
import { useDispatch, useSelector } from "react-redux";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { IoFilter, IoClose, IoChevronDown } from "react-icons/io5";
import { useLocale } from "../context/LocaleContext";

const ExplorePage = () => {
  const { t } = useLocale();
  const params = useParams();
  const isTV = params.explore === 'tv';
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const [totalPageNo, setTotalPageNo] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [appliedSortBy, setAppliedSortBy] = useState(searchParams.get('sort_by') || 'popularity.desc');
  const [appliedGenres, setAppliedGenres] = useState(() => {
    const genreParam = searchParams.get('genres');
    return genreParam ? genreParam.split(',') : [];
  });
  
  const [tempSortBy, setTempSortBy] = useState(appliedSortBy);
  const [tempGenres, setTempGenres] = useState(appliedGenres);
  
  const filterRef = useRef(null);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const genreDropdownRef = useRef(null);
  
  const dispatch = useDispatch();
  const genres = useSelector((state) => state.movieData.genres[params.explore] || []);

  const sortOptions = [
    { value: 'popularity.desc', label: 'Most Popular' },
    { value: 'popularity.asc', label: 'Least Popular' },
    { value: 'vote_average.desc', label: 'Highest Rated' },
    { value: 'vote_average.asc', label: 'Lowest Rated' },
    { value: 'primary_release_date.desc', label: 'Newest First' },
    { value: 'primary_release_date.asc', label: 'Oldest First' },
    { value: 'revenue.desc', label: 'Highest Revenue' },
  ];

  useEffect(() => {
    if (showFilters) {
      setTempSortBy(appliedSortBy);
      setTempGenres([...appliedGenres]);
    }
  }, [showFilters, appliedSortBy, appliedGenres]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
        setGenreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target)) {
        setGenreDropdownOpen(false);
      }
    };
    if (genreDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [genreDropdownOpen]);

  const fetchGenres = async () => {
    try {
      const response = await axiosInstance.get(`/genre/${params.explore}/list`);
      dispatch(setGenres({ type: params.explore, genres: response.data.genres }));
    } catch {
      // Genre list is optional for explore filters
    }
  };

  const fetchData = async (currentPage, sortBy, genresArray, reset = false) => {
    const isFirstPage = currentPage === 1;
    if (isFirstPage) setIsInitialLoading(true);
    else setIsLoadingMore(true);
    setError(null);
    try {
      const queryParams = {
        page: currentPage,
        sort_by: sortBy,
      };
      
      if (genresArray && genresArray.length > 0) {
        queryParams.with_genres = genresArray.join(',');
      }

      const response = await axiosInstance.get(`/discover/${params.explore}`, {
        params: queryParams,
      });
      
      if (reset) {
        setData(response.data.results);
      } else {
        setData((prev) => [...prev, ...response.data.results]);
      }
      setTotalPageNo(response.data.total_pages);
    } catch {
      setError("Failed to fetch data");
    } finally {
      if (isFirstPage) setIsInitialLoading(false);
      else setIsLoadingMore(false);
    }
  };

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

  const applyFilters = () => {
    setAppliedSortBy(tempSortBy);
    setAppliedGenres([...tempGenres]);
    setPageNo(1);
    setData([]);
    setTotalPageNo(0);
    fetchData(1, tempSortBy, tempGenres, true);
    setShowFilters(false);
    setGenreDropdownOpen(false);
    
    const newParams = new URLSearchParams();
    if (tempSortBy !== 'popularity.desc') newParams.set('sort_by', tempSortBy);
    if (tempGenres.length > 0) newParams.set('genres', tempGenres.join(','));
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setTempSortBy('popularity.desc');
    setTempGenres([]);
    setAppliedSortBy('popularity.desc');
    setAppliedGenres([]);
    setSearchParams({});
    setPageNo(1);
    setData([]);
    setTotalPageNo(0);
    fetchData(1, 'popularity.desc', [], true);
    setShowFilters(false);
    setGenreDropdownOpen(false);
  };

  const handleGenreQuickFilter = (genreId) => {
    let newGenres;
    if (!genreId) {
      newGenres = [];
    } else if (appliedGenres.includes(genreId)) {
      newGenres = appliedGenres.filter(g => g !== genreId);
    } else {
      newGenres = [...appliedGenres, genreId];
    }
    
    setAppliedGenres(newGenres);
    setTempGenres(newGenres);
    setPageNo(1);
    setData([]);
    setTotalPageNo(0);
    
    const newParams = new URLSearchParams();
    if (appliedSortBy !== 'popularity.desc') newParams.set('sort_by', appliedSortBy);
    if (newGenres.length > 0) newParams.set('genres', newGenres.join(','));
    setSearchParams(newParams);
    
    fetchData(1, appliedSortBy, newGenres, true);
  };

  const removeAppliedSort = () => {
    setAppliedSortBy('popularity.desc');
    setTempSortBy('popularity.desc');
    setPageNo(1);
    setData([]);
    setTotalPageNo(0);
    
    const newParams = new URLSearchParams();
    if (appliedGenres.length > 0) newParams.set('genres', appliedGenres.join(','));
    setSearchParams(newParams);
    
    fetchData(1, 'popularity.desc', appliedGenres, true);
  };

  const removeAppliedGenre = (genreId) => {
    const newGenres = appliedGenres.filter(g => g !== genreId);
    setAppliedGenres(newGenres);
    setTempGenres(newGenres);
    setPageNo(1);
    setData([]);
    setTotalPageNo(0);
    
    const newParams = new URLSearchParams();
    if (appliedSortBy !== 'popularity.desc') newParams.set('sort_by', appliedSortBy);
    if (newGenres.length > 0) newParams.set('genres', newGenres.join(','));
    setSearchParams(newParams);
    
    fetchData(1, appliedSortBy, newGenres, true);
  };

  useEffect(() => {
    if (genres.length === 0) {
      fetchGenres();
    }
  }, [params.explore]);

  useEffect(() => {
    if (pageNo !== 1) {
      fetchData(pageNo, appliedSortBy, appliedGenres);
    }
  }, [pageNo]);

  useEffect(() => {
    setPageNo(1);
    setData([]);
    setTotalPageNo(0);
    setAppliedSortBy('popularity.desc');
    setAppliedGenres([]);
    setTempSortBy('popularity.desc');
    setTempGenres([]);
    fetchData(1, 'popularity.desc', [], true);
  }, [params.explore]);

  const getHeading = () => {
    const type = params.explore === 'tv' ? t('nav.series') : t('nav.movies');
    if (appliedGenres.length === 1) {
      const genreName = genres.find(g => g.id.toString() === appliedGenres[0])?.name;
      if (genreName) return `${genreName} ${type}`;
    } else if (appliedGenres.length > 1) {
      return `${appliedGenres.length} Genres - ${type}`;
    }
    return `Explore ${type}`;
  };

  const hasActiveFilters = appliedSortBy !== 'popularity.desc' || appliedGenres.length > 0;
  const hasPendingChanges = tempSortBy !== appliedSortBy || 
    tempGenres.length !== appliedGenres.length || 
    !tempGenres.every(g => appliedGenres.includes(g));
  const activeFilterCount = (appliedSortBy !== 'popularity.desc' ? 1 : 0) + appliedGenres.length;

  return (
    <div className="apple-page">
      <div className="apple-container">
        <header className="apple-section-header mt-4 flex flex-row items-start justify-between gap-4 sm:mt-6">
          <h1 className="apple-large-title min-w-0 flex-1 text-text">{getHeading()}</h1>
          
          <div className="relative flex-shrink-0" ref={filterRef}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg ${
                showFilters || hasActiveFilters
                  ? 'bg-primary text-primary-fg shadow-lg shadow-primary/25'
                  : 'bg-surface-elevated backdrop-blur-sm text-text hover:bg-surface-elevated border border-accent/20'
              }`}
            >
              <IoFilter className="w-5 h-5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 text-xs font-bold bg-surface text-text rounded-full">
                  {activeFilterCount}
                </span>
              )}
              <IoChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {showFilters && (
              <>
                <div
                  className="fixed inset-0 bg-surface-elevated z-40 md:hidden"
                  onClick={() => setShowFilters(false)}
                  aria-hidden
                />
                <div className="fixed inset-x-0 bottom-0 z-50 md:absolute md:inset-x-auto md:right-0 md:top-full md:bottom-auto md:mt-2 w-full md:w-72 max-w-none md:max-w-[calc(100vw-2rem)] bg-surface backdrop-blur-xl rounded-t-2xl md:rounded-2xl shadow-2xl border border-accent/20 max-h-[85dvh] md:max-h-none overflow-y-auto pb-[env(safe-area-inset-bottom)]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-accent/20 bg-surface-elevated rounded-t-2xl">
                  <h3 className="font-semibold text-text text-sm">Filters</h3>
                  {(hasActiveFilters || hasPendingChanges) && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-secondary hover:text-text transition-colors flex items-center gap-1"
                    >
                      <IoClose className="w-3.5 h-3.5" />
                      Clear
                    </button>
                  )}
                </div>

                <div className="p-4 space-y-4 overflow-visible">
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">
                      Sort By
                    </label>
                    <div className="relative">
                      <select
                        value={tempSortBy}
                        onChange={(e) => setTempSortBy(e.target.value)}
                        className="w-full appearance-none bg-surface-elevated text-text text-sm rounded-lg px-4 py-2.5 pr-10 border border-accent/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                      >
                        {sortOptions.map((option, optIdx) => (
                          <option key={option.value || `sort-${optIdx}`} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <IoChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                    </div>
                  </div>

                  <div className="relative" ref={genreDropdownRef}>
                    <label className="block text-xs font-medium text-muted mb-1.5">
                      Genres
                    </label>
                    <button
                      type="button"
                      onClick={() => setGenreDropdownOpen(!genreDropdownOpen)}
                      className="w-full flex items-center justify-between bg-surface-elevated text-text text-sm rounded-lg px-4 py-2.5 border border-accent/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer text-left"
                    >
                      <span className={tempGenres.length > 0 ? 'text-text' : 'text-muted'}>
                        {tempGenres.length === 0 
                          ? 'Select genres...' 
                          : tempGenres.length === 1
                            ? genres.find(g => g.id.toString() === tempGenres[0])?.name
                            : `${tempGenres.length} genres selected`
                        }
                      </span>
                      <IoChevronDown className={`w-4 h-4 text-muted transition-transform ${genreDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {genreDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-surface rounded-lg border border-accent/20 shadow-2xl z-[60]">
                        <div className="max-h-56 overflow-y-auto py-2">
                          {genres.map((genre) => (
                            <label 
                              key={genre.id} 
                              className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors ${
                                tempGenres.includes(genre.id.toString()) 
                                  ? 'bg-surface-elevated text-text' 
                                  : 'hover:bg-surface-elevated text-text'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={tempGenres.includes(genre.id.toString())}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setTempGenres([...tempGenres, genre.id.toString()]);
                                  } else {
                                    setTempGenres(tempGenres.filter(g => g !== genre.id.toString()));
                                  }
                                }}
                                className="w-4 h-4 rounded border-accent/30 text-primary bg-surface focus:ring-primary focus:ring-offset-0 cursor-pointer accent-primary"
                              />
                              <span className="text-sm">{genre.name}</span>
                            </label>
                          ))}
                        </div>
                        {tempGenres.length > 0 && (
                          <div className="px-3 py-2 border-t border-accent/20">
                            <button
                              type="button"
                              onClick={() => setTempGenres([])}
                              className="text-xs text-secondary hover:text-text transition-colors"
                            >
                              Clear all ({tempGenres.length})
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-accent/20 bg-surface-elevated rounded-b-2xl">
                  <motion.button
                    onClick={applyFilters}
                    disabled={!hasPendingChanges}
                    whileHover={hasPendingChanges ? { scale: 1.1 } : undefined}
                    whileTap={hasPendingChanges ? { scale: 0.9 } : undefined}
                    className={`w-full font-medium py-2.5 px-4 rounded-xl shadow-lg transition-all duration-200 text-sm ${
                      hasPendingChanges
                        ? 'btn-primary active:scale-[0.98]'
                        : 'bg-surface-elevated text-muted cursor-not-allowed'
                    }`}
                  >
                    {hasPendingChanges ? 'Apply Filters' : 'No Changes'}
                  </motion.button>
                </div>
                </div>
              </>
            )}
          </div>
        </header>
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleGenreQuickFilter('')}
            className={`apple-chip shrink-0 transition-all ${
              appliedGenres.length === 0
                ? 'bg-primary text-primary-fg'
                : ''
            }`}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreQuickFilter(genre.id.toString())}
              className={`apple-chip shrink-0 transition-all ${
                appliedGenres.includes(genre.id.toString())
                  ? 'bg-primary text-primary-fg'
                  : ''
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-secondary text-sm">Active:</span>
            {appliedSortBy !== 'popularity.desc' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-elevated text-text rounded-full text-sm border border-accent/30">
                {sortOptions.find(o => o.value === appliedSortBy)?.label}
                <button 
                  onClick={removeAppliedSort}
                  className="hover:bg-primary/30 rounded-full p-0.5 transition-colors"
                >
                  <IoClose className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {appliedGenres.map((genreId, gIdx) => (
              <span key={`genre-${String(genreId)}-${gIdx}`} className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-elevated text-text rounded-full text-sm border border-accent/30">
                {genres.find(g => g.id.toString() === genreId)?.name}
                <button 
                  onClick={() => removeAppliedGenre(genreId)}
                  className="hover:bg-primary/30 rounded-full p-0.5 transition-colors"
                >
                  <IoClose className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {error && (
          <div className="text-tertiary text-center mb-4 p-4 bg-tertiary/10 rounded-lg">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-5 xl:grid-cols-6">
          {data.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex justify-center">
              <Card data={item} trending={false} media_type={params.explore} />
            </div>
          ))}
        </div>
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
        {!isLoading && data.length === 0 && (
          <div className="text-center py-16">
            <p className="text-secondary text-lg">No results found</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-text hover:underline"
            >
              Clear filters and try again
            </button>
          </div>
        )}
        {!isLoading && pageNo >= totalPageNo && data.length > 0 && (
          <div className="text-center py-8">
            <p className="text-muted">You've reached the end</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
