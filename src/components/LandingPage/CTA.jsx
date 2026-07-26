import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { IoArrowForwardOutline, IoPlay } from "react-icons/io5";

const CTA = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section ref={ref} className="relative z-10 apple-container pb-12 sm:pb-16">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
            >
                <div className="relative overflow-hidden rounded-[1.75rem] liquid-glass glow-ring px-5 py-12 text-center sm:rounded-[2rem] sm:px-10 sm:py-14">
                    <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-accent/30 blur-[80px]" aria-hidden />
                    <div className="pointer-events-none absolute -bottom-16 right-8 h-32 w-32 rounded-full bg-accent-purple/25 blur-[60px]" aria-hidden />

                    <span className="section-label">Get started</span>
                    <h2 className="apple-title-1 mt-3 text-text sm:apple-large-title">
                        Your next favorite film is one tap away.
                    </h2>
                    <p className="apple-subheadline mx-auto mt-3 max-w-md">
                        Hindi, Marathi, English, and regional picks — thousands streaming free on MovieSphere.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <a href="/home" className="btn-primary gap-2">
                            <IoPlay className="h-4 w-4" />
                            Start Watching
                            <IoArrowForwardOutline className="h-4 w-4" />
                        </a>
                        <a href="/tv" className="btn-ghost">
                            Browse Web Series
                        </a>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default CTA;
