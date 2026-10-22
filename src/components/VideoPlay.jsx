import { IoClose, IoChevronDown, IoChevronBack, IoChevronForward, IoExpand, IoContract, IoEye, IoEyeOff, IoPhoneLandscapeOutline } from "react-icons/io5";
import { useEffect, useState, useRef, useCallback, useLayoutEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Loader from "./Reusables/Loader";
import { useLocale } from "../context/LocaleContext";
import {
  PLAYBACK_SOURCES,
  findPlaybackSource,
  getDefaultPlaybackSourceId,
  persistPlaybackSourceId,
} from "../lib/vidsrcEmbed";
import { lockBodyScroll } from "../lib/scrollLock";

const MOBILE_TABLET_QUERY = "(max-width: 1023px)";
const ROTATE_CONTROL_QUERY = "(max-width: 1279px), (hover: none) and (pointer: coarse)";
const TOUCH_PRIMARY_QUERY = "(hover: none) and (pointer: coarse)";

const isMobileOrTablet = () => window.matchMedia(MOBILE_TABLET_QUERY).matches;
const shouldShowRotateControl = () => window.matchMedia(ROTATE_CONTROL_QUERY).matches;
const isTouchPrimary = () => window.matchMedia(TOUCH_PRIMARY_QUERY).matches;

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
    const [playbackSourceId, setPlaybackSourceId] = useState(getDefaultPlaybackSourceId);
    const [showSourceDropdown, setShowSourceDropdown] = useState(false);
    const [loadSlow, setLoadSlow] = useState(false);
    const selectedSource = findPlaybackSource(playbackSourceId);
    const isDirectPlayback = Boolean(selectedSource.isDirect);
    const [isLoading, setIsLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [showRotateControl, setShowRotateControl] = useState(() => shouldShowRotateControl());
    const [isTouchDevice, setIsTouchDevice] = useState(() => isTouchPrimary());
    const containerRef = useRef(null);
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
    }, [selectedSeason, selectedEpisode, playbackSourceId]);

    useEffect(() => {
        if (!isLoading) {
            setLoadSlow(false);
            return undefined;
        }
        const timer = setTimeout(() => setLoadSlow(true), 12000);
        return () => clearTimeout(timer);
    }, [isLoading, videoKey]);

    const cyclePlaybackSource = useCallback(() => {
        const idx = PLAYBACK_SOURCES.findIndex((s) => s.id === playbackSourceId);
        const next = PLAYBACK_SOURCES[(idx + 1) % PLAYBACK_SOURCES.length];
        setPlaybackSourceId(next.id);
        persistPlaybackSourceId(next.id);
        setShowSourceDropdown(false);
        setLoadSlow(false);
    }, [playbackSourceId]);

    const handleClose = useCallback(async () => {
        await exitPlaybackFullscreen();
        unlockOrientation();
        close();
    }, [close]);

    const getVideoSrc = () => {
        if (!playVideoId) return '';
        if (media_type === 'tv') {
            return selectedSource.getTvUrl(playVideoId, selectedSeason, selectedEpisode);
        }
        return selectedSource.getMovieUrl(playVideoId);
    };

    useEffect(() => lockBodyScroll(), []);

    useEffect(() => {
        const rotateQuery = window.matchMedia(ROTATE_CONTROL_QUERY);
        const touchQuery = window.matchMedia(TOUCH_PRIMARY_QUERY);
        const updateRotateControl = () => setShowRotateControl(rotateQuery.matches);
        const updateTouchDevice = () => setIsTouchDevice(touchQuery.matches);

        updateRotateControl();
        updateTouchDevice();
        rotateQuery.addEventListener("change", updateRotateControl);
        touchQuery.addEventListener("change", updateTouchDevice);
        return () => {
            rotateQuery.removeEventListener("change", updateRotateControl);
            touchQuery.removeEventListener("change", updateTouchDevice);
        };
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

    // ponytail: no full-screen tap layer — it blocked iframe play buttons; chrome stays on touch
    const revealControls = useCallback(() => {
        setShowControls(true);
    }, []);

    const hideControls = useCallback(() => {
        if (showSeasonDropdown || showEpisodeDropdown || showSourceDropdown) return;
        setShowControls(false);
    }, [showSeasonDropdown, showEpisodeDropdown, showSourceDropdown]);

    const handlePlayerMouseEnter = useCallback(() => {
        if (isTouchDevice) return;
        setShowControls(true);
    }, [isTouchDevice]);

    const handlePlayerMouseLeave = useCallback(() => {
        if (isTouchDevice) return;
        hideControls();
    }, [hideControls, isTouchDevice]);

    const handleEmbedLoad = useCallback(() => {
        setIsLoading(false);
        setShowControls(false);
    }, []);

    const handleDirectStreamReady = useCallback(() => {
        setIsLoading(false);
        setShowControls(false);
    }, []);

    const handleDirectStreamError = useCallback(() => {
        setIsLoading(false);
        setLoadSlow(true);
    }, []);

    const toggleFullscreen = useCallback(async () => {
        try {
            if (!document.fullscreenElement) {
                await containerRef.current?.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch {
            // Fullscreen API may be unavailable or denied
        }
    }, []);

    const handleRotateLandscape = async () => {
        const didLock = await requestLandscapeOrientation(containerRef.current);
        if (!didLock && !document.fullscreenElement) {
            await toggleFullscreen();
        }
    };

    const validSeasons = useMemo(
        () => seasons?.filter((s) => s.season_number > 0) || [],
        [seasons]
    );
    const episodes = Array.from({ length: episodeCount }, (_, i) => i + 1);

    const handlePrevEpisode = useCallback(() => {
        if (selectedEpisode > 1) {
            setSelectedEpisode(prev => prev - 1);
        } else if (selectedSeason > 1) {
            const prevSeason = validSeasons.find(s => s.season_number === selectedSeason - 1);
            if (prevSeason) {
                setSelectedSeason(selectedSeason - 1);
                setSelectedEpisode(prevSeason.episode_count || 1);
            }
        }
    }, [selectedEpisode, selectedSeason, validSeasons]);

    const handleNextEpisode = useCallback(() => {
        if (selectedEpisode < episodeCount) {
            setSelectedEpisode(prev => prev + 1);
        } else {
            const nextSeason = validSeasons.find(s => s.season_number === selectedSeason + 1);
            if (nextSeason) {
                setSelectedSeason(selectedSeason + 1);
                setSelectedEpisode(1);
            }
        }
    }, [selectedEpisode, episodeCount, selectedSeason, validSeasons]);

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
            // Leave arrow keys for the embed player (seek). Episodes: Shift + arrows.
            if (e.shiftKey && e.key === 'ArrowRight' && media_type === 'tv') {
                e.preventDefault();
                handleNextEpisode();
            }
            if (e.shiftKey && e.key === 'ArrowLeft' && media_type === 'tv') {
                e.preventDefault();
                handlePrevEpisode();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [
        media_type,
        handleClose,
        toggleFullscreen,
        handlePrevEpisode,
        handleNextEpisode,
    ]);

    const closeAllDropdowns = () => {
        setShowSeasonDropdown(false);
        setShowEpisodeDropdown(false);
        setShowSourceDropdown(false);
    };

    const canGoPrev = selectedEpisode > 1 || selectedSeason > 1;
    const canGoNext = selectedEpisode < episodeCount || validSeasons.some(s => s.season_number === selectedSeason + 1);
    const controlsVisible = showControls || isLoading;
    const videoSrc = getVideoSrc();

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
                onMouseEnter={handlePlayerMouseEnter}
                onMouseLeave={handlePlayerMouseLeave}
            >
                {!controlsVisible && !isLoading && (
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-between p-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="pointer-events-auto rounded-full bg-background/80 p-2 text-text shadow-lg backdrop-blur-sm border border-accent/15"
                            title="Close (Esc)"
                            aria-label={t("video.close")}
                        >
                            <IoClose className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowControls(true)}
                            className="pointer-events-auto rounded-lg bg-background/80 px-3 py-1.5 text-xs font-medium text-text shadow-lg backdrop-blur-sm border border-accent/15"
                        >
                            {selectedSource.name}
                        </button>
                    </div>
                )}
                <div 
                    className={`absolute top-0 left-0 right-0 z-20 transition-all duration-300 pointer-events-none ${
                        controlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
                    }`}
                >
                    <div className="pointer-events-auto bg-gradient-to-b from-background/90 via-background/60 to-transparent p-3 sm:p-4 pb-6 sm:pb-8 pt-[max(0.75rem,env(safe-area-inset-top))]">
                        <div className="flex flex-wrap items-center justify-between gap-2 max-w-screen-2xl mx-auto">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="p-2 text-text/80 hover:text-text hover:bg-surface-elevated rounded-full transition-all"
                                    title="Close (Esc)"
                                    aria-label={t("video.close")}
                                >
                                    <IoClose className="w-6 h-6" />
                </button>

                                <div className="h-6 w-px bg-surface-elevated hidden sm:block"></div>
                                <div className="min-w-0">
                                    <span className="text-text font-medium text-sm sm:text-base">
                                        {media_type === "tv" ? `S${selectedSeason} E${selectedEpisode}` : "Now Playing"}
                                    </span>
                                    {media_type === "tv" && (
                                        <p className="hidden text-muted text-[10px] sm:text-xs mt-0.5 sm:block">
                                            {t("video.embedSeekHint")}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 order-3 sm:order-none w-full sm:w-auto justify-center sm:justify-start">
                                {media_type === "tv" && validSeasons.length > 0 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handlePrevEpisode}
                                            disabled={!canGoPrev}
                                            className="p-2 rounded-lg bg-surface-elevated disabled:opacity-30 border border-accent/15"
                                            title={t("video.prevEpisode")}
                                            aria-label={t("video.prevEpisode")}
                                        >
                                            <IoChevronBack className="w-5 h-5" />
                                        </button>
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowSeasonDropdown(!showSeasonDropdown);
                                                    setShowEpisodeDropdown(false);
                                                    revealControls();
                                                }}
                                                className="flex items-center gap-1 bg-surface-elevated hover:bg-surface-elevated backdrop-blur-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-text text-xs sm:text-sm transition-all border border-accent/15"
                                            >
                                                <span className="sm:hidden">S{selectedSeason}</span>
                                                <span className="hidden sm:inline">Season {selectedSeason}</span>
                                                <IoChevronDown className={`w-4 h-4 transition-transform ${showSeasonDropdown ? 'rotate-180' : ''}`} />
                                            </button>
                                            {showSeasonDropdown && (
                                                <div className="app-scrollbar absolute top-full left-0 mt-2 bg-surface backdrop-blur-xl rounded-xl shadow-2xl max-h-64 overflow-y-auto z-30 min-w-[160px] border border-accent/15">
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
                                                    revealControls();
                                                }}
                                                className="flex items-center gap-1 bg-surface-elevated hover:bg-surface-elevated backdrop-blur-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-text text-xs sm:text-sm transition-all border border-accent/15"
                                            >
                                                <span className="sm:hidden">E{selectedEpisode}</span>
                                                <span className="hidden sm:inline">Episode {selectedEpisode}</span>
                                                <IoChevronDown className={`w-4 h-4 transition-transform ${showEpisodeDropdown ? 'rotate-180' : ''}`} />
                                            </button>
                                            {showEpisodeDropdown && (
                                                <div className="app-scrollbar absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-surface backdrop-blur-xl rounded-xl shadow-2xl max-h-64 overflow-y-auto z-30 min-w-[140px] border border-accent/15">
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
                                                        >
                                                            Episode {ep}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleNextEpisode}
                                            disabled={!canGoNext}
                                            className="p-2 rounded-lg bg-surface-elevated disabled:opacity-30 border border-accent/15"
                                            title={t("video.nextEpisode")}
                                            aria-label={t("video.nextEpisode")}
                                        >
                                            <IoChevronForward className="w-5 h-5" />
                                        </button>
                                    </>
                                )}

                            </div>
                            <div className="flex items-center gap-1 order-2 sm:order-none ml-auto sm:ml-0">
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowSourceDropdown(!showSourceDropdown);
                                            setShowSeasonDropdown(false);
                                            setShowEpisodeDropdown(false);
                                            revealControls();
                                        }}
                                        className="flex items-center gap-1 bg-surface-elevated hover:bg-surface-elevated backdrop-blur-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-text text-xs sm:text-sm transition-all border border-accent/15 max-w-[8.5rem] sm:max-w-none"
                                        title={t("video.switchSource")}
                                    >
                                        <span className="truncate">{selectedSource.name}</span>
                                        <IoChevronDown className={`w-4 h-4 shrink-0 transition-transform ${showSourceDropdown ? "rotate-180" : ""}`} />
                                    </button>
                                    {showSourceDropdown && (
                                        <div className="absolute top-full right-0 mt-2 bg-surface backdrop-blur-xl rounded-xl shadow-2xl max-h-64 overflow-y-auto z-30 min-w-[10rem] border border-accent/15">
                                            {PLAYBACK_SOURCES.map((source) => (
                                                <button
                                                    key={source.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setPlaybackSourceId(source.id);
                                                        persistPlaybackSourceId(source.id);
                                                        setShowSourceDropdown(false);
                                                        setLoadSlow(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                                        playbackSourceId === source.id
                                                            ? "bg-primary text-primary-fg hover:bg-primary"
                                                            : "text-text/80 hover:bg-accent/20 hover:text-text"
                                                    }`}
                                                >
                                                    {source.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
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
                <div
                    className="flex-1 min-h-0 relative bg-background overflow-hidden"
                    onClick={() => {
                        if (isTouchDevice) setShowControls(false);
                    }}
                >
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background z-10 px-4">
                            <Loader
                                size="lg"
                                label={
                                    media_type === 'tv'
                                        ? t('loading.playbackEpisode')
                                        : t('loading.playbackMovie')
                                }
                            />
                            {loadSlow && (
                                <div className="text-center max-w-sm">
                                    <p className="apple-footnote text-muted">{t("video.playbackSlow")}</p>
                                    <button
                                        type="button"
                                        onClick={cyclePlaybackSource}
                                        className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:opacity-90"
                                    >
                                        {t("video.tryNextSource")}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    {videoSrc ? (
                        isDirectPlayback ? (
                            <video
                                key={videoKey}
                                title="video"
                                src={videoSrc}
                                controls
                                playsInline
                                className="relative z-0 h-full w-full border-0 bg-black object-contain"
                                onLoadedData={handleDirectStreamReady}
                                onCanPlay={handleDirectStreamReady}
                                onError={handleDirectStreamError}
                            />
                        ) : (
                            <iframe
                                key={videoKey}
                                title="video"
                                src={videoSrc}
                                className="relative z-0 h-full w-full border-0 bg-black"
                                style={{ border: 'none' }}
                                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                                allowFullScreen
                                referrerPolicy="no-referrer"
                                onLoad={handleEmbedLoad}
                            />
                        )
                    ) : null}
                </div>
            </div>
        </section>,
        document.body
    );
};

export default VideoPlay;
