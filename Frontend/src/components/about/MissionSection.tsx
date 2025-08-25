import React, { useEffect, useRef } from 'react';
import { Clock, Award, Heart, Leaf } from 'lucide-react';

const MissionSection: React.FC = () => {
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
      className="py-20 bg-white opacity-0 -translate-y-6 transition-all duration-700 ease-out"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Our Mission & Values</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            At DhobiXpress, we're on a mission to give you back your precious time by handling 
            one of life's most persistent chores with care, quality, and efficiency.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-blue-50 rounded-xl p-8 text-center transform transition-transform duration-300 hover:scale-105">
            <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Time-Saving</h3>
            <p className="text-slate-600">
              We believe your time is valuable. Our services are designed to give you back hours each week.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-8 text-center transform transition-transform duration-300 hover:scale-105">
            <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Award className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Quality First</h3>
            <p className="text-slate-600">
              We treat each garment with care and attention to detail, ensuring exceptional results every time.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-8 text-center transform transition-transform duration-300 hover:scale-105">
            <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Customer Centric</h3>
            <p className="text-slate-600">
              Your satisfaction drives everything we do. We listen, adapt, and strive to exceed your expectations.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-8 text-center transform transition-transform duration-300 hover:scale-105">
            <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Leaf className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Eco-Friendly</h3>
            <p className="text-slate-600">
              We use energy-efficient machines and eco-friendly detergents to minimize our environmental impact.
            </p>
          </div>
        </div>
        
        <div className="mt-16 bg-blue-600 rounded-xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Our Story</h3>
              <p className="mb-4">
             DhobiXpress began in 2025 with a simple goal — to make laundry easier for everyone. 
             Tired of the daily hassle, we set out to build a smart,
              reliable laundry service that fits into modern lives. 
              With features like easy booking, real-time tracking,
               and smooth conversation, FoldMate was created to save time and bring comfort.
              </p>
              <p>
               What started as an idea is now a growing platform, helping students, 
               professionals, and families manage laundry effortlessly.
               DhobiXpress – your laundry, simplified.
                </p>
            </div>
            <div className="order-first md:order-last">
              <img 
                src="https://images.pexels.com/photos/5591581/pexels-photo-5591581.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="DhobiXpress team members smiling" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
