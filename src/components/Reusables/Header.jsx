import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { IoSearchOutline, IoSettingsOutline } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';
import { navigation } from '../../lib/constants';
import MovieSphereIcon from './MovieSphereIcon';
import { debounce, getSearchQueryFromSearch, sanitizeSearchQuery } from "../../lib/utils";
import { useLocale } from '../../context/LocaleContext';

const Header = () => {
    const { t } = useLocale();
    const { scrollY } = useScroll();
    const [visible, setVisible] = useState(true);
    const [activePath, setActivePath] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const searchRef = useRef(null);

    useEffect(() => {
        setActivePath(location.pathname);
    }, [location]);

    useEffect(() => {
        const urlQuery = getSearchQueryFromSearch(location.search);
        if (location.pathname === "/search" && urlQuery) {
            setSearchQuery(urlQuery);
            setIsSearchOpen(true);
            return;
        }
        if (location.pathname !== "/search") {
            setSearchQuery("");
            setIsSearchOpen(false);
        }
    }, [location.pathname, location.search]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
                if (location.pathname !== "/search") {
                    setSearchQuery("");
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [location.pathname]);

    useMotionValueEvent(scrollY, "change", (current) => {
        setVisible(current <= 100);
    });

    const navigateToSearch = useCallback((value) => {
        if (value) {
            const sanitized = sanitizeSearchQuery(String(value).trim() || value);
            if (sanitized) navigate(`/search?q=${encodeURIComponent(sanitized)}`);
        } else {
            navigate('/home');
        }
    }, [navigate]);

    const debouncedSearch = useMemo(
        () => debounce(navigateToSearch, 600),
        [navigateToSearch]
    );

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };

    const navButtonClass = (isActive) =>
        `apple-footnote min-h-[2.75rem] px-3.5 py-1.5 rounded-full font-medium transition-all duration-200 ${
            isActive
                ? 'bg-primary text-primary-fg hover:bg-primary/90 hover:shadow-[0_0_16px_rgba(255,153,51,0.35)]'
                : '!text-text/85 hover:!text-primary hover:bg-primary/15 hover:shadow-[inset_0_0_0_0.5px_rgba(255,153,51,0.35)]'
        }`;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1, y: -100 }}
                animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="liquid-glass-strong hidden md:flex max-w-fit fixed top-5 inset-x-0 mx-auto rounded-full z-50 px-2 py-1.5 items-center justify-center gap-0.5"
            >
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-primary/15 active:scale-[0.97]"
                    aria-label="Go to home"
                >
                    <MovieSphereIcon className="h-5 w-5" />
                </button>

                <div className="flex items-center">
                    {navigation.map((item, idx) => {
                        const isActive = activePath === item.path;
                        return (
                            <button
                                key={idx}
                                onClick={() => navigate(item.path)}
                                className={navButtonClass(isActive)}
                            >
                                {t(item.titleKey)}
                            </button>
                        );
                    })}
                </div>

                {isSearchOpen ? (
                    <motion.div
                        ref={searchRef}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center ml-1"
                    >
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleInputChange}
                            placeholder={t('search.placeholder')}
                            className="glass-pill p-1.5 text-text text-xs w-36 bg-transparent focus:outline-none placeholder:text-muted"
                            autoFocus
                        />
                    </motion.div>
                ) : (
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className={`ml-0.5 ${navButtonClass(location.pathname === '/search')}`}
                    >
                        <IoSearchOutline className="text-base" />
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => navigate('/settings')}
                    className={`ml-0.5 ${navButtonClass(location.pathname === '/settings')}`}
                    aria-label={t('settings.title')}
                >
                    <IoSettingsOutline className="text-base" />
                </button>
            </motion.div>

            <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:hidden fixed top-0 inset-x-0 z-50 flex items-center gap-3 px-4 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] ios-nav-bar"
            >
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full active:bg-white/10"
                    aria-label="Go to home"
                >
                    <MovieSphereIcon className="h-6 w-6 opacity-90" />
                </button>

                <div className="min-w-0 flex-1" ref={searchRef}>
                    {!isSearchOpen ? (
                        <button
                            type="button"
                            onClick={() => setIsSearchOpen(true)}
                            className="ios-search-field w-full text-secondary active:opacity-80"
                            aria-label={t('search.aria')}
                        >
                            <IoSearchOutline className="shrink-0 text-lg" aria-hidden />
                            <span className="truncate text-left text-[1.0625rem]">{t('search.title')}</span>
                        </button>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0.85 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.15 }}
                            className="ios-search-field w-full"
                        >
                            <IoSearchOutline className="shrink-0 text-lg text-secondary" aria-hidden />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={handleInputChange}
                                placeholder={t('search.placeholderLong')}
                                className="min-w-0"
                                autoFocus
                                enterKeyHint="search"
                            />
                        </motion.div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/settings')}
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full active:bg-white/10 ${
                        location.pathname === '/settings' ? 'text-accent' : 'text-secondary'
                    }`}
                    aria-label={t('settings.title')}
                >
                    <IoSettingsOutline className="text-xl" aria-hidden />
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default Header;
