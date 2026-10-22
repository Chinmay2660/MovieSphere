import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { navigation } from '../../lib/constants';
import { useLocale } from '../../context/LocaleContext';
import NavCountBadge from './NavCountBadge';

const MOBILE_NAV_ORDER = ['/tv', '/movie', '/home', '/watchlist', '/downloads'];
const mobileNavItems = MOBILE_NAV_ORDER
    .map((path) => navigation.find((item) => item.path === path))
    .filter(Boolean);

const isNavActive = (path, activePath) =>
    path === '/home' ? activePath === '/home' : activePath.startsWith(path);

const MobileBottomNav = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { t } = useLocale();
    const watchlistCount = useSelector((state) => state.watchlist.length);
    const downloadsCount = useSelector((state) => state.downloads.length);

    const badgeCountForPath = (path) => {
        if (path === '/watchlist') return watchlistCount;
        if (path === '/downloads') return downloadsCount;
        return 0;
    };

    return (
        <nav
            aria-label="Main navigation"
            className="fixed inset-x-0 bottom-0 z-50 md:hidden px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4"
        >
            <div className="ios-tab-bar flex items-stretch overflow-hidden rounded-full">
                {mobileNavItems.map((item) => {
                    const isActive = isNavActive(item.path, pathname);
                    const Icon = isActive ? item.iconActive : item.icon;
                    const badgeCount = badgeCountForPath(item.path);
                    const ariaLabel =
                        badgeCount > 0
                            ? `${t(item.titleKey)}, ${badgeCount}`
                            : t(item.titleKey);

                    return (
                        <button
                            key={item.path}
                            type="button"
                            onClick={() => navigate(item.path)}
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={ariaLabel}
                            className={`ios-tab-item ${isActive ? 'text-accent' : 'text-secondary'}`}
                        >
                            <span className="relative inline-flex shrink-0">
                                <Icon className="h-[1.5625rem] w-[1.5625rem]" aria-hidden />
                                <NavCountBadge
                                    count={badgeCount}
                                    className="absolute -right-2 -top-1.5"
                                />
                            </span>
                            <span className="w-full truncate text-center capitalize">{t(item.shortTitleKey)}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileBottomNav;
