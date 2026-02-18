// components/Hero.tsx

export default function Hero() {
    return (
        <section className="relative w-full">

            {/* ─── MOBILE LAYOUT (block, flex-col) ─── */}
            {/* ─── DESKTOP LAYOUT (background image, min-h) ─── */}

            {/* === MOBILE: Top Banner Image (sirf mobile pe dikhega) === */}
            <div className="block md:hidden w-full">
                <img
                    src="/Ingram-Banner-2-1.png"
                    alt="Ingram Banner"
                    className="w-full h-[220px] object-cover object-right"
                />
            </div>

            {/* === MAIN SECTION: Desktop pe background, Mobile pe plain === */}
            <div
                className="
                    relative
                    w-full
                    md:min-h-[600px]
                    lg:min-h-[700px]
                    md:bg-cover
                    md:bg-no-repeat
                    md:bg-right
                    
                "
                style={{
                    backgroundImage: "url('/Ingram-Banner-2-1.png')",
                }}
            >
                {/* Desktop pe background image hai, mobile pe white background */}
                <div className="max-w-7xl mx-auto px-6 py-10 md:py-0 md:h-[600px] lg:h-[700px] md:flex md:items-center">
                    <div className="max-w-2xl text-center md:text-left">

                        {/* H1 - Heading */}
                        <h1 className="
                            font-[var(--font-inter)]
                            font-semibold
                            uppercase
                            text-[#5C5C5C]
                            text-[22px] leading-[30px]
                            sm:text-[22px] sm:leading-[30px]
                            md:text-[44px] md:leading-[44px]
                            lg:text-[48px] lg:leading-[48px]
                            mb-4
                        ">
                            Ingram Micro and <br /> Microsoft Surface
                        </h1>

                        {/* Paragraph - Description */}
                        <p className="
                            text-gray-600
                            mb-6
                            text-sm leading-6
                            sm:text-sm sm:leading-6
                            md:text-lg md:leading-8
                        ">
                            Your Ingram Micro and Microsoft Surface team has created an exclusive
                            demo program that gives resellers the ability to customize, compare
                            and evaluate the most cutting-edge Surface devices in a few simple steps.
                        </p>

                        {/* Logo Image - Mobile pe beech mein, Desktop pe bhi yahan */}
                        <div className="flex items-center gap-6 mb-6 justify-center md:justify-start">
                            <img
                                src="/Logos-ingram.png"
                                alt="Ingram Micro Logo"
                                className="h-10 w-auto"
                            />
                        </div>

                        {/* CTA Button */}
                        <div className="flex justify-center md:justify-start">
                        <a
                            href="/create-demo-kit"
                           className="
        inline-flex
        items-center
        justify-center
        font-medium
        text-[15px]
        leading-[15px]
        text-white
        custom-blue
        px-6 py-3
        sm:px-6 sm:py-3
        md:px-10 md:py-5
        rounded-md
        transition
    "
                        >
                            Create Demo Kit
                        </a>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}