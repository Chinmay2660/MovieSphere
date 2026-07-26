import { motion, useInView } from 'framer-motion';
import { faqsList } from "../../lib/constants";
import FAQCard from "./FAQCard";
import { useRef } from 'react';

const FAQ = () => {
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
                    <span className="section-label">FAQ</span>
                    <h2 className="apple-title-1 mt-3 text-text">Got questions? We&apos;ve got answers.</h2>
                    <p className="apple-subheadline mt-3">Everything you need to know before you hit play.</p>
                </motion.div>

                <motion.div
                    className="mx-auto mt-10 max-w-2xl space-y-2 sm:mt-12"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
                    }}
                >
                    {faqsList.map((item, idx) => (
                        <motion.div
                            key={idx}
                            variants={{
                                hidden: { opacity: 0, y: 16 },
                                visible: { opacity: 1, y: 0 },
                            }}
                        >
                            <FAQCard faqsList={item} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default FAQ;
