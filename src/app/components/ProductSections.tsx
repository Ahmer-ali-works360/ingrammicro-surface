// components/ProductSections.tsx 

import Image from "next/image";

export default function ProductSections() {
    return (
        <>
            <section className="bg-white py-10 md:py-16">
                <div className="max-w-7xl mx-auto px-6">

                    

                    {/* GRID - stack on mobile, side by side on desktop */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                        {/* LEFT COLUMN */}
                        <div className="text-center">
                            <div className="text-center mb-8 md:mb-12">
                        <h2 className="
                            font-semibold text-black mb-3
                            text-xl
                            md:text-3xl
                        ">
                            Welcome to the family
                        </h2>
                        <p className="
                            text-gray-700 leading-relaxed max-w-xl mx-auto
                            text-sm
                            md:text-lg
                        ">
                            Upgrade the experience with incredible speed, enhanced battery
                            life and game-changing AI experiences — all in the signature
                            Surface design you know and love.
                        </p>
                    </div>
                            <Image
                                src="/Layer-21.png"
                                alt="Surface family"
                                width={1200}
                                height={800}
                                className="w-full h-auto rounded-2xl mb-4 md:mb-6"
                                priority
                            />

                            <h3 className="
                                font-medium text-black mb-2
                                text-base
                                md:text-xl
                            ">
                                Discover the Surface 2-in-1 PC collection
                            </h3>

                            <p className="
                                text-gray-700 leading-relaxed mb-4 max-w-xl mx-auto
                                text-xs
                                md:text-lg
                            ">
                                Explore versatile devices designed for creativity and productivity.
                            </p>

                            <a
                                href="/create-demo-kit?form_factor=2%20in%201%27s"
                                className="inline-flex items-center justify-center gap-1 text-sm md:text-base text-blue-600 hover:underline mb-6"
                            >
                                Explore Surface 2-in-1 PCs
                                <span>›</span>
                            </a>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="text-center">
                            <Image
                                src="/Layer-20.png"
                                alt="Surface Laptop"
                                width={1200}
                                height={800}
                                className="w-full h-auto rounded-2xl mb-4 md:mb-6"
                            />

                            <h3 className="
                                font-semibold text-black mb-2
                                text-base
                                md:text-xl
                            ">
                                Meet the Surface laptops
                            </h3>

                            <p className="
                                text-gray-700 leading-relaxed mb-4 max-w-xl mx-auto
                                text-xs
                                md:text-lg
                            ">
                                The ultimate in style, speed and power. An ultra-premium experience.
                            </p>

                            <a
                                href="/create-demo-kit?form_factor=Notebook"
                                className="inline-flex items-center justify-center gap-1 text-sm md:text-base text-blue-600 hover:underline mb-6"
                            >
                                See All Surface Laptops
                                <span>›</span>
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
                                className="inline-flex items-center justify-center gap-1 text-sm md:text-base text-blue-600 hover:underline mb-2 md:mb-6"
                            >
                                All Devices
                            </a>
                        </div>

                    </div>
                </div>
            </section>

            {/* FULL WIDTH PROMO BANNER */}
            <div className="w-full px-4 md:px-6 mb-10">
                <Image
                    src="/promobanner.png"
                    alt="Explore the AI-powered capabilities of Microsoft Surface Copilot+ PCs"
                    width={1920}
                    height={430}
                    className="w-full h-auto rounded-xl"
                    priority
                />
            </div>
        </>
    );
}