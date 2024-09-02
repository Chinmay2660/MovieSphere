import { useState } from "react";
import { motion } from "framer-motion";

const FAQCard = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div
            className="space-y-3 mt-5 overflow-hidden bg-background rounded-lg p-4 border border-secondary cursor-pointer"
            onClick={handleToggle}
        >
            <h4 className="flex items-center justify-between text-lg text-text font-bold">
                {props.faqsList.q}
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                )}
            </h4>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: isOpen ? "auto" : 0, marginTop: 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
            >
                <p className="text-text mt-3">
                    {props.faqsList.a}
                </p>
            </motion.div>
        </div>
    );
};

export default FAQCard;