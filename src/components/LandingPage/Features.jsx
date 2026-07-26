import { motion, useInView } from 'framer-motion';
import { features } from "../../lib/constants";
import { useRef } from 'react';

const Features = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section ref={ref} className="relative z-10 apple-section">
            <div className="apple-container">
                <motion.div
                    className="mx-auto max-w-2xl text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <span className="section-label">Why MovieSphere</span>
                    <h2 className="apple-title-1 mt-3 text-text sm:apple-large-title">
                        Streaming, India-style
                    </h2>
                    <p className="apple-subheadline mt-3">
                        No clutter. No paywalls. Bollywood, regional cinema, and web series — polished for how you watch.
                    </p>
                </motion.div>

                <motion.ul
                    className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
                    }}
                >
                    {features.map((item, idx) => (
                        <motion.li
                            key={idx}
                            className="group bento-card"
                            variants={{
                                hidden: { opacity: 0, y: 16 },
                                visible: { opacity: 1, y: 0 },
                            }}
                        >
                            <div className="mb-3 inline-flex glass-pill p-3 text-secondary transition-colors group-hover:text-accent">
                                {item.icon}
                            </div>
                            <h3 className="apple-headline text-text">{item.title}</h3>
                            <p className="apple-footnote mt-1.5">{item.desc}</p>
                        </motion.li>
                    ))}
                </motion.ul>
            </div>
        </section>
    );
};

export default Features;
