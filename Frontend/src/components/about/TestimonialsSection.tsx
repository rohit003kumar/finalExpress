import React, { useEffect, useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  comment: string;
  rating: number;
  imageUrl: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Amanda Porter",
    role: "Busy Parent",
    comment: "FoldMate has changed my life! As a working mom with three kids, laundry was taking up so much of my free time. Now I get my weekends back and my clothes are cleaner than ever.",
    rating: 5,
    imageUrl: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 2,
    name: "James Wilson",
    role: "Entrepreneur",
    comment: "The subscription plan is fantastic. My laundry gets done weekly without me even thinking about it. The app makes scheduling pickups and deliveries incredibly simple.",
    rating: 5,
    imageUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 3,
    name: "Sophia Lee",
    role: "Graduate Student",
    comment: "As a student with a busy schedule, FoldMate has been a game-changer. The service is reliable, affordable, and the team takes great care with my clothes.",
    rating: 4,
    imageUrl: "https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 4,
    name: "Thomas Brown",
    role: "Corporate Executive",
    comment: "I travel frequently for work and FoldMate ensures I always have clean, perfectly pressed clothes. Their attention to detail with my business attire is impressive.",
    rating: 5,
    imageUrl: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
];

const TestimonialsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
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
  
  const handlePrev = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const handleNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
    
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index} 
        className={`h-5 w-5 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };
  
  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-blue-50 to-white opacity-0 -translate-y-6 transition-all duration-700 ease-out"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">What Our Customers Say</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about DhobiXpress.
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                      <div className="md:w-1/4 flex-shrink-0">
                        <img 
                          src={testimonial.imageUrl} 
                          alt={testimonial.name} 
                          className="w-24 h-24 rounded-full object-cover mx-auto"
                        />
                      </div>
                      <div className="md:w-3/4">
                        <div className="flex mb-3">
                          {renderStars(testimonial.rating)}
                        </div>
                        <p className="text-slate-600 text-lg italic mb-6">
                          "{testimonial.comment}"
                        </p>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800">{testimonial.name}</h4>
                          <p className="text-blue-600">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-6 bg-white rounded-full shadow-lg p-3 text-blue-600 hover:text-blue-800 transition-colors z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-6 bg-white rounded-full shadow-lg p-3 text-blue-600 hover:text-blue-800 transition-colors z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        
        <div className="mt-8 flex justify-center">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full mx-1 transition-colors ${
                index === activeIndex ? 'bg-blue-600' : 'bg-slate-300'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
