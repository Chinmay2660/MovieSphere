import { features } from "../../lib/constants"

const Features = () => {
    return (
        <section className="py-14 bg-background">
            <div className="max-w-screen-xl mx-auto px-4 text-secondary md:px-8">
                <div className="relative max-w-2xl mx-auto sm:text-center">
                    <div className="relative z-10">
                        <h3 className="text-text mb-8 text-5xl font-semibold">
                            Features
                        </h3>
                        <p className="mt-3 text-text">
                            MovieSphere offers a host of powerful features designed to enhance your movie-watching experience.
                        </p>
                    </div>
                </div>
                <div className="relative mt-12">
                    <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {
                            features.map((item, idx) => (
                                <li key={idx} className="bg-background space-y-3 p-4 border border-secondary rounded-lg">
                                    <div className="text-primary pb-3">
                                        {item.icon}
                                    </div>
                                    <h4 className="text-lg text-text font-semibold">
                                        {item.title}
                                    </h4>
                                    <p className="text-text">
                                        {item.desc}
                                    </p>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default Features