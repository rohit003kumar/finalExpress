import React from 'react';
import { WashingMachine, Phone, Mail, MapPin, Facebook, Instagram} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <div className="flex items-center mb-4">
              <WashingMachine className="h-6 w-6 text-blue-400" />
              <span className="ml-2 text-xl font-bold">DhobiXpress</span>
            </div>
            <p className="text-slate-300 mb-6 pr-4">
              Making laundry simple and convenient for busy people with our revolutionary laundry service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-slate-300 hover:text-blue-400 transition-colors">Home</a></li>
             
              <li><a href="/about" className="text-slate-300 hover:text-blue-400 transition-colors">About</a></li>
              <li><a href="/contact" className="text-slate-300 hover:text-blue-400 transition-colors">Contact</a></li>
              
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li><a href="/services/wash-fold" className="text-slate-300 hover:text-blue-400 transition-colors">Wash & Fold</a></li>
              <li><a href="/services/dry-cleaning" className="text-slate-300 hover:text-blue-400 transition-colors">Dry Cleaning</a></li>
              <li><a href="/services/ironing" className="text-slate-300 hover:text-blue-400 transition-colors">Ironing Services</a></li>
              {/* <li><a href="/services/subscription" className="text-slate-300 hover:text-blue-400 transition-colors">Subscription Plans</a></li>
              <li><a href="/services/business" className="text-slate-300 hover:text-blue-400 transition-colors">Business Solutions</a></li> */}
            </ul>
          </div>
          
          {/* Contact info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex">
                <Phone className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                <span className="text-slate-300">7909045381</span>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                <span className="text-slate-300">rohitkumar60704@gmail.com</span>
              </li>
              <li className="flex">
                <MapPin className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                <span className="text-slate-300">Fortune Tower ,Bhubaneswar</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} DhobiXpress. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="/terms" className="text-slate-400 text-sm hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="/privacy" className="text-slate-400 text-sm hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="/faq" className="text-slate-400 text-sm hover:text-blue-400 transition-colors">FAQ</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
