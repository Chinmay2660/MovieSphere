import { useNavigate } from 'react-router-dom';
import MovieSphereIcon from './MovieSphereIcon';
import { useLocale } from '../../context/LocaleContext';

const PORTFOLIO_URL = 'https://chinmaybhoir.vercel.app/';

const Footer = () => {
    const navigate = useNavigate();
    const { t } = useLocale();

    return (
        <footer className="apple-container pb-4 pt-2 md:pb-6">
            <div className="liquid-glass mx-auto max-w-3xl rounded-full px-4 py-2.5 sm:px-5 sm:py-3">
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10 active:scale-[0.97]"
                        aria-label="Go to home"
                    >
                        <MovieSphereIcon className="h-5 w-5 opacity-80" alt="MovieSphere logo" />
                    </button>
                    <p className="apple-caption-1 min-w-0 flex-1 truncate text-center">
                        {t('footer.copyright')}
                    </p>
                    <a
                        href={PORTFOLIO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="apple-footnote shrink-0 transition-colors hover:text-accent"
                        aria-label="Check my portfolio"
                    >
                        {t('footer.portfolio')}
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
