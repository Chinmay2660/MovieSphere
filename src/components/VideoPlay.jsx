import { IoClose, IoChevronDown, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useEffect, useState } from "react";

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
    const [episodeCount, setEpisodeCount] = useState(1);
    const [videoKey, setVideoKey] = useState(0); // Force iframe refresh

    useEffect(() => {
        // Set episode count based on selected season
        if (seasons && seasons.length > 0) {
            const season = seasons.find(s => s.season_number === selectedSeason);
            if (season) {
                setEpisodeCount(season.episode_count || 1);
            }
        }
    }, [selectedSeason, seasons]);

    // Update video when season/episode changes
    useEffect(() => {
        setVideoKey(prev => prev + 1);
    }, [selectedSeason, selectedEpisode]);

    const getVideoSrc = () => {
        if (media_type === "tv") {
            // VidSrc format for TV shows: /embed/tv/{id}/{season}/{episode}
            return `https://vidsrc.cc/v2/embed/tv/${playVideoId}/${selectedSeason}/${selectedEpisode}`;
        } else {
            // VidSrc format for movies
            return `https://vidsrc.cc/v2/embed/movie/${playVideoId}`;
        }
    };

    const validSeasons = seasons?.filter(s => s.season_number > 0) || [];
    const episodes = Array.from({ length: episodeCount }, (_, i) => i + 1);

    const handlePrevEpisode = () => {
        if (selectedEpisode > 1) {
            setSelectedEpisode(prev => prev - 1);
        } else if (selectedSeason > 1) {
            // Go to previous season's last episode
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
            // Go to next season's first episode
            const nextSeason = validSeasons.find(s => s.season_number === selectedSeason + 1);
            if (nextSeason) {
                setSelectedSeason(selectedSeason + 1);
                setSelectedEpisode(1);
            }
        }
    };

    const canGoPrev = selectedEpisode > 1 || selectedSeason > 1;
    const canGoNext = selectedEpisode < episodeCount || validSeasons.some(s => s.season_number === selectedSeason + 1);

    return (
        <section className="fixed bg-black/90 backdrop-blur-md top-0 right-0 bottom-0 left-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="w-full max-w-6xl bg-neutral-900 rounded-xl overflow-hidden shadow-2xl max-h-[95vh] flex flex-col">
                {/* Header with controls */}
                <div className="flex items-center justify-between p-3 sm:p-4 bg-neutral-800 border-b border-neutral-700 flex-shrink-0">
                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                        <h3 className="text-white font-semibold text-sm sm:text-base">
                            {media_type === "tv" ? "📺 Watch Episode" : "🎬 Watch Movie"}
                        </h3>
                        
                        {/* Season/Episode selectors for TV shows */}
                        {media_type === "tv" && validSeasons.length > 0 && (
                            <div className="flex items-center gap-2 sm:gap-3">
                                {/* Season Selector */}
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setShowSeasonDropdown(!showSeasonDropdown);
                                            setShowEpisodeDropdown(false);
                                        }}
                                        className="flex items-center gap-1 sm:gap-2 bg-neutral-700 hover:bg-neutral-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-white text-xs sm:text-sm transition-colors"
                                    >
                                        S{selectedSeason}
                                        <IoChevronDown className={`transition-transform ${showSeasonDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                    {showSeasonDropdown && (
                                        <div className="absolute top-full left-0 mt-2 bg-neutral-800 rounded-lg shadow-xl max-h-60 overflow-y-auto z-20 min-w-[120px] border border-neutral-700">
                                            {validSeasons.map((season) => (
                                                <button
                                                    key={season.season_number}
                                                    onClick={() => {
                                                        setSelectedSeason(season.season_number);
                                                        setSelectedEpisode(1);
                                                        setShowSeasonDropdown(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-700 transition-colors ${
                                                        selectedSeason === season.season_number ? 'bg-primary text-white' : 'text-neutral-300'
                                                    }`}
                                                >
                                                    Season {season.season_number}
                                                    <span className="text-neutral-500 text-xs ml-2">
                                                        ({season.episode_count} ep)
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Episode Selector */}
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setShowEpisodeDropdown(!showEpisodeDropdown);
                                            setShowSeasonDropdown(false);
                                        }}
                                        className="flex items-center gap-1 sm:gap-2 bg-neutral-700 hover:bg-neutral-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-white text-xs sm:text-sm transition-colors"
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
                                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-700 transition-colors ${
                                                        selectedEpisode === ep ? 'bg-primary text-white' : 'text-neutral-300'
                                                    }`}
                                                >
                                                    Episode {ep}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                        className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                        onClick={close}
                    >
                        <IoClose className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                {/* Video Player */}
                <div className="aspect-video bg-black flex-1 min-h-0">
                    <iframe
                        key={videoKey}
                        title="video"
                        src={getVideoSrc()}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        allowFullScreen
                    />
                </div>

                {/* Episode Navigation for TV */}
                {media_type === "tv" && (
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-neutral-800 border-t border-neutral-700 flex-shrink-0">
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
                                Season {selectedSeason}, Episode {selectedEpisode}
                            </span>
                            <p className="text-neutral-500 text-xs">
                                {episodeCount} episodes in this season
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
                )}
            </div>
        </section>
    );
};

export default VideoPlay;
