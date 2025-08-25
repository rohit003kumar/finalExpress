// File: LaundryHome.tsx
import { Star } from "lucide-react";

const LaundryHome = () => {
  return (
    <div className="text-gray-600 font-sans">
      {/* HERO SECTION */}
      <section className="bg-blue-50 py-5 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          Professional Laundry <br />
          <span className="text-blue-600">At Your Doorstep</span>
        </h1>
        <p className="mt-1 text-md max-w-2xl mx-auto">
          Experience hassle-free laundry service with pickup and delivery.
          Quality cleaning, affordable prices, and reliable service guaranteed.
        </p>
{/*         <div className="mt-6 flex justify-center items-center gap-4 flex-wrap">
//           <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow font-medium">
//             Book Now
//           </button> 

        </div> */}
      </section>

      {/* FEATURES */}
      <section className="bg-blue-50 py-5 px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
          <div className="text-blue-600 text-4xl">✔️</div>
          <h3 className="text-xl font-semibold mt-2">Quality Guaranteed</h3>
          <p>100% satisfaction or money back</p>
        </div>
        <div>
          <div className="text-blue-600 text-4xl">🛡️</div>
          <h3 className="text-xl font-semibold mt-2">Safe & Secure</h3>
          <p>Eco-friendly cleaning products</p>
        </div>
        <div>
          <div className="text-blue-600 text-4xl">🚚</div>
          <h3 className="text-xl font-semibold mt-2">Free Delivery</h3>
          <p>Convenient doorstep service</p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-white py-9 px-4 text-center">
        <h2 className="text-4xl font-bold mb-8">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Ironing Service",
              desc: "Professional ironing for wrinkle-free clothes",
              icon: "🧼",
            },
            {
              title: "Wash",
              desc: "Deep cleaning with fabric softener",
              icon: "✨",
            },
            {
              title: "Dry Cleaning",
              desc: "Professional dry cleaning for delicate items",
              icon: "🛡️",
            },
            {
              title: "Express Service",
              desc: "Same day pickup and delivery",
              icon: "⏱️",
            },
          ].map((service) => (
            <div
              key={service.title}
              className="border rounded-lg p-6 shadow hover:shadow-md transition"
            >
              <div className="text-3xl">{service.icon}</div>
              <h4 className="text-xl font-semibold mt-2">{service.title}</h4>
              <p className="text-sm mt-1">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gray-50 py-12 px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "1. Schedule Pickup",
              desc: "Book online or call us to schedule a convenient pickup time",
              icon: "📅",
            },
            {
              title: "2. We Clean",
              desc: "Professional cleaning with eco-friendly detergents and care",
              icon: "🧽",
            },
            {
              title: "3. We Iron",
              desc: "Expert ironing service for perfectly pressed clothes",
              icon: "🧺",
            },
            {
              title: "4. Free Delivery",
              desc: "Clean, fresh clothes delivered back to your doorstep",
              icon: "🚛",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="rounded-lg border p-6 bg-white shadow hover:shadow-md transition"
            >
              <div className="text-3xl mb-2">{step.icon}</div>
              <h4 className="text-lg font-semibold">{step.title}</h4>
              <p className="text-sm mt-1">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LaundryHome;










// // File: LaundryHome.tsx
// import { Star } from "lucide-react";

// const LaundryHome = () => {
//   return (
//     <div className="text-gray-800 font-sans text-sm">
//       {/* HERO SECTION */}
//       <section className="bg-blue-50 py-10 px-2 text-center">
//         <h1 className="text-1xl md:text-3xl font-bold leading-tight">
//           Professional Laundry <br />
//           <span className="text-blue-600">At Your Doorstep</span>
//         </h1>
//         <p className="mt-2 text-xs md:text-sm max-w-md mx-auto">
//           Hassle-free laundry with pickup and delivery. Quality cleaning and affordable prices.
//         </p>
//         <div className="mt-4 flex justify-center items-center gap-2 flex-wrap">
//           <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded shadow text-sm">
//             Book Now
//           </button>
//         </div>
//       </section>

//       {/* FEATURES */}
//       <section className="bg-blue-50 py-4 px-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
//         <div>
//           <div className="text-blue-600 text-2xl">✔️</div>
//           <h3 className="text-base font-semibold mt-1">Quality Guaranteed</h3>
//           <p className="text-xs">100% satisfaction or money back</p>
//         </div>
//         <div>
//           <div className="text-blue-600 text-2xl">🛡️</div>
//           <h3 className="text-base font-semibold mt-1">Safe & Secure</h3>
//           <p className="text-xs">Eco-friendly cleaning products</p>
//         </div>
//         <div>
//           <div className="text-blue-700 text-3xl">🚚</div>
//           <h3 className="text-base font-semibold mt-1">Free Delivery</h3>
//           <p className="text-xs">Convenient doorstep service</p>
//         </div>
//       </section>

//       {/* SERVICES */}
//       <section className="bg-white py-6 px-2 text-center">
//         <h2 className="text-2xl font-bold mb-4">Our Services</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 max-w-8xl mx-auto text-sm">
//           {[
//             {
//               title: "Ironing Service",
//               desc: "Wrinkle-free clothes, professionally ironed.",
//               icon: "🧼",
//             },
//             {
//               title: "Wash",
//               desc: "Deep cleaning with fabric softener.",
//               icon: "✨",
//             },
//             {
//               title: "Dry Cleaning",
//               desc: "Careful dry cleaning for delicate items.",
//               icon: "🛡️",
//             },
//             {
//               title: "Express Service",
//               desc: "Same day pickup & delivery.",
//               icon: "⏱️",
//             },
//           ].map((service) => (
//             <div
//               key={service.title}
//               className="border rounded p-4 shadow hover:shadow-md transition"
//             >
//               <div className="text-xl">{service.icon}</div>
//               <h4 className="text-base font-semibold mt-2">{service.title}</h4>
//               <p className="text-xs mt-1">{service.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//   {/* HOW IT WORKS */}
//       <section className="bg-gray-50 py-12 px-4 text-center">
//         <h2 className="text-3xl font-bold mb-8">How It Works</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
//            {[
//             {
//               title: "1. Schedule Pickup",
//               desc: "Book online or call us to schedule a convenient pickup time",
//               icon: "📅",
//             },
//             {
//               title: "2. We Clean",
//               desc: "Professional cleaning with eco-friendly detergents and care",
//               icon: "🧽",
//             },
//             {
//               title: "3. We Iron",
//               desc: "Expert ironing service for perfectly pressed clothes",
//               icon: "🧺",
//             },
//             {
//               title: "4. Free Delivery",
//               desc: "Clean, fresh clothes delivered back to your doorstep",
//               icon: "🚛",
//             },
//           ].map((step) => (
//             <div
//               key={step.title}
//               className="rounded-lg border p-6 bg-white shadow hover:shadow-md transition"
//             >
//               <div className="text-3xl mb-2">{step.icon}</div>
//               <h4 className="text-lg font-semibold">{step.title}</h4>
//               <p className="text-sm mt-1">{step.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default LaundryHome;

