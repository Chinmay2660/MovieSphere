import { IoArrowForwardOutline } from "react-icons/io5";

const HeroSection = () => {
    return (
        <section
            className="relative flex  h-[80vh] items-center justify-center mt-24 mb-24 mx-auto max-w-screen-xl sm:px-8 bg-cover bg-center"
            style={{ marginTop: '-2rem' }}
        >
            <div className="text-center text-white">
                <h1 className="text-white font-bold text-4xl md:text-6xl mb-4">
                    <span className="block mb-2">MovieSphere</span>
                    <span className="text-tertiary">Search TV Shows, Movies Online</span>
                </h1>
                <p className="text-white font-bold text-2xl max-w-xl leading-relaxed mx-auto mb-8">
                    Thousands of movies and TV shows
                </p>

                <div className="mt-12 flex justify-center">
                    <a href="/" className="flex items-center gap-2 py-3 px-6 text-center text-black text-base font-bold bg-text hover:bg-secondary active:shadow-none rounded-lg shadow">
                        <span>Watch Now</span>
                        <IoArrowForwardOutline className="text-black w-6 h-6" />
                    </a>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
