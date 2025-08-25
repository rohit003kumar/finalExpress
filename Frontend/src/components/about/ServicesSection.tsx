import React, { useEffect, useRef } from 'react';
import { Shirt, Timer, Truck, Calendar, CheckSquare as SquareCheck, Briefcase } from 'lucide-react';

const ServiceCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  className?: string;
}> = ({ icon, title, description, delay, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);
  
  return (
    <div 
      ref={cardRef}
      className={`bg-white rounded-xl shadow-lg p-8 opacity-0 translate-y-8 transition-all duration-700 ease-out ${className}`}
    >
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
};

const ServicesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
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
      className="py-20 bg-blue-50 opacity-0 transition-opacity duration-700 ease-out"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Our Services</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            DhobiXpress offers a range of comprehensive laundry solutions designed to meet your needs, 
            whether you're an individual, family, or business.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group hover:scale-105 hover:shadow-2xl transition-transform duration-300">
            <ServiceCard 
              icon={<Shirt className="h-10 w-10 transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-800" />}
              title="Wash & Fold"
              description="washing, drying, and folding services."
              delay={0}
              className="group"
            />
          </div>
          
          <div className="group hover:scale-105 hover:shadow-2xl transition-transform duration-300">
            <ServiceCard 
              icon={<Timer className="h-10 w-10 transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-800" />}
              title="Every time Service"
              description="Need it fast? Our  service guarantees same-day turnaround for urgent laundry needs."
              delay={200}
              className="group"
            />
          </div>
          
          <div className="group hover:scale-105 hover:shadow-2xl transition-transform duration-300">
            <ServiceCard 
              icon={<Truck className="h-10 w-10 transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-800" />}
              title="Free Pickup & Delivery"
              description="Convenient door-to-door service with scheduled pickups and deliveries at your preferred times."
              delay={400}
              className="group"
            />
          </div>
          
          <div className="group hover:scale-105 hover:shadow-2xl transition-transform duration-300">
            <ServiceCard 
              icon={<Calendar className="h-10 w-10 transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-800" />}
              title="Time schedule "
              description="choose date and book your slots"
              delay={600}
              className="group"
            />
          </div>
          
          <div className="group hover:scale-105 hover:shadow-2xl transition-transform duration-300">
            <ServiceCard 
              icon={<SquareCheck className="h-10 w-10 transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-800" />}
              title="Special Care Items"
              description="special care instructions handled with expert attention."
              delay={800}
              className="group"
            />
          </div>
          
          <div className="group hover:scale-105 hover:shadow-2xl transition-transform duration-300">
            <ServiceCard 
              icon={<Briefcase className="h-10 w-10 transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-800" />}
              title="100% safe pickup and Delivery"
              description="don't worry your product is safe"
              delay={1000}
              className="group"
            />
          </div>
        </div>
        <div className="text-center mt-12">
          {/* <a 
            href="/services" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-colors inline-block"
          >
            View All Services
          </a> */}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
