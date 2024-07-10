import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigation } from '../../lib/constants';
import logo from '../../assets/logo.svg';
import { IoSearchOutline } from 'react-icons/io5';

const Header = () => {
    const [searchInput, setSearchInput] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [isTransparent, setIsTransparent] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (searchInput) {
            navigate(`/search?q=${searchInput}`);
        }
    }, [searchInput, navigate]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY === 0) {
                setIsTransparent(true);
            } else if (window.scrollY > lastScrollY) {
                setIsVisible(false);
                setIsTransparent(false);
            } else {
                setIsVisible(true);
                setIsTransparent(false);
            }
            setLastScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <nav
            className={`fixed top-0 z-50 w-full transition-all duration-300 ${
                isVisible ? 'translate-y-0' : '-translate-y-full'
            } ${isTransparent ? 'bg-transparent' : 'bg-background bg-opacity-100'}`}
        >
            <div className="items-center max-w-screen-xl mx-auto flex px-8">
                <div className="flex items-center justify-between py-4 w-full">
                    <div className="flex items-center gap-6">
                        <a href="/">
                            <img
                                src={logo}
                                width={120}
                                height={50}
                                alt="Float UI logo"
                            />
                        </a>
                        <div className="flex items-center space-x-6">
                            {navigation.map((item, idx) => (
                                <a
                                    key={idx}
                                    href={item.path}
                                    className="text-text text-base font-bold hover:text-secondary"
                                >
                                    {item.title}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                            <div className="relative w-full md:w-80">
                                <IoSearchOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text hover:text-gray-200" />
                                <input
                                    type="text"
                                    placeholder="Find Movies, TV shows and more"
                                    className={`py-2 pl-10 pr-4 w-full border rounded-lg border-gray-500 focus:outline-none focus:border-gray-400 hover:border-gray-400 ${
                                        isTransparent ? 'bg-transparent' : 'bg-background'
                                    } text-text hover:text-gray-200`}
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                            </div>
                        </form>

                        {/* <a
                            href="/login"
                            className="block py-3 text-center text-text text-base font-bold hover:text-secondary border rounded-lg border-none"
                        >
                            Log in
                        </a>
                        <a
                            href="/register"
                            className="block py-2 px-6 text-center text-text text-base font-bold bg-primary hover:bg-indigo-500 active:bg-indigo-700 active:shadow-none rounded-lg shadow"
                        >
                            Register
                        </a> */}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
