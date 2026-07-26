import { useNavigate, useLocation } from 'react-router-dom';
import { navigation } from '../../lib/constants';
import { useLocale } from '../../context/LocaleContext';

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

    return (
        <nav
            aria-label="Main navigation"
            className="fixed inset-x-0 bottom-0 z-50 md:hidden ios-tab-bar pb-[env(safe-area-inset-bottom)]"
        >
            <div className="flex items-stretch">
                {mobileNavItems.map((item) => {
                    const isActive = isNavActive(item.path, pathname);
                    const Icon = isActive ? item.iconActive : item.icon;

                    return (
                        <button
                            key={item.path}
                            type="button"
                            onClick={() => navigate(item.path)}
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={t(item.titleKey)}
                            className={`ios-tab-item ${isActive ? 'text-accent' : 'text-secondary'}`}
                        >
                            <Icon className="h-[1.5625rem] w-[1.5625rem] shrink-0" aria-hidden />
                            <span className="w-full truncate text-center capitalize">{t(item.shortTitleKey)}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileBottomNav;
