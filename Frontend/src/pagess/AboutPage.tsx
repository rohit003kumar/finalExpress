// import React from 'react';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import HeroSection from '../components/about/HeroSection';
// import MissionSection from '../components/about/MissionSection';
// import ServicesSection from '../components/about/ServicesSection';
// // import TestimonialsSection from '../components/about/TestimonialsSection';
// import FaqSection from '../components/about/FaqSection';

// const AboutPage: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
//         <Navbar />
        
//             {/* Main content of the About page */}
//         <HeroSection />
//         <MissionSection />
//         <ServicesSection />
//         {/* <TestimonialsSection /> */}
//         <FaqSection />
      
//       <Footer />
//     </div>
//   );
// };

// export default AboutPage;







import React, { Suspense, lazy } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ✅ Lazy-load sections for performance
const HeroSection = lazy(() => import('../components/about/HeroSection'));
const MissionSection = lazy(() => import('../components/about/MissionSection'));
const ServicesSection = lazy(() => import('../components/about/ServicesSection'));
// const TestimonialsSection = lazy(() => import('../components/about/TestimonialsSection'));
const FaqSection = lazy(() => import('../components/about/FaqSection'));

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      <Navbar />

      {/* ✅ Suspense fallback while sections load */}
      <Suspense fallback={<div className="min-h-[300px]" />}>
        <HeroSection />
        <MissionSection />
        <ServicesSection />
        {/* <TestimonialsSection /> */}
        <FaqSection />
      </Suspense>

      <Footer />
    </div>
  );
};

export default AboutPage;
