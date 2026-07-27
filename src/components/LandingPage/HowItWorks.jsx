import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { IoCompassOutline, IoPlayOutline, IoPhonePortraitOutline } from "react-icons/io5";

const steps = [
    {
        step: "01",
        icon: IoCompassOutline,
        title: "Discover",
        description: "Browse Hindi, Marathi, English, and regional collections — or search for exactly what you're in the mood for.",
    },
    {
        step: "02",
        icon: IoPlayOutline,
        title: "Press Play",
        description: "Tap any title for trailers, cast info, and similar picks. Hit play and streaming starts immediately.",
    },
    {
        step: "03",
        icon: IoPhonePortraitOutline,
        title: "Watch Your Way",
        description: "Save to your watchlist, download for offline, and switch between phone, tablet, or desktop seamlessly.",
    },
];

const HowItWorks = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section ref={ref} className="relative z-10 apple-section">
            <div className="apple-container">
                <motion.div
                    className="mx-auto max-w-xl text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <span className="section-label">How it works</span>
                    <h2 className="apple-title-1 mt-3 text-text">From open to watching in under a minute</h2>
                    <p className="apple-subheadline mt-3">No onboarding flows. No credit card forms. Just cinema.</p>
                </motion.div>

                <motion.div
                    className="relative mt-10 grid gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                    }}
                >
                    {steps.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={idx}
                                className="bento-card relative text-center sm:text-left"
                                variants={{
                                    hidden: { opacity: 0, y: 16 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                            >
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl glass-pill text-accent sm:mx-0">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <span className="apple-caption-1 font-semibold text-accent">{item.step}</span>
                                <h3 className="apple-headline mt-2 text-text">{item.title}</h3>
                                <p className="apple-footnote mt-1.5">{item.description}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;
