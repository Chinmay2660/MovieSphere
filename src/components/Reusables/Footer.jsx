import { useNavigate } from 'react-router-dom';
import logo from '../../assets/MovieSphereLogo.png';
import { useLocale } from '../../context/LocaleContext';

const PORTFOLIO_URL = 'https://chinmaybhoir.vercel.app/';

const Footer = () => {
    const navigate = useNavigate();
    const { t } = useLocale();

    return (
        <footer className="apple-container pb-4 pt-2 md:pb-6">
            <div className="liquid-glass rounded-[1.25rem] px-5 py-6 sm:rounded-[1.5rem] sm:px-8 sm:py-8">
                <div className="flex flex-col items-center md:flex-row md:justify-between">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="mb-4 flex items-center justify-center md:mb-0 md:justify-start"
                    >
                        <img src={logo} className="w-30 opacity-70" alt="MovieSphere logo" style={{ filter: 'brightness(0) invert(1)' }} />
                    </button>
                    <a
                        href={PORTFOLIO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="apple-footnote transition-colors hover:text-accent"
                        aria-label="Check my portfolio"
                    >
                        {t('footer.portfolio')}
                    </a>
                </div>
                <p className="apple-caption-1 mt-6 text-center">
                    {t('footer.copyright')}
                </p>
            </div>
        </footer>
    );
};

export default Footer;
