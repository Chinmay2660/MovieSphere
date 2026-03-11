import { useNavigate } from 'react-router-dom';
import logo from '../../assets/MovieSphereLogo.png';

const PORTFOLIO_URL = 'https://chinmaybhoir.vercel.app/';

const Footer = () => {

    const navigate = useNavigate()

    const handleNavigate = () => {
        navigate('/')
    }

    return (
        <footer className="bg-background px-4 py-8 md:px-8 text-white/60">
            <div className="max-w-screen-xl mx-auto">
                <div className="flex flex-col items-center md:flex-row md:justify-between">
                    <div className="flex items-center justify-center md:justify-start mb-4 md:mb-0 cursor-pointer" onClick={handleNavigate}>
                        <img src={logo} className="w-30" alt="Logo" style={{ filter: 'brightness(0) invert(1)' }} />
                    </div>
                    <a
                        href={PORTFOLIO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-white transition-colors duration-300 font-medium underline"
                        aria-label="Check my portfolio"
                    >
                        Check my portfolio
                    </a>
                </div>
                <div className="mt-8 text-center text-sm text-white/60">
                    &copy; 2026 MovieSphere. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
