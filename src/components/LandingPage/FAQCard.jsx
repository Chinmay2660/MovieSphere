import { useState } from "react";

const FaqsCard = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="space-y-3 mt-5 overflow-hidden border-b" onClick={handleToggle}>
            <h4 className="cursor-pointer pb-5 flex items-center justify-between text-lg text-gray-700 font-medium">
                {/* {props.faqsList.q} */}
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                )}
            </h4>
            <div className={`duration-300 overflow-hidden ${isOpen ? "max-h-screen" : "max-h-0"}`}>
                <p className="text-gray-500">
                    {/* {props.faqsList.a} */}
                </p>
            </div>
        </div>
    );
};

export default FaqsCard;
