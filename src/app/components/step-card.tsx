// components/StepCard.tsx

"use client"

interface StepCardProps {
  icon: string
  title: string
  description: string
  number: number
  color: string
}

export default function StepCard({ icon, title, description, number, color }: StepCardProps) {
  return (
    <div className="relative flex justify-center mb-10 group">
      {/* Blue Background Decoration */}
      <div className="absolute -bottom-5 -right-4 bg-[#419fd4] w-22 h-22 rounded-bl-2xl rounded-tr-2xl"></div>

      {/* Colored Border Box */}
      <div
        className="absolute -top-5 -left-6 bg-transparent w-full h-40 rounded-bl-2xl rounded-tr-2xl max-w-[19rem]"
        style={{ border: `1px solid ${color}` }}
      ></div>

      {/* Blue Top Corner with Expansion Animation */}
      <div
        className="absolute -top-5 -left-6 w-16 h-16 bg-transparent 
        transition-all duration-500 ease-in-out group-hover:w-28 group-hover:h-28"
        style={{
          borderTop: `5px solid #419fd4`,
          borderLeft: `5px solid #419fd4`,
        }}
      ></div>

      {/* Main Card */}
      <div
        className="
          relative bg-gray-50 rounded-3xl border border-gray-200 
          px-6 py-4 pt-16
          md:px-6 md:py-6 md:pt-20
          w-[75vw] sm:w-[45vw] md:w-[28vw] lg:w-[24vw]
          shadow-xl transition-all duration-300 group
        "
      >
        {/* Icon Badge */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2">
          <div className="relative w-16 h-16 md:w-20 md:h-20">
            {/* Outer Circle */}
            <div
              className="absolute inset-0 rounded-full 
              bg-gradient-to-r from-[#ffffff] to-[#d9d9d9]
              shadow-[4px_4px_10px_rgba(0,0,0,0.15),-4px_-4px_10px_rgba(255,255,255,0.8)]
              transition-all duration-500 ease-in-out
              group-hover:bg-[#d1d1d1] group-hover:from-[#d9d9d9] group-hover:to-[#d9d9d9]"
            ></div>

            {/* Inner Circle with Icon */}
            <div className="absolute inset-[6px] rounded-full bg-[#f4f4f4] border border-[#f4f4f4] flex items-center justify-center shadow-sm">
              <img src={icon} alt={title} className="w-6 h-6 md:w-8 md:h-8 object-contain" />
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="flex flex-col text-center space-y-2 mt-6 md:mt-8">
          <h3 className="text-gray-600 font-extrabold text-sm md:text-xl tracking-wide">
            {title}
          </h3>
          <p className="text-gray-600 text-xs md:text-base leading-relaxed">
            {description}
          </p>
        </div>

        {/* Number Badge */}
        <div className="absolute -bottom-5 -right-4 z-10">
          <div className="bg-[#419fd4] text-white font-bold text-xl md:text-2xl w-11 h-11 md:w-14 md:h-14 flex items-center justify-center rounded-tl-3xl shadow-md">
            {number}
          </div>
        </div>
      </div>
    </div>
  )
}