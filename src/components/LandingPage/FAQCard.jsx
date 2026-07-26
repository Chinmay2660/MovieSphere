import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronDown } from "react-icons/io5";

const FAQCard = ({ faqsList }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={`bento-card cursor-pointer transition-all duration-200 ${isOpen ? "border-accent/30" : ""}`}
            onClick={() => setIsOpen(!isOpen)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setIsOpen(!isOpen)}
            aria-expanded={isOpen}
        >
            <div className="flex items-center justify-between gap-4">
                <h3 className="apple-headline text-left text-text">{faqsList.q}</h3>
                <IoChevronDown
                    className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${isOpen ? "rotate-180 text-accent" : ""}`}
                />
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="apple-footnote overflow-hidden"
                    >
                        <span className="block pt-3 text-secondary">{faqsList.a}</span>
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FAQCard;
