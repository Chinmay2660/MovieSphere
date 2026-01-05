import { useParams, useSearchParams } from "react-router-dom";
import axiosInstance from "../lib/axiosConfig";
import { useEffect, useState, useCallback } from "react";
import Card from "../components/Home/Card";
import { setImageURL, setGenres } from "../reduxStore/Reducer/movieSlice";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "../lib/utils";
import { IoFilter, IoClose } from "react-icons/io5";

const ExplorePage = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const [totalPageNo, setTotalPageNo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'popularity.desc');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
  
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

  const fetchGenres = async () => {
    try {
      const response = await axiosInstance.get(`/genre/${params.explore}/list`);
      dispatch(setGenres({ type: params.explore, genres: response.data.genres }));
    } catch (error) {
      console.error("Failed to fetch genres", error);
    }
  };

  const fetchData = async (currentPage, reset = false) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = {
        page: currentPage,
        sort_by: sortBy,
      };
      
      if (selectedGenre) {
        queryParams.with_genres = selectedGenre;
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

  const handleFilterChange = () => {
    setPageNo(1);
    setData([]);
    fetchData(1, true);
    
    // Update URL params
    const newParams = new URLSearchParams();
    if (sortBy !== 'popularity.desc') newParams.set('sort_by', sortBy);
    if (selectedGenre) newParams.set('genre', selectedGenre);
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSortBy('popularity.desc');
    setSelectedGenre('');
    setSearchParams({});
    setPageNo(1);
    setData([]);
    fetchData(1, true);
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
      fetchData(pageNo);
    }
  }, [pageNo]);

  useEffect(() => {
    setPageNo(1);
    setData([]);
    setSortBy('popularity.desc');
    setSelectedGenre('');
    fetchData(1, true);
  }, [params.explore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const getHeading = () => {
    const type = params.explore === 'tv' ? "TV Shows" : "Movies";
    const genreName = genres.find(g => g.id.toString() === selectedGenre)?.name;
    if (genreName) {
      return `${genreName} ${type}`;
    }
    return `Explore ${type}`;
  };

  const hasActiveFilters = sortBy !== 'popularity.desc' || selectedGenre;

  return (
    <div className="pt-16 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-10 mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold">{getHeading()}</h1>
          
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-neutral-400 hover:text-white transition-colors"
              >
                <IoClose className="w-4 h-4" />
                Clear Filters
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                showFilters || hasActiveFilters
                  ? 'bg-primary text-white'
                  : 'bg-neutral-800 text-white hover:bg-neutral-700'
              }`}
            >
              <IoFilter className="w-5 h-5" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-accent"></span>
              )}
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-neutral-800/50 rounded-xl p-6 mb-8 border border-neutral-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-neutral-700 text-white rounded-lg px-4 py-2.5 border border-neutral-600 focus:border-primary focus:outline-none transition-colors"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">
                  Genre
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full bg-neutral-700 text-white rounded-lg px-4 py-2.5 border border-neutral-600 focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Apply Button */}
              <div className="flex items-end">
                <button
                  onClick={handleFilterChange}
                  className="w-full bg-primary hover:bg-primary/80 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Genre Quick Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <button
            onClick={() => {
              setSelectedGenre('');
              handleFilterChange();
            }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !selectedGenre
                ? 'bg-primary text-white'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            All
          </button>
          {genres.slice(0, 10).map((genre) => (
            <button
              key={genre.id}
              onClick={() => {
                setSelectedGenre(genre.id.toString());
                setTimeout(() => handleFilterChange(), 0);
              }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedGenre === genre.id.toString()
                  ? 'bg-primary text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {error && (
          <div className="text-red-500 text-center mb-4 p-4 bg-red-500/10 rounded-lg">
            {error}
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
          {data.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex justify-center">
              <Card data={item} trending={false} media_type={params.explore} />
            </div>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* No Results */}
        {!loading && data.length === 0 && (
          <div className="text-center py-16">
            <p className="text-neutral-400 text-lg">No results found</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-primary hover:underline"
            >
              Clear filters and try again
            </button>
          </div>
        )}

        {/* End of Results */}
        {!loading && pageNo >= totalPageNo && data.length > 0 && (
          <div className="text-center py-8">
            <p className="text-neutral-500">You've reached the end</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
