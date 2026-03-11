import { useState } from "react";
import { motion } from "framer-motion";
import { IoChevronDown } from "react-icons/io5";

const FAQCard = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div
            className="space-y-3 overflow-hidden bg-background rounded-lg p-4 border border-white/20 hover:border-primary cursor-pointer mb-0 transition-colors duration-300"  
            onClick={handleToggle}
        >
            <h4 className="flex items-center justify-between text-lg text-text font-bold mb-0">
                {props.faqsList.q}
                <IoChevronDown
                    className={`h-5 w-5 text-text ml-2 flex-shrink-0 transition-transform duration-300 ${isOpen ? '' : '-rotate-90'}`}
                />
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