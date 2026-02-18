// components/HowItWorks.tsx

"use client"

import StepCard from "./step-card"

const STEPS = [
  { title: 'REGISTRATION', description: 'Complete the registration process to start using the portal', icon: '/autocomp.png', number: 1, color: "#e28743" },
  { title: 'CREATE DEMO KIT', description: 'Choose between different products for a 30-days demo', icon: '/vector.png', number: 2, color: "#2f9e44" },
  { title: 'CHECKOUT', description: 'Fill out the form with shipping & opportunity details and checkout easily', icon: '/checkout.png', number: 3, color: "#ff4d4f" },
  { title: 'ORDER SHIPMENT', description: 'Seamless overnight shipment after order approval', icon: '/shipment.png', number: 4, color: "#1e90ff" },
  { title: 'RETURN ORDER', description: 'Simple order return using hard/soft copy of provided prepaid return label', icon: '/return.png', number: 5, color: "#ffb703" },
  { title: 'REPORT A WIN', description: 'Close customer after demo period and enter win details', icon: '/trophy.png', number: 6, color: "#9b5de5" },
]

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E8F0FE] via-white to-[#F8F9FA] pt-[5vh] md:pt-[9vh]">
      <div className="max-w-[1900px] mx-auto w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        <h2 className="text-center text-xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-10 md:mb-20">
          How it Works
        </h2>

        {/* Responsive Grid */}
        <div
          className="
            grid 
            grid-cols-1 
            md:grid-cols-3 
            lg:grid-cols-3 
            gap-10 
            justify-items-center
          "
        >
          {STEPS.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  )
}