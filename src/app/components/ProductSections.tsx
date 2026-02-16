import Image from "next/image";

export default function ProductSections() {
    return (
        <>
            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                        {/* LEFT COLUMN */}
                        <div className="text-center">
                            <h2 className="text-4xl font-semibold text-black mt-28 mb-3">
                                Welcome to the family
                            </h2>

                            <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
                                Upgrade the experience with incredible speed, enhanced battery
                                life and game-changing AI experiences — all in the signature
                                Surface design you know and love.
                            </p>

                            <Image
                                src="/Layer-21.png"
                                alt="Surface family"
                                width={1200}
                                height={800}
                                className="w-full h-auto rounded-2xl mb-6"
                                priority
                            />

                            <h3 className="text-xl font-medium text-black mb-2">
                                Discover the Surface 2-in-1 PC collection
                            </h3>

                            <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
                                Explore versatile devices designed for creativity and productivity.
                            </p>

                            <a
                                href="/create-demo-kit"
                                className="inline-flex items-center justify-center gap-1 text-m font-largr text-blue-600 hover:underline mb-6"
                            >
                                Explore Surface 2-in-1 PCs
                                <span className="text-base">›</span>
                            </a>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="text-center">
                            <Image
                                src="/Layer-20.png"
                                alt="Surface Laptop"
                                width={1200}
                                height={800}
                                className="w-full h-auto rounded-2xl mb-6"
                            />

                            <h3 className="text-2xl font-semibold text-black mb-2">
                                Meet the Surface laptops
                            </h3>

                            <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
                                The ultimate in style, speed and power. An ultra-premium experience.
                            </p>

                            <a
                                href="#"
                                className="inline-flex items-center justify-center gap-1 text-m font-largr text-blue-600 hover:underline mb-6"
                            >
                                See All Surface Laptops
                                <span className="text-base">›</span>
                            </a>

                            <Image
                                src="/Layer-22.png"
                                alt="Surface devices"
                                width={1200}
                                height={800}
                                className="w-full h-auto rounded-2xl mb-4"
                            />

                            <a
                                href="/create-demo-kit"
                                className="inline-flex items-center justify-center gap-1 text-m font-largr text-blue-600 hover:underline mb-6"
                            >
                                All Devices
                            </a>
                        </div>

                    </div>
                </div>
            </section>

            {/* FULL WIDTH IMAGE BELOW SECTION */}
            <div className="w-full px-6">
                <Image
                    src="/promobanner.png"   // ← your new image
                    alt="Explore the AI-powered capabilities of Microsoft Surface Copilot+ PCs"
                    width={1920}
                    height={430}
                    className="w-full h-auto rounded-2xl"
                    priority
                />
            </div>
        </>
    );
}
