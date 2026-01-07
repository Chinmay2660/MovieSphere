import { IoClose, IoChevronDown, IoChevronBack, IoChevronForward, IoServer, IoLanguage, IoExpand, IoContract, IoEye, IoEyeOff } from "react-icons/io5";
import { useEffect, useState, useRef } from "react";

// Video source providers - ordered by ad-friendliness & quality
const VIDEO_SOURCES = [
  { 
    id: 'autoembed', 
    name: 'AutoEmbed', 
    icon: '🎞️',
    badge: 'Clean',
    getMovieUrl: (id) => `https://player.autoembed.cc/embed/movie/${id}`,
    getTvUrl: (id, season, episode) => `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`,
  },
  { 
    id: 'vidsrc_xyz', 
    name: 'VidSrc Pro', 
    icon: '⭐',
    badge: 'HD',
    getMovieUrl: (id) => `https://vidsrc.xyz/embed/movie/${id}`,
    getTvUrl: (id, season, episode) => `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}`,
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
    id: 'vidsrc_cc', 
    name: 'VidSrc', 
    icon: '🎬',
    getMovieUrl: (id) => `https://vidsrc.cc/v2/embed/movie/${id}`,
    getTvUrl: (id, season, episode) => `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}`,
  },
  { 
    id: 'vidsrc_to', 
    name: 'VidSrc Alt', 
    icon: '🎥',
    getMovieUrl: (id) => `https://vidsrc.to/embed/movie/${id}`,
    getTvUrl: (id, season, episode) => `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`,
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
  { 
    id: '2embed', 
    name: '2Embed', 
    icon: '🔷',
    getMovieUrl: (id) => `https://www.2embed.cc/embed/${id}`,
    getTvUrl: (id, season, episode) => `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`,
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
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const containerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);

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

    // Fullscreen handling
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && !document.fullscreenElement) {
                close();
            }
            if (e.key === 'f' || e.key === 'F') {
                toggleFullscreen();
            }
            if (e.key === 't' || e.key === 'T') {
                setIsTheaterMode(prev => !prev);
            }
            if (e.key === 'ArrowRight' && media_type === 'tv') {
                handleNextEpisode();
            }
            if (e.key === 'ArrowLeft' && media_type === 'tv') {
                handlePrevEpisode();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedEpisode, episodeCount, selectedSeason]);

    // Auto-hide controls
    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
            if (!showSeasonDropdown && !showEpisodeDropdown && !showSourceDropdown) {
                setShowControls(false);
            }
        }, 3000);
    };

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await containerRef.current?.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.error('Fullscreen error:', err);
        }
    };

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
            className="fixed inset-0 z-50 bg-black"
            onClick={(e) => {
                if (e.target === e.currentTarget) close();
                closeAllDropdowns();
            }}
        >
            <div 
                ref={containerRef}
                className={`relative w-full h-full flex flex-col ${isTheaterMode ? 'bg-black' : ''}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => !showSeasonDropdown && !showEpisodeDropdown && !showSourceDropdown && setShowControls(false)}
            >
                {/* Top Controls Bar */}
                <div 
                    className={`absolute top-0 left-0 right-0 z-20 transition-all duration-300 ${
                        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
                    }`}
                >
                    <div className="bg-gradient-to-b from-black/90 via-black/60 to-transparent p-4 pb-8">
                        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
                            {/* Left Controls */}
                            <div className="flex items-center gap-2 sm:gap-3">
                                {/* Close Button */}
                                <button 
                                    onClick={close}
                                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
                                    title="Close (Esc)"
                                >
                                    <IoClose className="w-6 h-6" />
                </button>

                                <div className="h-6 w-px bg-white/20 hidden sm:block"></div>

                                {/* Title */}
                                <div className="hidden sm:block">
                                    <span className="text-white font-medium">
                                        {media_type === "tv" ? `S${selectedSeason} E${selectedEpisode}` : "Now Playing"}
                                    </span>
                                </div>
                            </div>

                            {/* Center Controls - Season/Episode */}
                            <div className="flex items-center gap-2">
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
                                                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg text-white text-sm transition-all border border-white/10"
                                            >
                                                <span>Season {selectedSeason}</span>
                                                <IoChevronDown className={`w-4 h-4 transition-transform ${showSeasonDropdown ? 'rotate-180' : ''}`} />
                                            </button>
                                            {showSeasonDropdown && (
                                                <div className="absolute top-full left-0 mt-2 bg-neutral-900/95 backdrop-blur-xl rounded-xl shadow-2xl max-h-64 overflow-y-auto z-30 min-w-[160px] border border-white/10">
                                                    {validSeasons.map((season) => (
                                                        <button
                                                            key={season.season_number}
                                                            onClick={() => {
                                                                setSelectedSeason(season.season_number);
                                                                setSelectedEpisode(1);
                                                                setShowSeasonDropdown(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors flex items-center justify-between ${
                                                                selectedSeason === season.season_number ? 'bg-primary text-white' : 'text-white/80'
                                                            }`}
                                                        >
                                                            <span>Season {season.season_number}</span>
                                                            <span className="text-white/50 text-xs">{season.episode_count} ep</span>
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
                                                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg text-white text-sm transition-all border border-white/10"
                                            >
                                                <span>Episode {selectedEpisode}</span>
                                                <IoChevronDown className={`w-4 h-4 transition-transform ${showEpisodeDropdown ? 'rotate-180' : ''}`} />
                                            </button>
                                            {showEpisodeDropdown && (
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-neutral-900/95 backdrop-blur-xl rounded-xl shadow-2xl max-h-64 overflow-y-auto z-30 min-w-[140px] border border-white/10">
                                                    {episodes.map((ep) => (
                                                        <button
                                                            key={ep}
                                                            onClick={() => {
                                                                setSelectedEpisode(ep);
                                                                setShowEpisodeDropdown(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 transition-colors ${
                                                                selectedEpisode === ep ? 'bg-primary text-white' : 'text-white/80'
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
                                        className="flex items-center gap-1.5 bg-gradient-to-r from-primary/80 to-red-500/80 hover:from-primary hover:to-red-500 backdrop-blur-sm px-3 py-2 rounded-lg text-white text-sm transition-all"
                                    >
                                        <IoServer className="w-4 h-4" />
                                        <span className="hidden sm:inline">{selectedSource.icon} {selectedSource.name}</span>
                                        <span className="sm:hidden">{selectedSource.icon}</span>
                                        <IoChevronDown className={`w-4 h-4 transition-transform ${showSourceDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                    {showSourceDropdown && (
                                        <div className="absolute top-full right-0 mt-2 bg-neutral-900/95 backdrop-blur-xl rounded-xl shadow-2xl z-30 min-w-[220px] border border-white/10 overflow-hidden">
                                            <div className="px-4 py-3 bg-white/5 border-b border-white/10">
                                                <div className="flex items-center gap-2 text-xs text-white/60">
                                                    <IoLanguage className="w-4 h-4" />
                                                    <span>Switch for different languages</span>
                                                </div>
                                            </div>
                                            {VIDEO_SOURCES.map((source) => (
                                                <button
                                                    key={source.id}
                                                    onClick={() => {
                                                        setSelectedSource(source);
                                                        setShowSourceDropdown(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors flex items-center justify-between ${
                                                        selectedSource.id === source.id ? 'bg-primary text-white' : 'text-white/80'
                                                    }`}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <span className="text-lg">{source.icon}</span>
                                                        <span>{source.name}</span>
                                                    </span>
                                                    {source.badge && (
                                                        <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                                            {source.badge}
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                    </div>
                )}
                                </div>
                            </div>

                            {/* Right Controls */}
                            <div className="flex items-center gap-1">
                                {/* Theater Mode */}
                                <button 
                                    onClick={() => setIsTheaterMode(!isTheaterMode)}
                                    className={`p-2 rounded-full transition-all ${isTheaterMode ? 'text-primary bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                                    title="Theater Mode (T)"
                                >
                                    {isTheaterMode ? <IoEyeOff className="w-5 h-5" /> : <IoEye className="w-5 h-5" />}
                                </button>

                                {/* Fullscreen */}
                                <button 
                                    onClick={toggleFullscreen}
                                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
                                    title="Fullscreen (F)"
                                >
                                    {isFullscreen ? <IoContract className="w-5 h-5" /> : <IoExpand className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Video Player - Full Screen */}
                <div className="flex-1 relative">
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-primary/30 rounded-full"></div>
                                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                            </div>
                            <p className="text-white/60 text-sm">Loading {selectedSource.name}...</p>
                    </div>
                )}
                    <iframe
                        key={videoKey}
                        title="video"
                        src={getVideoSrc()}
                        className="w-full h-full"
                        style={{ border: 'none' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        allowFullScreen
                        onLoad={() => setIsLoading(false)}
                    />
                </div>

                {/* Bottom Controls Bar */}
                <div 
                    className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 ${
                        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
                    }`}
                >
                    <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pt-8">
                        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
                            {/* Episode Navigation */}
                            {media_type === "tv" ? (
                                <>
                                    <button
                                        onClick={handlePrevEpisode}
                                        disabled={!canGoPrev}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-white text-sm transition-all backdrop-blur-sm"
                                    >
                                        <IoChevronBack className="w-5 h-5" />
                                        <span className="hidden sm:inline">Previous</span>
                                    </button>
                                    
                                    <div className="text-center">
                                        <p className="text-white/50 text-xs">
                                            Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/70">←</kbd> <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/70">→</kbd> for episodes • <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/70">F</kbd> fullscreen
                                        </p>
                                    </div>
                                    
                                    <button
                                        onClick={handleNextEpisode}
                                        disabled={!canGoNext}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-white text-sm transition-all backdrop-blur-sm"
                                    >
                                        <span className="hidden sm:inline">Next</span>
                                        <IoChevronForward className="w-5 h-5" />
                                    </button>
                                </>
                            ) : (
                                <div className="w-full text-center">
                                    <p className="text-white/50 text-xs">
                                        Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/70">F</kbd> for fullscreen • <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/70">Esc</kbd> to close
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Episode Navigation Overlay (for TV) */}
                {media_type === "tv" && showControls && (
                    <>
                        {/* Left Arrow */}
                        {canGoPrev && (
                            <button
                                onClick={handlePrevEpisode}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all opacity-0 hover:opacity-100 sm:opacity-100"
                            >
                                <IoChevronBack className="w-8 h-8" />
                            </button>
                        )}
                        
                        {/* Right Arrow */}
                        {canGoNext && (
                            <button
                                onClick={handleNextEpisode}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all opacity-0 hover:opacity-100 sm:opacity-100"
                            >
                                <IoChevronForward className="w-8 h-8" />
                            </button>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default VideoPlay;
