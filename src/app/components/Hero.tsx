// components/Hero.tsx

export default function Hero() {
    return (
        <section
            className="
                relative
                w-full
                min-h-[600px]
                bg-no-repeat
                bg-right
                bg-cover
                sm:min-h-[500px]   // Smaller screens pe height adjust
                md:min-h-[600px]   // Medium screens (tablet) pe height adjust
                lg:min-h-[700px]   // Laptop/wide screens pe height adjust
            "
            style={{
                backgroundImage: "url('/Ingram-Banner-2-1.png')",
            }}
        >
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="max-w-2xl">
                    <h1 className="
    font-[var(--font-inter)] 
    text-[28px] leading-[36px] 
    font-semibold uppercase text-[#5C5C5C]
    sm:text-[16px]  // Mobile devices ke liye font size
    sm:leading-[20px]  // Mobile devices ke liye line-height
    md:text-[44px]  // Tablet ke liye font size
    md:leading-[44px]  // Tablet aur laptop ke liye line-height
    lg:text-[48px]  // Laptop aur wide screen ke liye
    lg:leading-[48px]  // Laptop aur wide screen ke liye line-height
">
                        Ingram Micro and <br /> Microsoft Surface
                    </h1>


                    <p className="text-gray-600 text-lg mb-8
                        sm:text-base  // Mobile devices pe chhota text
                        md:text-lg    // Tablet aur laptop ke liye
                        sm:leading-7  // Mobile pe line height thoda kam
                        md:leading-8  // Tablet aur laptop pe line height thoda barhaya
                    ">
                        Your Ingram Micro and Microsoft Surface team has created an exclusive<br />
                        demo program that gives resellers the ability to customize, compare
                        and<br /> evaluate the most cutting-edge Surface devices in a few simple steps.
                    </p>

                    <div className="flex items-center gap-6 mb-8">
                        <img
                            src="/Logos-ingram.png"
                            alt="Microsoft Surface"
                            className="h-10 w-auto"
                        />
                    </div>

                    <a
                        href="/create-demo-kit"
                        className="
                            inline-flex
                            items-center
                            justify-center
                            font-roboto
                            font-medium
                            text-[15px]
                            leading-[15px]
                            text-black
                            bg-[#fece00]
                            px-10
                            py-5
                            rounded-md
                            hover:bg-yellow-500
                            transition
                            sm:px-6 sm:py-3  // Smaller screens ke liye padding adjust
                            md:px-10 md:py-5  // Medium screens pe thoda padding barhaya
                        "
                    >
                        Create Demo Kit
                    </a>
                </div>
            </div>
        </section>
    );
}
