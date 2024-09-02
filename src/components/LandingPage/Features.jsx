import { motion, useInView } from 'framer-motion';
import { features } from "../../lib/constants";
import { useRef } from 'react';

const Features = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <section ref={ref} className="pt-14 bg-background">
            <div className="max-w-screen-xl mx-auto px-4 text-secondary md:px-8">
                <div className="relative max-w-2xl mx-auto sm:text-center">
                    <motion.div
                        className="relative z-10"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3 className="text-text mb-8 text-5xl font-semibold text-center">
                            Features
                        </h3>
                        <p className="mt-3 text-text text-center">
                            MovieSphere offers a host of powerful features designed to enhance your movie-watching experience.
                        </p>
                    </motion.div>
                </div>
                <motion.div
                    className="relative mt-12"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.3,
                            }
                        }
                    }}
                >
                    <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((item, idx) => (
                            <motion.li
                                key={idx}
                                className="bg-background space-y-3 p-4 border border-secondary rounded-lg"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                            >
                                <div className="text-[#f8485e] pb-3">
                                    {item.icon}
                                </div>
                                <h4 className="text-lg text-text font-bold">
                                    {item.title}
                                </h4>
                                <p className="text-text">
                                    {item.desc}
                                </p>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </section>
    );
};

export default Features;