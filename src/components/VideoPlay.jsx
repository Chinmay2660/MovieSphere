import { IoClose, IoChevronDown, IoChevronBack, IoChevronForward, IoExpand, IoContract, IoEye, IoEyeOff, IoPhoneLandscapeOutline } from "react-icons/io5";
import { useEffect, useState, useRef, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Loader from "./Reusables/Loader";
import { useLocale } from "../context/LocaleContext";

const MOBILE_TABLET_QUERY = "(max-width: 1023px)";
const ROTATE_CONTROL_QUERY = "(max-width: 1279px), (hover: none) and (pointer: coarse)";

const isMobileOrTablet = () => window.matchMedia(MOBILE_TABLET_QUERY).matches;
const shouldShowRotateControl = () => window.matchMedia(ROTATE_CONTROL_QUERY).matches;

const requestLandscapeOrientation = async (container, { allowFullscreen = true } = {}) => {
  const orientation = screen.orientation;
  if (!orientation?.lock) return false;

  try {
    await orientation.lock("landscape");
    return true;
  } catch {
    // ponytail: most mobile browsers require fullscreen before orientation.lock
  }

  if (!allowFullscreen) return false;

  try {
    if (container && !document.fullscreenElement) {
      await container.requestFullscreen();
    }
    await orientation.lock("landscape");
    return true;
  } catch {
    return false;
  }
};

const exitPlaybackFullscreen = async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  } catch {
    // Best-effort cleanup when leaving the player.
  }
};

const unlockOrientation = () => {
  try {
    screen.orientation?.unlock?.();
  } catch {
    // Orientation unlock is best-effort only.
  }
};

const VIDSRC = {
  id: 'vidsrc_sbs',
  name: 'VidSrc',
  icon: '🎬',
  getMovieUrl: (id) => `https://vidsrc.sbs/embed/movie/${id}`,
  getTvUrl: (id, season, episode) => `https://vidsrc.sbs/embed/tv/${id}/${season}/${episode}`,
};

const getDirectEmbedUrl = (mediaType, playVideoId, season, episode) => {
  if (!playVideoId) return '';
  if (mediaType === 'tv') {
    return VIDSRC.getTvUrl(playVideoId, season, episode);
  }
  return VIDSRC.getMovieUrl(playVideoId);
};

const VideoPlay = ({ 
    playVideoId, 
    close, 
    media_type, 
    seasons = [],
    initialSeason = 1,
    initialEpisode = 1 
}) => {
    const { t } = useLocale();
    const [selectedSeason, setSelectedSeason] = useState(initialSeason);
    const [selectedEpisode, setSelectedEpisode] = useState(initialEpisode);
    const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
    const [showEpisodeDropdown, setShowEpisodeDropdown] = useState(false);
    const [episodeCount, setEpisodeCount] = useState(1);
    const [videoKey, setVideoKey] = useState(0);
    const [embedSrc, setEmbedSrc] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [showRotateControl, setShowRotateControl] = useState(() => shouldShowRotateControl());
    const [embedReady, setEmbedReady] = useState(false);
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
        setEmbedReady(false);
    }, [selectedSeason, selectedEpisode]);

    const handleClose = useCallback(async () => {
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        await exitPlaybackFullscreen();
        unlockOrientation();
        close();
    }, [close]);

    const resolveEmbedSrc = useCallback(() => {
        if (!playVideoId) {
            setEmbedSrc('');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setEmbedReady(false);

        const mediaType = media_type === 'tv' ? 'tv' : 'movie';
        setEmbedSrc(getDirectEmbedUrl(mediaType, playVideoId, selectedSeason, selectedEpisode));
        setVideoKey((prev) => prev + 1);
    }, [playVideoId, media_type, selectedSeason, selectedEpisode]);

    useEffect(() => {
        resolveEmbedSrc();
    }, [resolveEmbedSrc]);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 1279px), (hover: none) and (pointer: coarse)");
        const updateRotateControl = () => setShowRotateControl(mediaQuery.matches);

        updateRotateControl();
        mediaQuery.addEventListener("change", updateRotateControl);
        return () => mediaQuery.removeEventListener("change", updateRotateControl);
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    useLayoutEffect(() => {
        if (!isMobileOrTablet()) return undefined;

        requestLandscapeOrientation(containerRef.current, { allowFullscreen: false });
        return () => {
            exitPlaybackFullscreen();
            unlockOrientation();
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && !document.fullscreenElement) {
                handleClose();
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

    const scheduleControlsHide = useCallback(() => {
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }

        // ponytail: iframe eats pointer events once loaded, so keep chrome visible
        if (embedSrc || isLoading) return;

        controlsTimeoutRef.current = setTimeout(() => {
            if (!showSeasonDropdown && !showEpisodeDropdown) {
                setShowControls(false);
            }
        }, 3000);
    }, [embedSrc, isLoading, showSeasonDropdown, showEpisodeDropdown]);

    const handleMouseMove = () => {
        setShowControls(true);
        scheduleControlsHide();
    };

    const handleTouchStart = () => {
        setShowControls(true);
        scheduleControlsHide();
    };

    const handleEmbedLoad = useCallback(() => {
        setIsLoading(false);
        setEmbedReady(true);
        setShowControls(true);
    }, []);

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await containerRef.current?.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch {
            // Fullscreen API may be unavailable or denied
        }
    };

    const handleRotateLandscape = async () => {
        const didLock = await requestLandscapeOrientation(containerRef.current);
        if (!didLock && !document.fullscreenElement) {
            await toggleFullscreen();
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
    };

    const canGoPrev = selectedEpisode > 1 || selectedSeason > 1;
    const canGoNext = selectedEpisode < episodeCount || validSeasons.some(s => s.season_number === selectedSeason + 1);

    return createPortal(
        <section 
            className="fixed inset-0 z-[100] isolate bg-background"
            onClick={(e) => {
                if (e.target === e.currentTarget) handleClose();
                closeAllDropdowns();
            }}
        >
            <div 
                ref={containerRef}
                className={`relative flex h-dvh w-full flex-col bg-background ${isTheaterMode ? 'bg-background' : ''}`}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onMouseLeave={() => !showSeasonDropdown && !showEpisodeDropdown && setShowControls(false)}
            >
                <div 
                    className={`absolute top-0 left-0 right-0 z-20 transition-all duration-300 ${
                        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
                    }`}
                >
                    <div className="bg-gradient-to-b from-background/90 via-background/60 to-transparent p-3 sm:p-4 pb-6 sm:pb-8 pt-[max(0.75rem,env(safe-area-inset-top))]">
                        <div className="flex flex-wrap items-center justify-between gap-2 max-w-screen-2xl mx-auto">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <button 
                                    onClick={handleClose}
                                    className="p-2 text-text/80 hover:text-text hover:bg-surface-elevated rounded-full transition-all"
                                    title="Close (Esc)"
                                >
                                    <IoClose className="w-6 h-6" />
                </button>

                                <div className="h-6 w-px bg-surface-elevated hidden sm:block"></div>
                                <div className="hidden sm:block">
                                    <span className="text-text font-medium">
                                        {media_type === "tv" ? `S${selectedSeason} E${selectedEpisode}` : "Now Playing"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 order-3 sm:order-none w-full sm:w-auto justify-center sm:justify-start">
                                {media_type === "tv" && validSeasons.length > 0 && (
                                    <>
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowSeasonDropdown(!showSeasonDropdown);
                                                    setShowEpisodeDropdown(false);
                                                }}
                                                className="flex items-center gap-1 bg-surface-elevated hover:bg-surface-elevated backdrop-blur-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-text text-xs sm:text-sm transition-all border border-accent/15"
                                            >
                                                <span className="sm:hidden">S{selectedSeason}</span>
                                                <span className="hidden sm:inline">Season {selectedSeason}</span>
                                                <IoChevronDown className={`w-4 h-4 transition-transform ${showSeasonDropdown ? 'rotate-180' : ''}`} />
                                            </button>
                                            {showSeasonDropdown && (
                                                <div className="absolute top-full left-0 mt-2 bg-surface backdrop-blur-xl rounded-xl shadow-2xl max-h-64 overflow-y-auto z-30 min-w-[160px] border border-accent/15">
                                                    {validSeasons.map((season) => (
                                                        <button
                                                            key={season.season_number}
                                                            onClick={() => {
                                                                setSelectedSeason(season.season_number);
                                                                setSelectedEpisode(1);
                                                                setShowSeasonDropdown(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${
                                                                selectedSeason === season.season_number
                                                                    ? 'bg-primary text-primary-fg hover:bg-primary'
                                                                    : 'text-text/80 hover:bg-accent/20 hover:text-text'
                                                            }`}
                                                            style={selectedSeason === season.season_number ? { color: '#000' } : undefined}
                                                        >
                                                            <span>Season {season.season_number}</span>
                                                            <span className={`text-xs ${selectedSeason === season.season_number ? 'text-primary-fg/70' : 'text-muted'}`}>{season.episode_count} ep</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowEpisodeDropdown(!showEpisodeDropdown);
                                                    setShowSeasonDropdown(false);
                                                }}
                                                className="flex items-center gap-1 bg-surface-elevated hover:bg-surface-elevated backdrop-blur-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-text text-xs sm:text-sm transition-all border border-accent/15"
                                            >
                                                <span className="sm:hidden">E{selectedEpisode}</span>
                                                <span className="hidden sm:inline">Episode {selectedEpisode}</span>
                                                <IoChevronDown className={`w-4 h-4 transition-transform ${showEpisodeDropdown ? 'rotate-180' : ''}`} />
                                            </button>
                                            {showEpisodeDropdown && (
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-surface backdrop-blur-xl rounded-xl shadow-2xl max-h-64 overflow-y-auto z-30 min-w-[140px] border border-accent/15">
                                                    {episodes.map((ep) => (
                                                        <button
                                                            key={ep}
                                                            onClick={() => {
                                                                setSelectedEpisode(ep);
                                                                setShowEpisodeDropdown(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                                                selectedEpisode === ep
                                                                    ? 'bg-primary text-primary-fg hover:bg-primary'
                                                                    : 'text-text/80 hover:bg-accent/20 hover:text-text'
                                                            }`}
                                                            style={selectedEpisode === ep ? { color: '#000' } : undefined}
                                                        >
                                                            Episode {ep}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                            </div>
                            <div className="flex items-center gap-1 order-2 sm:order-none ml-auto sm:ml-0">
                                <button 
                                    onClick={() => setIsTheaterMode(!isTheaterMode)}
                                    className={`hidden sm:block p-2 rounded-full transition-all ${isTheaterMode ? 'text-text bg-surface-elevated' : 'text-text/80 hover:text-text hover:bg-surface-elevated'}`}
                                    title="Theater Mode (T)"
                                >
                                    {isTheaterMode ? <IoEyeOff className="w-5 h-5" /> : <IoEye className="w-5 h-5" />}
                                </button>
                                {showRotateControl ? (
                                    <button
                                        type="button"
                                        onClick={handleRotateLandscape}
                                        className="flex items-center gap-1.5 rounded-full bg-surface-elevated px-2.5 py-2 text-text transition-all hover:bg-surface-elevated border border-accent/15"
                                        title={t('video.rotateLandscape')}
                                        aria-label={t('video.rotateLandscape')}
                                    >
                                        <IoPhoneLandscapeOutline className="w-5 h-5 shrink-0" />
                                        <span className="text-xs font-medium">{t('video.rotate')}</span>
                                    </button>
                                ) : (
                                    <button 
                                        onClick={toggleFullscreen}
                                        className="p-2 text-text/80 hover:text-text hover:bg-surface-elevated rounded-full transition-all"
                                        title="Fullscreen (F)"
                                    >
                                        {isFullscreen ? <IoContract className="w-5 h-5" /> : <IoExpand className="w-5 h-5" />}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 min-h-0 relative bg-background overflow-hidden">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
                            <Loader
                                size="lg"
                                label={
                                    media_type === 'tv'
                                        ? t('loading.playbackEpisode')
                                        : t('loading.playbackMovie')
                                }
                            />
                        </div>
                    )}
                    {embedSrc ? (
                        <iframe
                            key={videoKey}
                            title="video"
                            src={embedSrc}
                            className={`h-full w-full ${embedReady ? 'opacity-100' : 'opacity-0'}`}
                            style={{ border: 'none' }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                            allowFullScreen
                            onLoad={handleEmbedLoad}
                        />
                    ) : null}
                </div>
                <div 
                    className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 ${
                        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
                    }`}
                >
                    <div className="bg-gradient-to-t from-background/90 via-background/60 to-transparent p-3 sm:p-4 pt-6 sm:pt-8 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                        <div className="flex items-center justify-between max-w-screen-2xl mx-auto gap-2">
                            {media_type === "tv" ? (
                                <>
                                    <button
                                        onClick={handlePrevEpisode}
                                        disabled={!canGoPrev}
                                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-surface-elevated hover:bg-surface-elevated disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-text text-sm transition-all backdrop-blur-sm"
                                    >
                                        <IoChevronBack className="w-5 h-5" />
                                        <span className="hidden sm:inline">Previous</span>
                                    </button>
                                    
                                    <div className="text-center hidden sm:block">
                                        <p className="text-muted text-xs">
                                            Press <kbd className="px-1.5 py-0.5 bg-surface-elevated rounded text-secondary">←</kbd> <kbd className="px-1.5 py-0.5 bg-surface-elevated rounded text-secondary">→</kbd> for episodes • <kbd className="px-1.5 py-0.5 bg-surface-elevated rounded text-secondary">F</kbd> fullscreen
                                        </p>
                                    </div>
                                    
                                    <button
                                        onClick={handleNextEpisode}
                                        disabled={!canGoNext}
                                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-surface-elevated hover:bg-surface-elevated disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-text text-sm transition-all backdrop-blur-sm"
                                    >
                                        <span className="hidden sm:inline">Next</span>
                                        <IoChevronForward className="w-5 h-5" />
                                    </button>
                                </>
                            ) : (
                                <div className="w-full text-center hidden sm:block">
                                    <p className="text-muted text-xs">
                                        Press <kbd className="px-1.5 py-0.5 bg-surface-elevated rounded text-secondary">F</kbd> for fullscreen • <kbd className="px-1.5 py-0.5 bg-surface-elevated rounded text-secondary">Esc</kbd> to close
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {media_type === "tv" && showControls && (
                    <>
                        {canGoPrev && (
                            <button
                                onClick={handlePrevEpisode}
                                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 bg-surface hover:bg-surface-elevated rounded-full text-text transition-all opacity-70 sm:opacity-100"
                            >
                                <IoChevronBack className="w-6 h-6 sm:w-8 sm:h-8" />
                            </button>
                        )}
                        {canGoNext && (
                            <button
                                onClick={handleNextEpisode}
                                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 bg-surface hover:bg-surface-elevated rounded-full text-text transition-all opacity-70 sm:opacity-100"
                            >
                                <IoChevronForward className="w-6 h-6 sm:w-8 sm:h-8" />
                            </button>
                        )}
                    </>
                )}
            </div>
        </section>,
        document.body
    );
};

export default VideoPlay;
