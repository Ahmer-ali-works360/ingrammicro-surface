// // components/HowItWorks.tsx
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faFileSignature,
//   faBoxOpen,
//   faCreditCard,
//   faTruckFast,
//   faArrowRotateLeft,
//   faTrophy,
// } from "@fortawesome/free-solid-svg-icons";

// const steps = [
//   {
//     title: "Registration",
//     desc: "Complete the registration process to start using the portal.",
//     icon: faFileSignature,
//   },
//   {
//     title: "Create Demo Kit",
//     desc: "Create demo kit with selected products.",
//     icon: faBoxOpen,
//   },
//   {
//     title: "Checkout",
//     desc: "Proceed checkout and confirm order.",
//     icon: faCreditCard,
//   },
//   {
//     title: "Order Shipment",
//     desc: "Demo kit will be shipped to you.",
//     icon: faTruckFast,
//   },
//   {
//     title: "Return Order",
//     desc: "Return demo kit after completion.",
//     icon: faArrowRotateLeft,
//   },
//   {
//     title: "Report a Win",
//     desc: "Report your successful project.",
//     icon: faTrophy,
//   },
// ];

// export default function HowItWorks() {
//   return (
//     <section className=" py-[88px] px-6">
//       <div className="max-w-[1200px] mx-auto px-6">
//         {/* Heading */}
//         <h2 className="text-[28px] font-semibold text-center mb-14 text-gray-900">
//           Let’s get started
//         </h2>

//         {/* Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
//           {steps.map((step, i) => (
//             <div
//               key={i}
//               className="
//                 relative
//                 bg-white
//                 rounded-[18px]
//                 px-8
//                 pt-12
//                 pb-16
//                 text-center
//                 shadow-[0_6px_20px_rgba(0,0,0,0.08)]
//                 group
//               "
//             >
//               {/* Icon circle */}
//               <div className="flex justify-center mb-6">
//                 <div
//                   className="
//       w-[72px]
//       h-[72px]
//       rounded-full
//       bg-gray-100
//       border-[5px]
//       border-gray-100
//       shadow-[5px_0_5px_rgba(0,0,0,0.164)]
//       flex
//       items-center
//       justify-center
//       transition-colors
//       duration-200
//       group-hover:border-[#D1D1D1]
//     "
//                 >
//                   <FontAwesomeIcon
//                     icon={step.icon}
//                     className="text-[#1E73BE] text-[30px]"
//                   />
//                 </div>
//               </div>


//               {/* Title */}
//               <h3 className="text-[16px] font-semibold uppercase tracking-wide text-gray-800 mb-3">
//                 {step.title}
//               </h3>

//               {/* Description */}
//               <p className="text-[14px] leading-[1.6] text-gray-600 px-2">
//                 {step.desc}
//               </p>

//               {/* Number badge — exact overlap */}
//               <span
//                 className="
//                   absolute
//                   -bottom-6
//                   -right-6
//                   w-[64px]
//                   h-[44px]
//                   bg-[#3FA0D9]
//                   text-white
//                   text-[18px]
//                   font-semibold
//                   flex
//                   items-center
//                   justify-center
//                 "
//                 style={{
//                   borderTopLeftRadius: "12px",
//                 }}
//               >
//                 {i + 1}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
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
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E8F0FE]  via-white to-[#F8F9FA] pt-[9vh]">
      <div className="max-w-[1900px] mx-auto w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 ">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-semibold text-gray-900   mb-20">
          How it Works
        </h2>

        {/* ✅ Responsive Grid */}
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
