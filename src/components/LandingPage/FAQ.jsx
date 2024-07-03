import { faqsList } from "../../lib/constants";
import FAQCard from "./FAQCard";

const FAQ = () => {
    return (
        <section className="leading-relaxed max-w-screen-xl mt-10 mb-10 mx-auto px-4 md:px-8">
            <div className="space-y-3 text-center">
                <h1 className="text-5xl text-text font-semibold">
                    Frequently Asked Questions
                </h1>
            </div>
            <div className="mt-14 max-w-2xl mx-auto">
                {faqsList.map((item, idx) => (
                    <FAQCard key={idx} faqsList={item} />
                ))}
            </div>
        </section>
    );
};

export default FAQ;