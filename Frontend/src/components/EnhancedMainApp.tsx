import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WashingMachine } from 'lucide-react';
import Navbar from './Navbar';
import ServiceCard from './ServiceCard';
import TimeSlotPicker from './TimeSlotPicker';
import OrderSummary from './OrderSummary';
import CategoryFilter from './CategoryFilter';
import LocationModal from './LocationModal';
import LocationBanner from './LocationBanner';
import ServiceAvailability from './ServiceAvailability';
import { useCart } from '../hooks/useCart';
import { generateTimeSlotsForDate } from '../utils/timeSlots';
import type { Service, TimeSlot } from '../types';
import axios from '../utilss/axios';

type AppView = "services" | "booking" | "availability";

const categories = [
  { id: "all", name: "All" },
  { id: "shirt", name: "Shirt" },
  { id: "pant", name: "Pant" },
  { id: "suits", name: "Suits" },
  { id: "Bedsheet", name: "Bedsheet" },
];

interface CustomerLocation {
  lat: number;
  lng: number;
  address: string;
}

const EnhancedMainApp: React.FC = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<AppView>("availability");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Location states
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [customerLocation, setCustomerLocation] = useState<CustomerLocation | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [servicesAvailable, setServicesAvailable] = useState(false);

  const { cartItems, addToCart, removeFromCart, updateQuantity, getTotalItems, clearCart } = useCart();

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      
      if (token && userRole) {
        setIsLoggedIn(true);
        setUserRole(userRole);
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Check user location on mount
  useEffect(() => {
    const checkUserLocation = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const savedLocation = localStorage.getItem("customerLocation");
        if (savedLocation) {
          const location = JSON.parse(savedLocation);
          setCustomerLocation(location);
          setHasLocationPermission(true);
        } else {
          // Try to get location from backend
          try {
            const response = await axios.get('/api/location/user/location', {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success && response.data.location) {
              const location = {
                lat: response.data.location.lat,
                lng: response.data.location.lng,
                address: response.data.location.address || `${response.data.location.lat.toFixed(4)}, ${response.data.location.lng.toFixed(4)}`
              };
              setCustomerLocation(location);
              setHasLocationPermission(true);
              localStorage.setItem('customerLocation', JSON.stringify(location));
            }
          } catch (error) {
            console.log('No saved location found');
          }
        }
      } catch (error) {
        console.error("Error checking user location:", error);
      }
    };

    checkUserLocation();
  }, [isLoggedIn]);

  // Generate time slots when date changes
  useEffect(() => {
    const newTimeSlots = generateTimeSlotsForDate(selectedDate);
    setTimeSlots(newTimeSlots);
    setSelectedTimeSlot(null);
  }, [selectedDate]);

  // Save selected time slot to localStorage
  useEffect(() => {
    if (selectedTimeSlot) {
      localStorage.setItem("selectedTimeSlot", JSON.stringify(selectedTimeSlot));
    } else {
      localStorage.removeItem("selectedTimeSlot");
    }
  }, [selectedTimeSlot]);

  // Save selected date to localStorage
  useEffect(() => {
    localStorage.setItem("selectedDate", selectedDate);
  }, [selectedDate]);

  const handleLocationSet = (location: CustomerLocation) => {
    setCustomerLocation(location);
    setHasLocationPermission(true);
    setCurrentView("availability");
  };

  const handleServicesFound = (availableServices: Service[]) => {
    setServices(availableServices);
    setServicesAvailable(true);
    setCurrentView("services");
  };

  const handleNoServices = () => {
    setServices([]);
    setServicesAvailable(false);
    setCurrentView("availability");
  };

  const handleLocationChange = () => {
    setShowLocationModal(true);
  };

  const handleAddToCart = (service: Service, quantity: number, selectedOptions: string[]) => {
    addToCart({
      ...service,
      quantity,
      selectedOptions,
    });
  };

  const handleProceedToBooking = () => {
    if (getTotalItems() > 0) {
      setCurrentView("booking");
    }
  };

  const handleBackToServices = () => {
    setCurrentView("services");
  };

  const handleCompleteOrder = () => {
    clearCart();
    setCurrentView("services");
    alert("Order completed successfully!");
  };

  const handleNav = (path: string) => navigate(path);

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === "all" || 
      service.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderAvailabilityView = () => (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <WashingMachine className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Laundry Services</h1>
        <p className="text-gray-600">Check if laundry services are available in your area</p>
      </div>
      
      <ServiceAvailability
        customerLocation={customerLocation}
        onServicesFound={handleServicesFound}
        onNoServices={handleNoServices}
      />
    </div>
  );

  const renderServicesView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service._id}
            service={service}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <WashingMachine className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-600">
            {searchQuery ? "Try adjusting your search terms" : "No services available in your area"}
          </p>
        </div>
      )}
    </div>
  );

  const renderBookingView = () => (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Time Slot</h2>
          <TimeSlotPicker
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            selectedTimeSlot={selectedTimeSlot}
            onTimeSlotSelect={setSelectedTimeSlot}
            timeSlots={timeSlots}
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
          <OrderSummary
            cartItems={cartItems}
            onRemoveItem={removeFromCart}
            onUpdateQuantity={updateQuantity}
            selectedTimeSlot={selectedTimeSlot}
            onCompleteOrder={handleCompleteOrder}
            onBackToServices={handleBackToServices}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartItemCount={getTotalItems()}
        onCartClick={handleProceedToBooking}
        onContactClick={() => handleNav("/contact")}
        onAboutClick={() => handleNav("/about")}
        onOrdersClick={() => handleNav("/orders")}
        onHomeClick={() => handleNav("/mainapp")}
        onSignInClick={() => handleNav("/signin")}
        onSignUpClick={() => handleNav("/signup")}
        onProfileClick={() => handleNav("/CustomerDashboard")}
      />

      <LocationBanner
        customerLocation={customerLocation}
        onLocationChange={handleLocationChange}
        isLoggedIn={isLoggedIn}
      />

      {currentView === "availability" && renderAvailabilityView()}
      {currentView === "services" && renderServicesView()}
      {currentView === "booking" && renderBookingView()}

      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationSet={handleLocationSet}
        currentLocation={customerLocation}
      />
    </div>
  );
};

export default EnhancedMainApp;
