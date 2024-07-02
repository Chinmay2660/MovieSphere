import { IoArrowForwardOutline } from "react-icons/io5";

const HeroSection = () => {
    return (
        <section
            className="relative mt-24 mb-24 mx-auto max-w-screen-xl pb-4 px-4 sm:px-8 "
        >
            <div className="absolute "></div>
            <div className="relative space-y-4 text-left text-white">
                <h1 className="text-text font-bold text-4xl md:text-5xl">
                    MovieSphere <br />
                    Search TV Shows, Movies Online.
                </h1>
                <p className="text-text font-bold max-w-xl leading-relaxed">
                    Step into a world where entertainment knows no boundaries, where your screens come alive with an endless array of captivating stories.
                </p>
            </div>

            <div className="relative mt-12 flex items-center justify-start">
                <a href="/" className="w-30 gap-2 flex items-center py-2 px-6 text-center text-text text-base font-bold bg-primary hover:bg-indigo-500 active:bg-indigo-700 active:shadow-none rounded-lg shadow">
                    <span>Watch Now</span>
                    <IoArrowForwardOutline className="text-text w-6 h-6" />
                </a>
            </div>
        </section>
    );
}

export default HeroSection;