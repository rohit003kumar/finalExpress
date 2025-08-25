"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
// import React, { useEffect, useState } from 'react';
import axios from '../utilss/axios'; // Adjust the import path as necessary 
import {apiFetch } from '../utilss/apifetch'; // Adjust the import path as necessary
import AddressModal from '../components/AddressModal';
import { useAddress } from '../components/AddressIntegration';

import "./CustomerDashboard.css"

const CustomerDashboard = () => {
  const fileInputRef = useRef(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const [profile, setProfile] = useState({
    // name: "",
    // email: "",
    // contact: "",
    // image: "",
    // address: "",
    // location: "",
  })

  const [activePage, setActivePage] = useState("Home")
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPhoto, setIsChangingPhoto] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [tempProfile, setTempProfile] = useState({})
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
const [orders, setOrders] = useState([]);
const [ordersLoading, setOrdersLoading] = useState(true);

  // Payment states
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [selectedUpiProvider, setSelectedUpiProvider] = useState("")
  const [paymentStep, setPaymentStep] = useState("method")

  // Notification state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  // Rating states
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [ratingOrder, setRatingOrder] = useState(null)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")

  // Reorder states
  const [showReorderModal, setShowReorderModal] = useState(false)
  const [reorderData, setReorderData] = useState(null)

  // Time slot modal states
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  // Service modal states
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [serviceModalView, setServiceModalView] = useState("overview")

  // Address states
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [customerAddress, setCustomerAddress] = useState(null)
  const { savedAddress, saveAddress, sendAddressToWasherman } = useAddress();

  // Location and Service State
  const [customerLocation, setCustomerLocation] = useState(null)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [availableLaundrymen, setAvailableLaundrymen] = useState([])
  const [isLaundrymenLoading, setIsLaundrymenLoading] = useState(false)
  const [laundrymenError, setLaundrymenError] = useState(null)
  const [locationNotification, setLocationNotification] = useState("")

  // Booking State - Modified for multiple services
  const [selectedServices, setSelectedServices] = useState([]) // Changed to array
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [selectedLaundryman, setSelectedLaundryman] = useState(null)
  const [selectedClothes, setSelectedClothes] = useState([])
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [orderTotal, setOrderTotal] = useState(0)






// useEffect(() => {
//   const fetchOrders = async () => {
//     try {
//       const res = await axios.get("/api/booking", {
//         withCredentials: true, // needed if you're using cookies
//       });

//       // Attach washerman name and amount to each order if missing
//       const updatedOrders = res.data.map(order => ({
//         ...order,
//         laundryman: order.laundryman || order.laundrymanName || "",
//         total: order.total || order.totalAmount || 0,
//       }));

//       setOrders(updatedOrders);

//       // Calculate totalSpent correctly
//       const totalSpent = updatedOrders.reduce((sum, order) => {
//         return sum + (typeof order.total === "number" ? order.total : Number(order.total) || 0);
//       }, 0);

//       console.log("Total Spent:", totalSpent);
//     } catch (err) {
//       console.error("Error fetching orders", err);
//     } finally {
//       setOrdersLoading(false);
//     }
//   };

//   const token = localStorage.getItem("token");

//   const fetchProfile = async () => {
//     try {
//       const res = await axios.get("/api/user/currentuser", {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       // setProfile({
//       //   name: res.data.name,
//       //   email: res.data.email,
//       //   contact: res.data.contact,
//       //   image: "/src/profile.png",
//       //   _id: res.data._id, // store ID for update route
//       // });

//           setProfile({
//       name: res.data.name,
//       email: res.data.email,
//       contact: res.data.contact,
//       image: res.data.image || "/placeholder.svg", // ✅ fixed
//       address: res.data.address,
//       _id: res.data._id,
//     });

//     } catch (err) {
//       console.error("Failed to fetch profile:", err);
//     }
//   };

//   fetchProfile();
//   fetchOrders();
// }, []);
 



useEffect(() => {
  const token = localStorage.getItem("token");
  console.log("Token from localStorage:", token);

 
  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/user/currentuser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setProfile({
        name: res.data.name,
        email: res.data.email,
        contact: res.data.contact,
        image: res.data.image || "/placeholder.svg",
        address: res.data.address,
        _id: res.data._id,
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

 const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/booking", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // Include this if backend uses cookies
      });

      const updatedOrders = res.data.map(order => ({
        ...order,
        laundryman: order.laundryman || order.laundrymanName || "",
        total: order.total || order.totalAmount || 0,
      }));

      setOrders(updatedOrders);

      const totalSpent = updatedOrders.reduce((sum, order) => {
        return sum + (typeof order.total === "number" ? order.total : Number(order.total) || 0);
      }, 0);

      console.log("Total Spent:", totalSpent);
    } catch (err) {
       console.error("Error fetching orders:", err?.response?.data || err.message);
    } finally {
      setOrdersLoading(false);
    }
  };


  fetchProfile();
  fetchOrders();
}, []);



  // Enhanced Services and Pricing
  const services = [
    {
      id: "wash_fold",
      name: "Wash & Fold",
      description: "Regular washing and folding service",
      icon: "👕",
      deliveryTime: "Same day - Next day",
      clothes: [
        { name: "Shirt", price: 25, image: "download.jpg" },
        { name: "T-Shirt", price: 20, image: "t shirt.jpg" },
        { name: "Pants", price: 30, image: "pants.jpg" },
        { name: "Jeans", price: 35, image: "jeans.jpg" },
        { name: "Jacket", price: 50, image: "jacket.jpg" },
      ],
    },
    {
      id: "dry_clean",
      name: "Dry Cleaning",
      description: "Professional dry cleaning service",
      icon: "🧥",
      deliveryTime: "Same day - Next day",
      clothes: [
        { name: "Shirt", price: 150, image: "download.jpg" },
        { name: "Jeans", price: 120, image: "jeans.jpg" },
        { name: "Jacket", price: 200, image: "jacket.jpg" },
      ],
    },
    {
      id: "iron_only",
      name: "Iron Only",
      description: "Professional ironing service",
      icon: "🔥",
      deliveryTime: "Same day",
      clothes: [
        { name: "Shirt", price: 15, image: "download.jpg" },
        { name: "T-Shirt", price: 10, image: "t shirt.jpg" },
        { name: "Pants", price: 20, image: "pants.jpg" },
        { name: "Jacket", price: 30, image: "jacket.jpg" },
      ],
    },
    {
      id: "stain_removal",
      name: "Stain Removal",
      description: "Specialized stain removal service",
      icon: "🧽",
      deliveryTime: "Same day - Next day",
      clothes: [
        { name: "Shirt", price: 50, image: "download.jpg" },
        { name: "Pants", price: 60, image: "pants.jpg" },
        { name: "Jacket", price: 100, image: "jacket.jpg" },
      ],
    },
    {
      id: "eco_friendly",
      name: "Eco-Friendly Wash",
      description: "Environment friendly washing with organic detergents",
      icon: "🌱",
      deliveryTime: "Same day - Next day",
      clothes: [
        { name: "Shirt", price: 30, image: "download.jpg" },
        { name: "T-Shirt", price: 25, image: "t shirt.jpg" },
        { name: "Pants", price: 35, image: "pants.jpg" },
      ],
    },
  ]

  // FIXED: Generate dynamic time slots - Only mark past dates as unavailable
  const generateTimeSlots = (date) => {
    const today = new Date().toISOString().split("T")[0]
    const selectedDateObj = new Date(date)
    const todayObj = new Date(today)
    const isToday = date === today
    const isPastDate = selectedDateObj < todayObj
    const currentHour = new Date().getHours()

    let slots = [
      { id: 1, time: "06:00 - 09:00", available: 3, total: 5 },
      { id: 2, time: "09:00 - 12:00", available: 1, total: 5 },
      { id: 3, time: "12:00 - 15:00", available: 4, total: 4 },
      { id: 4, time: "15:00 - 18:00", available: 2, total: 3 },
      { id: 5, time: "18:00 - 21:00", available: 4, total: 6 },
    ]

    // If it's a past date, mark all slots as unavailable
    if (isPastDate) {
      return slots.map((slot) => ({
        ...slot,
        status: "unavailable",
        reason: "Date has passed",
      }))
    }

    // If it's today, filter out past time slots
    if (isToday) {
      slots = slots.filter((slot) => {
        const slotHour = parseInt(slot.time.split(":")[0])
        return slotHour > currentHour
      })
    }

    // For today and future dates, set status based on availability
    return slots.map((slot) => ({
      ...slot,
      status: slot.available > 0 ? "available" : "full",
    }))
  }

  const [timeSlots, setTimeSlots] = useState(generateTimeSlots(selectedDate))

  // Enhanced Laundrymen Data
  const laundrymenData = [
    {
      id: 1,
      name: "Raj Kumar",
      experience: "5 years",
      location: { lat: 19.076, lng: 72.8777 },
      distance: 0.1,
      workingHours: "06:00 - 21:00",
      services: ["wash_fold", "iron_only", "eco_friendly"],
      image: "laundryman 1.jpg",
      phone: "+91 9876543210",
      specialties: ["Wash & fold", "Iron service", "Eco-friendly detergents"],
    },
    {
      id: 2,
      name: "Amit Singh",
      experience: "3 years",
      location: { lat: 19.0765, lng: 72.878 },
      distance: 0.3,
      workingHours: "07:00 - 19:00",
      services: ["wash_fold", "dry_clean", "stain_removal"],
      image: "laundryman 2.jpg",
      phone: "+91 9876543211",
      specialties: ["Suits & blazers", "Wedding dresses", "Leather cleaning"],
    },
    {
      id: 3,
      name: "Suresh Patel",
      experience: "7 years",
      location: { lat: 19.0755, lng: 72.8785 },
      distance: 0.4,
      workingHours: "05:00 - 20:00",
      services: ["wash_fold", "dry_clean", "iron_only", "stain_removal", "eco_friendly"],
      image: "laundryman 3.jpg",
      phone: "+91 9876543212",
      specialties: ["Eco friendly", "Premium ironing", "Stain removal expert"],
    },
  ]

  // Contact modal states
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactType, setContactType] = useState(null)
  const [contactOrder, setContactOrder] = useState(null)

  // Update time slots when date changes
  useEffect(() => {
    setTimeSlots(generateTimeSlots(selectedDate))
  }, [selectedDate])

  // Mobile menu functions
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  // Payment Functions
  const handleProceedToPay = () => {
    if (!selectedServices.length || !selectedTimeSlot || !selectedLaundryman || selectedClothes.length === 0) {
      alert("Please complete all selections before proceeding to payment")
      return
    }
    setShowPaymentModal(true)
    setPaymentStep("method")
  }

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method)
    if (method === "upi") {
      setPaymentStep("upi")
    } else if (method === "cod") {
      handlePlaceOrder("cod")
    }
  }

  const handleUpiProviderSelect = (provider) => {
    setSelectedUpiProvider(provider)
    setPaymentStep("processing")

    setTimeout(() => {
      setPaymentStep("success")
      setTimeout(() => {
        handlePlaceOrder("upi")
      }, 2000)
    }, 3000)
  }

  const upiProviders = [
    { id: "phonepe", name: "PhonePe", icon: "📱", color: "#5f259f" },
    { id: "googlepay", name: "Google Pay", icon: "🔵", color: "#4285f4" },
    { id: "paytm", name: "Paytm", icon: "💙", color: "#00baf2" },
    { id: "phonepe_upi", name: "PhonePe UPI", icon: "💳", color: "#5f259f" },
    { id: "googlepay_upi", name: "Google Pay UPI", icon: "💳", color: "#4285f4" },
    { id: "paytm_upi", name: "Paytm UPI", icon: "💳", color: "#00baf2" },
  ]

  // Profile Functions
  const handleEditProfile = () => {
    setTempProfile({ ...profile })
    setIsEditingProfile(true)
  }

  const handleChangePhoto = () => {
    setIsChangingPhoto(true)
    fileInputRef.current?.click()
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
        if (isEditingProfile) {
          setTempProfile({ ...tempProfile, image: reader.result })
        } else {
          setProfile({ ...profile, image: reader.result })
          alert("Profile photo updated successfully!")
        }
      }
      reader.readAsDataURL(file)
    }
    setIsChangingPhoto(false)
  }




const handleSaveProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    const updatedProfile = { ...tempProfile };

    // ✅ Sanitize address fields (optional but safe)
    if (updatedProfile.address) {
      updatedProfile.address = {
        street: updatedProfile.address.street || "",
        city: updatedProfile.address.city || "",
        state: updatedProfile.address.state || "",
        zip: updatedProfile.address.zip || "",
      };
    }

    // ✅ Don't send `range` if not washerman
    if (profile.role !== "washerman") {
      delete updatedProfile.range;
    }

    const res = await axios.put(
      `/api/user/${profile._id}`,
      updatedProfile,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setProfile(res.data);
    setIsEditingProfile(false);
    setPreviewImage(null);
    alert("Profile updated successfully!");
  } catch (err) {
    console.error("Update error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to update profile");
  }
};


  const handleCancelEdit = () => {
    setIsEditingProfile(false)
    setTempProfile({})
    setPreviewImage(null)
  }

  const handleChangePassword = () => {
    setIsChangingPassword(true)
  }

  const handleSavePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!")
      return
    }
    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long!")
      return
    }
    alert("Password changed successfully!")
    setIsChangingPassword(false)
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false)
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  // Address Management Functions
  const handleOpenAddressModal = () => {
    setShowAddressModal(true)
  }

  const handleCloseAddressModal = () => {
    setShowAddressModal(false)
  }

  const handleSaveAddress = async (address) => {
    try {
      const success = await saveAddress(address)
      if (success) {
        setCustomerAddress(address)
        setShowAddressModal(false)
      }
    } catch (error) {
      console.error('Error saving address:', error)
    }
  }



  const handleSendAddressToWasherman = async (orderId, washermanId, address, deliveryInstructions) => {
    try {
      const success = await sendAddressToWasherman({
        orderId,
        washermanId,
        address,
        deliveryInstructions
      })
      if (success) {
        console.log('Address sent to washerman successfully')
      }
    } catch (error) {
      console.error('Error sending address to washerman:', error)
    }
  }

  // Notification Functions
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled)
    alert(`Notifications ${!notificationsEnabled ? "enabled" : "disabled"}!`)
  }

  // Rating Functions
  const handleRateOrder = (order) => {
    setRatingOrder(order)
    setRating(order.rating || 0)
    setFeedback("")
    setShowRatingModal(true)
  }

  const handleSubmitRating = () => {
    if (rating === 0) {
      alert("Please select a rating")
      return
    }

    const updatedOrders = orders.map((order) => (order.id === ratingOrder.id ? { ...order, rating, feedback } : order))

    setOrders(updatedOrders)
    setShowRatingModal(false)
    setRatingOrder(null)
    setRating(0)
    setFeedback("")
    alert("Thank you for your feedback!")
  }

  // Reorder Functions
  const handleReorder = (order) => {
    const orderServices = order.services.map((serviceId) => services.find((s) => s.id === serviceId))
    setReorderData({
      ...order,
      services: orderServices,
      laundrymanName: order.laundryman,
      laundrymanObj: laundrymenData.find((l) => l.name === order.laundryman),
    })
    setShowReorderModal(true)
  }

  const confirmReorder = () => {
    if (!reorderData) return

    setSelectedServices(reorderData.services)
    setSelectedLaundryman(reorderData.laundrymanObj)
    setSelectedClothes(reorderData.items)
    setOrderTotal(reorderData.total)
    setPaymentMethod(reorderData.paymentMethod === "Cash on Delivery" ? "cod" : "upi")

    setShowReorderModal(false)
    setActivePage("Book")
    alert("Previous order details loaded! Please select date and time slot.")
  }

  // Time Slot Functions
  const handleShowTimeSlots = () => {
    setShowTimeSlotModal(true)
  }

  const handleSelectTimeSlot = (slot) => {
    if (slot.status === "available") {
      setSelectedTimeSlot(slot)
      setShowTimeSlotModal(false)
      alert(`Time slot ${slot.time} selected!`)
    }
  }

  const handleDateChange = (e) => {
    const newDate = e.target.value
    setSelectedDate(newDate)
    setSelectedTimeSlot(null)
  }

  // Enhanced Service Functions - Modified for multiple selection
  const handleShowServices = () => {
    setServiceModalView("overview")
    setShowServiceModal(true)
  }

  // Fixed: Allow service selection from modal AND redirect to booking
  const handleSelectServiceFromModal = (service) => {
    const isSelected = selectedServices.find((s) => s.id === service.id)

    if (isSelected) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id))
    } else {
      setSelectedServices([...selectedServices, service])
    }

    // Reset clothes selection when services change
    setSelectedClothes([])
    setOrderTotal(0)
  }

  // New function for quick action service selection
  const handleQuickSelectService = (service) => {
    const isSelected = selectedServices.find((s) => s.id === service.id)

    if (isSelected) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id))
    } else {
      setSelectedServices([...selectedServices, service])
    }

    // Reset clothes selection when services change
    setSelectedClothes([])
    setOrderTotal(0)

    // Close modal and redirect to booking page
    setShowServiceModal(false)
    setActivePage("Book")

    alert(
      `${service.name} service ${isSelected ? "removed from" : "added to"} selection! Redirecting to booking page...`,
    )
  }

const handleDetectLocation = () => {
  setIsDetectingLocation(true);
  setLocationNotification("📍 Detecting your location...");

  if (!navigator.geolocation) {
    setLocationNotification("❌ Geolocation is not supported by your browser.");
    setIsDetectingLocation(false);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const apiKey = "fbddd9ac0aff4feb840edc8d63a8f264";
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
        );
        const data = await response.json();
        if (data.status.code !== 200) {
          throw new Error("Reverse geocoding failed");
        }
        const address =
          data.results.length > 0
            ? data.results[0].formatted
            : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        const location = {
          lat: latitude,
          lng: longitude,
          address,
        };
        setCustomerLocation(location);
        setLocationNotification(`✅ Location detected: ${address}`);
        
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const saveResponse = await apiFetch("/api/user/location", {  
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                latitude: latitude,
                longitude: longitude
              }),
            });
            if (saveResponse.ok) {
              console.log("Location saved to database successfully");
              setLocationNotification(`✅ Location saved: ${address}`);
            } else {
              console.error("Failed to save location to database");
              setLocationNotification("⚠️ Location detected but not saved");
            }
          } catch (error) {
            console.error("Error saving location to database:", error);
            setLocationNotification("⚠️ Location detected but not saved");
          }
        }
        
        setLocationNotification("🔍 Finding nearby washermen...");
        await findAvailableLaundrymen(location);
      } catch (error) {
        console.error("Geocoding error:", error);
        setLocationNotification("❌ Failed to get address from coordinates");
      } finally {
        setIsDetectingLocation(false);
      }
    },
    (error) => {
      console.error("Location error:", error.message);
      setLocationNotification("❌ Could not detect location. Please allow location access.");
      const fallback = {
        lat: 19.076,
        lng: 72.8777,
        address: "Bandra West, Mumbai (Fallback)",
      };
      setCustomerLocation(fallback);
      setLocationNotification("📍 Using fallback location: Bandra West, Mumbai");
      findAvailableLaundrymen(fallback);
      setIsDetectingLocation(false);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    }
  );
};



  const findAvailableLaundrymen = async (location) => {
    setIsLaundrymenLoading(true);
    setLaundrymenError(null);
    try {
      const response = await apiFetch(`/api/washer/nearby?lat=${location.lat}&lng=${location.lng}`);   
      if (!response.ok) throw new Error('Failed to fetch laundrymen');
      const data = await response.json();
      const laundrymen = Array.isArray(data) ? data : [];
      setAvailableLaundrymen(laundrymen);
      
      if (laundrymen.length > 0) {
        setLocationNotification(`✅ Found ${laundrymen.length} nearby washermen!`);
      } else {
        setLocationNotification("⚠️ No washermen found in your area");
      }
    } catch (error) {
      setAvailableLaundrymen([]);
      setLaundrymenError('Could not load laundrymen. Please try again.');
      setLocationNotification("❌ Failed to load nearby washermen");
      console.error('Error fetching laundrymen:', error);
    } finally {
      setIsLaundrymenLoading(false);
    }
  };


  // Booking Functions - Modified for multiple services
  const handleServiceSelect = (service) => {
    const isSelected = selectedServices.find((s) => s.id === service.id)

    if (isSelected) {
      // Remove service if already selected
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id))
    } else {
      // Add service if not selected
      setSelectedServices([...selectedServices, service])
    }

    // Reset clothes selection when services change
    setSelectedClothes([])
    setOrderTotal(0)
  }

  // Get all available clothes from selected services - Updated for multiple service selection
  const getAvailableClothes = () => {
    const clothesMap = new Map()

    selectedServices.forEach((service) => {
      service.clothes.forEach((cloth) => {
        if (!clothesMap.has(cloth.name)) {
          clothesMap.set(cloth.name, {
            name: cloth.name,
            image: cloth.image,
            services: [],
          })
        }

        clothesMap.get(cloth.name).services.push({
          id: service.id,
          name: service.name,
          price: cloth.price,
          icon: service.icon,
        })
      })
    })

    return Array.from(clothesMap.values())
  }

  // FIXED: Handle cloth selection with proper number validation
  const handleClothSelect = (cloth, quantity, serviceId) => {
    // Ensure quantity is a valid number and at least 1
    const validQuantity = Math.max(1, Number(quantity) || 1)
    
    const clothKey = `${cloth.name}_${serviceId}`
    const existingIndex = selectedClothes.findIndex((item) => item.key === clothKey)
    const newClothes = [...selectedClothes]

    if (existingIndex >= 0) {
      if (validQuantity === 0) {
        newClothes.splice(existingIndex, 1)
      } else {
        newClothes[existingIndex] = {
          ...newClothes[existingIndex],
          quantity: validQuantity,
        }
      }
    } else if (validQuantity > 0) {
      const service = services.find((s) => s.id === serviceId)
      const serviceCloth = service.clothes.find((c) => c.name === cloth.name)
      newClothes.push({
        ...serviceCloth,
        quantity: validQuantity,
        serviceId,
        key: clothKey,
        serviceName: service.name,
      })
    }

    setSelectedClothes(newClothes)
    calculateTotal(newClothes)
  }

  // New handler for adding cloth service via dropdown
  const handleAddClothService = (cloth, serviceId, price) => {
    const clothKey = `${cloth.name}_${serviceId}`
    const existingIndex = selectedClothes.findIndex((item) => item.key === clothKey)

    if (existingIndex >= 0) {
      // If already exists, just increase quantity
      const newClothes = [...selectedClothes]
      newClothes[existingIndex] = {
        ...newClothes[existingIndex],
        quantity: Number(newClothes[existingIndex].quantity) + 1,
      }
      setSelectedClothes(newClothes)
      calculateTotal(newClothes)
    } else {
      // Add new service for this cloth
      const service = services.find((s) => s.id === serviceId)
      const newItem = {
        name: cloth.name,
        price: Number(price),
        quantity: 1,
        serviceId: serviceId,
        key: clothKey,
        serviceName: service.name,
        image: cloth.image,
      }
      const newClothes = [...selectedClothes, newItem]
      setSelectedClothes(newClothes)
      calculateTotal(newClothes)
    }
  }

  // New handler for removing cloth service
  const handleRemoveClothService = (clothName, serviceId) => {
    const clothKey = `${clothName}_${serviceId}`
    const newClothes = selectedClothes.filter((item) => item.key !== clothKey)
    setSelectedClothes(newClothes)
    calculateTotal(newClothes)
  }

  // FIXED: Calculate total with proper number conversion
  const calculateTotal = (clothes) => {
    const total = clothes.reduce((sum, item) => {
      const price = Number(item.price) || 0
      const quantity = Number(item.quantity) || 0
      return sum + (price * quantity)
    }, 0)
    setOrderTotal(total)
  }

  const handleTimeSlotSelect = (slot) => {
    if (slot.status === "available") {
      setSelectedTimeSlot(slot)
    }
  }

  const handleLaundrymanSelect = (laundryman) => {
    setSelectedLaundryman(laundryman)
  }

  // Updated: Orders now start with "Confirmed" status
  const handlePlaceOrder = (finalPaymentMethod = null) => {
    const newOrder = {
      id: `ORD${String(orders.length + 1).padStart(3, "0")}`,
      date: selectedDate,
      time: selectedTimeSlot.time,
      laundryman: selectedLaundryman.name,
      status: "Confirmed", // Changed from "Pending" to "Confirmed"
      items: selectedClothes,
      total: orderTotal,
      paymentMethod: finalPaymentMethod === "cod" ? "Cash on Delivery" : "UPI",
      address: customerLocation?.address || profile.address,
      services: selectedServices.map((s) => s.id),
      rating: null,
    }

    setOrders([newOrder, ...orders])
    setShowOrderConfirmation(true)
    setShowPaymentModal(false)

    // Reset booking state
    setSelectedServices([])
    setSelectedTimeSlot(null)
    setSelectedLaundryman(null)
    setSelectedClothes([])
    setOrderTotal(0)
    setSelectedPaymentMethod("")
    setSelectedUpiProvider("")
    setPaymentStep("method")
    setActivePage("Orders")
  }

  const handleLogout = () => {
    setShowLogoutPopup(true)
  }


  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f39c12"
      case "Confirmed":
        return "#3498db"
      case "In Progress":
        return "#9b59b6"
      case "Ready for Pickup":
        return "#e67e22"
      case "Delivered":
        return "#27ae60"
      default:
        return "#95a5a6"
    }
  }

  const [trackingOrder, setTrackingOrder] = useState(null)
  const [showTrackingModal, setShowTrackingModal] = useState(false)

  const handleTrackOrder = (order) => {
    setTrackingOrder(order)
    setShowTrackingModal(true)
  }

  // Updated: Delivery time now shows only today/tomorrow
  const getDeliveryTimeSlot = (orderDate) => {
    const today = new Date().toISOString().split("T")[0]
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split("T")[0]

    if (orderDate === today) return "Today"
    if (orderDate === tomorrowStr) return "Tomorrow"
    return "Tomorrow" // Default to tomorrow for any future date
  }

  const getOrderProgress = (status) => {
    const statusMap = {
      Pending: 20,
      Confirmed: 40,
      "In Progress": 60,
      "Ready for Pickup": 80,
      Delivered: 100,
    }
    return statusMap[status] || 0
  }

  const getMinDate = () => {
    return new Date().toISOString().split("T")[0]
  }

  // FIXED: Allow booking for future dates - extend max date to 30 days from today
  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30) // Allow booking up to 30 days in advance
    return maxDate.toISOString().split("T")[0]
  }

  const handleDemoBooking = () => {
    const demoLocation = {
      lat: 19.076,
      lng: 72.8777,
      address: "Demo Location - Bandra West, Mumbai, Maharashtra",
    }

    setCustomerLocation(demoLocation)
    findAvailableLaundrymen(demoLocation)

    const rajKumar = laundrymenData.find((l) => l.id === 1)
    setSelectedLaundryman(rajKumar)

    const washFoldService = services.find((s) => s.id === "wash_fold")
    const ironService = services.find((s) => s.id === "iron_only")
    setSelectedServices([washFoldService, ironService])

    const demoClothes = [
      {
        name: "Shirt",
        price: 25,
        quantity: 3,
        serviceId: "wash_fold",
        key: "Shirt_wash_fold",
        serviceName: "Wash & Fold",
      },
      {
        name: "Pants",
        price: 30,
        quantity: 2,
        serviceId: "wash_fold",
        key: "Pants_wash_fold",
        serviceName: "Wash & Fold",
      },
    ]
    setSelectedClothes(demoClothes)
    calculateTotal(demoClothes)

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setSelectedDate(tomorrow.toISOString().split("T")[0])

    setActivePage("Book")
    alert("Demo booking setup complete! You can now select time slot and payment method.")
  }

  // Contact Functions
  const handleContactLaundryman = (order) => {
    setContactOrder(order)
    setContactType("laundryman")
    setShowContactModal(true)
  }

  const handleCustomerSupport = (order = null) => {
    setContactOrder(order)
    setContactType("support")
    setShowContactModal(true)
  }

  // Login Functions
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const handleLogin = (e) => {
    e.preventDefault()
    if (loginData.email && loginData.password) {
      setActivePage("Home")
      alert("Login successful!")
    } else {
      alert("Please enter both email and password")
    }
  }

  const navigate = useNavigate();

const confirmLogout = async () => {
  try {
    await apiFetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    localStorage.removeItem('token');
    localStorage.removeItem('role');

    navigate('/mainapp'); // 👈 Redirect to mainapp after logout
  } catch (error) {
    console.error('Logout failed:', error);
    navigate('/mainapp'); // still redirect even if logout fails
  }
};

const cancelLogout = () => {
  setShowLogoutPopup(false);
};



  return (
    <div className="dashboard-container">
      {/* Hidden file input for photo upload */}
      <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} style={{ display: "none" }} />

      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
      </button>

      {/* Mobile Menu Overlay */}
      {isSidebarOpen && <div className="mobile-menu-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-profile" onClick={() => { setActivePage("Profile"); closeSidebar(); }}>
          <img src={"/profile.webp"} alt="Customer" className="sidebar-profile-img" />
          <span className="sidebar-profile-name">{profile.name}</span>
        </div>
        <nav>
          <button className={activePage === "Home" ? "active" : ""} onClick={() => { setActivePage("Home"); closeSidebar(); }}>
            🏠 Home
          </button>
          <button className="" onClick={() => { navigate("/mainapp"); closeSidebar(); }}>
            📅 Book Service
          </button>
          <button
  className={activePage === "Orders" ? "active" : ""}
  onClick={() => {
    setActivePage("Orders");   // Only the name, not the route path
    closeSidebar();            // Close sidebar if needed
    navigate("/orders");    // Actual route navigation
  }}
>
  📦 My Orders
</button>
          <button className={activePage === "Profile" ? "active" : ""} onClick={() => { setActivePage("Profile"); closeSidebar(); }}>
            👤 Profile
          </button>
          <button className="logout-btn" onClick={() => { handleLogout(); closeSidebar(); }}>
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activePage === "Home" && (
          <div className="home-page">
                 {/* Location Status Notification */}
            {locationNotification && (
              <section className="location-notification" style={{
                marginBottom: '16px',
                padding: '12px 16px',
                borderRadius: '8px',
                background: locationNotification.includes('✅') ? '#dcfce7' : 
                           locationNotification.includes('❌') ? '#fee2e2' : 
                           locationNotification.includes('⚠️') ? '#fef3c7' : '#dbeafe',
                border: locationNotification.includes('✅') ? '1px solid #22c55e' : 
                        locationNotification.includes('❌') ? '1px solid #ef4444' : 
                        locationNotification.includes('⚠️') ? '1px solid #f59e0b' : '1px solid #3b82f6',
                color: locationNotification.includes('✅') ? '#166534' : 
                       locationNotification.includes('❌') ? '#991b1b' : 
                       locationNotification.includes('⚠️') ? '#92400e' : '#1e40af',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {locationNotification}
              </section>
            )}

          
            {/* Welcome Section */}
             <section className="welcome-section">
              <div className="welcome-content">
                <h1>
                  {getGreeting()}, {profile.name}! 👋
                </h1>
                <p>Your trusted laundry service is just a click away</p>
              </div>
              <div className="date-time">
                <div className="current-date">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="current-time">
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </section> 

            {/* Quick Stats */}
            {/* <section className="dashboard-stats">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-content">
                    <h3>Total Orders</h3>
                    <p className="stat-number">{orders.length}</p>
                    <span className="stat-label">All time</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-content">
                    <h3>Active Orders</h3>
                    <p className="stat-number">{orders.filter((o) => o.status !== "Delivered").length}</p>
                    <span className="stat-label">In progress</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">₹</div>
                  <div className="stat-content">
                    <h3>Total Spent</h3>
                    <p className="stat-number">₹{orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0)}</p>
                    <span className="stat-label">This month</span>
                  </div>
                </div>
              </div>
            </section> */}


            <section className="dashboard-stats">
  <div className="stats-grid">
    {/* Total Orders */}
    <div className="stat-card">
      <div className="stat-icon">📦</div>
      <div className="stat-content">
        <h3>Total Orders</h3>
        <p className="stat-number">{orders.length}</p>
        <span className="stat-label">All time</span>
      </div>
    </div>

    {/* Active Orders */}
    <div className="stat-card">
      <div className="stat-icon">⏳</div>
      <div className="stat-content">
        <h3>Active Orders</h3>
        <p className="stat-number">
          {
            orders.filter(
              (o) =>
                o.status &&
                o.status.toLowerCase() !== "delivered" &&
                o.status.toLowerCase() !== "cancelled"
            ).length
          }
        </p>
        <span className="stat-label">In progress</span>
      </div>
    </div>

    {/* Total Spent (This Month) */}
    <div className="stat-card">
      <div className="stat-icon">₹</div>
      <div className="stat-content">
        <h3>Total Spent</h3>
        <p className="stat-number">
          ₹
          {
            orders
              .filter((order) => {
                const date = new Date(order.createdAt);
                const now = new Date();
                return (
                  date.getMonth() === now.getMonth() &&
                  date.getFullYear() === now.getFullYear()
                );
              })
              .reduce((sum, order) => sum + (Number(order.total) || 0), 0)
          }
        </p>
        <span className="stat-label">This month</span>
      </div>
    </div>
  </div>
</section>


            {/* Quick Actions */}
            <section className="quick-actions-section">
              <h3>Quick Actions</h3>
              <div className="quick-actions-grid">
                <button className="quick-action-btn" onClick={() => navigate("/mainapp")}>
                  <div className="action-icon">📅</div>
                  <span>Book New Service</span>
                </button>

                {/* <button className="quick-action-btn" onClick={() => setActivePage("Orders")}>
                  <div className="action-icon">📦</div>
                  <span>Track Orders</span>
                </button> */}
{/* 
                <button className="quick-action-btn demo-btn" onClick={handleDemoBooking}>
                  <div className="action-icon">🚀</div>
                  <span>Demo Booking</span>
                </button> */}
              </div>
            </section>
          </div>
        )}


                
{/* 
  {activePage === "Book" && (
  <div className="book-page">
    <div className="book-header">
      <h2>Book Laundry Service</h2>
      <p>Follow the steps below to book your laundry service</p>
    </div>

    <div className="booking-steps">
      {/* Step 1: Location */}
{/*       <div className="booking-step">
        <div className="step-header">
          <span className="step-number">1</span>
          <h3>Set Your Location</h3>
        </div>

        <div className="location-section">
          <div className="location-controls">
            <button
              className="detect-location-btn"
              onClick={handleDetectLocation}
              disabled={isDetectingLocation}
            >
              {isDetectingLocation ? "Detecting..." : "📍 Use Current Location"}
            </button>
          </div>

          {customerLocation && (
            <div className="location-info">
              <p>
                <strong>📍 Your Location:</strong> {customerLocation.address}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* You can continue with Step 2 here */}
{/*     </div>
  </div>
)}
  */}

         {/* {activePage === "Orders" && (
          <div className="orders-page">
            <div className="orders-header">
              <h2>My Orders</h2>
              <p>Track and manage your laundry orders</p>
            </div>

            <div className="orders-list">
              {orders.length === 0 ? (
                <div className="no-orders">
                  <div className="no-orders-icon">📦</div>
                  <h3>No orders yet</h3>
                  <p>Book your first laundry service to get started</p>
                  <button className="book-now-btn" onClick={() => setActivePage("Book")}>
                    Book Now
                  </button>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-id">
                        <h3>Order #{order.id}</h3>
                        <span className="order-date">
                          {order.date} • {order.time}
                        </span>
                      </div>
                      <span className="status-badge" style={{ backgroundColor: getOrderStatusColor(order.status) }}>
                        {order.status}
                      </span>
                    </div>

                    <div className="order-details">
                      <div className="order-info">
                        <p>
                          <strong>👤 Laundryman:</strong> {order.laundryman}
                        </p>
                        <p>
                          <strong>📍 Address:</strong> {order.address}
                        </p>
                        <p>
                          <strong>💳 Payment:</strong> {order.paymentMethod}
                        </p>
                        <p>
                          <strong>🧺 Services:</strong>{" "}
                          {order.services
                            .map((serviceId) => services.find((s) => s.id === serviceId)?.name)
                            .join(", ") || "N/A"}
                        </p>
                      </div>

                      <div className="order-items">
                        <h4>Items:</h4>
                        <div className="items-list">
                          {order.items.map((item, index) => (
                            <div key={index} className="item">
                              <span>
                                {item.name} x {item.quantity} {item.serviceName && `(${item.serviceName})`}
                              </span>
                              <span>₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className="order-total">
                          <strong>Total: ₹{order.total}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="order-actions">
                      {order.status === "Delivered" && (
                        <button className="rate-btn" onClick={() => handleRateOrder(order)}>
                          ⭐ {order.rating ? "Update Rating" : "Rate Service"}
                        </button>
                      )}
                      {order.status !== "Delivered" && (
                        <button className="track-btn" onClick={() => handleTrackOrder(order)}>
                          📍 Track Order
                        </button>
                      )}
                      <button className="reorder-btn" onClick={() => handleReorder(order)}>
                        🔄 Reorder
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}  */}


{/* 

       {activePage === "Orders" && (
  <div className="orders-page">
    <div className="orders-header">
      <h2>My Orders</h2>
      <p>Track and manage your laundry orders</p>
    </div>

    <div className="orders-list">
      {(orders || []).length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Book your first laundry service to get started</p>
          <button className="book-now-btn" onClick={() => navigate("/mainapp")}>
            Book Now
          </button>
        </div>
      ) : (
        (orders || []).map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-id">
                <h3>Order #{order.id}</h3>
                <span className="order-date">
                  {order.date} • {order.time}
                </span>
              </div>
              <span className="status-badge" style={{ backgroundColor: getOrderStatusColor(order.status) }}>
                {order.status}
              </span>
            </div>

            <div className="order-details">
              <div className="order-info">
                <p>
                  <strong>👤 Laundryman:</strong> {order.laundryman}
                </p>
                <p>
                  <strong>📍 Address:</strong> {order.address}
                </p>
                <p>
                  <strong>💳 Payment:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>🧺 Services:</strong>{" "}
                  {(order.services || [])
                    .map((serviceId) => services.find((s) => s.id === serviceId)?.name)
                    .join(", ") || "N/A"}
                </p>
              </div>

              <div className="order-items">
                <h4>Items:</h4>
                <div className="items-list">
                  {(order.items || []).map((item, index) => (
                    <div
                      key={`${item.name}-${item.serviceName || "none"}-${index}`}
                      className="item"
                    >
                      <span>
                        {item.name} x {item.quantity}{" "}
                        {item.serviceName && `(${item.serviceName})`}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="order-total">
                  <strong>Total: ₹{order.total}</strong>
                </div>
              </div>
            </div>

            <div className="order-actions">
              {order.status === "Delivered" && (
                <button className="rate-btn" onClick={() => handleRateOrder(order)}>
                  ⭐ {order.rating ? "Update Rating" : "Rate Service"}
                </button>
              )}
              {order.status !== "Delivered" && (
                <button className="track-btn" onClick={() => handleTrackOrder(order)}>
                  📍 Track Order
                </button>
              )}
              <button className="reorder-btn" onClick={() => handleReorder(order)}>
                🔄 Reorder
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
)} */}





    {activePage === "Profile" && (
  <div className="profile-page">
    <div className="profile-header">
      <h2>My Profile</h2>
      <p>Manage your account information</p>
    </div>

    <div className="profile-content">
      <div className="profile-card">
        {!isEditingProfile ? (
          <>
            <div className="profile-image-section">
              <img src={"/profile.webp"} alt="Profile" className="profile-image" />
            </div>

            <div className="profile-info">
              <div className="info-group">
                <label>Full Name</label>
                <p>{profile.name}</p>
              </div>

              <div className="info-group">
                <label>Email Address</label>
                <p>{profile.email}</p>
              </div>

              <div className="info-group">
                <label>Phone Number</label>
                <p>{profile.contact}</p>
              </div>

              {/* <div className="info-group">
                <label>Address</label>
                <p>
                  {profile.address?.street}, {profile.address?.city}, {profile.address?.state} - {profile.address?.zip}
                </p>
              </div> */}
              <div className="info-group">
  <label>Address</label>
  <p>
    {profile.address?.street || profile.address?.city || profile.address?.state || profile.address?.zip
      ? `${profile.address?.street || ""}${profile.address?.city ? ", " + profile.address.city : ""}${profile.address?.state ? ", " + profile.address.state : ""}${profile.address?.zip ? " - " + profile.address.zip : ""}`
      : "Not Provided"}
  </p>
</div>

              {/* Enhanced Address Management */}
              <div className="info-group">
                <label>Delivery Address</label>
                <div className="address-display">
                  {savedAddress ? (
                    <div className="saved-address">
                      <p className="address-text">
                        {savedAddress.houseNo}, {savedAddress.street}
                        {savedAddress.landmark && `, ${savedAddress.landmark}`}
                        <br />
                        {savedAddress.city}, {savedAddress.state} - {savedAddress.pincode}
                      </p>
                      <button 
                        className="manage-address-btn" 
                        onClick={handleOpenAddressModal}
                      >
                        📝 Edit Address
                      </button>
                    </div>
                  ) : (
                    <div className="no-address">
                      <p>No delivery address saved</p>
                      <button 
                        className="add-address-btn" 
                        onClick={handleOpenAddressModal}
                      >
                        📍 Add Delivery Address
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="profile-actions">
                <button className="edit-profile-btn" onClick={handleEditProfile}>
                  ✏️ Edit Profile
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="edit-profile-form">
            <div className="profile-image-section">
              <img
                src={"/profile.webp"} // Use the uploaded image if available
                alt="Profile Preview"
                className="profile-image"
              />
              <button type="button" className="change-image-btn" onClick={() => fileInputRef.current?.click()}>
                📷 Change Photo
              </button>
            </div>

            <div className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={tempProfile.name || ""}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={tempProfile.email || ""}
                  onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact">Phone Number</label>
                <input
                  type="tel"
                  id="contact"
                  value={tempProfile.contact || ""}
                  onChange={(e) => setTempProfile({ ...tempProfile, contact: e.target.value })}
                  required
                />
              </div>

              {/* ✅ Split address into separate fields */}
              <div className="form-group">
                <label htmlFor="street">Street</label>
                <input
                  type="text"
                  id="street"
                  value={tempProfile.address?.street || ""}
                  onChange={(e) =>
                    setTempProfile({
                      ...tempProfile,
                      address: {
                        ...tempProfile.address,
                        street: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  value={tempProfile.address?.city || ""}
                  onChange={(e) =>
                    setTempProfile({
                      ...tempProfile,
                      address: {
                        ...tempProfile.address,
                        city: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  value={tempProfile.address?.state || ""}
                  onChange={(e) =>
                    setTempProfile({
                      ...tempProfile,
                      address: {
                        ...tempProfile.address,
                        state: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="zip">ZIP Code</label>
                <input
                  type="text"
                  id="zip"
                  value={tempProfile.address?.zip || ""}
                  onChange={(e) =>
                    setTempProfile({
                      ...tempProfile,
                      address: {
                        ...tempProfile.address,
                        zip: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="profile-actions">
                <button type="button" className="save-profile-btn" onClick={handleSaveProfile}>
                  💾 Save Changes
                </button>
                <button type="button" className="cancel-edit-btn" onClick={handleCancelEdit}>
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}

      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="popup-overlay">
          <div className="popup-content payment-modal">
            <div className="payment-header">
              <h3>
                {paymentStep === "method" && "Choose Payment Method"}
                {paymentStep === "upi" && "Select UPI Provider"}
                {paymentStep === "processing" && "Processing Payment"}
                {paymentStep === "success" && "Payment Successful"}
              </h3>
              {paymentStep !== "processing" && paymentStep !== "success" && (
                <button className="close-btn" onClick={() => setShowPaymentModal(false)}>
                  ✕
                </button>
              )}
            </div>

            <div className="payment-content">
              {paymentStep === "method" && (
                <div className="payment-methods">
                  <div className="order-summary-payment">
                    <h4>Order Summary</h4>
                    <div className="summary-details">
                      <div className="detail-row">
                        <span>Services:</span>
                        <span>{selectedServices.map((s) => s.name).join(", ")}</span>
                      </div>
                      <div className="detail-row">
                        <span>Laundryman:</span>
                        <span>{selectedLaundryman?.name}</span>
                      </div>
                      <div className="detail-row">
                        <span>Date & Time:</span>
                        <span>
                          {selectedDate} • {selectedTimeSlot?.time}
                        </span>
                      </div>
                      <div className="detail-row total-row">
                        <span>Total Amount:</span>
                        <span>₹{orderTotal}</span>
                      </div>
                    </div>
                  </div>

                  <div className="payment-options">
                    <div
                      className={`payment-option ${selectedPaymentMethod === "upi" ? "selected" : ""}`}
                      onClick={() => handlePaymentMethodSelect("upi")}
                    >
                      <div className="payment-icon">📱</div>
                      <div className="payment-info">
                        <h4>UPI Payment</h4>
                        <p>Pay instantly using UPI apps</p>
                      </div>
                      <div className="payment-arrow">→</div>
                    </div>

                    <div
                      className={`payment-option ${selectedPaymentMethod === "cod" ? "selected" : ""}`}
                      onClick={() => handlePaymentMethodSelect("cod")}
                    >
                      <div className="payment-icon">💵</div>
                      <div className="payment-info">
                        <h4>Cash on Delivery</h4>
                        <p>Pay when your order is delivered</p>
                      </div>
                      <div className="payment-arrow">→</div>
                    </div>
                  </div>
                </div>
              )}

              {paymentStep === "upi" && (
                <div className="upi-providers">
                  <div className="upi-amount">
                    <h4>Amount to Pay: ₹{orderTotal}</h4>
                  </div>

                  <div className="upi-options">
                    <h4>Choose your preferred UPI app:</h4>
                    <div className="upi-grid">
                      {upiProviders.map((provider) => (
                        <div
                          key={provider.id}
                          className="upi-option"
                          onClick={() => handleUpiProviderSelect(provider)}
                          style={{ borderColor: provider.color }}
                        >
                          <div className="upi-icon" style={{ color: provider.color }}>
                            {provider.icon}
                          </div>
                          <div className="upi-name">{provider.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="upi-back">
                    <button className="back-btn" onClick={() => setPaymentStep("method")}>
                      ← Back to Payment Methods
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === "processing" && (
                <div className="payment-processing">
                  <div className="processing-animation">
                    <div className="spinner"></div>
                  </div>
                  <h4>Processing Payment...</h4>
                  <p>Please wait while we process your payment through {selectedUpiProvider}</p>
                  <div className="processing-details">
                    <div className="detail-row">
                      <span>Amount:</span>
                      <span>₹{orderTotal}</span>
                    </div>
                    <div className="detail-row">
                      <span>Payment Method:</span>
                      <span>{upiProviders.find((p) => p.id === selectedUpiProvider)?.name}</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentStep === "success" && (
                <div className="payment-success">
                  <div className="success-animation">
                    <div className="success-icon">✅</div>
                  </div>
                  <h4>Payment Successful!</h4>
                  <p>Your order has been placed successfully</p>
                  <div className="success-details">
                    <div className="detail-row">
                      <span>Amount Paid:</span>
                      <span>₹{orderTotal}</span>
                    </div>
                    <div className="detail-row">
                      <span>Payment Method:</span>
                      <span>{upiProviders.find((p) => p.id === selectedUpiProvider)?.name}</span>
                    </div>
                    <div className="detail-row">
                      <span>Transaction ID:</span>
                      <span>TXN{Date.now()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


    
      {/* Password Change Modal */}
      {isChangingPassword && (
        <div className="popup-overlay">
          <div className="popup-content password-modal">
            <div className="password-header">
              <h3>Change Password</h3>
              <button className="close-btn" onClick={handleCancelPasswordChange}>
                ✕
              </button>
            </div>

            <div className="password-content">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <div className="password-actions">
                <button className="save-password-btn" onClick={handleSavePassword}>
                  💾 Save Password
                </button>
                <button className="cancel-password-btn" onClick={handleCancelPasswordChange}>
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && ratingOrder && (
        <div className="popup-overlay">
          <div className="popup-content rating-modal">
            <div className="rating-header">
              <h3>Rate Your Experience</h3>
              <button className="close-btn" onClick={() => setShowRatingModal(false)}>
                ✕
              </button>
            </div>

            <div className="rating-content">
              <div className="order-info">
                <p>
                  <strong>Order:</strong> #{ratingOrder.id}
                </p>
                <p>
                  <strong>Laundryman:</strong> {ratingOrder.laundryman}
                </p>
                <p>
                  <strong>Services:</strong>{" "}
                  {ratingOrder.services.map((serviceId) => services.find((s) => s.id === serviceId)?.name).join(", ")}
                </p>
              </div>

              <div className="star-rating">
                <p>How was your experience?</p>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={`star ${star <= rating ? "active" : ""}`}
                      onClick={() => setRating(star)}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <p className="rating-text">
                  {rating === 0 && "Select a rating"}
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              </div>

              <div className="feedback-section">
                <label htmlFor="feedback">Additional Feedback (Optional)</label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us about your experience..."
                  rows={4}
                />
              </div>

              <div className="rating-actions">
                <button className="submit-rating-btn" onClick={handleSubmitRating}>
                  Submit Rating
                </button>
                <button className="cancel-rating-btn" onClick={() => setShowRatingModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reorder Modal */}
      {showReorderModal && reorderData && (
        <div className="popup-overlay">
          <div className="popup-content reorder-modal">
            <div className="reorder-header">
              <h3>Reorder Confirmation</h3>
              <button className="close-btn" onClick={() => setShowReorderModal(false)}>
                ✕
              </button>
            </div>

            <div className="reorder-content">
              <div className="reorder-details">
                <h4>Previous Order Details</h4>
                <div className="detail-item">
                  <span>Order ID:</span>
                  <span>#{reorderData.id}</span>
                </div>
                <div className="detail-item">
                  <span>Services:</span>
                  <span>{reorderData.services?.map((s) => s.name).join(", ")}</span>
                </div>
                <div className="detail-item">
                  <span>Laundryman:</span>
                  <span>{reorderData.laundrymanName}</span>
                </div>
                <div className="detail-item">
                  <span>Total Amount:</span>
                  <span>₹{reorderData.total}</span>
                </div>
              </div>

              <div className="reorder-items">
                <h4>Items to Reorder</h4>
                <div className="items-list">
                  {reorderData.items.map((item, index) => (
                    <div key={index} className="item">
                      <span>
                        {item.name} x {item.quantity} {item.serviceName && `(${item.serviceName})`}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="reorder-note">
                <p>📝 Note: You'll be able to modify the order details (date, time, etc.) on the booking page.</p>
              </div>

              <div className="reorder-actions">
                <button className="confirm-reorder-btn" onClick={confirmReorder}>
                  ✅ Proceed to Book
                </button>
                <button className="cancel-reorder-btn" onClick={() => setShowReorderModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Slot Modal */}
      {showTimeSlotModal && (
        <div className="popup-overlay">
          <div className="popup-content time-slot-modal">
            <div className="time-slot-header">
              <h3>Available Time Slots</h3>
              <button className="close-btn" onClick={() => setShowTimeSlotModal(false)}>
                ✕
              </button>
            </div>

            <div className="time-slot-content">
              <div className="date-selection">
                <label htmlFor="slotDate">Select Date:</label>
                <input
                  type="date"
                  id="slotDate"
                  value={selectedDate}
                  onChange={handleDateChange}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="date-input"
                />
              </div>

              <div className="time-slots-grid">
                {timeSlots.length === 0 ? (
                  <div className="no-slots">
                    <p>No time slots available for selected date</p>
                    <span>All slots have passed for today</span>
                  </div>
                ) : (
                  timeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`time-slot ${slot.status} ${selectedTimeSlot?.id === slot.id ? "selected" : ""}`}
                      onClick={() => handleSelectTimeSlot(slot)}
                    >
                      <div className="slot-time">{slot.time}</div>
                      <div className="slot-availability">
                        {slot.status === "available" ? (
                          <>
                            <span className="available-icon">✅</span>
                            <span>
                              {slot.available}/{slot.total} available
                            </span>
                          </>
                        ) : slot.status === "full" ? (
                          <>
                            <span className="full-icon">❌</span>
                            <span>Slot Full</span>
                          </>
                        ) : (
                          <>
                            <span className="unavailable-icon">🚫</span>
                            <span>Unavailable</span>
                            {slot.reason && (
                              <div className="unavailable-reason">{slot.reason}</div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation Popup */}
      {showOrderConfirmation && (
        <div className="popup-overlay">
          <div className="popup-content order-confirmation-popup">
            <div className="success-icon">✅</div>
            <h3>Thank You!</h3>
            <p>Your order has been confirmed successfully</p>
            <div className="order-details-popup">
              <p>
                <strong>Order ID:</strong> {orders[0]?.id}
              </p>
              <p>
                <strong>Expected Delivery:</strong> {getDeliveryTimeSlot(selectedDate)}
              </p>
            </div>
            <button className="close-popup-btn" onClick={() => setShowOrderConfirmation(false)}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="popup-overlay">
          <div className="popup-content logout-popup">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="popup-buttons">
              <button className="confirm-btn" onClick={confirmLogout}>
                Yes, Logout
              </button>
              <button className="cancel-btn" onClick={cancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Tracking Modal */}
      {showTrackingModal && trackingOrder && (
        <div className="popup-overlay">
          <div className="popup-content tracking-modal">
            <div className="tracking-header">
              <h3>Track Order #{trackingOrder.id}</h3>
              <button className="close-btn" onClick={() => setShowTrackingModal(false)}>
                ✕
              </button>
            </div>

            <div className="tracking-content">
              <div className="order-summary">
                <div className="summary-item">
                  <span>Laundryman:</span>
                  <span>{trackingOrder.laundryman}</span>
                </div>
                <div className="summary-item">
                  <span>Services:</span>
                  <span>
                    {trackingOrder.services
                      .map((serviceId) => services.find((s) => s.id === serviceId)?.name)
                      .join(", ")}
                  </span>
                </div>
                <div className="summary-item">
                  <span>Expected Delivery:</span>
                  <span className="delivery-time">{getDeliveryTimeSlot(trackingOrder.date)}</span>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${getOrderProgress(trackingOrder.status)}%` }}></div>
                </div>
                <div className="progress-percentage">{getOrderProgress(trackingOrder.status)}% Complete</div>
              </div>

              <div className="status-timeline">
                <div
                  className={`timeline-item ${["Confirmed", "In Progress", "Ready for Pickup", "Delivered"].includes(trackingOrder.status) ? "completed" : ""}`}
                >
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h4>Order Confirmed</h4>
                    <p>Your order has been confirmed</p>
                    <span className="timeline-time">
                      {trackingOrder.status === "Confirmed" ? "Current" : "Completed"}
                    </span>
                  </div>
                </div>

                <div
                  className={`timeline-item ${["In Progress", "Ready for Pickup", "Delivered"].includes(trackingOrder.status) ? "completed" : ""}`}
                >
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h4>Clothes Picked Up</h4>
                    <p>Your clothes are being processed</p>
                    <span className="timeline-time">
                      {trackingOrder.status === "In Progress"
                        ? "Current"
                        : ["Ready for Pickup", "Delivered"].includes(trackingOrder.status)
                          ? "Completed"
                          : "Pending"}
                    </span>
                  </div>
                </div>

                <div
                  className={`timeline-item ${["Ready for Pickup", "Delivered"].includes(trackingOrder.status) ? "completed" : ""}`}
                >
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h4>Ready for Delivery</h4>
                    <p>Your clothes are clean and ready</p>
                    <span className="timeline-time">
                      {trackingOrder.status === "Ready for Pickup"
                        ? "Current"
                        : trackingOrder.status === "Delivered"
                          ? "Completed"
                          : "Pending"}
                    </span>
                  </div>
                </div>

                <div className={`timeline-item ${trackingOrder.status === "Delivered" ? "completed" : ""}`}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h4>Delivered</h4>
                    <p>Order completed successfully</p>
                    <span className="timeline-time">
                      {trackingOrder.status === "Delivered" ? "Completed" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="contact-section">
                <button className="contact-btn" onClick={() => handleContactLaundryman(trackingOrder)}>
                  📞 Contact Laundryman
                </button>
                <button className="support-btn" onClick={() => handleCustomerSupport(trackingOrder)}>
                  💬 Customer Support
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="popup-overlay">
          <div className="popup-content contact-modal">
            <div className="contact-header">
              <h3>{contactType === "laundryman" ? "📞 Contact Laundryman" : "💬 Customer Support"}</h3>
              <button className="close-btn" onClick={() => setShowContactModal(false)}>
                ✕
              </button>
            </div>

            <div className="contact-content">
              {contactOrder && (
                <div className="contact-order-info">
                  <h4>Order Details</h4>
                  <div className="order-info-grid">
                    <div className="info-item">
                      <span>Order ID:</span>
                      <span>#{contactOrder.id}</span>
                    </div>
                    <div className="info-item">
                      <span>Status:</span>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getOrderStatusColor(contactOrder.status) }}
                      >
                        {contactOrder.status}
                      </span>
                    </div>
                    <div className="info-item">
                      <span>Date:</span>
                      <span>{contactOrder.date}</span>
                    </div>
                    {contactType === "laundryman" && (
                      <div className="info-item">
                        <span>Laundryman:</span>
                        <span>{contactOrder.laundryman}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {contactType === "laundryman" ? (
                <div className="laundryman-contact-options">
                  <h4>Contact Options</h4>
                  <div className="contact-options-grid">
                    <button className="contact-option-btn call-btn">
                      <div className="contact-icon">📞</div>
                      <div className="contact-info">
                        <h5>Call Now</h5>
                        <p>Direct phone call</p>
                      </div>
                    </button>

                    <button className="contact-option-btn whatsapp-btn">
                      <div className="contact-icon">💬</div>
                      <div className="contact-info">
                        <h5>WhatsApp</h5>
                        <p>Send message</p>
                      </div>
                    </button>
                  </div>

                  {contactOrder && (
                    <div className="laundryman-details">
                      <h4>Laundryman Information</h4>
                      {(() => {
                        const laundryman = laundrymenData.find((l) => l.name === contactOrder.laundryman)
                        return laundryman ? (
                          <div className="laundryman-contact-card">
                            <img
                              src={laundryman.image || "/profile.webp"}
                              alt={laundryman.name}
                              className="laundryman-contact-image"
                            />
                            <div className="laundryman-contact-info">
                              <h5>{laundryman.name}</h5>
                              <p>{laundryman.experience}</p>
                              <p>📞 {laundryman.phone}</p>
                              <p>🕒 {laundryman.workingHours}</p>
                            </div>
                          </div>
                        ) : null
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="support-contact-options">
                  <h4>How can we help you?</h4>
                  <div className="contact-options-grid">
                    <button className="contact-option-btn email-btn">
                      <div className="contact-icon">📧</div>
                      <div className="contact-info">
                        <h5>Email Support</h5>
                        <p>Get help via email</p>
                      </div>
                    </button>

                    <button className="contact-option-btn chat-btn">
                      <div className="contact-icon">💬</div>
                      <div className="contact-info">
                        <h5>Live Chat</h5>
                        <p>Chat with our team</p>
                      </div>
                    </button>

                    <button
                      className="contact-option-btn call-btn"
                      onClick={() => window.open("tel:+911234567890", "_self")}
                    >
                      <div className="contact-icon">📞</div>
                      <div className="contact-info">
                        <h5>Call Support</h5>
                        <p>+91 123 456 7890</p>
                      </div>
                    </button>

                    <button className="contact-option-btn faq-btn" onClick={() => alert("FAQ section coming soon!")}>
                      <div className="contact-icon">❓</div>
                      <div className="contact-info">
                        <h5>FAQ</h5>
                        <p>Common questions</p>
                      </div>
                    </button>
                  </div>

                  <div className="support-hours">
                    <h4>Support Hours</h4>
                    <div className="hours-info">
                      <p>📅 Monday - Friday: 9:00 AM - 8:00 PM</p>
                      <p>📅 Saturday: 10:00 AM - 6:00 PM</p>
                      <p>📅 Sunday: 10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="contact-actions">
                <button className="close-contact-btn" onClick={() => setShowContactModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={handleCloseAddressModal}
        onSave={handleSaveAddress}
        initialAddress={savedAddress || undefined}
      />
    </div>
  )
}

export default CustomerDashboard
