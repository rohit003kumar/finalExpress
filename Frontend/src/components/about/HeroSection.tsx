import React, { useEffect, useRef } from 'react';
import { WashingMachine } from 'lucide-react';

const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  return (
    <section 
      ref={sectionRef} 
      className="pt-32 pb-24 md:pt-40 md:pb-32 px-4 opacity-0 -translate-y-6 transition-all duration-700 ease-out"
    >
      <div className="container mx-auto text-center">
        <div className="inline-flex items-center justify-center mb-6">
          <WashingMachine className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-6">
          About <span className="text-blue-600">DhobiXpress</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
          Revolutionizing the way people handle laundry with our convenient, 
          eco-friendly and technology-driven approach to washing, folding, and delivery.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a 
            href="/services" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            Our Services
          </a>
          <a 
            href="/contact" 
            className="bg-white hover:bg-slate-100 text-blue-600 border border-blue-600 px-8 py-3 rounded-full font-medium transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
