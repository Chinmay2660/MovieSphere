import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { IoSearchOutline } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';
import { navigation } from '../../lib/constants';

const Header = () => {
    const { scrollYProgress } = useScroll();
    const [visible, setVisible] = useState(true);
    const [activePath, setActivePath] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setActivePath(location.pathname);
    }, [location]);

    useMotionValueEvent(scrollYProgress, "change", (current) => {
        if (typeof current === "number") {
            let direction = current - scrollYProgress.getPrevious();

            if (scrollYProgress.get() < 0.05) {
                setVisible(true);
            } else {
                if (direction < 0) {
                    setVisible(true);
                } else {
                    setVisible(false);
                }
            }
        }
    });

    return (
        <AnimatePresence>
            <motion.div
                initial={{
                    opacity: 1,
                    y: -100,
                }}
                animate={{
                    y: visible ? 0 : -100,
                    opacity: visible ? 1 : 0,
                }}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                }}
                className="hidden md:flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent rounded-full bg-black text-white shadow z-50 px-4 py-1 items-center justify-center space-x-4"
            >
                {navigation.map((item, idx) => {
                    const isActive = activePath === item.path;
                    return (
                        <button
                            key={idx}
                            onClick={() => navigate(item.path)}
                            className={`text-sm font-semibold px-3 py-1 rounded-full transition-transform duration-300 ${isActive ? 'bg-white text-black transform scale-105' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {item.title}
                        </button>
                    );
                })}
                <button
                    onClick={() => navigate("/search")}
                    className={`p-2 rounded-full transition-transform duration-300 ${location.pathname === '/search' ? 'bg-white text-black transform scale-105' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <IoSearchOutline className="text-lg font-bold" />
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default Header;