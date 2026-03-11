import { motion } from "framer-motion";
import { IoArrowForwardOutline } from "react-icons/io5";

const HeroSection = () => {
    return (
        <section
            className="relative flex h-[100vh] items-center justify-center mt-24 mb-24 mx-auto max-w-screen-xl sm:px-8 bg-cover bg-center"
            style={{ marginTop: '-2rem' }}
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className=" text-center mt-12"
            >
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                    className="text-white font-bold text-4xl md:text-6xl mb-4"
                >
                    <span className="block mb-2 text-primary">MovieSphere</span>
                    <motion.span
                        className="text-white/85"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Search TV Shows, Movies Online
                    </motion.span>
                </motion.h1>
                <p className="text-white font-bold text-2xl max-w-xl leading-relaxed mx-auto mb-8">
                    Thousands of movies and TV shows
                </p>
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex justify-center"
                >
                    <a href="/home" className="flex items-center gap-2 py-3 px-6 text-center text-base font-bold bg-white hover:bg-white/90 active:scale-[0.98] rounded-xl shadow-lg transition-all duration-200 !text-black">
                        <span>Watch Now</span>
                        <IoArrowForwardOutline className="w-6 h-6 shrink-0" style={{ color: 'black' }} />
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
}

export default HeroSection;