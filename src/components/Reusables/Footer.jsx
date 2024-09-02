import logo from '../../assets/MovieSphereLogo.png';
import { socialMediaLinks } from '../../lib/constants';

const Footer = () => {
    return (
        <footer className="bg-background px-4 py-8 md:px-8 text-gray-500">
            <div className="max-w-screen-xl mx-auto">
                <div className="flex flex-col items-center md:flex-row md:justify-between">
                    <div className="flex items-center justify-center md:justify-start mb-4 md:mb-0">
                        <img src={logo} className="w-30" alt="Logo" />
                    </div>
                    <div className="flex space-x-6">
                        {socialMediaLinks.map(({ href, icon: Icon, label }) => (
                            <a 
                                key={label} 
                                href={href} 
                                className="text-gray-400 hover:text-white transition-colors duration-300" 
                                aria-label={label}
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <Icon size={24} />
                            </a>
                        ))}
                    </div>
                </div>
                <div className="mt-8 text-center text-sm text-gray-400">
                    &copy; 2024 Movie Sphere. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
