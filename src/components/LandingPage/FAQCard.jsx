import { useState } from "react";
import PropTypes from "prop-types";

const FAQCard = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="space-y-3 mt-5 overflow-hidden bg-background rounded-lg p-4 border border-secondary" onClick={handleToggle}>
            <h4 className="cursor-pointer flex items-center justify-between text-lg text-text font-bold">
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
            {isOpen && <div className={`transition-all duration-500 ease-in-out ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
                <p className="text-text mt-3">
                    {props.faqsList.a}
                </p>
            </div>}
        </div>
    );
};

FAQCard.propTypes = {
    faqsList: PropTypes.shape({
        q: PropTypes.string.isRequired,
        a: PropTypes.string.isRequired
    }).isRequired,
};

export default FAQCard;