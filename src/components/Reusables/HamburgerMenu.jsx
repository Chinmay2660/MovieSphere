import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from 'react-router-dom';
import { navigation } from '../../lib/constants';
import { IoCloseOutline } from 'react-icons/io5';

const HamburgerMenu = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const activePath = location.pathname;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: "-100%" }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: "-100%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="fixed inset-0 bg-black text-white flex flex-col p-6 z-50"
                >
                    <button
                        onClick={onClose}
                        className="self-end text-2xl mb-6"
                    >
                        <IoCloseOutline />
                    </button>
                    <div className="flex flex-col items-center justify-center flex-1 space-y-4">
                        {navigation.map((item, idx) => {
                            const isActive = activePath === item.path;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        navigate(item.path);
                                        onClose();
                                    }}
                                    className={`text-lg font-semibold px-4 py-2 rounded-full transition-transform duration-300 ${isActive ? 'bg-white text-black transform scale-105' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {item.title}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HamburgerMenu;
