const CTA = () => {
    return (
        <section className="py-14 pt-8 bg-background">
            <div className="max-w-screen-xl mx-auto px-4 md:text-center md:px-8">
                <div className="max-w-xl md:mx-auto">
                    <h3 className="text-text text-3xl font-semibold sm:text-4xl">
                        Get an account today
                    </h3>
                    <p className="mt-5 text-text">
                        Access free content on all of your devices, sync your list, and continue watching anywhere.
                    </p>
                </div>
                <div className="flex gap-3 items-center mt-6 md:justify-center">
                    <a href="/" className="flex items-center gap-2 py-3 px-6 text-center text-black text-base font-bold bg-text hover:bg-secondary active:shadow-none rounded-lg shadow">
                        Register Free
                    </a>
                </div>
            </div>
        </section>
    )
}

export default CTA