import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../lib/axiosConfig";
import { setImageURL } from "../reduxStore/Reducer/movieSlice";
import { useDispatch, useSelector } from "react-redux";
import Card from "../components/Home/Card";
import { debounce, sanitizeSearchQuery } from "../lib/utils";

const getSearchQuery = (search) => {
  const q = new URLSearchParams(search).get("q");
  return q ? sanitizeSearchQuery(q) : "";
};

const SearchPage = () => {
  const location = useLocation();
  const query = getSearchQuery(location?.search || "");
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const [totalPageNo, setTotalPageNo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const imageURL = useSelector((state) => state.movieData.imageURL);

  const debouncedFetchData = useCallback(
    debounce(async (currentPage, searchQuery) => {
      if (!searchQuery) return;
      setLoading(true);
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
      } catch (err) {
        setError("Failed to load search results. Please try again.");
        console.error("Search fetch error", err);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
      pageNo < totalPageNo &&
      !loading &&
      query
    ) {
      setPageNo((prev) => prev + 1);
    }
  }, [pageNo, totalPageNo, loading, query]);

  const fetchConfigurationData = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/configuration");
      dispatch(
        setImageURL(response.data.images.secure_base_url + "original")
      );
    } catch (err) {
      console.error("Config fetch error", err);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!imageURL) fetchConfigurationData();
  }, [imageURL, fetchConfigurationData]);

  useEffect(() => {
    if (!query) {
      setData([]);
      setTotalPageNo(0);
      setError(null);
      setPageNo(1);
      return;
    }
    setPageNo(1);
    setData([]);
    debouncedFetchData(1, query);
  }, [query]);

  useEffect(() => {
    if (query && pageNo > 1) {
      debouncedFetchData(pageNo, query);
    }
  }, [pageNo]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const hasSearched = query.length > 0;
  const showNoResults =
    !loading && hasSearched && data.length === 0 && !error;
  const showInitialEmpty = !loading && !hasSearched && !error;

  return (
    <div className="pt-16 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h1 className="text-2xl font-bold text-white mt-10 mb-6 text-center lg:text-left">
          {hasSearched
            ? `Search results for "${query}"`
            : "Search"}
        </h1>

        {error && (
          <div className="text-center mb-6 p-4 bg-white/10 border border-white/20 rounded-lg text-white/90">
            {error}
          </div>
        )}

        {showInitialEmpty && (
          <div className="text-center py-16">
            <p className="text-white/70 text-lg">
              Try searching for a movie or TV show using the search icon above.
            </p>
          </div>
        )}

        {showNoResults && (
          <div className="text-center py-16">
            <p className="text-white/70 text-lg mb-2">
              No results found for <span className="text-white font-medium">"{query}"</span>
            </p>
            <p className="text-white/50 text-sm">
              Try different keywords or check the spelling.
            </p>
          </div>
        )}

        {data.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
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

        {loading && data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/30 border-t-white"></div>
            <p className="text-white/70 text-sm">Searching...</p>
          </div>
        )}

        {loading && data.length > 0 && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/30 border-t-white"></div>
          </div>
        )}

        {!loading && data.length > 0 && pageNo >= totalPageNo && (
          <div className="text-center py-8">
            <p className="text-white/50 text-sm">You&apos;ve reached the end of results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;