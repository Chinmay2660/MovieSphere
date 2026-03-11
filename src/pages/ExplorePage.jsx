import { useParams, useSearchParams } from "react-router-dom";
import axiosInstance from "../lib/axiosConfig";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Card from "../components/Home/Card";
import { setImageURL, setGenres } from "../reduxStore/Reducer/movieSlice";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "../lib/utils";
import { IoFilter, IoClose, IoChevronDown } from "react-icons/io5";

const ExplorePage = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const [totalPageNo, setTotalPageNo] = useState(0);
  const [loading, setLoading] = useState(false);
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
  const imageURL = useSelector((state) => state.movieData.imageURL);
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
    } catch (error) {
      console.error("Failed to fetch genres", error);
    }
  };

  const fetchData = async (currentPage, sortBy, genresArray, reset = false) => {
    setLoading(true);
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
    } catch (error) {
      setError("Failed to fetch data");
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = useCallback(
    debounce(() => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
      ) {
        if (pageNo < totalPageNo && !loading) {
          setPageNo((prev) => prev + 1);
        }
      }
    }, 700),
    [pageNo, totalPageNo, loading]
  );

  const fetchConfigurationData = async () => {
    try {
      const response = await axiosInstance.get('/configuration');
      dispatch(setImageURL(response.data.images.secure_base_url + "original"));
    } catch (error) {
      console.log("error", error);
    }
  };

  const applyFilters = () => {
    setAppliedSortBy(tempSortBy);
    setAppliedGenres([...tempGenres]);
    setPageNo(1);
    setData([]);
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
    
    const newParams = new URLSearchParams();
    if (appliedSortBy !== 'popularity.desc') newParams.set('sort_by', appliedSortBy);
    if (newGenres.length > 0) newParams.set('genres', newGenres.join(','));
    setSearchParams(newParams);
    
    fetchData(1, appliedSortBy, newGenres, true);
  };

  useEffect(() => {
    if (!imageURL) {
      fetchConfigurationData();
    }
  }, [imageURL]);

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
    setAppliedSortBy('popularity.desc');
    setAppliedGenres([]);
    setTempSortBy('popularity.desc');
    setTempGenres([]);
    fetchData(1, 'popularity.desc', [], true);
  }, [params.explore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const getHeading = () => {
    const type = params.explore === 'tv' ? "TV Shows" : "Movies";
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
    <div className="pt-16 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center gap-4 mt-10 mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate text-white">{getHeading()}</h1>
          
          <div className="relative flex-shrink-0" ref={filterRef}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg ${
                showFilters || hasActiveFilters
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              <IoFilter className="w-5 h-5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 text-xs font-bold bg-black text-white rounded-full">
                  {activeFilterCount}
                </span>
              )}
              <IoChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/20 bg-white/5 rounded-t-2xl">
                  <h3 className="font-semibold text-white text-sm">Filters</h3>
                  {(hasActiveFilters || hasPendingChanges) && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-white/70 hover:text-white transition-colors flex items-center gap-1"
                    >
                      <IoClose className="w-3.5 h-3.5" />
                      Clear
                    </button>
                  )}
                </div>

                <div className="p-4 space-y-4 overflow-visible">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">
                      Sort By
                    </label>
                    <div className="relative">
                      <select
                        value={tempSortBy}
                        onChange={(e) => setTempSortBy(e.target.value)}
                        className="w-full appearance-none bg-black/60 text-white text-sm rounded-lg px-4 py-2.5 pr-10 border border-white/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                      >
                        {sortOptions.map((option, optIdx) => (
                          <option key={option.value || `sort-${optIdx}`} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <IoChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
                    </div>
                  </div>

                  <div className="relative" ref={genreDropdownRef}>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">
                      Genres
                    </label>
                    <button
                      type="button"
                      onClick={() => setGenreDropdownOpen(!genreDropdownOpen)}
                      className="w-full flex items-center justify-between bg-black/60 text-white text-sm rounded-lg px-4 py-2.5 border border-white/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer text-left"
                    >
                      <span className={tempGenres.length > 0 ? 'text-white' : 'text-white/60'}>
                        {tempGenres.length === 0 
                          ? 'Select genres...' 
                          : tempGenres.length === 1
                            ? genres.find(g => g.id.toString() === tempGenres[0])?.name
                            : `${tempGenres.length} genres selected`
                        }
                      </span>
                      <IoChevronDown className={`w-4 h-4 text-white/60 transition-transform ${genreDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {genreDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-black/95 rounded-lg border border-white/20 shadow-2xl z-[60]">
                        <div className="max-h-56 overflow-y-auto py-2">
                          {genres.map((genre) => (
                            <label 
                              key={genre.id} 
                              className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors ${
                                tempGenres.includes(genre.id.toString()) 
                                  ? 'bg-white/20 text-white' 
                                  : 'hover:bg-white/10 text-white'
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
                                className="w-4 h-4 rounded border-white/30 text-primary bg-black/40 focus:ring-primary focus:ring-offset-0 cursor-pointer accent-primary"
                              />
                              <span className="text-sm">{genre.name}</span>
                            </label>
                          ))}
                        </div>
                        {tempGenres.length > 0 && (
                          <div className="px-3 py-2 border-t border-white/20">
                            <button
                              type="button"
                              onClick={() => setTempGenres([])}
                              className="text-xs text-white/70 hover:text-white transition-colors"
                            >
                              Clear all ({tempGenres.length})
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-white/20 bg-white/5 rounded-b-2xl">
                  <motion.button
                    onClick={applyFilters}
                    disabled={!hasPendingChanges}
                    whileHover={hasPendingChanges ? { scale: 1.1 } : undefined}
                    whileTap={hasPendingChanges ? { scale: 0.9 } : undefined}
                    className={`w-full font-medium py-2.5 px-4 rounded-xl shadow-lg transition-all duration-200 text-sm ${
                      hasPendingChanges
                        ? 'bg-white hover:bg-white/90 text-black active:scale-[0.98]'
                        : 'bg-white/10 text-white/50 cursor-not-allowed'
                    }`}
                  >
                    {hasPendingChanges ? 'Apply Filters' : 'No Changes'}
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <button
            onClick={() => handleGenreQuickFilter('')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              appliedGenres.length === 0
                ? 'bg-white text-black shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
            }`}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreQuickFilter(genre.id.toString())}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                appliedGenres.includes(genre.id.toString())
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-white/70 text-sm">Active:</span>
            {appliedSortBy !== 'popularity.desc' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white rounded-full text-sm border border-white/30">
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
              <span key={`genre-${String(genreId)}-${gIdx}`} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white rounded-full text-sm border border-white/30">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
          {data.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex justify-center">
              <Card data={item} trending={false} media_type={params.explore} />
            </div>
          ))}
        </div>
        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        {!loading && data.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/70 text-lg">No results found</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-white hover:underline"
            >
              Clear filters and try again
            </button>
          </div>
        )}
        {!loading && pageNo >= totalPageNo && data.length > 0 && (
          <div className="text-center py-8">
            <p className="text-white/50">You've reached the end</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
