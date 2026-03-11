import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
    {
        step: "1",
        title: "Browse",
        description: "Explore thousands of movies and TV shows across genres. Search or filter to find what you love.",
    },
    {
        step: "2",
        title: "Pick & Watch",
        description: "Choose what to watch and start streaming instantly. No sign-up required to get started.",
    },
    {
        step: "3",
        title: "Enjoy Anywhere",
        description: "Watch on any device—phone, tablet, laptop, or TV. Your picks sync across devices.",
    },
];

const HowItWorks = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <section ref={ref} className="pt-14 pb-14 bg-background">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <motion.div
                    className="text-center max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h3 className="text-text text-5xl font-semibold mb-3">
                        How it works
                    </h3>
                    <p className="text-text text-muted">
                        Start watching in three simple steps. No subscriptions, no hassle.
                    </p>
                </motion.div>
                <motion.div
                    className="mt-12 grid gap-8 sm:grid-cols-3"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.2 },
                        },
                    }}
                >
                    {steps.map((item, idx) => (
                        <motion.div
                            key={idx}
                            className="group text-center p-6 border border-white/20 rounded-lg bg-background transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02]"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                        >
                            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white/80 text-xl font-bold mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:text-primary">
                                {item.step}
                            </span>
                            <h4 className="text-lg text-text font-bold mb-2">
                                {item.title}
                            </h4>
                            <p className="text-text text-muted text-sm">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;
