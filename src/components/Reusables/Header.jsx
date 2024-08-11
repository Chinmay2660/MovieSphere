import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { IoSearchOutline, IoMenuOutline, IoCloseOutline } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';
import { navigation } from '../../lib/constants';
import HamburgerMenu from './HamburgerMenu';

const Header = () => {
    const { scrollY } = useScroll();
    const [visible, setVisible] = useState(true);
    const [activePath, setActivePath] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const searchRef = useRef(null);

    useEffect(() => {
        setActivePath(location.pathname);
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
                setSearchQuery('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useMotionValueEvent(scrollY, "change", (current) => {
        if (current > 100) {
            setVisible(false);
        } else {
            setVisible(true);
        }
    });

    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const handleSearchChange = debounce((value) => {
        if (value) {
            navigate(`/search?q=${encodeURIComponent(value)}`);
        }
    }, 600);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        handleSearchChange(value);
    };

    return (
        <AnimatePresence>
            {/* Desktop Header */}
            <motion.div
                initial={{ opacity: 1, y: -100 }}
                animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden md:flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent rounded-full bg-black text-white shadow z-50 px-4 py-1 items-center justify-center space-x-4"
            >
                <div className="flex items-center space-x-4">
                    {navigation.map((item, idx) => {
                        const isActive = activePath === item.path;
                        return (
                            <button
                                key={idx}
                                onClick={() => navigate(item.path)}
                                className={`text-sm font-semibold px-3 py-1 rounded-full transition-transform duration-300 ${isActive ? 'bg-white text-black transform scale-105' : 'text-gray-400 hover:text-white'}`}
                            >
                                {item.title}
                            </button>
                        );
                    })}
                </div>

                {isSearchOpen ? (
                    <motion.div
                        ref={searchRef}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex items-center space-x-2"
                    >
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleInputChange}
                            placeholder="Search..."
                            className="p-2 rounded-full border border-gray-700 bg-gray-800 text-white"
                        />
                    </motion.div>
                ) : (
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className={`p-2 rounded-full transition-transform duration-300 ${location.pathname === '/search' ? 'bg-white text-black transform scale-105' : 'text-gray-400 hover:text-white'}`}
                    >
                        <IoSearchOutline className="text-xl font-bold" />
                    </button>
                )}
            </motion.div>

            {/* Mobile Header */}
            <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -100 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden fixed top-0 inset-x-0 flex items-center p-4 bg-black text-white z-50"
            >
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} >
                    {isMenuOpen ? <IoCloseOutline className="text-3xl font-bold" /> : <IoMenuOutline className="text-2xl font-bold" />}
                </button>

                <div className="relative flex-1">
                    {!isSearchOpen ? (
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={`p-2 rounded-full transition-transform duration-300 absolute right-4 top-1/2 transform -translate-y-1/2 ${location.pathname === '/search' ? 'bg-white text-black transform scale-105' : 'text-gray-400 hover:text-white'}`}
                        >
                            <IoSearchOutline className="text-2xl font-bold" />
                        </button>
                    ) : (
                        <motion.div
                            ref={searchRef}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className=" absolute right-2 -top-5 transform -translate-y-1/2 "
                        >
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleInputChange}
                                placeholder="Search..."
                                className="p-2 rounded-full border border-gray-700 bg-gray-800 text-white"
                            />
                        </motion.div>
                    )}
                </div>
            </motion.div>

            <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </AnimatePresence>
    );
};

export default Header;
