import { IoClose, IoChevronDown, IoChevronBack, IoChevronForward, IoServer, IoLanguage } from "react-icons/io5";
import { useEffect, useState } from "react";

// Video source providers - some have better multi-language support
const VIDEO_SOURCES = [
  { 
    id: 'vidsrc_cc', 
    name: 'VidSrc', 
    icon: '🎬',
    getMovieUrl: (id) => `https://vidsrc.cc/v2/embed/movie/${id}`,
    getTvUrl: (id, season, episode) => `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}`,
  },
  { 
    id: 'vidsrc_to', 
    name: 'VidSrc Pro', 
    icon: '🎥',
    getMovieUrl: (id) => `https://vidsrc.to/embed/movie/${id}`,
    getTvUrl: (id, season, episode) => `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`,
  },
  { 
    id: 'embed_su', 
    name: 'MultiLang', 
    icon: '🌐',
    badge: 'Hindi+',
    getMovieUrl: (id) => `https://embed.su/embed/movie/${id}`,
    getTvUrl: (id, season, episode) => `https://embed.su/embed/tv/${id}/${season}/${episode}`,
  },
  { 
    id: 'autoembed', 
    name: 'AutoEmbed', 
    icon: '🎞️',
    getMovieUrl: (id) => `https://player.autoembed.cc/embed/movie/${id}`,
    getTvUrl: (id, season, episode) => `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`,
  },
  { 
    id: 'moviesapi', 
    name: 'MoviesAPI', 
    icon: '📺',
    getMovieUrl: (id) => `https://moviesapi.club/movie/${id}`,
    getTvUrl: (id, season, episode) => `https://moviesapi.club/tv/${id}-${season}-${episode}`,
  },
  { 
    id: 'multiembed', 
    name: 'Multi Embed', 
    icon: '🎭',
    badge: 'Subs',
    getMovieUrl: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    getTvUrl: (id, season, episode) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`,
  },
];

const VideoPlay = ({ 
    playVideoId, 
    close, 
    media_type, 
    seasons = [],
    initialSeason = 1,
    initialEpisode = 1 
}) => {
    const [selectedSeason, setSelectedSeason] = useState(initialSeason);
    const [selectedEpisode, setSelectedEpisode] = useState(initialEpisode);
    const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
    const [showEpisodeDropdown, setShowEpisodeDropdown] = useState(false);
    const [showSourceDropdown, setShowSourceDropdown] = useState(false);
    const [episodeCount, setEpisodeCount] = useState(1);
    const [videoKey, setVideoKey] = useState(0);
    const [selectedSource, setSelectedSource] = useState(VIDEO_SOURCES[0]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (seasons && seasons.length > 0) {
            const season = seasons.find(s => s.season_number === selectedSeason);
            if (season) {
                setEpisodeCount(season.episode_count || 1);
            }
        }
    }, [selectedSeason, seasons]);

    useEffect(() => {
        setVideoKey(prev => prev + 1);
        setIsLoading(true);
    }, [selectedSeason, selectedEpisode, selectedSource]);

    const getVideoSrc = () => {
        if (media_type === "tv") {
            return selectedSource.getTvUrl(playVideoId, selectedSeason, selectedEpisode);
        } else {
            return selectedSource.getMovieUrl(playVideoId);
        }
    };

    const validSeasons = seasons?.filter(s => s.season_number > 0) || [];
    const episodes = Array.from({ length: episodeCount }, (_, i) => i + 1);

    const handlePrevEpisode = () => {
        if (selectedEpisode > 1) {
            setSelectedEpisode(prev => prev - 1);
        } else if (selectedSeason > 1) {
            const prevSeason = validSeasons.find(s => s.season_number === selectedSeason - 1);
            if (prevSeason) {
                setSelectedSeason(selectedSeason - 1);
                setSelectedEpisode(prevSeason.episode_count || 1);
            }
        }
    };

    const handleNextEpisode = () => {
        if (selectedEpisode < episodeCount) {
            setSelectedEpisode(prev => prev + 1);
        } else {
            const nextSeason = validSeasons.find(s => s.season_number === selectedSeason + 1);
            if (nextSeason) {
                setSelectedSeason(selectedSeason + 1);
                setSelectedEpisode(1);
            }
        }
    };

    const closeAllDropdowns = () => {
        setShowSeasonDropdown(false);
        setShowEpisodeDropdown(false);
        setShowSourceDropdown(false);
    };

    const canGoPrev = selectedEpisode > 1 || selectedSeason > 1;
    const canGoNext = selectedEpisode < episodeCount || validSeasons.some(s => s.season_number === selectedSeason + 1);

    return (
        <section 
            className="fixed bg-black/90 backdrop-blur-md top-0 right-0 bottom-0 left-0 z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) close();
                closeAllDropdowns();
            }}
        >
            <div className="w-full max-w-6xl bg-neutral-900 rounded-xl overflow-hidden shadow-2xl max-h-[95vh] flex flex-col">
                {/* Header with controls */}
                <div className="flex items-center justify-between p-3 sm:p-4 bg-neutral-800 border-b border-neutral-700 flex-shrink-0">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <h3 className="text-white font-semibold text-sm sm:text-base">
                            {media_type === "tv" ? "📺 Watch" : "🎬 Watch"}
                        </h3>
                        
                        {/* Season/Episode selectors for TV shows */}
                        {media_type === "tv" && validSeasons.length > 0 && (
                            <>
                                {/* Season Selector */}
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowSeasonDropdown(!showSeasonDropdown);
                                            setShowEpisodeDropdown(false);
                                            setShowSourceDropdown(false);
                                        }}
                                        className="flex items-center gap-1 bg-neutral-700 hover:bg-neutral-600 px-3 py-1.5 rounded-lg text-white text-xs sm:text-sm transition-colors"
                                    >
                                        S{selectedSeason}
                                        <IoChevronDown className={`transition-transform ${showSeasonDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                    {showSeasonDropdown && (
                                        <div className="absolute top-full left-0 mt-2 bg-neutral-800 rounded-lg shadow-xl max-h-60 overflow-y-auto z-20 min-w-[130px] border border-neutral-700">
                                            {validSeasons.map((season) => (
                                                <button
                                                    key={season.season_number}
                                                    onClick={() => {
                                                        setSelectedSeason(season.season_number);
                                                        setSelectedEpisode(1);
                                                        setShowSeasonDropdown(false);
                                                    }}
                                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 transition-colors ${
                                                        selectedSeason === season.season_number ? 'bg-primary text-white' : 'text-neutral-300'
                                                    }`}
                                                >
                                                    Season {season.season_number}
                                                    <span className="text-neutral-500 text-xs ml-1">({season.episode_count})</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Episode Selector */}
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowEpisodeDropdown(!showEpisodeDropdown);
                                            setShowSeasonDropdown(false);
                                            setShowSourceDropdown(false);
                                        }}
                                        className="flex items-center gap-1 bg-neutral-700 hover:bg-neutral-600 px-3 py-1.5 rounded-lg text-white text-xs sm:text-sm transition-colors"
                                    >
                                        E{selectedEpisode}
                                        <IoChevronDown className={`transition-transform ${showEpisodeDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                    {showEpisodeDropdown && (
                                        <div className="absolute top-full left-0 mt-2 bg-neutral-800 rounded-lg shadow-xl max-h-60 overflow-y-auto z-20 min-w-[120px] border border-neutral-700">
                                            {episodes.map((ep) => (
                                                <button
                                                    key={ep}
                                                    onClick={() => {
                                                        setSelectedEpisode(ep);
                                                        setShowEpisodeDropdown(false);
                                                    }}
                                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 transition-colors ${
                                                        selectedEpisode === ep ? 'bg-primary text-white' : 'text-neutral-300'
                                                    }`}
                                                >
                                                    Episode {ep}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Source Selector */}
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowSourceDropdown(!showSourceDropdown);
                                    setShowSeasonDropdown(false);
                                    setShowEpisodeDropdown(false);
                                }}
                                className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-3 py-1.5 rounded-lg text-white text-xs sm:text-sm transition-all"
                            >
                                <IoServer className="w-4 h-4" />
                                <span className="hidden sm:inline">{selectedSource.icon} {selectedSource.name}</span>
                                <span className="sm:hidden">{selectedSource.icon}</span>
                                <IoChevronDown className={`transition-transform ${showSourceDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            {showSourceDropdown && (
                                <div className="absolute top-full right-0 sm:left-0 mt-2 bg-neutral-800 rounded-lg shadow-xl z-20 min-w-[180px] border border-neutral-700 overflow-hidden">
                                    <div className="px-3 py-2 bg-neutral-700/50 border-b border-neutral-700">
                                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                                            <IoLanguage className="w-4 h-4" />
                                            <span>Switch source for different languages</span>
                                        </div>
                                    </div>
                                    {VIDEO_SOURCES.map((source) => (
                                        <button
                                            key={source.id}
                                            onClick={() => {
                                                setSelectedSource(source);
                                                setShowSourceDropdown(false);
                                            }}
                                            className={`w-full text-left px-3 py-2.5 text-sm hover:bg-neutral-700 transition-colors flex items-center justify-between ${
                                                selectedSource.id === source.id ? 'bg-primary text-white' : 'text-neutral-300'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>{source.icon}</span>
                                                <span>{source.name}</span>
                                            </span>
                                            {source.badge && (
                                                <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                                                    {source.badge}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <button 
                        className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                        onClick={close}
                    >
                        <IoClose className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                {/* Video Player */}
                <div className="aspect-video bg-black flex-1 min-h-0 relative">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    )}
                    <iframe
                        key={videoKey}
                        title="video"
                        src={getVideoSrc()}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        allowFullScreen
                        onLoad={() => setIsLoading(false)}
                    />
                </div>

                {/* Footer with Navigation & Info */}
                <div className="p-3 sm:p-4 bg-neutral-800 border-t border-neutral-700 flex-shrink-0">
                    {media_type === "tv" ? (
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handlePrevEpisode}
                                disabled={!canGoPrev}
                                className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-xs sm:text-sm transition-colors"
                            >
                                <IoChevronBack className="w-4 h-4" />
                                <span className="hidden sm:inline">Previous</span>
                            </button>
                            
                            <div className="text-center">
                                <span className="text-white font-medium text-sm sm:text-base">
                                    S{selectedSeason} E{selectedEpisode}
                                </span>
                                <p className="text-neutral-500 text-xs">
                                    {episodeCount} episodes • Try different sources for Hindi/other languages
                                </p>
                            </div>
                            
                            <button
                                onClick={handleNextEpisode}
                                disabled={!canGoNext}
                                className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-xs sm:text-sm transition-colors"
                            >
                                <span className="hidden sm:inline">Next</span>
                                <IoChevronForward className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-neutral-400 text-sm">
                                💡 <span className="text-neutral-300">Tip:</span> Try different sources above for Hindi/dubbed versions or subtitles
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default VideoPlay;
