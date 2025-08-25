import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    question: "How does the pickup and delivery process work?",
    answer: "It's simple! Schedule a pickup through our app or website, and we'll come to your location at the chosen time. We'll collect your laundry in our FoldMate bags and deliver it back to you, clean and folded, at your requested delivery time."
  },
  {
    question: "What is the turnaround time for standard service?",
    answer: "Our standard service has a 48-hour turnaround time."
  },
  {
    question: "How are delicate garments and special care items handled?",
    answer: "We have specialized processes for delicate items. You can add special care instructions to your order."
  },
  // {
  //   question: "",
  //   answer: ""
  // },
  {
    question: "Do you offer dry cleaning services?",
    answer: "Yes, we offer professional dry cleaning services for garments that require it. depending your location this option will avialable or not."
  },
  {
    question: "What detergents and products do you use?",
    answer: "We use eco-friendly detergents that are effective yet gentle on the environment. ."
  }
];

const FaqSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
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
  
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-white opacity-0 -translate-y-6 transition-all duration-700 ease-out"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Have questions about our services? Find answers to commonly asked questions below.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqItems.map((faq, index) => (
            <div 
              key={index} 
              className="mb-4 border-b border-slate-200 pb-4 last:border-b-0"
            >
              <button 
                onClick={() => toggleFaq(index)}
                className="flex justify-between items-center w-full text-left py-3 focus:outline-none"
              >
                <h3 className="text-lg font-medium text-slate-800">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-blue-600 flex-shrink-0" />
                )}
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-slate-600 pt-2 pb-4">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-lg text-slate-600 mb-6">
            Didn't find the answer you're looking for?
          </p>
          <a 
            href="/contact" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-colors inline-block"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;