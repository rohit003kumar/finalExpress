























// "use client"

// // File: src/App.tsx
// import { useState, useEffect } from "react"
// import { Routes, Route, useNavigate } from "react-router-dom"
// import { WashingMachine } from "lucide-react"
// import Navbar from "./components/Navbar"
// import ServiceCard from "./components/ServiceCard"
// import TimeSlotPicker from "./components/TimeSlotPicker"
// import OrderSummary from "./components/OrderSummary"
// import CategoryFilter from "./components/CategoryFilter"
// import { useCart } from "./hooks/useCart"
// import { generateTimeSlotsForDate } from "./utils/timeSlots"
// import type { Service, TimeSlot } from "./types"
// import Contact from "./pagess/ContactPage"
// import About from "./pagess/AboutPage"
// import OrderPage from "./pagess/OrderPage"
// import PaymentPage from "./pagess/PaymentPage"
// import SignIn from "./components/SignIn"
// import SignUp from "./components/SignUp"
// import MapPage from "./pagess/MapPage"
// import NearbyWashermenWithSlots from "./components/NearbyWashermenWithSlots"
// import LocationTest from "./components/LocationTest"
// import LocationDebug from "./components/LocationDebug"
// import LaundrymanDashboard from "./dashboard/LaundrymanDashboard"
// import CustomerDashboard from "./dashboard/CustomerDashboard"
// import AdminDashboard from "./dashboard/AdminDashboard"
// import ServiceForm from "./components/ServiceForm"
// import ServiceList from "./components/ServiceList"
// import SlotTemplateManagers from "./components/SlotTemplateManagers"
// import SlotTemplateManager from "./components/SlotTemplateManager"
// import WashermanSlotToggle from "./components/WashermanSlotToggle"
// import type { Servicee } from "./components/Types/Servicee"
// import axios from '../src/utilss/axios.js' // Adjust the import path as necessary
// import { apiFetch } from "./utilss/apifetch"
// import ResetPassword from "./pagess/resetPassword";
// import AdminMessages from './pagess/AdminMessages'; // adjust path if needed
import PWAStatusIndicator from './components/PWAStatusIndicator';




// type AppView = "services" | "booking"

// const categories = [
//   { id: "all", name: "All" },
//   { id: "shirt", name: "Shirt" },
//   { id: "pant", name: "Pant" },
//   { id: "suits", name: "Suits" },
//   { id: "Bedsheet", name: "Bedsheet" },
// ]

// function MainApp() {
//   const navigate = useNavigate()
//   const [currentView, setCurrentView] = useState<AppView>("services")
//   const [selectedCategory, setSelectedCategory] = useState("all")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedDate, setSelectedDate] = useState(
//     new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
//   )
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
//   const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
//   const [services, setServices] = useState<Service[]>([])
// const [isLoggedIn, setIsLoggedIn] = useState(false);
// const [userRole, setUserRole] = useState(null);




//   // Location states
//   const [showLocationModal, setShowLocationModal] = useState(false)
//   const [customerLocation, setCustomerLocation] = useState(null)
//   const [isDetectingLocation, setIsDetectingLocation] = useState(false)
//   const [locationError, setLocationError] = useState("")
//   const [hasLocationPermission, setHasLocationPermission] = useState(false)

//   const { cartItems, addToCart, removeFromCart, updateQuantity, getTotalItems, clearCart } = useCart()

// const [manualAddress, setManualAddress] = useState("")






//   // Safe localStorage write for selectedTimeSlot
//   useEffect(() => {
//     if (selectedTimeSlot) {
//       localStorage.setItem("selectedTimeSlot", JSON.stringify(selectedTimeSlot))
//     } else {
//       localStorage.removeItem("selectedTimeSlot")
//     }
//   }, [selectedTimeSlot])

//   useEffect(() => {
//     localStorage.setItem("selectedDate", selectedDate)
//   }, [selectedDate])

//   useEffect(() => {
//     const newTimeSlots = generateTimeSlotsForDate(selectedDate)
//     setTimeSlots(newTimeSlots)
//     setSelectedTimeSlot(null)
//   }, [selectedDate])

  

// useEffect(() => {
//   const checkUserLocation = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const hasLocation = localStorage.getItem("customerLocation");
//       if (!hasLocation) {
//         setShowLocationModal(true);
//       } else {
//         const savedLocation = JSON.parse(hasLocation);
//         setCustomerLocation(savedLocation);
//         setHasLocationPermission(true);
//         fetchNearbyServices(savedLocation.lat, savedLocation.lng); // ✅ lat/lng
//       }
//     } catch (error) {
//       console.error("Error checking user location:", error);
//       setShowLocationModal(true);
//     }
//   };

//   checkUserLocation();
// }, []);




// // 👇 Define the function FIRST
// const fetchNearbyServices = async (lat: number, lng: number, token: string) => {
//   try {
//     const res = await axios.get("/api/customer/nearby-services", {
//       headers: { Authorization: `Bearer ${token}` },
//       params: { lat, lng },
//     });

//     console.log("🧾 Nearby services response:", res.data);
//     if (Array.isArray(res.data)) {
//       setServices(res.data);
//     } else {
//       console.error("❌ Invalid nearby response format:", res.data);
//       fallbackToAll();
//     }
//   } catch (err) {
//     console.error("❌ Failed to fetch nearby services:", err);
//     fallbackToAll();
//   }
// };

// // ✅ Then write useEffect below it
// useEffect(() => {
//   const fetchServices = async () => {
//     const token = localStorage.getItem("token");

//     try {
//       if (!token) {
//         const res = await axios.get("/api/product/all");
//         setServices(res.data || []);
//         return;
//       }

//       const profileRes = await axios.get("/api/user/currentuser", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const user = profileRes.data;
//       setIsLoggedIn(true);
//       setUserRole(user.role);

//       if (user.role === "customer") {
//         if ("geolocation" in navigator) {
//           navigator.geolocation.getCurrentPosition(
//             (position) => {
//               const lat = position.coords.latitude;
//               const lng = position.coords.longitude;
//               fetchNearbyServices(lat, lng, token); // ✅ NOW it exists
//             },
//             (err) => {
//               console.warn("❌ Location error:", err);
//               fallbackToAll();
//             }
//           );
//         } else {
//           fallbackToAll();
//         }
//       } else {
//         const res = await axios.get("/api/product/all");
//         setServices(res.data || []);
//       }
//     } catch (err) {
//       console.error("❌ Error fetching user or services:", err);
//       setIsLoggedIn(false);
//       fallbackToAll();
//     }
//   };

//   const fallbackToAll = async () => {
//     try {
//       const res = await axios.get("/api/product/all");
//       setServices(res.data || []);
//     } catch (err) {
//       console.error("❌ Failed to load fallback services:", err);
//       setServices([]);
//     }
//   };

//   fetchServices();
// }, []);





// // const fetchNearbyServices = async (lat, lng) => {
// //   try {
// //     const token = localStorage.getItem("token");
// //     if (!token) return;

// //     const res = await axios.get(`/api/customer/nearby-services`, {
// //       headers: { Authorization: `Bearer ${token}` },
// //       params: { lat, lng },
// //     });

// //     console.log("Nearby services response 🧾", res.data);

// //     // ✅ Validate the response before setting it
// //     if (Array.isArray(res.data)) {
// //       setServices(res.data);
// //     } else {
// //       console.error("❌ Invalid services response format:", res.data);
// //       setServices([]); // fallback to prevent crash
// //     }
// //   } catch (error) {
// //     console.error("Failed to fetch nearby services:", error);
// //     setServices([]); // fallback to empty on failure
// //   }
// // };



// const handleDetectLocation = () => {
//   setIsDetectingLocation(true);
//   setLocationError("");

//   if (!navigator.geolocation) {
//     setLocationError("Geolocation is not supported by your browser.");
//     setIsDetectingLocation(false);
//     return;
//   }

//   navigator.geolocation.getCurrentPosition(
//     async (position) => {
//       const { latitude, longitude } = position.coords;

//       try {
//         const response = await fetch(
//           `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=fbddd9ac0aff4feb840edc8d63a8f264`
//         );
//         const data = await response.json();

//         const address =
//           data.results.length > 0
//             ? data.results[0].formatted
//             : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

//         const location = {
//           lat: latitude,
//           lng: longitude,
//           address,
//         };

//         setCustomerLocation(location);
//         setHasLocationPermission(true);
//         localStorage.setItem("customerLocation", JSON.stringify(location));

//         const token = localStorage.getItem("token");
//         if (token) {
//           try {
//             await axios.post(
//               "/api/user/location",
//               {
//                 lat: latitude, // ✅ fixed field
//                 lng: longitude, // ✅ fixed field
//               },
//               {
//                 headers: {
//                   "Content-Type": "application/json",
//                   Authorization: `Bearer ${token}`,
//                 },
//               }
//             );
//           } catch (error) {
//             console.error("Failed to save location to backend:", error);
//           }
//         }

//         fetchNearbyServices(latitude, longitude);
//         setShowLocationModal(false);
//       } catch (error) {
//         console.error("Geocoding error:", error);
//         setLocationError("Failed to get address from coordinates");
//       } finally {
//         setIsDetectingLocation(false);
//       }
//     },
//     (error) => {
//       console.error("Location error:", error.message);
//       setLocationError("Could not detect location. Please allow location access.");
//       setIsDetectingLocation(false);
//     },
//     {
//       enableHighAccuracy: true,
//       timeout: 15000,
//       maximumAge: 0,
//     }
//   );
// };

// const handleManualLocation = async (address) => {
//   try {
//     const response = await fetch(
//       `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=fbddd9ac0aff4feb840edc8d63a8f264`
//     );
//     const data = await response.json();

//     if (data.results.length > 0) {
//       const result = data.results[0];
//       const location = {
//         lat: result.geometry.lat,
//         lng: result.geometry.lng,
//         address: result.formatted,
//       };

//       setCustomerLocation(location);
//       setHasLocationPermission(true);
//       localStorage.setItem("customerLocation", JSON.stringify(location));

//       const token = localStorage.getItem("token");
//       if (token) {
//         try {
//          await axios.post(
//   "/api/user/location",
//   {
//     lat: location.lat,
//     lng: location.lng,
//     address: location.address, // ✅ now you're saving the full location
//   },
//   {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   }
// );


//         } catch (error) {
//           console.error("Failed to save location to backend:", error);
//         }
//       }

//       fetchNearbyServices(location.lat, location.lng); // ✅ correct field
//       setShowLocationModal(false);
//     } else {
//       setLocationError("Address not found. Please try a different address.");
//     }
//   } catch (error) {
//     console.error("Manual location error:", error);
//     setLocationError("Failed to find location. Please try again.");
//   }
// };


// const filteredServices = services.filter((service) => {
//   const name = (service.title || service.name || service.serviceName || "").toLowerCase();
//   const washerman =
//     (service.washerman?.name ||
//       service.washermanName ||
//       service.laundryman ||
//       "").toLowerCase();
//   const category = (service.category || "").toLowerCase();
//   const query = searchQuery.trim().toLowerCase();

//   const matchesCategory =
//     selectedCategory === "all" || category === selectedCategory.toLowerCase();

//   const matchesSearch =
//     query === "" || name.includes(query) || washerman.includes(query);

//   return matchesCategory && matchesSearch;
// });




//   const handleAddToCart = (service: Service, quantity: number, selectedOptions: string[]) => {
//     addToCart(service, quantity, selectedOptions)
//   }

//   const handleProceedToBooking = () => {
//     if (cartItems.length > 0) {
//       setCurrentView("booking")
//     }
//   }

//   const handleBackToServices = () => {
//     setCurrentView("services")
//   }

//   const handleCompleteOrder = () => {
//     setCurrentView("services")
//     clearCart()
//     setSelectedTimeSlot(null)
//     navigate("/payment", {
//       state: {
//         cartItems,
//         selectedDate,
//         selectedTimeSlot,
//       },
//     })
//   }

//   const handleNav = (path: string) => navigate(path)

//   const renderServicesView = () => (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar
//         searchQuery={searchQuery}
//         onSearchChange={setSearchQuery}
//         cartItemCount={getTotalItems()}
//         onCartClick={handleProceedToBooking}
//         onContactClick={() => handleNav("/contact")}
//         onAboutClick={() => handleNav("/about")}
//         onOrdersClick={() => handleNav("/orders")}
//         onHomeClick={() => handleNav("/mainapp")}
//         onSignInClick={() => handleNav("/signin")}
//         onSignUpClick={() => handleNav("/signup")}
//         onProfileClick={() => handleNav("/CustomerDashboard")}
//       />

//       {/* Location Display */}
//       {customerLocation && (
//         <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
//           <div className="max-w-7xl mx-auto flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <span className="text-blue-600">📍</span>
//               <span className="text-sm text-blue-800">Delivering to: {customerLocation.address}</span>
//             </div>
//             <button
//               onClick={() => setShowLocationModal(true)}
//               className="text-blue-600 text-sm font-medium hover:text-blue-700"
//             >
//               Change Location
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
//         <CategoryFilter
//           categories={categories}
//           selectedCategory={selectedCategory}
//           onCategoryChange={setSelectedCategory}
//         />
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
//           {filteredServices.map((service) => (
//             <ServiceCard key={service._id} service={service} onAddToCart={handleAddToCart} />
// //             <ServiceCard
// //   key={service._id}
// //   service={service}
// //   onAddToCart={addToCart}
// //   cartItems={cartItems}  // ✅ REQUIRED!
// // />

//           ))}
//         </div>
//         {filteredServices.length === 0 && (
//           <div className="text-center py-12">
//             <WashingMachine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
//             <p className="text-gray-600">Try adjusting your search or filter criteria</p>
//           </div>
//         )}
//         {cartItems.length > 0 && (
//           <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-3 md:p-4 shadow-lg">
//             <div className="max-w-7xl mx-auto flex items-center justify-between">
//               <span className="font-semibold text-sm md:text-base">{getTotalItems()} items selected</span>
//               <button
//                 onClick={handleProceedToBooking}
//                 className="bg-white text-blue-600 px-4 md:px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base"
//               >
//                 Proceed to Order
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )

//   const renderBookingView = () => (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar
//         searchQuery={searchQuery}
//         onSearchChange={setSearchQuery}
//         cartItemCount={getTotalItems()}
//         onCartClick={() => {}}
//         onContactClick={() => handleNav("/contact")}
//         onAboutClick={() => handleNav("/about")}
//         onOrdersClick={() => handleNav("/orders")}
//         onHomeClick={() => handleNav("/mainapp")}
//         onSignInClick={() => handleNav("/signin")}
//         onSignUpClick={() => handleNav("/signup")}
//         onProfileClick={() => handleNav("/CustomerDashboard")}
//       />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
//         <button
//           onClick={handleBackToServices}
//           className="mb-6 flex items-center space-x-2 text-blue-600 hover:text-blue-700"
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//           <span className="font-medium">Back to Products</span>
//         </button>
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
//           <div className="lg:col-span-2">
//             <TimeSlotPicker
//               timeSlots={timeSlots}
//               selectedDate={selectedDate}
//               selectedTimeSlot={selectedTimeSlot}
//               onDateChange={setSelectedDate}
//               onTimeSlotSelect={setSelectedTimeSlot}
//             />
//           </div>
//           <div className="lg:col-span-1">
//             <OrderSummary
//               cartItems={cartItems}
//               selectedDate={selectedDate}
//               selectedTimeSlot={selectedTimeSlot}
//               onCompleteOrder={handleCompleteOrder}
//               onRemoveFromCart={removeFromCart}
//               onUpdateQuantity={updateQuantity}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )

//   return (
//     <>
//       {currentView === "services" ? renderServicesView() : renderBookingView()}

//       {/* Location Selection Modal */}
//       {showLocationModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <div className="text-center mb-6">
//               <div className="text-4xl mb-4">📍</div>
//               <h2 className="text-xl font-bold text-gray-900 mb-2">Choose Your Location</h2>
//               <p className="text-gray-600 text-sm">We need your location to show nearby laundry services</p>
//             </div>

//             {locationError && (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
//                 <p className="text-red-600 text-sm">{locationError}</p>
//               </div>
//             )}

//             <div className="space-y-4">
//               <button
//                 onClick={handleDetectLocation}
//                 disabled={isDetectingLocation}
//                 className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//               >
//                 {isDetectingLocation ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     <span>Detecting Location...</span>
//                   </>
//                 ) : (
//                   <>
//                     <span>📍</span>
//                     <span>Use Current Location</span>
//                   </>
//                 )}
//               </button>

//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">or</span>
//                 </div>
//               </div>

//               <div>
//                 <input
//                   type="text"
//                   placeholder="Enter your address manually"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   onKeyPress={(e) => {
//                     if (e.key === "Enter") {
//                       handleManualLocation(e.target.value)
//                     }
//                   }}
//                 />




//                 <p className="text-xs text-gray-500 mt-1">Press Enter to search for this address</p>
//               </div>
//             </div>

//             <div className="mt-6 text-center">
//               <p className="text-xs text-gray-500">
//                 Your location helps us show you the most relevant laundry services in your area
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// function WashermanServicesApp() {
//   const [services, setServices] = useState<Servicee[]>([])
//   const [currentView, setCurrentView] = useState<"list" | "form">("list")

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const token = localStorage.getItem("token")
//         const res = await apiFetch("/api/product/all", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         const data = await res.json()
//         setServices(data)
//       } catch (err) {
//         console.error("Failed to fetch services:", err)
//       }
//     }
//     fetchServices()
//   }, [])


//   const handleAddService = async (serviceData: Omit<Servicee, "_id" | "createdAt" | "updatedAt">) => {
//     try {
//       const token = localStorage.getItem("token")
//       const response = await apiFetch("/api/product", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(serviceData),
//       })
//       const newService = await response.json()
//       setServices((prev) => [newService, ...prev])
//       setCurrentView("list")
//     } catch (err) {
//       console.error("Add service failed:", err)
//     }
//   }

//   const handleEditService = (id: string, updates: Partial<Servicee>) => {
//     setServices((prev) =>
//       prev.map((service) =>
//         service._id === id ? { ...service, ...updates, updatedAt: new Date().toISOString() } : service,
//       ),
//     )
//   }

//   const handleDeleteService = (id: string) => {
//     setServices((prev) => prev.filter((service) => service._id !== id))
//   }

//   return (
//     <div className="App">
//       {currentView === "form" ? (
//         <ServiceForm onSubmit={handleAddService} onBack={() => setCurrentView("list")} />
//       ) : (
//         <ServiceList
//           services={services}
//           onEdit={handleEditService}
//           onDelete={handleDeleteService}
//           onAddNew={() => setCurrentView("form")}
//         />
//       )}
//     </div>
//   )
// }

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<MainApp />} />
//       <Route path="/mainapp" element={<MainApp />} />
//       <Route path="/contact" element={<Contact />} />
//       <Route path="/about" element={<About />} />
//       <Route path="/orders" element={<OrderPage />} />
//       <Route path="/signin" element={<SignIn />} />
//       <Route path="/signup" element={<SignUp />} />
//       <Route path="/LaundrymanDashboard" element={<LaundrymanDashboard />} />
//       <Route path="/CustomerDashboard" element={<CustomerDashboard />} />
//       <Route path="/adminservices" element={<WashermanServicesApp />} />
//       <Route path="/adminDashboard" element={<AdminDashboard />} />
//       <Route path="/payment" element={<PaymentPage />} />
//       <Route path="/SlotTemplateManager" element={<SlotTemplateManager />} />
//       <Route path="/WashermanSlotToggle" element={<WashermanSlotToggle />} />
//       <Route path="/SlotTemplateManagers" element={<SlotTemplateManagers />} />
//       <Route path="/location-test" element={<LocationTest />} />
//       <Route path="/location-debug" element={<LocationDebug />} />
//       <Route path="/nearby-washermen" element={<NearbyWashermenWithSlots />} />
//       {/* <Route path="/NearbyWashermenMap" element={<MapPage />} /> */}
//       <Route path="/reset-password/:token" element={<ResetPassword />} />
// <Route path="/AdminMessages" element={<AdminMessages />} />
//     </Routes>
//   )
// }

// export default App






















// "use client"

// // File: src/App.tsx
// import { useState, useEffect } from "react"
// import { Routes, Route, useNavigate } from "react-router-dom"
// import { WashingMachine } from "lucide-react"
// import Navbar from "./components/Navbar"
// import ServiceCard from "./components/ServiceCard"
// import TimeSlotPicker from "./components/TimeSlotPicker"
// import OrderSummary from "./components/OrderSummary"
// import CategoryFilter from "./components/CategoryFilter"
// import { useCart } from "./hooks/useCart"
// import { generateTimeSlotsForDate } from "./utils/timeSlots"
// import type { Service, TimeSlot } from "./types"
// import Contact from "./pagess/ContactPage"
// import About from "./pagess/AboutPage"
// import OrderPage from "./pagess/OrderPage"
// import PaymentPage from "./pagess/PaymentPage"
// import SignIn from "./components/SignIn"
// import SignUp from "./components/SignUp"
// import MapPage from "./pagess/MapPage"
// import NearbyWashermenWithSlots from "./components/NearbyWashermenWithSlots"
// import LocationTest from "./components/LocationTest"
// import LocationDebug from "./components/LocationDebug"
// import LaundrymanDashboard from "./dashboard/LaundrymanDashboard"
// import CustomerDashboard from "./dashboard/CustomerDashboard"
// import AdminDashboard from "./dashboard/AdminDashboard"
// import ServiceForm from "./components/ServiceForm"
// import ServiceList from "./components/ServiceList"
// import SlotTemplateManagers from "./components/SlotTemplateManagers"
// import SlotTemplateManager from "./components/SlotTemplateManager"
// import WashermanSlotToggle from "./components/WashermanSlotToggle"
// import type { Servicee } from "./components/Types/Servicee"
// import axios from '../src/utilss/axios.js' // Adjust the import path as necessary
// import { apiFetch } from "./utilss/apifetch"
// import ResetPassword from "./pagess/resetPassword";
// import AdminMessages from './pagess/AdminMessages'; // adjust path if needed
// import ManualAddressInput from "./components/ManualAddressInput"
// import LocationDisplay from "./components/LocationDisplay"
// import { getCurrentLocation, geocodeAddress } from "./utils/geocodingService"
// import LaundryHome from './components/LaundryHome';



// type AppView = "services" | "booking"

// const categories = [
//   { id: "all", name: "All" },
//   { id: "shirt", name: "Shirt" },
//   { id: "pant", name: "Pant" },
//   { id: "suits", name: "Suits" },
//   { id: "Bedsheet", name: "Bedsheet" },
// ]

// function MainApp() {
//   const navigate = useNavigate()
//   const [currentView, setCurrentView] = useState<AppView>("services")
//   const [selectedCategory, setSelectedCategory] = useState("all")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedDate, setSelectedDate] = useState(
//     new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
//   )
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
//   const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
//   const [services, setServices] = useState<Service[]>([])
// const [isLoggedIn, setIsLoggedIn] = useState(false);
// const [userRole, setUserRole] = useState(null);




//   // Location states
//   const [showLocationModal, setShowLocationModal] = useState(false)
//   const [showManualAddressModal, setShowManualAddressModal] = useState(false)
//   const [customerLocation, setCustomerLocation] = useState(null)
//   const [isDetectingLocation, setIsDetectingLocation] = useState(false)
//   const [locationError, setLocationError] = useState("")
//   const [hasLocationPermission, setHasLocationPermission] = useState(false)

//   const { cartItems, addToCart, removeFromCart, updateQuantity, getTotalItems, clearCart } = useCart()

// const [manualAddress, setManualAddress] = useState("")






//   // Safe localStorage write for selectedTimeSlot
//   useEffect(() => {
//     if (selectedTimeSlot) {
//       localStorage.setItem("selectedTimeSlot", JSON.stringify(selectedTimeSlot))
//     } else {
//       localStorage.removeItem("selectedTimeSlot")
//     }
//   }, [selectedTimeSlot])

//   useEffect(() => {
//     localStorage.setItem("selectedDate", selectedDate)
//   }, [selectedDate])

//   useEffect(() => {
//     const newTimeSlots = generateTimeSlotsForDate(selectedDate)
//     setTimeSlots(newTimeSlots)
//     setSelectedTimeSlot(null)
//   }, [selectedDate])

  

// useEffect(() => {
//   const checkUserLocation = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const hasLocation = localStorage.getItem("customerLocation");
//       if (!hasLocation) {
//         setShowLocationModal(true);
//       } else {
//         const savedLocation = JSON.parse(hasLocation);
//         setCustomerLocation(savedLocation);
//         setHasLocationPermission(true);
//         fetchNearbyServices(savedLocation.lat, savedLocation.lng); // ✅ lat/lng
//       }
//     } catch (error) {
//       console.error("Error checking user location:", error);
//       setShowLocationModal(true);
//     }
//   };

//   checkUserLocation();
// }, []);




// // 👇 Define the function FIRST
// const fetchNearbyServices = async (lat: number, lng: number, token: string) => {
//   try {
//     const res = await axios.get("/api/customer/nearby-services", {
//       headers: { Authorization: `Bearer ${token}` },
//       params: { lat, lng },
//     });

//     console.log("🧾 Nearby services response:", res.data);
//     if (Array.isArray(res.data)) {
//       setServices(res.data);
//     } else {
//       console.error("❌ Invalid nearby response format:", res.data);
//       fallbackToAll();
//     }
//   } catch (err) {
//     console.error("❌ Failed to fetch nearby services:", err);
//     fallbackToAll();
//   }
// };

// // ✅ Then write useEffect below it
// useEffect(() => {
//   const fetchServices = async () => {
//     const token = localStorage.getItem("token");

//     try {
//       if (!token) {
//         const res = await axios.get("/api/product/all");
//         setServices(res.data || []);
//         return;
//       }

//       const profileRes = await axios.get("/api/user/currentuser", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const user = profileRes.data;
//       setIsLoggedIn(true);
//       setUserRole(user.role);

//       if (user.role === "customer") {
//         if ("geolocation" in navigator) {
//           navigator.geolocation.getCurrentPosition(
//             (position) => {
//               const lat = position.coords.latitude;
//               const lng = position.coords.longitude;
//               fetchNearbyServices(lat, lng, token); // ✅ NOW it exists
//             },
//             (err) => {
//               console.warn("❌ Location error:", err);
//               fallbackToAll();
//             }
//           );
//         } else {
//           fallbackToAll();
//         }
//       } else {
//         const res = await axios.get("/api/product/all");
//         setServices(res.data || []);
//       }
//     } catch (err) {
//       console.error("❌ Error fetching user or services:", err);
//       setIsLoggedIn(false);
//       fallbackToAll();
//     }
//   };

//   const fallbackToAll = async () => {
//     try {
//       const res = await axios.get("/api/product/all");
//       setServices(res.data || []);
//     } catch (err) {
//       console.error("❌ Failed to load fallback services:", err);
//       setServices([]);
//     }
//   };

//   fetchServices();
// }, []);





// // const fetchNearbyServices = async (lat, lng) => {
// //   try {
// //     const token = localStorage.getItem("token");
// //     if (!token) return;

// //     const res = await axios.get(`/api/customer/nearby-services`, {
// //       headers: { Authorization: `Bearer ${token}` },
// //       params: { lat, lng },
// //     });

// //     console.log("Nearby services response 🧾", res.data);

// //     // ✅ Validate the response before setting it
// //     if (Array.isArray(res.data)) {
// //       setServices(res.data);
// //     } else {
// //       console.error("❌ Invalid services response format:", res.data);
// //       setServices([]); // fallback to prevent crash
// //     }
// //   } catch (error) {
// //     console.error("Failed to fetch nearby services:", error);
// //     setServices([]); // fallback to empty on failure
// //   }
// // };



// const handleDetectLocation = async () => {
//   setIsDetectingLocation(true);
//   setLocationError("");

//   try {
//     const location = await getCurrentLocation();
    
//     setCustomerLocation(location);
//     setHasLocationPermission(true);
//     localStorage.setItem("customerLocation", JSON.stringify(location));

//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         await axios.post(
//           "/api/user/location",
//           {
//             lat: location.lat,
//             lng: location.lng,
//             address: location.address,
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//       } catch (error) {
//         console.error("Failed to save location to backend:", error);
//       }
//     }

//     fetchNearbyServices(location.lat, location.lng);
//     setShowLocationModal(false);
//   } catch (error) {
//     console.error("Location detection error:", error);
//     setLocationError(error.message || "Could not detect location. Please allow location access.");
//   } finally {
//     setIsDetectingLocation(false);
//   }
// };

// const handleManualLocationSelect = async (location) => {
//   try {
//     setCustomerLocation(location);
//     setHasLocationPermission(true);
//     localStorage.setItem("customerLocation", JSON.stringify(location));

//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         await axios.post(
//           "/api/user/location",
//           {
//             lat: location.lat,
//             lng: location.lng,
//             address: location.address,
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//       } catch (error) {
//         console.error("Failed to save location to backend:", error);
//       }
//     }

//     fetchNearbyServices(location.lat, location.lng);
//     setShowLocationModal(false);
//     setShowManualAddressModal(false);
//   } catch (error) {
//     console.error("Manual location error:", error);
//     setLocationError("Failed to save location. Please try again.");
//   }
// };

// const handleOpenManualAddressInput = () => {
//   setShowLocationModal(false);
//   setShowManualAddressModal(true);
// };

// const handleCloseManualAddressInput = () => {
//   setShowManualAddressModal(false);
//   setShowLocationModal(true);
// };

// const handleChangeLocation = () => {
//   setShowLocationModal(true);
// };


// const filteredServices = services.filter((service) => {
//   const name = (service.title || service.name || service.serviceName || "").toLowerCase();
//   const washerman =
//     (service.washerman?.name ||
//       service.washermanName ||
//       service.laundryman ||
//       "").toLowerCase();
//   const category = (service.category || "").toLowerCase();
//   const query = searchQuery.trim().toLowerCase();

//   const matchesCategory =
//     selectedCategory === "all" || category === selectedCategory.toLowerCase();

//   const matchesSearch =
//     query === "" || name.includes(query) || washerman.includes(query);

//   return matchesCategory && matchesSearch;
// });




//   const handleAddToCart = (service: Service, quantity: number, selectedOptions: string[]) => {
//     addToCart(service, quantity, selectedOptions)
//   }

//   const handleProceedToBooking = () => {
//     if (cartItems.length > 0) {
//       setCurrentView("booking")
//     }
//   }

//   const handleBackToServices = () => {
//     setCurrentView("services")
//   }

//   const handleCompleteOrder = () => {
//     setCurrentView("services")
//     clearCart()
//     setSelectedTimeSlot(null)
//     navigate("/payment", {
//       state: {
//         cartItems,
//         selectedDate,
//         selectedTimeSlot,
//       },
//     })
//   }

//   const handleNav = (path: string) => navigate(path)

//   const renderServicesView = () => (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar
//         searchQuery={searchQuery}
//         onSearchChange={setSearchQuery}
//         cartItemCount={getTotalItems()}
//         onCartClick={handleProceedToBooking}
//         onContactClick={() => handleNav("/contact")}
//         onAboutClick={() => handleNav("/about")}
//         onOrdersClick={() => handleNav("/orders")}
//         onHomeClick={() => handleNav("/mainapp")}
//         onSignInClick={() => handleNav("/signin")}
//         onSignUpClick={() => handleNav("/signup")}
//         onProfileClick={() => handleNav("/CustomerDashboard")}
//       />

//       {/* Location Display */}
//       {customerLocation ? (
//         <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
//           <div className="max-w-7xl mx-auto">
//             <LocationDisplay
//               location={customerLocation}
//               onEditLocation={handleChangeLocation}
//               className="flex items-center justify-between"
//             />
//           </div>
//         </div>
//       ) : (
//         <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
//           <div className="max-w-7xl mx-auto flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <span className="text-yellow-600">⚠️</span>
//               <span className="text-sm text-yellow-800">Please set your location to see nearby services</span>
//             </div>
//             <button
//               onClick={() => setShowLocationModal(true)}
//               className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
//             >
//               Set Location
//             </button>
//           </div>
//         </div>
//       )}

// <div>
//    <LaundryHome />
// </div>

     
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
//         <CategoryFilter
//           categories={categories}
//           selectedCategory={selectedCategory}
//           onCategoryChange={setSelectedCategory}
//         />
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
//           {filteredServices.map((service) => (
//             <ServiceCard key={service._id} service={service} onAddToCart={handleAddToCart} />
// //             <ServiceCard
// //   key={service._id}
// //   service={service}
// //   onAddToCart={addToCart}
// //   cartItems={cartItems}  // ✅ REQUIRED!
// // />

//           ))}
//         </div>
//         {filteredServices.length === 0 && (
//           <div className="text-center py-12">
//             <WashingMachine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
//             <p className="text-gray-600">Try adjusting your search or filter criteria</p>
//           </div>
//         )}
//         {cartItems.length > 0 && (
//           <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-3 md:p-4 shadow-lg">
//             <div className="max-w-7xl mx-auto flex items-center justify-between">
//               <span className="font-semibold text-sm md:text-base">{getTotalItems()} items selected</span>
//               <button
//                 onClick={handleProceedToBooking}
//                 className="bg-white text-blue-600 px-4 md:px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base"
//               >
//                 Proceed to Order
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )




//   const renderBookingView = () => (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar
//         searchQuery={searchQuery}
//         onSearchChange={setSearchQuery}
//         cartItemCount={getTotalItems()}
//         onCartClick={() => {}}
//         onContactClick={() => handleNav("/contact")}
//         onAboutClick={() => handleNav("/about")}
//         onOrdersClick={() => handleNav("/orders")}
//         onHomeClick={() => handleNav("/mainapp")}
//         onSignInClick={() => handleNav("/signin")}
//         onSignUpClick={() => handleNav("/signup")}
//         onProfileClick={() => handleNav("/CustomerDashboard")}
//       />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
//         <button
//           onClick={handleBackToServices}
//           className="mb-6 flex items-center space-x-2 text-blue-600 hover:text-blue-700"
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//           <span className="font-medium">Back to Products</span>
//         </button>
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
//           <div className="lg:col-span-2">
//             <TimeSlotPicker
//               timeSlots={timeSlots}
//               selectedDate={selectedDate}
//               selectedTimeSlot={selectedTimeSlot}
//               onDateChange={setSelectedDate}
//               onTimeSlotSelect={setSelectedTimeSlot}
//             />
//           </div>
//           <div className="lg:col-span-1">
//             <OrderSummary
//               cartItems={cartItems}
//               selectedDate={selectedDate}
//               selectedTimeSlot={selectedTimeSlot}
//               onCompleteOrder={handleCompleteOrder}
//               onRemoveFromCart={removeFromCart}
//               onUpdateQuantity={updateQuantity}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )

//   return (
//     <>
//       {currentView === "services" ? renderServicesView() : renderBookingView()}

//       {/* Location Selection Modal */}
//       {showLocationModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <div className="text-center mb-6">
//               <div className="text-4xl mb-4">📍</div>
//               <h2 className="text-xl font-bold text-gray-900 mb-2">Choose Your Location</h2>
//               <p className="text-gray-600 text-sm">We need your location to show nearby laundry services</p>
//             </div>

//             {locationError && (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
//                 <p className="text-red-600 text-sm">{locationError}</p>
//               </div>
//             )}

//             <div className="space-y-4">
//               <button
//                 onClick={handleDetectLocation}
//                 disabled={isDetectingLocation}
//                 className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//               >
//                 {isDetectingLocation ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     <span>Detecting Location...</span>
//                   </>
//                 ) : (
//                   <>
//                     <span>📍</span>
//                     <span>Use Current Location</span>
//                   </>
//                 )}
//               </button>

//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">or</span>
//                 </div>
//               </div>

//               <button
//                 onClick={handleOpenManualAddressInput}
//                 className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
//               >
//                 <span>📝</span>
//                 <span>Enter Address Manually</span>
//               </button>
//             </div>

//             <div className="mt-6 text-center">
//               <p className="text-xs text-gray-500">
//                 Your location helps us show you the most relevant laundry services in your area
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Manual Address Input Modal */}
//       {showManualAddressModal && (
//         <ManualAddressInput
//           onLocationSelect={handleManualLocationSelect}
//           onClose={handleCloseManualAddressInput}
//           currentLocation={customerLocation}
//         />
//       )}
//     </>
//   )
// }

// function WashermanServicesApp() {
//   const [services, setServices] = useState<Servicee[]>([])
//   const [currentView, setCurrentView] = useState<"list" | "form">("list")

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const token = localStorage.getItem("token")
//         const res = await apiFetch("/api/product/all", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         const data = await res.json()
//         setServices(data)
//       } catch (err) {
//         console.error("Failed to fetch services:", err)
//       }
//     }
//     fetchServices()
//   }, [])


//   const handleAddService = async (serviceData: Omit<Servicee, "_id" | "createdAt" | "updatedAt">) => {
//     try {
//       const token = localStorage.getItem("token")
//       const response = await apiFetch("/api/product", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(serviceData),
//       })
//       const newService = await response.json()
//       setServices((prev) => [newService, ...prev])
//       setCurrentView("list")
//     } catch (err) {
//       console.error("Add service failed:", err)
//     }
//   }

//   const handleEditService = (id: string, updates: Partial<Servicee>) => {
//     setServices((prev) =>
//       prev.map((service) =>
//         service._id === id ? { ...service, ...updates, updatedAt: new Date().toISOString() } : service,
//       ),
//     )
//   }

//   const handleDeleteService = (id: string) => {
//     setServices((prev) => prev.filter((service) => service._id !== id))
//   }

//   return (
//     <div className="App">
//       {currentView === "form" ? (
//         <ServiceForm onSubmit={handleAddService} onBack={() => setCurrentView("list")} />
//       ) : (
//         <ServiceList
//           services={services}
//           onEdit={handleEditService}
//           onDelete={handleDeleteService}
//           onAddNew={() => setCurrentView("form")}
//         />
//       )}
//     </div>
//   )
// }

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<MainApp />} />
//       <Route path="/mainapp" element={<MainApp />} />
//       <Route path="/contact" element={<Contact />} />
//       <Route path="/about" element={<About />} />
//       <Route path="/orders" element={<OrderPage />} />
//       <Route path="/signin" element={<SignIn />} />
//       <Route path="/signup" element={<SignUp />} />
//       <Route path="/LaundrymanDashboard" element={<LaundrymanDashboard />} />
//       <Route path="/CustomerDashboard" element={<CustomerDashboard />} />
//       <Route path="/adminservices" element={<WashermanServicesApp />} />
//       <Route path="/adminDashboard" element={<AdminDashboard />} />
//       <Route path="/payment" element={<PaymentPage />} />
//       <Route path="/SlotTemplateManager" element={<SlotTemplateManager />} />
//       <Route path="/WashermanSlotToggle" element={<WashermanSlotToggle />} />
//       <Route path="/SlotTemplateManagers" element={<SlotTemplateManagers />} />
//       <Route path="/location-test" element={<LocationTest />} />
//       <Route path="/location-debug" element={<LocationDebug />} />
//       <Route path="/nearby-washermen" element={<NearbyWashermenWithSlots />} />
//       {/* <Route path="/NearbyWashermenMap" element={<MapPage />} /> */}
//       <Route path="/reset-password/:token" element={<ResetPassword />} />
// <Route path="/AdminMessages" element={<AdminMessages />} />
//     </Routes>
//   )
// }

// export default App

















// "use client"

// // File: src/App.tsx
// import { useState, useEffect } from "react"
// import { Routes, Route, useNavigate } from "react-router-dom"
// import { WashingMachine } from "lucide-react"
// import Navbar from "./components/Navbar"
// import ServiceCard from "./components/ServiceCard"
// import TimeSlotPicker from "./components/TimeSlotPicker"
// import OrderSummary from "./components/OrderSummary"
// import CategoryFilter from "./components/CategoryFilter"
// import { useCart } from "./hooks/useCart"
// import { generateTimeSlotsForDate } from "./utils/timeSlots"
// import type { Service, TimeSlot } from "./types"
// import Contact from "./pagess/ContactPage"
// import About from "./pagess/AboutPage"
// import OrderPage from "./pagess/OrderPage"
// import PaymentPage from "./pagess/PaymentPage"
// import SignIn from "./components/SignIn"
// import SignUp from "./components/SignUp"
// import MapPage from "./pagess/MapPage"
// import NearbyWashermenWithSlots from "./components/NearbyWashermenWithSlots"
// import LocationTest from "./components/LocationTest"
// import LocationDebug from "./components/LocationDebug"
// import LaundrymanDashboard from "./dashboard/LaundrymanDashboard"
// import CustomerDashboard from "./dashboard/CustomerDashboard"
// import AdminDashboard from "./dashboard/AdminDashboard"
// import ServiceForm from "./components/ServiceForm"
// import ServiceList from "./components/ServiceList"
// import SlotTemplateManagers from "./components/SlotTemplateManagers"
// import SlotTemplateManager from "./components/SlotTemplateManager"
// import WashermanSlotToggle from "./components/WashermanSlotToggle"
// import type { Servicee } from "./components/Types/Servicee"
// import axios from '../src/utilss/axios.js' // Adjust the import path as necessary
// import { apiFetch } from "./utilss/apifetch"
// import ResetPassword from "./pagess/resetPassword";
// import AdminMessages from './pagess/AdminMessages'; // adjust path if needed
// import LaundryHome from './components/LaundryHome';



// type AppView = "services" | "booking"

// const categories = [
//   { id: "all", name: "All" },
//   { id: "shirt", name: "Shirt" },
//   { id: "pant", name: "Pant" },
//   { id: "suits", name: "Suits" },
//   { id: "Bedsheet", name: "Bedsheet" },
// ]

// function MainApp() {
//   const navigate = useNavigate()
//   const [currentView, setCurrentView] = useState<AppView>("services")
//   const [selectedCategory, setSelectedCategory] = useState("all")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedDate, setSelectedDate] = useState(
//     new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
//   )
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
//   const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
//   const [services, setServices] = useState<Service[]>([])
// const [isLoggedIn, setIsLoggedIn] = useState(false);
// const [userRole, setUserRole] = useState(null);




//   // Location states
//   const [showLocationModal, setShowLocationModal] = useState(false)
//   const [customerLocation, setCustomerLocation] = useState(null)
//   const [isDetectingLocation, setIsDetectingLocation] = useState(false)
//   const [locationError, setLocationError] = useState("")
//   const [hasLocationPermission, setHasLocationPermission] = useState(false)

//   const { cartItems, addToCart, removeFromCart, updateQuantity, getTotalItems, clearCart } = useCart()

// const [manualAddress, setManualAddress] = useState("")






//   // Safe localStorage write for selectedTimeSlot
//   useEffect(() => {
//     if (selectedTimeSlot) {
//       localStorage.setItem("selectedTimeSlot", JSON.stringify(selectedTimeSlot))
//     } else {
//       localStorage.removeItem("selectedTimeSlot")
//     }
//   }, [selectedTimeSlot])

//   useEffect(() => {
//     localStorage.setItem("selectedDate", selectedDate)
//   }, [selectedDate])

//   useEffect(() => {
//     const newTimeSlots = generateTimeSlotsForDate(selectedDate)
//     setTimeSlots(newTimeSlots)
//     setSelectedTimeSlot(null)
//   }, [selectedDate])

  

// useEffect(() => {
//   const checkUserLocation = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const hasLocation = localStorage.getItem("customerLocation");
//       if (!hasLocation) {
//         setShowLocationModal(true);
//       } else {
//         const savedLocation = JSON.parse(hasLocation);
//         setCustomerLocation(savedLocation);
//         setHasLocationPermission(true);
//         fetchNearbyServices(savedLocation.lat, savedLocation.lng); // ✅ lat/lng
//       }
//     } catch (error) {
//       console.error("Error checking user location:", error);
//       setShowLocationModal(true);
//     }
//   };

//   checkUserLocation();
// }, []);




// // 👇 Define the function FIRST
// const fetchNearbyServices = async (lat: number, lng: number, token: string) => {
//   try {
//     const res = await axios.get("/api/customer/nearby-services", {
//       headers: { Authorization: `Bearer ${token}` },
//       params: { lat, lng },
//     });

//     console.log("🧾 Nearby services response:", res.data);
//     if (Array.isArray(res.data)) {
//       setServices(res.data);
//     } else {
//       console.error("❌ Invalid nearby response format:", res.data);
//       fallbackToAll();
//     }
//   } catch (err) {
//     console.error("❌ Failed to fetch nearby services:", err);
//     fallbackToAll();
//   }
// };

// // ✅ Then write useEffect below it
// useEffect(() => {
//   const fetchServices = async () => {
//     const token = localStorage.getItem("token");

//     try {
//       if (!token) {
//         const res = await axios.get("/api/product/all");
//         setServices(res.data || []);
//         return;
//       }

//       const profileRes = await axios.get("/api/user/currentuser", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const user = profileRes.data;
//       setIsLoggedIn(true);
//       setUserRole(user.role);

//       if (user.role === "customer") {
//         // Only request location if user is logged in
//         if ("geolocation" in navigator) {
//           navigator.geolocation.getCurrentPosition(
//             (position) => {
//               const lat = position.coords.latitude;
//               const lng = position.coords.longitude;
//               fetchNearbyServices(lat, lng, token); // ✅ NOW it exists
//             },
//             (err) => {
//               console.warn("❌ Location error:", err);
//               fallbackToAll();
//             }
//           );
//         } else {
//           fallbackToAll();
//         }
//       } else {
//         const res = await axios.get("/api/product/all");
//         setServices(res.data || []);
//       }
//     } catch (err) {
//       console.error("❌ Error fetching user or services:", err);
//       setIsLoggedIn(false);
//       fallbackToAll();
//     }
//   };

//   const fallbackToAll = async () => {
//     try {
//       const res = await axios.get("/api/product/all");
//       setServices(res.data || []);
//     } catch (err) {
//       console.error("❌ Failed to load fallback services:", err);
//       setServices([]);
//     }
//   };

//   fetchServices();
// }, []);





// // const fetchNearbyServices = async (lat, lng) => {
// //   try {
// //     const token = localStorage.getItem("token");
// //     if (!token) return;

// //     const res = await axios.get(`/api/customer/nearby-services`, {
// //       headers: { Authorization: `Bearer ${token}` },
// //       params: { lat, lng },
// //     });

// //     console.log("Nearby services response 🧾", res.data);

// //     // ✅ Validate the response before setting it
// //     if (Array.isArray(res.data)) {
// //       setServices(res.data);
// //     } else {
// //       console.error("❌ Invalid services response format:", res.data);
// //       setServices([]); // fallback to prevent crash
// //     }
// //   } catch (error) {
// //     console.error("Failed to fetch nearby services:", error);
// //     setServices([]); // fallback to empty on failure
// //   }
// // };



// const handleDetectLocation = () => {
//   // Only allow location detection if user is logged in
//   const token = localStorage.getItem("token");
//   if (!token) {
//     alert("Please log in to use location services.");
//     return;
//   }

//   setIsDetectingLocation(true);
//   setLocationError("");

//   if (!navigator.geolocation) {
//     setLocationError("Geolocation is not supported by your browser.");
//     setIsDetectingLocation(false);
//     return;
//   }

//   navigator.geolocation.getCurrentPosition(
//     async (position) => {
//       const { latitude, longitude } = position.coords;

//       try {
//         const response = await fetch(
//           `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=fbddd9ac0aff4feb840edc8d63a8f264`
//         );
//         const data = await response.json();

//         const address =
//           data.results.length > 0
//             ? data.results[0].formatted
//             : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

//         const location = {
//           lat: latitude,
//           lng: longitude,
//           address,
//         };

//         setCustomerLocation(location);
//         setHasLocationPermission(true);
//         localStorage.setItem("customerLocation", JSON.stringify(location));

//         const token = localStorage.getItem("token");
//         if (token) {
//           try {
//             await axios.post(
//               "/api/user/location",
//               {
//                 lat: latitude, // ✅ fixed field
//                 lng: longitude, // ✅ fixed field
//               },
//               {
//                 headers: {
//                   "Content-Type": "application/json",
//                   Authorization: `Bearer ${token}`,
//                 },
//               }
//             );
//           } catch (error) {
//             console.error("Failed to save location to backend:", error);
//           }
//         }

//         fetchNearbyServices(latitude, longitude);
//         setShowLocationModal(false);
//       } catch (error) {
//         console.error("Geocoding error:", error);
//         setLocationError("Failed to get address from coordinates");
//       } finally {
//         setIsDetectingLocation(false);
//       }
//     },
//     (error) => {
//       console.error("Location error:", error.message);
//       setLocationError("Could not detect location. Please allow location access.");
//       setIsDetectingLocation(false);
//     },
//     {
//       enableHighAccuracy: true,
//       timeout: 15000,
//       maximumAge: 0,
//     }
//   );
// };

// const handleManualLocation = async (address) => {
//   try {
//     const response = await fetch(
//       `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=fbddd9ac0aff4feb840edc8d63a8f264`
//     );
//     const data = await response.json();

//     if (data.results.length > 0) {
//       const result = data.results[0];
//       const location = {
//         lat: result.geometry.lat,
//         lng: result.geometry.lng,
//         address: result.formatted,
//       };

//       setCustomerLocation(location);
//       setHasLocationPermission(true);
//       localStorage.setItem("customerLocation", JSON.stringify(location));

//       const token = localStorage.getItem("token");
//       if (token) {
//         try {
//          await axios.post(
//   "/api/user/location",
//   {
//     lat: location.lat,
//     lng: location.lng,
//     address: location.address, // ✅ now you're saving the full location
//   },
//   {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   }
// );


//         } catch (error) {
//           console.error("Failed to save location to backend:", error);
//         }
//       }

//       fetchNearbyServices(location.lat, location.lng); // ✅ correct field
//       setShowLocationModal(false);
//     } else {
//       setLocationError("Address not found. Please try a different address.");
//     }
//   } catch (error) {
//     console.error("Manual location error:", error);
//     setLocationError("Failed to find location. Please try again.");
//   }
// };


// const filteredServices = services.filter((service) => {
//   const name = (service.title || service.name || service.serviceName || "").toLowerCase();
//   const washerman =
//     (service.washerman?.name ||
//       service.washermanName ||
//       service.laundryman ||
//       "").toLowerCase();
//   const category = (service.category || "").toLowerCase();
//   const query = searchQuery.trim().toLowerCase();

//   const matchesCategory =
//     selectedCategory === "all" || category === selectedCategory.toLowerCase();

//   const matchesSearch =
//     query === "" || name.includes(query) || washerman.includes(query);

//   return matchesCategory && matchesSearch;
// });




//   const handleAddToCart = (service: Service, quantity: number, selectedOptions: string[]) => {
//     addToCart(service, quantity, selectedOptions)
//   }

//   const handleProceedToBooking = () => {
//     if (cartItems.length > 0) {
//       setCurrentView("booking")
//     }
//   }

//   const handleBackToServices = () => {
//     setCurrentView("services")
//   }

//   const handleCompleteOrder = () => {
//     setCurrentView("services")
//     clearCart()
//     setSelectedTimeSlot(null)
//     navigate("/payment", {
//       state: {
//         cartItems,
//         selectedDate,
//         selectedTimeSlot,
//       },
//     })
//   }

//   const handleNav = (path: string) => navigate(path)

//   const renderServicesView = () => (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar
//         searchQuery={searchQuery}
//         onSearchChange={setSearchQuery}
//         cartItemCount={getTotalItems()}
//         onCartClick={handleProceedToBooking}
//         onContactClick={() => handleNav("/contact")}
//         onAboutClick={() => handleNav("/about")}
//         onOrdersClick={() => handleNav("/orders")}
//         onHomeClick={() => handleNav("/mainapp")}
//         onSignInClick={() => handleNav("/signin")}
//         onSignUpClick={() => handleNav("/signup")}
//         onProfileClick={() => handleNav("/CustomerDashboard")}
//       />

//       {/* Location Display - Only show if logged in */}
//       {isLoggedIn && customerLocation && (
//         <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
//           <div className="max-w-7xl mx-auto flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <span className="text-blue-600">📍</span>
//               <span className="text-sm text-blue-800">Delivering to: {customerLocation.address}</span>
//             </div>
//             <button
//               onClick={() => setShowLocationModal(true)}
//               className="text-blue-600 text-sm font-medium hover:text-blue-700"
//             >
//               Change Location
//             </button>
//           </div>
//         </div>
//       )}

//  <div>
//    <LaundryHome />
// </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
//         <CategoryFilter
//           categories={categories}
//           selectedCategory={selectedCategory}
//           onCategoryChange={setSelectedCategory}
//         />
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
//           {filteredServices.map((service) => (
//             <ServiceCard key={service._id} service={service} onAddToCart={handleAddToCart} />
// //             <ServiceCard
// //   key={service._id}
// //   service={service}
// //   onAddToCart={addToCart}
// //   cartItems={cartItems}  // ✅ REQUIRED!
// // />

//           ))}
//         </div>
//         {filteredServices.length === 0 && (
//           <div className="text-center py-12">
//             <WashingMachine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
//             <p className="text-gray-600">Try adjusting your search or filter criteria</p>
//           </div>
//         )}
//         {cartItems.length > 0 && (
//           <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-3 md:p-4 shadow-lg">
//             <div className="max-w-7xl mx-auto flex items-center justify-between">
//               <span className="font-semibold text-sm md:text-base">{getTotalItems()} items selected</span>
//               <button
//                 onClick={handleProceedToBooking}
//                 className="bg-white text-blue-600 px-4 md:px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base"
//               >
//                 Proceed to Order
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )

//   const renderBookingView = () => (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar
//         searchQuery={searchQuery}
//         onSearchChange={setSearchQuery}
//         cartItemCount={getTotalItems()}
//         onCartClick={() => {}}
//         onContactClick={() => handleNav("/contact")}
//         onAboutClick={() => handleNav("/about")}
//         onOrdersClick={() => handleNav("/orders")}
//         onHomeClick={() => handleNav("/mainapp")}
//         onSignInClick={() => handleNav("/signin")}
//         onSignUpClick={() => handleNav("/signup")}
//         onProfileClick={() => handleNav("/CustomerDashboard")}
//       />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
//         <button
//           onClick={handleBackToServices}
//           className="mb-6 flex items-center space-x-2 text-blue-600 hover:text-blue-700"
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//           <span className="font-medium">Back to Products</span>
//         </button>
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
//           <div className="lg:col-span-2">
//             <TimeSlotPicker
//               timeSlots={timeSlots}
//               selectedDate={selectedDate}
//               selectedTimeSlot={selectedTimeSlot}
//               onDateChange={setSelectedDate}
//               onTimeSlotSelect={setSelectedTimeSlot}
//             />
//           </div>
//           <div className="lg:col-span-1">
//             <OrderSummary
//               cartItems={cartItems}
//               selectedDate={selectedDate}
//               selectedTimeSlot={selectedTimeSlot}
//               onCompleteOrder={handleCompleteOrder}
//               onRemoveFromCart={removeFromCart}
//               onUpdateQuantity={updateQuantity}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )

//   return (
//     <>
//       {currentView === "services" ? renderServicesView() : renderBookingView()}

//       {/* Location Selection Modal - Only show if logged in */}
//       {isLoggedIn && showLocationModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <div className="text-center mb-6">
//               <div className="text-4xl mb-4">📍</div>
//               <h2 className="text-xl font-bold text-gray-900 mb-2">Choose Your Location</h2>
//               <p className="text-gray-600 text-sm">We need your location to show nearby laundry services</p>
//             </div>

//             {locationError && (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
//                 <p className="text-red-600 text-sm">{locationError}</p>
//               </div>
//             )}

//             <div className="space-y-4">
//               <button
//                 onClick={handleDetectLocation}
//                 disabled={isDetectingLocation}
//                 className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//               >
//                 {isDetectingLocation ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     <span>Detecting Location...</span>
//                   </>
//                 ) : (
//                   <>
//                     <span>📍</span>
//                     <span>Use Current Location</span>
//                   </>
//                 )}
//               </button>

//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">or</span>
//                 </div>
//               </div>

//               <div>
//                 <input
//                   type="text"
//                   placeholder="Enter your address manually"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   onKeyPress={(e) => {
//                     if (e.key === "Enter") {
//                       handleManualLocation(e.target.value)
//                     }
//                   }}
//                 />




//                 <p className="text-xs text-gray-500 mt-1">Press Enter to search for this address</p>
//               </div>
//             </div>

//             <div className="mt-6 text-center">
//               <p className="text-xs text-gray-500">
//                 Your location helps us show you the most relevant laundry services in your area
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// function WashermanServicesApp() {
//   const [services, setServices] = useState<Servicee[]>([])
//   const [currentView, setCurrentView] = useState<"list" | "form">("list")

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const token = localStorage.getItem("token")
//         const res = await apiFetch("/api/product/all", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         const data = await res.json()
//         setServices(data)
//       } catch (err) {
//         console.error("Failed to fetch services:", err)
//       }
//     }
//     fetchServices()
//   }, [])


//   const handleAddService = async (serviceData: Omit<Servicee, "_id" | "createdAt" | "updatedAt">) => {
//     try {
//       const token = localStorage.getItem("token")
//       const response = await apiFetch("/api/product", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(serviceData),
//       })
//       const newService = await response.json()
//       setServices((prev) => [newService, ...prev])
//       setCurrentView("list")
//     } catch (err) {
//       console.error("Add service failed:", err)
//     }
//   }

//   const handleEditService = (id: string, updates: Partial<Servicee>) => {
//     setServices((prev) =>
//       prev.map((service) =>
//         service._id === id ? { ...service, ...updates, updatedAt: new Date().toISOString() } : service,
//       ),
//     )
//   }

//   const handleDeleteService = (id: string) => {
//     setServices((prev) => prev.filter((service) => service._id !== id))
//   }

//   return (
//     <div className="App">
//       {currentView === "form" ? (
//         <ServiceForm onSubmit={handleAddService} onBack={() => setCurrentView("list")} />
//       ) : (
//         <ServiceList
//           services={services}
//           onEdit={handleEditService}
//           onDelete={handleDeleteService}
//           onAddNew={() => setCurrentView("form")}
//         />
//       )}
//     </div>
//   )
// }

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<MainApp />} />
//       <Route path="/mainapp" element={<MainApp />} />
//       <Route path="/contact" element={<Contact />} />
//       <Route path="/about" element={<About />} />
//       <Route path="/orders" element={<OrderPage />} />
//       <Route path="/signin" element={<SignIn />} />
//       <Route path="/signup" element={<SignUp />} />
//       <Route path="/LaundrymanDashboard" element={<LaundrymanDashboard />} />
//       <Route path="/CustomerDashboard" element={<CustomerDashboard />} />
//       <Route path="/adminservices" element={<WashermanServicesApp />} />
//       <Route path="/adminDashboard" element={<AdminDashboard />} />
//       <Route path="/payment" element={<PaymentPage />} />
//       <Route path="/SlotTemplateManager" element={<SlotTemplateManager />} />
//       <Route path="/WashermanSlotToggle" element={<WashermanSlotToggle />} />
//       <Route path="/SlotTemplateManagers" element={<SlotTemplateManagers />} />
//       <Route path="/location-test" element={<LocationTest />} />
//       <Route path="/location-debug" element={<LocationDebug />} />
//       <Route path="/nearby-washermen" element={<NearbyWashermenWithSlots />} />
//       {/* <Route path="/NearbyWashermenMap" element={<MapPage />} /> */}
//       <Route path="/reset-password/:token" element={<ResetPassword />} />
// <Route path="/AdminMessages" element={<AdminMessages />} />
//     </Routes>
//   )
// }

// export default App















"use client"

// File: src/App.tsx
import { useState, useEffect } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import { WashingMachine } from "lucide-react"
import Navbar from "./components/Navbar"
import ServiceCard from "./components/ServiceCard"
import TimeSlotPicker from "./components/TimeSlotPicker"
import OrderSummary from "./components/OrderSummary"
import CategoryFilter from "./components/CategoryFilter"
import { useCart } from "./hooks/useCart"
import { generateTimeSlotsForDate } from "./utils/timeSlots"
import type { Service, TimeSlot } from "./types"
import Contact from "./pagess/ContactPage"
import About from "./pagess/AboutPage"
import OrderPage from "./pagess/OrderPage"
import PaymentPage from "./pagess/PaymentPage"
import SignIn from "./components/SignIn"
import SignUp from "./components/SignUp"
import MapPage from "./pagess/MapPage"
import NearbyWashermenWithSlots from "./components/NearbyWashermenWithSlots"
import LocationTest from "./components/LocationTest"
import LocationDebug from "./components/LocationDebug"
import LaundrymanDashboard from "./dashboard/LaundrymanDashboard"
import CustomerDashboard from "./dashboard/CustomerDashboard"
import AdminDashboard from "./dashboard/AdminDashboard"
import ServiceForm from "./components/ServiceForm"
import ServiceList from "./components/ServiceList"
import SlotTemplateManagers from "./components/SlotTemplateManagers"
import SlotTemplateManager from "./components/SlotTemplateManager"
import WashermanSlotToggle from "./components/WashermanSlotToggle"
import type { Servicee } from "./components/Types/Servicee"
import axios from '../src/utilss/axios.js' // Adjust the import path as necessary
import { apiFetch } from "./utilss/apifetch"
import ResetPassword from "./pagess/resetPassword";
import AdminMessages from './pagess/AdminMessages'; // adjust path if needed

import LaundryHome from './components/LaundryHome';
import LocationBasedServiceFilter from './components/LocationBasedServiceFilter';
import BackgroundSlotGenerator from './components/BackgroundSlotGenerator';


type AppView = "services" | "booking"

const categories = [
  { id: "all", name: "All" },
  { id: "shirt", name: "Shirt" },
  { id: "pant", name: "Pant" },
  { id: "suits", name: "Suits" },
  { id: "Bedsheet", name: "Bedsheet" },
]

function MainApp() {
  const navigate = useNavigate()
  const [currentView, setCurrentView] = useState<AppView>("services")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  )
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [services, setServices] = useState<Service[]>([])
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [userRole, setUserRole] = useState(null);




  // Location states
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [customerLocation, setCustomerLocation] = useState(null)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [locationError, setLocationError] = useState("")
  const [hasLocationPermission, setHasLocationPermission] = useState(false)
  const [locationModalShown, setLocationModalShown] = useState(false)

  const { cartItems, addToCart, removeFromCart, updateQuantity, getTotalItems, clearCart } = useCart()

const [manualAddress, setManualAddress] = useState("")






  // Fallback: load all services when location-based fetch fails or user not logged in
  const fallbackToAll = async () => {
    try {
      const res = await axios.get("/api/product/all");
      setServices(res.data || []);
    } catch (err) {
      console.error("❌ Failed to load fallback services:", err);
      setServices([]);
    }
  };

  // Safe localStorage write for selectedTimeSlot
  useEffect(() => {
    if (selectedTimeSlot) {
      localStorage.setItem("selectedTimeSlot", JSON.stringify(selectedTimeSlot))
    } else {
      localStorage.removeItem("selectedTimeSlot")
    }
  }, [selectedTimeSlot])

  useEffect(() => {
    localStorage.setItem("selectedDate", selectedDate)
  }, [selectedDate])

  useEffect(() => {
    const newTimeSlots = generateTimeSlotsForDate(selectedDate)
    setTimeSlots(newTimeSlots)
    setSelectedTimeSlot(null)
  }, [selectedDate])

  // Lock body scroll when location modal is open (prevents background from scrolling)
  useEffect(() => {
    if (showLocationModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showLocationModal])

  

useEffect(() => {
  const checkUserLocation = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Check if we already have a saved location
    const savedLocation = localStorage.getItem("customerLocation");
    
    if (!savedLocation && !locationModalShown) {
      // Only show location modal if no location is saved AND modal hasn't been shown this session
      setShowLocationModal(true);
      setLocationModalShown(true);
    } else if (savedLocation) {
      // Load saved location without showing modal
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setCustomerLocation(parsedLocation);
        setHasLocationPermission(true);
        fetchNearbyServices(parsedLocation.lat, parsedLocation.lng);
      } catch (error) {
        console.error("Error parsing saved location:", error);
        // If parsing fails and modal hasn't been shown, show modal to get fresh location
        if (!locationModalShown) {
          setShowLocationModal(true);
          setLocationModalShown(true);
        }
      }
    }
  };

  checkUserLocation();
}, [locationModalShown]);

// Additional effect to ensure location state is always in sync with localStorage
useEffect(() => {
  const savedLocation = localStorage.getItem("customerLocation");
  if (savedLocation && !customerLocation) {
    try {
      const parsedLocation = JSON.parse(savedLocation);
      setCustomerLocation(parsedLocation);
    } catch (error) {
      console.error("Error parsing saved location:", error);
    }
  }
}, [customerLocation]);




// 👇 Define the function FIRST
const fetchNearbyServices = async (lat: number, lng: number, tokenParam?: string) => {
  try {
    const tokenToUse = tokenParam || localStorage.getItem('token') || '';
    const headers = tokenToUse ? { Authorization: `Bearer ${tokenToUse}` } : undefined;

    const res = await axios.get("/api/customer/nearby-services", {
      headers,
      params: { lat, lng },
    });

    console.log("🧾 Nearby services response:", res.data);
    if (Array.isArray(res.data)) {
      setServices(res.data);
    } else {
      console.error("❌ Invalid nearby response format:", res.data);
      fallbackToAll();
    }
  } catch (err) {
    console.error("❌ Failed to fetch nearby services:", err);
    fallbackToAll();
  }
};

// ✅ Then write useEffect below it
useEffect(() => {
  const fetchServices = async () => {
    const token = localStorage.getItem("token");

    try {
      if (!token) {
        const res = await axios.get("/api/product/all");
        setServices(res.data || []);
        return;
      }

      const profileRes = await axios.get("/api/user/currentuser", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = profileRes.data;
      setIsLoggedIn(true);
      setUserRole(user.role);

      if (user.role === "customer") {
        // Only request location if user is logged in
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              fetchNearbyServices(lat, lng, token); // ✅ NOW it exists
            },
            (err) => {
              console.warn("❌ Location error:", err);
              fallbackToAll();
            }
          );
        } else {
          fallbackToAll();
        }
      } else {
        const res = await axios.get("/api/product/all");
        setServices(res.data || []);
      }
    } catch (err) {
      console.error("❌ Error fetching user or services:", err);
      setIsLoggedIn(false);
      fallbackToAll();
    }
  };

  fetchServices();
}, []);





// const fetchNearbyServices = async (lat, lng) => {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const res = await axios.get(`/api/customer/nearby-services`, {
//       headers: { Authorization: `Bearer ${token}` },
//       params: { lat, lng },
//     });

//     console.log("Nearby services response 🧾", res.data);

//     // ✅ Validate the response before setting it
//     if (Array.isArray(res.data)) {
//       setServices(res.data);
//     } else {
//       console.error("❌ Invalid services response format:", res.data);
//       setServices([]); // fallback to prevent crash
//     }
//   } catch (error) {
//     console.error("Failed to fetch nearby services:", error);
//     setServices([]); // fallback to empty on failure
//   }
// };



const handleDetectLocation = async () => {
  // Only allow location detection if user is logged in
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in to use location services.");
    return;
  }

  setIsDetectingLocation(true);
  setLocationError("");

  try {
    // Use improved geocoding service with multiple fallbacks
    const { getCurrentLocation } = await import('./utils/geocodingService');
    
    const location = await getCurrentLocation();
    
    setCustomerLocation(location);
    setHasLocationPermission(true);
    localStorage.setItem("customerLocation", JSON.stringify(location));

    // Save to backend
    if (token) {
      try {
        await axios.post(
          "/api/user/location",
          {
            lat: location.lat,
            lng: location.lng,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Failed to save location to backend:", error);
      }
    }

    fetchNearbyServices(location.lat, location.lng);
    setShowLocationModal(false);
    
  } catch (error: any) {
    console.error("Location detection error:", error);
    setLocationError(error.message || "Could not detect location. Please allow location access.");
  } finally {
    setIsDetectingLocation(false);
  }
};

const handleManualLocation = async (address) => {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=fbddd9ac0aff4feb840edc8d63a8f264`
    );
    const data = await response.json();

    if (data.results.length > 0) {
      const result = data.results[0];
      const location = {
        lat: result.geometry.lat,
        lng: result.geometry.lng,
        address: result.formatted,
      };

      setCustomerLocation(location);
      setHasLocationPermission(true);
      localStorage.setItem("customerLocation", JSON.stringify(location));

      const token = localStorage.getItem("token");
      if (token) {
        try {
         await axios.post(
  "/api/user/location",
  {
    lat: location.lat,
    lng: location.lng,
    address: location.address, // ✅ now you're saving the full location
  },
  {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }
);


        } catch (error) {
          console.error("Failed to save location to backend:", error);
        }
      }

      fetchNearbyServices(location.lat, location.lng); // ✅ correct field
      setShowLocationModal(false);
    } else {
      setLocationError("Address not found. Please try a different address.");
    }
  } catch (error) {
    console.error("Manual location error:", error);
    setLocationError("Failed to find location. Please try again.");
  }
};


const filteredServices = services.filter((service) => {
  const name = (service.title || service.name || service.serviceName || "").toLowerCase();
  const washerman =
    (service.washerman?.name ||
      service.washermanName ||
      service.laundryman ||
      "").toLowerCase();
  const category = (service.category || "").toLowerCase();
  const query = searchQuery.trim().toLowerCase();

  const matchesCategory =
    selectedCategory === "all" || category === selectedCategory.toLowerCase();

  const matchesSearch =
    query === "" || name.includes(query) || washerman.includes(query);

  return matchesCategory && matchesSearch;
});




  const handleAddToCart = (service: Service, quantity: number, selectedOptions: string[]) => {
    addToCart(service, quantity, selectedOptions)
  }

  const handleProceedToBooking = () => {
    if (cartItems.length > 0) {
      // Check if location is set for logged-in users
      if (isLoggedIn && !customerLocation) {
        alert("Please set your delivery location before proceeding to booking. Location is required for delivery.");
        setShowLocationModal(true);
        setLocationModalShown(true);
        return;
      }
      
      setCurrentView("booking")
      
      // ✅ FIXED: Automatically refresh time slots when entering booking view
      const newTimeSlots = generateTimeSlotsForDate(selectedDate)
      setTimeSlots(newTimeSlots)
      setSelectedTimeSlot(null)
    }
  }

  const handleChangeLocation = () => {
    setShowLocationModal(true);
    setLocationModalShown(true);
  }

  const handleBackToServices = () => {
    setCurrentView("services")
    
    // ✅ FIXED: Automatically refresh time slots when returning to services
    const newTimeSlots = generateTimeSlotsForDate(selectedDate)
    setTimeSlots(newTimeSlots)
    setSelectedTimeSlot(null)
  }

  const handleCompleteOrder = () => {
    setCurrentView("services")
    clearCart()
    setSelectedTimeSlot(null)
    
    // ✅ FIXED: Regenerate time slots for next booking
    const newTimeSlots = generateTimeSlotsForDate(selectedDate)
    setTimeSlots(newTimeSlots)
    
    navigate("/payment", {
      state: {
        cartItems,
        selectedDate,
        selectedTimeSlot,
      },
    })
  }

  const handleNav = (path: string) => navigate(path)

  const renderServicesView = () => (
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

      {/* Location Display - Always show for logged-in users */}
      {isLoggedIn && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">📍</span>
              {customerLocation ? (
                <span className="text-sm text-blue-800">Delivering to: {customerLocation.address}</span>
              ) : (
                <span className="text-sm text-red-600 font-medium">Location required for delivery</span>
              )}
            </div>
            <button
              onClick={handleChangeLocation}
              className={`text-sm font-medium transition-colors ${
                customerLocation 
                  ? 'text-blue-600 hover:text-blue-700' 
                  : 'text-red-600 hover:text-red-700 bg-red-100 px-3 py-1 rounded-lg'
              }`}
            >
              {customerLocation ? 'Change Location' : 'Add Location'}
            </button>
          </div>
        </div>
      )}

 <div>
  <LaundryHome />
 </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
          {filteredServices.map((service) => (
            <ServiceCard key={service._id} service={service} onAddToCart={handleAddToCart} />
//             <ServiceCard
//   key={service._id}
//   service={service}
//   onAddToCart={addToCart}
//   cartItems={cartItems}  // ✅ REQUIRED!
// />

          ))}
        </div>
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <WashingMachine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
        {cartItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-3 md:p-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <span className="font-semibold text-sm md:text-base">{getTotalItems()} items selected</span>
              <button
                onClick={handleProceedToBooking}
                className="bg-white text-blue-600 px-4 md:px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base"
              >
                Proceed to Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderBookingView = () => (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartItemCount={getTotalItems()}
        onCartClick={() => {}}
        onContactClick={() => handleNav("/contact")}
        onAboutClick={() => handleNav("/about")}
        onOrdersClick={() => handleNav("/orders")}
        onHomeClick={() => handleNav("/mainapp")}
        onSignInClick={() => handleNav("/signin")}
        onSignUpClick={() => handleNav("/signup")}
        onProfileClick={() => handleNav("/CustomerDashboard")}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <button
          onClick={handleBackToServices}
          className="mb-6 flex items-center space-x-2 text-blue-600 hover:text-blue-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Products</span>
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <TimeSlotPicker
              timeSlots={timeSlots}
              selectedDate={selectedDate}
              selectedTimeSlot={selectedTimeSlot}
              onDateChange={setSelectedDate}
              onTimeSlotSelect={setSelectedTimeSlot}
            />
          </div>
          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={cartItems}
              selectedDate={selectedDate}
              selectedTimeSlot={selectedTimeSlot}
              onCompleteOrder={handleCompleteOrder}
              onRemoveFromCart={removeFromCart}
              onUpdateQuantity={updateQuantity}
            />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {currentView === "services" ? renderServicesView() : renderBookingView()}

      {/* Location Selection - Zomato-like map flow using LocationBasedServiceFilter */}
      {isLoggedIn && showLocationModal && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-0 md:p-4">
{/*           <div className="bg-white w-full h-[100vh] md:h-auto md:max-w-3xl md:rounded-lg shadow-xl p-0 md:p-4 overflow-y-auto max-h-[100vh]"> */}
          <div className="bg-white w-full h-[100vh] md:h-auto md:max-w-3xl md:rounded-lg shadow-xl p-0 md:p-4 overflow-y-auto max-h-[100vh] mt-10 md:mt-0">

            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 md:p-0 md:mb-2 border-b md:border-0 bg-white">
              <h2 className="text-lg font-semibold">Choose Your Delivery Location</h2>
              <button onClick={() => {
                // Save current location before closing if available
                if (customerLocation) {
                  localStorage.setItem("customerLocation", JSON.stringify(customerLocation));
                }
                setShowLocationModal(false);
                setLocationModalShown(true); // Mark as shown so it doesn't show again
              }} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="px-4 pb-4 md:p-0">
              <LocationBasedServiceFilter
              onServicesFound={(svc) => {
                setServices(Array.isArray(svc) ? svc : []);
                setHasLocationPermission(true);
                // Only close when not in change mode; always close after explicit save
              }}
              onNoServices={() => {
                // Keep modal open so user can adjust location
                setHasLocationPermission(true);
              }}
              onLocationSet={(loc) => {
                // Persisted inside component too, but keep local state in sync
                setCustomerLocation(loc as any);
                // Save to localStorage immediately when location is set
                localStorage.setItem("customerLocation", JSON.stringify(loc));
              }}
              startInMap
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function WashermanServicesApp() {
  const [services, setServices] = useState<Servicee[]>([])
  const [currentView, setCurrentView] = useState<"list" | "form">("list")

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await apiFetch("/api/product/all", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setServices(data)
      } catch (err) {
        console.error("Failed to fetch services:", err)
      }
    }
    fetchServices()
  }, [])


  const handleAddService = async (serviceData: Omit<Servicee, "_id" | "createdAt" | "updatedAt">) => {
    try {
      const token = localStorage.getItem("token")
      const response = await apiFetch("/api/product", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      })
      const newService = await response.json()
      setServices((prev) => [newService, ...prev])
      setCurrentView("list")
    } catch (err) {
      console.error("Add service failed:", err)
    }
  }

  const handleEditService = (id: string, updates: Partial<Servicee>) => {
    setServices((prev) =>
      prev.map((service) =>
        service._id === id ? { ...service, ...updates, updatedAt: new Date().toISOString() } : service,
      ),
    )
  }

  const handleDeleteService = (id: string) => {
    setServices((prev) => prev.filter((service) => service._id !== id))
  }

  return (
    <div className="App">
      {currentView === "form" ? (
        <ServiceForm onSubmit={handleAddService} onBack={() => setCurrentView("list")} />
      ) : (
        <ServiceList
          services={services}
          onEdit={handleEditService}
          onDelete={handleDeleteService}
          onAddNew={() => setCurrentView("form")}
        />
      )}
    </div>
  )
}

function App() {
  // Check if user is admin
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get("/api/user/currentuser", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const userData = response.data;
          setIsAdmin(userData.role === 'admin');
        } catch (error) {
          console.error("Error checking admin status:", error);
        }
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <>
      {/* Background slot generator for admin users */}
      <BackgroundSlotGenerator isAdmin={isAdmin} />
      
      {/* PWA Status Indicator (only in development) */}
      <PWAStatusIndicator />
      
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/mainapp" element={<MainApp />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/LaundrymanDashboard" element={<LaundrymanDashboard />} />
        <Route path="/CustomerDashboard" element={<CustomerDashboard />} />
        <Route path="/adminservices" element={<WashermanServicesApp />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/SlotTemplateManager" element={<SlotTemplateManager />} />
        <Route path="/WashermanSlotToggle" element={<WashermanSlotToggle />} />
        <Route path="/SlotTemplateManagers" element={<SlotTemplateManagers />} />
        <Route path="/location-test" element={<LocationTest />} />
        <Route path="/location-debug" element={<LocationDebug />} />
        <Route path="/nearby-washermen" element={<NearbyWashermenWithSlots />} />
        {/* <Route path="/NearbyWashermenMap" element={<MapPage />} /> */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/AdminMessages" element={<AdminMessages />} />
      </Routes>
    </>
  )
}

export default App





