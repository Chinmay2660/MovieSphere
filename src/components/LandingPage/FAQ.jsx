import { motion, useInView } from 'framer-motion';
import { faqsList } from "../../lib/constants";
import FAQCard from "./FAQCard";
import { useRef } from 'react';

const FAQ = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <section ref={ref} className="leading-relaxed max-w-screen-xl mt-10 mb-10 mx-auto px-4 md:px-8">
            <div className="space-y-3 text-center">
                <h1 className="text-5xl text-text font-semibold">
                    Frequently Asked Questions
                </h1>
            </div>
            <motion.div
                className="mt-14 max-w-2xl mx-auto"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
                }}
            >
                {faqsList.map((item, idx) => (
                    <motion.div
                        key={idx}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                    >
                        <FAQCard key={idx} faqsList={item} />
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default FAQ;