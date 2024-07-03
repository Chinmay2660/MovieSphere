import logo from '../../assets/logo.svg';
import { socialMediaLinks } from '../../lib/constants';

const Footer = () => {
    return (
        <footer className="text-gray-500 bg-background px-4 py-10 md:px-8">
            <div className="flex flex-col items-center md:flex-row md:justify-between">
                <div className="flex items-center">
                    <img src={logo} className="w-32" alt="Logo" />
                </div>
                <div className="flex mt-8 space-x-6 md:mt-0">
                    {socialMediaLinks.map(({ href, icon: Icon, label }) => (
                        <a key={label} href={href} className="text-text hover:text-accent" aria-label={label}>
                            <Icon size={24} />
                        </a>
                    ))}
                </div>
            </div>
            <div className="mt-8 text-center text-sm">
                {/* <p className="leading-relaxed mt-4 text-[15px]">
                    Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s.
                </p> */}
                <div className="mt-4">
                    &copy; 2024 Movie Sphere. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
