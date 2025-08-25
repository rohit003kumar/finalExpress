"use client"
import { useNavigate } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Loader2, Clock, CheckCircle, Save, MapPin } from 'lucide-react'
import { GoogleMap, useJsApiLoader, Circle, Marker } from '@react-google-maps/api';
import axios from '../utilss/axios'; // Adjust the import path as necessary
import { apiFetch } from "../utilss/apifetch";

import "./LaundrymanDashboard.css"

const Calendars = ({ selected, onSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const goToPreviousMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const handleDateClick = (day) => {
    const selectedDate = new Date(year, month, day)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    if (selectedDate < todayStart) return
    onSelect(selectedDate)
  }

  const isToday = (day) => {
    const todayDate = new Date()
    return todayDate.getDate() === day && todayDate.getMonth() === month && todayDate.getFullYear() === year
  }

  const isSelected = (day) => {
    if (!selected) return false
    return selected.getDate() === day && selected.getMonth() === month && selected.getFullYear() === year
  }

  const renderCalendarDays = () => {
    const days = []

    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day)
      const todayStart = new Date(today)
      todayStart.setHours(0, 0, 0, 0)
      const isPastDate = currentDate < todayStart

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday(day) ? "today" : ""} ${isSelected(day) ? "selected" : ""} ${isPastDate ? "past-date" : ""}`}
          onClick={() => !isPastDate && handleDateClick(day)}
          style={isPastDate ? { cursor: "not-allowed", opacity: 0.5 } : {}}
        >
          {day}
          {isPastDate && <div className="unavailable-indicator">✕</div>}
        </div>
      )
    }

    return days
  }

  return (
    <div className="custom-calendar">
      <div className="calendar-header">
        <button onClick={goToPreviousMonth} className="calendar-nav-btn">
          <ChevronLeft size={20} />
        </button>
        <h3 className="calendar-month-year">
          {monthNames[month]} {year}
        </h3>
        <button onClick={goToNextMonth} className="calendar-nav-btn">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="calendar-grid">
        {dayNames.map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>
    </div>
  )
}

const GoogleMapComponent = ({ onLocationSelect, selectedLocation, serviceRadius, nearbyCustomers = [] }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 19.076, lng: 72.8777 })
  const [zoom, setZoom] = useState(13)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCt9dISEfT7zM4zAeE8a4_ZE6F5oAmRppI',
    libraries: ['places']
  });

  useEffect(() => {
    if (selectedLocation) {
      setMapCenter({ lat: selectedLocation.lat, lng: selectedLocation.lng });
      setZoom(15);
    }
  }, [selectedLocation]);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    const newLocation = {
      lat: lat,
      lng: lng,
      address: `Selected Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      name: "Selected Location",
    }

    onLocationSelect(newLocation);
  };

  if (loadError) {
    return (
      <div style={{
        height: "450px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f3f4f6",
        border: "2px solid #e5e7eb",
        borderRadius: "8px"
      }}>
        <div style={{ textAlign: "center", color: "#ef4444" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
          <h4>Map Loading Error</h4>
          <p>Failed to load Google Maps. Please check your internet connection.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{
        height: "450px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f3f4f6",
        border: "2px solid #e5e7eb",
        borderRadius: "8px"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px"
          }}></div>
          <p>Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "450px" }}>
      <GoogleMap
        center={mapCenter}
        zoom={zoom}
        mapContainerStyle={{ width: "100%", height: "100%", borderRadius: "8px" }}
        onClick={handleMapClick}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        }}
      >
        {selectedLocation && (
          <>
            <Circle
              center={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
              radius={serviceRadius * 1000}
              options={{
                fillColor: "#3b82f6",
                fillOpacity: 0.1,
                strokeColor: "#3b82f6",
                strokeOpacity: 0.8,
                strokeWeight: 2
              }}
            />

            <Marker
              position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
              icon={{
                url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="12" fill="#ef4444" stroke="white" stroke-width="3"/>
                    <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">📍</text>
                  </svg>
                `)
              }}
            />
          </>
        )}

        {nearbyCustomers.map((customer, index) => (
          <Marker
            key={customer._id || index}
            position={{ lat: customer.location.coordinates[1], lng: customer.location.coordinates[0] }}
            icon={{
              url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#10b981" stroke="white" stroke-width="3"/>
                  <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">👤</text>
                </svg>
              `)
            }}
            title={`${customer.name} - ${customer.distance?.toFixed(2) || 'Unknown'} km away`}
          />
        ))}
      </GoogleMap>

      <div style={{
        position: "absolute",
        bottom: "10px",
        left: "10px",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: "8px 12px",
        borderRadius: "6px",
        fontSize: "12px",
        color: "#64748b",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        maxWidth: "300px"
      }}>
        <strong>🗺️ Interactive Map</strong><br />
        Click anywhere to select your service location<br />
        Blue circle shows your service radius<br />
        <span style={{ color: "#ef4444" }}>🔴 Red marker:</span> Your location<br />
        <span style={{ color: "#10b981" }}>🟢 Green markers:</span> Nearby customers ({nearbyCustomers.length})
      </div>
    </div>
  );
};

const LaundrymanDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null)

  // Helper function to format address
  const formatAddress = (address) => {
    if (!address) return 'Address not available';
    
    // If address is a string, return it directly
    if (typeof address === 'string') return address;
    
    // If address is an object with street, city, state, zip
    if (address.street || address.city || address.state || address.zip) {
      const parts = [
        address.street,
        address.city,
        address.state,
        address.zip
      ].filter(Boolean);
      
      return parts.length > 0 ? parts.join(', ') : 'Address not available';
    }
    
    return 'Address not available';
  };
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date())
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    contact: "",
    _id: "",
    serviceLocation: null,
    isWasherman: true // Ensure this is set when fetching profile
  })

  const [previewImage, setPreviewImage] = useState(null)
  const [weeklySchedule, setWeeklySchedule] = useState({
    monday: {
      enabled: true, slots: [
        { id: 1, time: "06:00 - 09:00", enabled: true, label: "Morning Slot 1", maxCapacity: 10 },
        { id: 2, time: "09:00 - 12:00", enabled: true, label: "Afternoon Slot 1", maxCapacity: 10 },
        { id: 3, time: "12:00 - 15:00", enabled: true, label: "Afternoon Slot 2", maxCapacity: 10 },
        { id: 4, time: "15:00 - 18:00", enabled: true, label: "Evening Slot", maxCapacity: 10 },
        { id: 5, time: "18:00 - 21:00", enabled: true, label: "Evening Slot", maxCapacity: 10 },
      ]
    },
    tuesday: {
      enabled: true, slots: [
        { id: 1, time: "06:00 - 09:00", enabled: true, label: "Morning Slot 1", maxCapacity: 10 },
        { id: 2, time: "09:00 - 12:00", enabled: true, label: "Afternoon Slot 1", maxCapacity: 10 },
        { id: 3, time: "12:00 - 15:00", enabled: true, label: "Afternoon Slot 2", maxCapacity: 10 },
        { id: 4, time: "15:00 - 18:00", enabled: true, label: "Evening Slot", maxCapacity: 10 },
        { id: 5, time: "18:00 - 21:00", enabled: true, label: "Evening Slot", maxCapacity: 10 },
      ]
    },
    wednesday: {
      enabled: true, slots: [
        { id: 1, time: "06:00 - 09:00", enabled: true, label: "Morning Slot 1", maxCapacity: 10 },
        { id: 2, time: "09:00 - 12:00", enabled: true, label: "Afternoon Slot 1", maxCapacity: 10 },
        { id: 3, time: "12:00 - 15:00", enabled: true, label: "Afternoon Slot 2", maxCapacity: 10 },
        { id: 4, time: "15:00 - 18:00", enabled: true, label: "Evening Slot", maxCapacity: 10 },
        { id: 5, time: "18:00 - 21:00", enabled: true, label: "Evening Slot", maxCapacity: 10 },
      ]
    },
    thursday: {
      enabled: true, slots: [
        { id: 1, time: "06:00 - 09:00", enabled: true, label: "Morning Slot 1", maxCapacity: 10 },
        { id: 2, time: "09:00 - 12:00", enabled: true, label: "Afternoon Slot 1", maxCapacity: 10 },
        { id: 3, time: "12:00 - 15:00", enabled: true, label: "Afternoon Slot 2", maxCapacity: 10 },
        { id: 4, time: "15:00 - 18:00", enabled: true, label: "Evening Slot", maxCapacity: 10 },
        { id: 5, time: "18:00 - 21:00", enabled: true, label: "Evening Slot", maxCapacity: 10 },
      ]
    },
    friday: {
      enabled: true, slots: [
        { id: 1, time: "06:00 - 09:00", enabled: true, label: "Morning Slot 1", maxCapacity: 10 },
        { id: 2, time: "09:00 - 12:00", enabled: true, label: "Afternoon Slot 1", maxCapacity: 10 },
        { id: 3, time: "12:00 - 15:00", enabled: true, label: "Afternoon Slot 2", maxCapacity: 10 },
        { id: 4, time: "15:00 - 18:00", enabled: true, label: "Evening Slot", maxCapacity: 10 },
        { id: 5, time: "18:00 - 21:00", enabled: true, label: "Evening Slot", maxCapacity: 10 },
      ]
    },
    saturday: {
      enabled: true, slots: [
        { id: 1, time: "06:00 - 09:00", enabled: true, label: "Morning Slot 1", maxCapacity: 10 },
        { id: 2, time: "09:00 - 12:00", enabled: true, label: "Afternoon Slot 1", maxCapacity: 10 },
        { id: 3, time: "12:00 - 15:00", enabled: true, label: "Afternoon Slot 2", maxCapacity: 10 },
        { id: 4, time: "15:00 - 18:00", enabled: true, label: "Evening Slot", maxCapacity: 10 },
        { id: 5, time: "18:00 - 21:00", enabled: true, label: "Evening Slot", maxCapacity: 10 },
      ]
    },
    sunday: {
      enabled: true, slots: [
        { id: 1, time: "06:00 - 09:00", enabled: true, label: "Morning Slot 1", maxCapacity: 10 },
        { id: 2, time: "09:00 - 12:00", enabled: true, label: "Afternoon Slot 1", maxCapacity: 10 },
        { id: 3, time: "12:00 - 15:00", enabled: true, label: "Afternoon Slot 2", maxCapacity: 10 },
        { id: 4, time: "15:00 - 18:00", enabled: true, label: "Evening Slot", maxCapacity: 10 },
        { id: 5, time: "18:00 - 21:00", enabled: true, label: "Evening Slot", maxCapacity: 10 },
      ]
    },
  })

  const [activePage, setActivePage] = useState("Home")
  const [selectedDay, setSelectedDay] = useState("monday")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)

  // Location state
  const [currentLocation, setCurrentLocation] = useState(null)
  const [selectedMapLocation, setSelectedMapLocation] = useState(null)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [manualLat, setManualLat] = useState(null)
  const [manualLng, setManualLng] = useState(null)
  const [savedLocations, setSavedLocations] = useState([])
  const [serviceRadius, setServiceRadius] = useState(2.5)
  const [nearbyCustomers, setNearbyCustomers] = useState([])
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false)



  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/booking/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAssignedOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update status");
    }
  };



  // const handlePaymentStatusUpdate = async (orderId) => {
  //   const confirmPayment = window.confirm("Are you sure you received the cash?");
  //   if (!confirmPayment) return;

  //   try {
  //     const response = await apiFetch(`/api/booking/orders/${orderId}/mark-paid`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     const data = await response.json();

  //     if (data.success) {
  //       alert("✅ Payment marked as paid!");
  //       // Update the UI — for example:
  //       setAssignedOrders((prevOrders) =>
  //         prevOrders.map((order) =>
  //           order._id === orderId
  //             ? { ...order, paymentStatus: "paid" }
  //             : order
  //         )
  //       );
  //     } else {
  //       alert("❌ Could not mark payment as paid.");
  //     }
  //   } catch (error) {
  //     console.error("Error updating payment:", error);
  //     alert("⚠️ Something went wrong.");
  //   }
  // };



  const handlePaymentStatusUpdate = async (orderId) => {
  const confirmPayment = window.confirm("Are you sure you received the cash?");
  if (!confirmPayment) return;

  try {
    const token = localStorage.getItem("token"); // ✅ FIX: define token here

    const response = await apiFetch(`/api/booking/orders/${orderId}/mark-paid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // ✅ Include token
      },
    });

    const data = await response.json();

    if (data.success) {
      alert("✅ Payment marked as paid!");
      setAssignedOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, paymentStatus: "paid" }
            : order
        )
      );
    } else {
      alert("❌ Could not mark payment as paid.");
    }
  } catch (error) {
    console.error("Error updating payment:", error);
    alert("⚠️ Something went wrong.");
  }
};




  const getDayFromDate = (dateString) => {
    const date = new Date(dateString)
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    return days[date.getDay()]
  }

  const getOrdersForSlot = (date, timeSlot) => {
    return assignedOrders.filter(
      (order) => order.date === date && order.timeSlot === timeSlot && order.status !== "Rejected"
    )
  }

  const getSlotAvailability = (date, timeSlot, maxCapacity) => {
    const orders = getOrdersForSlot(date, timeSlot)
    const currentOrders = orders.length
    const availableSlots = maxCapacity - currentOrders

    return {
      currentOrders,
      maxCapacity,
      availableSlots,
      isFull: currentOrders >= maxCapacity,
      isNearFull: currentOrders >= maxCapacity * 0.8,
      percentage: (currentOrders / maxCapacity) * 100,
      orders: orders,
    }
  }

  const handleToggleDaySchedule = (day) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        slots: prev[day].slots.map((slot) => ({
          ...slot,
          enabled: !prev[day].enabled,
        })),
      },
    }))
  }

  const handleToggleSlot = (day, slotId) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot) => (slot.id === slotId ? { ...slot, enabled: !slot.enabled } : slot)),
      },
    }))
  }

  const handleToggleAllSlots = () => {
    const allEnabled = Object.values(weeklySchedule).every(
      (day) => day.enabled && day.slots.every((slot) => slot.enabled),
    )

    const newEnabledState = !allEnabled

    setWeeklySchedule((prev) => {
      const updated = {}
      Object.keys(prev).forEach((day) => {
        updated[day] = {
          ...prev[day],
          enabled: newEnabledState,
          slots: prev[day].slots.map((slot) => ({
            ...slot,
            enabled: newEnabledState,
          })),
        }
      })
      return updated
    })
  }

  const handleDetectLocation = () => {
    setIsDetectingLocation(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          console.log('Current location detected:', latitude, longitude)

          try {
            const placeInfo = await getPlaceNameFromCoordinates(latitude, longitude)
            console.log('Place info received:', placeInfo)

            const newLocation = {
              lat: latitude,
              lng: longitude,
              address: placeInfo.fullAddress,
              shortAddress: placeInfo.shortAddress,
              city: placeInfo.city,
              state: placeInfo.state,
              country: placeInfo.country,
              name: `${placeInfo.city}, ${placeInfo.state}`,
            }

            setCurrentLocation(newLocation)
            setSelectedMapLocation(newLocation)
            setIsDetectingLocation(false)

            handleSaveLocation(newLocation)

            console.log('Location detected and saved successfully')

            alert(`✅ Location detected successfully!\n\n📍 ${placeInfo.shortAddress}\n🌍 ${placeInfo.city}, ${placeInfo.state}\n📊 Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\nYour location has been saved and will be used for your service area.`)
          } catch (error) {
            console.error("Error processing location:", error)
            const address = `Current Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            const newLocation = {
              lat: latitude,
              lng: longitude,
              address: address,
              shortAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              city: 'Unknown City',
              state: 'Unknown State',
              country: 'Unknown Country',
              name: "Current Location",
            }
            setCurrentLocation(newLocation)
            setSelectedMapLocation(newLocation)
            setIsDetectingLocation(false)

            handleSaveLocation(newLocation)

            alert(`✅ Location detected successfully!\n\n📊 Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\nNote: Could not retrieve place name. Your location has been saved with coordinates.`)
          }
        },
        (error) => {
          console.error("Geolocation error:", error)
          setIsDetectingLocation(false)

          let errorMessage = "Failed to get your location"
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please allow location access in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable. Please check your GPS settings.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out. Please try again.";
              break;
            default:
              errorMessage = "Unable to get your location. Please try again.";
          }

          alert(errorMessage)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    } else {
      setIsDetectingLocation(false)
      alert("Geolocation is not supported by this browser. Please use a modern browser with location support.")
    }
  }

  const handleSaveLocation = (location) => {
    const newLocation = {
      id: Date.now(),
      name: location.name || "New Location",
      address: location.address,
      lat: location.lat,
      lng: location.lng,
      isUsed: false,
      serviceRadius: serviceRadius,
    }

    const exists = savedLocations.some(
      (saved) => Math.abs(saved.lat - location.lat) < 0.001 && Math.abs(saved.lng - location.lng) < 0.001,
    )

    if (!exists) {
      setSavedLocations([newLocation, ...savedLocations])
    }

    fetchNearbyCustomers(location.lat, location.lng);
  }

  const handleUseLocation = async (locationId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("Please login to use this location")
        return
      }

      const location = savedLocations.find((loc) => loc.id === locationId)
      if (!location) {
        alert("Location not found")
        return
      }

      // Update both location and washerman status
      const response = await axios.put(
        `/api/user/${profile._id}`,
        {
          location: {
            type: "Point",
            coordinates: [location.lng, location.lat],
          },
          range: location.serviceRadius * 1000,
          isWasherman: true // Ensure this is set to true
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 200) {
        setProfile((prev) => ({
          ...prev,
          serviceLocation: {
            name: location.name,
            address: location.address,
            lat: location.lat,
            lng: location.lng,
            serviceRadius: location.serviceRadius,
          },
          isWasherman: true
        }))

        setSavedLocations((prev) =>
          prev.map((loc) => ({
            ...loc,
            isUsed: loc.id === locationId,
          }))
        )

        setSelectedMapLocation(location)
        alert(`✅ Location "${location.name}" is now your active service location!`)

        fetchNearbyCustomers(location.lat, location.lng);
      }
    } catch (error) {
      console.error("Error updating service location:", error)
      alert("❌ Failed to update service location. Please try again.")
    }
  }

  const handleDeleteLocation = (locationId) => {
    setSavedLocations(savedLocations.filter((loc) => loc.id !== locationId))
  }

  const getPlaceNameFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      )

      if (!response.ok) {
        throw new Error('Geocoding service unavailable')
      }

      const data = await response.json()

      if (data.display_name) {
        const addressParts = data.display_name.split(', ')
        const shortAddress = addressParts.slice(0, 3).join(', ')
        return {
          fullAddress: data.display_name,
          shortAddress: shortAddress,
          city: data.address?.city || data.address?.town || data.address?.village || 'Unknown City',
          state: data.address?.state || 'Unknown State',
          country: data.address?.country || 'Unknown Country'
        }
      } else {
        throw new Error('No address found')
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return {
        fullAddress: `Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        shortAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        city: 'Unknown City',
        state: 'Unknown State',
        country: 'Unknown Country'
      }
    }
  }

  const fetchNearbyCustomers = async (latitude, longitude) => {
    try {
      setIsLoadingCustomers(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await axios.get(
        `/api/location/customers-near-laundryman?lat=${latitude}&lng=${longitude}&range=${serviceRadius * 1000}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setNearbyCustomers(response.data.customers || []);
        console.log("Nearby customers fetched:", response.data.customers?.length || 0);
      } else {
        console.error("Failed to fetch nearby customers");
        setNearbyCustomers([]);
      }
    } catch (error) {
      console.error("Error fetching nearby customers:", error);
      setNearbyCustomers([]);
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/user/currentuser", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setProfile({
        name: res.data.name,
        email: res.data.email,
        contact: res.data.contact,
        _id: res.data._id,
        image: res.data.image || "/src/washer.png",
        isWasherman: res.data.isWasherman || false,
        serviceLocation: res.data.location ? {
          name: "Saved Location",
          address: res.data.location.address || "Your saved location",
          lat: res.data.location.coordinates[1],
          lng: res.data.location.coordinates[0],
          serviceRadius: (res.data.range || 500) / 1000
        } : null
      });

      if (res.data.location) {
        setServiceRadius((res.data.range || 500) / 1000);
        setSelectedMapLocation({
          lat: res.data.location.coordinates[1],
          lng: res.data.location.coordinates[0],
          address: res.data.location.address || "Saved Location",
          name: "Saved Location"
        });
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const fetchAssignedOrders = async () => {
    const token = localStorage.getItem("token");
    console.log('Fetching assigned orders with token:', token);

    try {
      const res = await axios.get("/api/booking/assigned", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched assigned orders:", res.data);
      const mappedOrders = Array.isArray(res.data)
        ? res.data.map(order => ({
          ...order,
          id: order._id,
        }))
        : [];
      setAssignedOrders(mappedOrders);
    } catch (error) {
      console.error("Error fetching assigned bookings:", error);
    }
  };

  // const handleStatusUpdate = async (orderId, newStatus) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     await axios.put(
  //       `http://localhost:5000/api/booking/${orderId}`,
  //       { status: newStatus },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     setAssignedOrders(prevOrders =>
  //       prevOrders.map(order =>
  //         order.id === orderId ? { ...order, status: newStatus } : order
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error updating order status:", error);
  //   }
  // };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const updatedData = {
      name: formData.get("name"),
      email: formData.get("email"),
      contact: formData.get("contact"),
      isWasherman: true // Ensure this remains true
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `/api/user/${profile._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile updated successfully:", res.data);
      setProfile(prev => ({
        ...prev,
        ...updatedData
      }));
      setActivePage("Home");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCalendarDateSelect = (date) => {
    const localDate = new Date(date);
    const dateString = localDate.toLocaleDateString('en-CA');
    setSelectedCalendarDate(localDate);
    setSelectedDate(dateString);
    const dayName = getDayFromDate(dateString);
    setSelectedDay(dayName);
    if (activePage !== "Schedule") {
      setActivePage("Schedule");
    }
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day)
    const today = new Date()
    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const selectedDayIndex = daysOfWeek.indexOf(day)
    const currentDayIndex = today.getDay()

    let dayDiff = selectedDayIndex - currentDayIndex
    if (dayDiff < 0) {
      dayDiff += 7
    }

    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + dayDiff)

    setSelectedCalendarDate(targetDate)
    setSelectedDate(targetDate.toISOString().split("T")[0])
  }

  const handleTimeSlotClick = (date, timeSlot, maxCapacity) => {
    const availability = getSlotAvailability(date, timeSlot, maxCapacity)
    setSelectedTimeSlot({
      date,
      timeSlot,
      availability,
      showSaveOption: true,
    })
  }

  useEffect(() => {
    fetchProfile();
    fetchAssignedOrders();
  }, []);

  useEffect(() => {
    if (activePage === "Location" && profile.serviceLocation) {
      fetchNearbyCustomers(
        profile.serviceLocation.lat,
        profile.serviceLocation.lng
      );
    }
  }, [activePage, profile.serviceLocation]);

  const today = new Date().toISOString().split("T")[0];
  const todaysOrders = assignedOrders.filter((order) => order.date === today);

//   const dashboardStats = {
//     totalOrders: todaysOrders.length,
//     pendingOrders: todaysOrders.filter((order) => order.status === "Pending" || order.status === "Accepted").length,
//     // completedOrders: todaysOrders.filter((order) => order.status === "Delivered").length,
//     completedOrders: todaysOrders.filter(
//   (order) => order.status === "DELIVERED"
// ).length,

//     activeSlots: Object.values(weeklySchedule).reduce(
//       (total, day) => total + day.slots.filter((slot) => slot.enabled).length,
//       0,
//     ),
//     totalSlots: Object.values(weeklySchedule).reduce((total, day) => total + day.slots.length, 0),
//     todayEarnings: todaysOrders.reduce((total, order) => total + (order.totalAmount || 0), 0),
//     weeklyEarnings: 2800,
//   }

const dashboardStats = {
  totalOrders: todaysOrders.length,

  pendingOrders: todaysOrders.filter(
    (order) =>
      order.status.toLowerCase() === "pending" ||
      order.status.toLowerCase() === "accepted"
  ).length,

  completedOrders: todaysOrders.filter(
    (order) =>
      order.status.toLowerCase() === "delivered" &&
      order.paymentStatus?.toLowerCase() === "paid"
  ).length,

  activeSlots: Object.values(weeklySchedule).reduce(
    (total, day) => total + day.slots.filter((slot) => slot.enabled).length,
    0
  ),

  totalSlots: Object.values(weeklySchedule).reduce(
    (total, day) => total + day.slots.length,
    0
  ),

  todayEarnings: todaysOrders
    .filter(
      (order) =>
        order.status.toLowerCase() === "delivered" &&
        order.paymentStatus?.toLowerCase() === "paid"
    )
    .reduce((total, order) => total + (order.totalAmount || 0), 0),

  weeklyEarnings: 0, // Optional: You can calculate this dynamically later
};


  const dayNames = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  }

  return (
    <div className="dashboard-container">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="mobile-header-content">
          <div className="mobile-logo">
            <img src={"/washer.webp"} alt="Profile" className="mobile-profile-img" />
            <span className="mobile-profile-name">{profile.name}</span>
          </div>
          <button className="hamburger-menu" onClick={toggleMobileMenu} aria-label="Toggle menu">
            <span className={`hamburger-line ${isMobileMenuOpen ? "active" : ""}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? "active" : ""}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? "active" : ""}`}></span>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-profile" onClick={() => setActivePage("Profile")}>
          <img src={"/washer.webp"} alt="Laundryman" className="sidebar-profile-img" />
          <span className="sidebar-profile-name">{profile.name}</span>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-button ${activePage === "Home" ? "active" : ""}`}
            onClick={() => {
              setActivePage("Home")
              setIsMobileMenuOpen(false)
            }}
          >
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </button>
          <button
            className={`nav-button ${activePage === "Schedule" ? "active" : ""}`}
            onClick={() => {
              setActivePage("Schedule")
              setIsMobileMenuOpen(false)
            }}
          >
            <span className="nav-icon">📅</span>
            <span>Weekly Schedule</span>
          </button>
          <button
            className={`nav-button ${activePage === "Location" ? "active" : ""}`}
            onClick={() => {
              setActivePage("Location")
              setIsMobileMenuOpen(false)
            }}
          >
            <span className="nav-icon">📍</span>
            <span>Set Location</span>
          </button>
          <button
            className={`nav-button ${activePage === "Orders" ? "active" : ""}`}
            onClick={() => {
              setActivePage("Orders")
              setIsMobileMenuOpen(false)
            }}
          >
            <span className="nav-icon">📋</span>
            <span>Orders</span>
          </button>

          <button
            className={`nav-button ${activePage === "Profile" ? "active" : ""}`}
            onClick={() => {
              setActivePage("Profile")
              setIsMobileMenuOpen(false)
            }}
          >
            <span className="nav-icon">👤</span>
            <span>Profile</span>
          </button>
          <button
            className={`nav-button ${activePage === "AddServices" ? "active" : ""}`}
            onClick={() => {
              setActivePage("AddServices")
              setIsMobileMenuOpen(false)
              navigate("/adminservices")
            }}
          >
            <span className="nav-icon">➕</span>
            <span>Add Services</span>
          </button>
        </nav>

        <button
          className={`nav-button ${activePage === "Logout" ? "active" : ""}`}
          onClick={() => {
            setActivePage("Logout")
            setIsMobileMenuOpen(false)
            setShowLogoutPopup(true)
          }}
        >
          <span className="nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && <div className="mobile-overlay" onClick={toggleMobileMenu}></div>}

      {/* Main Content */}
      <main className="main-content">
        {activePage === "Home" && (
          <div className="home-page">
            <section className="welcome-section">
              <div className="welcome-content">
                <h1>
                  {getGreeting()}, {profile.name}! 👋
                </h1>
                <p>Here's what's happening with your laundry service today</p>
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

            <section className="dashboard-stats">
              <div className="stats-grid">
                <div className="stat-card orders">
                  <div className="stat-icon">📦</div>
                  <div className="stat-content">
                    <h3>Total Orders</h3>
                    <p className="stat-number">{dashboardStats.totalOrders}</p>
                    <span className="stat-label">Today</span>
                  </div>
                </div>

                <div className="stat-card completed">
                  <div className="stat-icon">✅</div>
                  <div className="stat-content">
                    <h3>Completed</h3>
                    <p className="stat-number">{dashboardStats.completedOrders}</p>
                    <span className="stat-label">Today</span>
                  </div>
                </div>

                <div className="stat-card earnings">
                  <div className="stat-icon">₹</div>
                  <div className="stat-content">
                    <h3>Today's Earnings</h3>
                    <p className="stat-number">₹{dashboardStats.todayEarnings}</p>
                    <span className="stat-label"></span>
                  </div>
                </div>
              </div>
            </section>


          </div>
        )}

        {activePage === "Schedule" && (
          <WashermanSlotToggle />
        )}

        {activePage === "Location" && (
          <section className="location-section">
            <div className="location-header">
              <h3>Set Your Service Location</h3>
              <p>Choose your preferred location for laundry services</p>
            </div>
            <div className="location-content">
              <div className="location-selection-area">
                <div className="location-map-container">
                  <div className="current-location-section">
                    <h4>📍 Current Location</h4>
                    <div className="location-detection-info">
                      <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "12px" }}>
                        Click the button below to detect your current location using GPS
                      </p>
                      <button
                        className={`detect-location-btn ${isDetectingLocation ? 'detecting' : ''}`}
                        onClick={handleDetectLocation}
                        disabled={isDetectingLocation}
                        style={{
                          backgroundColor: isDetectingLocation ? "#f3f4f6" : "#3b82f6",
                          color: isDetectingLocation ? "#6b7280" : "white",
                          cursor: isDetectingLocation ? "not-allowed" : "pointer",
                          position: "relative"
                        }}
                      >
                        {isDetectingLocation ? (
                          <>
                            <span style={{ animation: "spin 1s linear infinite" }}>🔄</span>
                            Detecting Location...
                          </>
                        ) : (
                          <>
                            📍 Use Current Location
                          </>
                        )}
                      </button>
                      {isDetectingLocation && (
                        <div style={{
                          marginTop: "8px",
                          fontSize: "12px",
                          color: "#059669",
                          backgroundColor: "#d1fae5",
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #a7f3d0"
                        }}>
                          🔍 Please allow location access when prompted by your browser
                        </div>
                      )}
                    </div>
                    {currentLocation && (
                      <div className="location-info">
                        <div className="location-details">
                          <p>
                            <strong>📍 Place:</strong> {currentLocation.name}
                          </p>
                          <p>
                            <strong>🏙️ City:</strong> {currentLocation.city}
                          </p>
                          <p>
                            <strong>🏛️ State:</strong> {currentLocation.state}
                          </p>
                          <p>
                            <strong>📝 Address:</strong> {currentLocation.shortAddress || currentLocation.address}
                          </p>
                          <p>
                            <strong>📊 Coordinates:</strong> {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                          </p>
                        </div>
                        <button className="save-location-btn" onClick={() => handleSaveLocation(currentLocation)}>
                          💾 Save This Location
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="map-section">
                    <h4>🗺️ Interactive Map - Click to Select Location</h4>
                    <div className="map-controls">
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>
                        📍 Click anywhere on the map to select your service location
                      </span>
                    </div>

                    <GoogleMapComponent
                      onLocationSelect={setSelectedMapLocation}
                      selectedLocation={selectedMapLocation}
                      serviceRadius={serviceRadius}
                      nearbyCustomers={nearbyCustomers}
                    />

                    {selectedMapLocation && (
                      <div
                        className="selected-location-info"
                        style={{
                          marginTop: "12px",
                          padding: "12px",
                          backgroundColor: "#f0f9ff",
                          border: "1px solid #0ea5e9",
                          borderRadius: "6px",
                        }}
                      >
                        <h5 style={{ color: "#0369a1", marginBottom: "8px" }}>
                          📍 Selected Location: {selectedMapLocation.name}
                        </h5>
                        <p style={{ fontSize: "14px", marginBottom: "4px" }}>
                          <strong>🏙️ City:</strong> {selectedMapLocation.city}
                        </p>
                        <p style={{ fontSize: "14px", marginBottom: "4px" }}>
                          <strong>🏛️ State:</strong> {selectedMapLocation.state}
                        </p>
                        <p style={{ fontSize: "14px", marginBottom: "4px" }}>
                          <strong>📝 Address:</strong> {selectedMapLocation.shortAddress || selectedMapLocation.address}
                        </p>
                        <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>
                          <strong>📊 Coordinates:</strong> {selectedMapLocation.lat}, {selectedMapLocation.lng}
                        </p>
                        <button
                          className="save-location-btn"
                          onClick={() => handleSaveLocation(selectedMapLocation)}
                          style={{
                            backgroundColor: "#0ea5e9",
                            color: "white",
                            padding: "8px 16px",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          💾 Save Selected Location
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="service-area-card">
                <div className="card-header">
                  <h4>🎯 Service Area Settings</h4>
                </div>
                <div className="service-area-content">
                  <div className="service-radius">
                    <label htmlFor="serviceRadius">Service Radius: {serviceRadius} km</label>
                    <div className="radius-input-group">
                      <input
                        id="serviceRadius"
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.5"
                        value={serviceRadius}
                        onChange={(e) => setServiceRadius(Number.parseFloat(e.target.value))}
                        className="radius-slider"
                      />
                      <div className="radius-labels">
                        <span>0.5 km</span>
                        <span>5 km</span>
                      </div>
                    </div>
                    <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px" }}>
                      This radius will be saved with each location and determines your service coverage area.
                    </p>
                  </div>
                  {profile.serviceLocation && (
                    <div className="current-service-location">
                      <h5>✅ Current Active Service Location</h5>
                      <p>
                        <strong>Name:</strong> {profile.serviceLocation.name}
                      </p>
                      <p>
                        <strong>Address:</strong> {profile.serviceLocation.address}
                      </p>
                      <p>
                        <strong>Service Radius:</strong> {profile.serviceLocation.serviceRadius || serviceRadius} km
                      </p>
                    </div>
                  )}

                  <div className="nearby-customers-section" style={{ marginTop: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <h4>👥 Nearby Customers</h4>
                      <button
                        onClick={() => {
                          if (profile.serviceLocation) {
                            fetchNearbyCustomers(profile.serviceLocation.lat, profile.serviceLocation.lng);
                          } else {
                            alert("Please set your service location first");
                          }
                        }}
                        disabled={isLoadingCustomers}
                        style={{
                          backgroundColor: "#3b82f6",
                          color: "white",
                          padding: "6px 12px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: isLoadingCustomers ? "not-allowed" : "pointer",
                          fontSize: "12px",
                          fontWeight: "600",
                          opacity: isLoadingCustomers ? 0.6 : 1
                        }}
                      >
                        {isLoadingCustomers ? "🔄 Loading..." : "🔄 Refresh"}
                      </button>
                    </div>
                    {isLoadingCustomers ? (
                      <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                        <div style={{
                          width: "20px",
                          height: "20px",
                          border: "2px solid #e5e7eb",
                          borderTop: "2px solid #3b82f6",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                          margin: "0 auto 8px"
                        }}></div>
                        Loading nearby customers...
                      </div>
                    ) : nearbyCustomers.length > 0 ? (
                      <div className="customers-list">
                        {nearbyCustomers.map((customer, index) => (
                          <div key={customer._id || index} className="customer-item" style={{
                            padding: "12px",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            marginBottom: "8px",
                            backgroundColor: "#f9fafb"
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <h6 style={{ margin: "0 0 4px 0", color: "#374151" }}>👤 {customer.name}</h6>
                                <p style={{ margin: "0 0 2px 0", fontSize: "12px", color: "#6b7280" }}>
                                  📞 {customer.contact || "Contact not available"}
                                </p>
                                <p style={{ margin: "0", fontSize: "12px", color: "#6b7280" }}>
                                  📧 {customer.email || "Email not available"}
                                </p>

                              </div>
                              <div style={{ textAlign: "right" }}>
                                <span style={{
                                  backgroundColor: "#10b981",
                                  color: "white",
                                  padding: "4px 8px",
                                  borderRadius: "12px",
                                  fontSize: "11px",
                                  fontWeight: "600"
                                }}>
                                  {customer.distance?.toFixed(2) || "Unknown"} km
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                        <div style={{ fontSize: "24px", marginBottom: "8px" }}>👥</div>
                        <p>No customers found in your service area</p>
                        <p style={{ fontSize: "12px" }}>Customers will appear here when they set their location</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="saved-locations-card">
                <div className="card-header">
                  <h4>💾 Saved Locations</h4>
                </div>
                <div className="saved-locations-list">
                  {savedLocations.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📍</div>
                      <p>No saved locations yet</p>
                      <span>Add locations to see them here</span>
                    </div>
                  ) : (
                    savedLocations.map((location) => (
                      <div key={location.id} className="saved-location-item">
                        <div className="location-info">
                          <h5>📍 {location.name || "Saved Location"}</h5>
                          {location.city && (
                            <p style={{ fontSize: "14px", color: "#374151", marginBottom: "2px" }}>
                              🏙️ {location.city}, {location.state}
                            </p>
                          )}
                          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>
                            {location.shortAddress || location.address}
                          </p>
                          <span className="coordinates" style={{ fontSize: "12px", color: "#9ca3af" }}>
                            📊 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                          </span>
                          <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                            🎯 Service Radius: {location.serviceRadius || 2.5} km
                          </div>
                        </div>
                        <div className="location-actions">
                          <button
                            className={`use-location-btn ${location.isUsed ? "used" : ""}`}
                            onClick={() => handleUseLocation(location.id)}
                          >
                            {location.isUsed ? "✓ Active" : "Use"}
                          </button>
                          <button className="delete-location-btn" onClick={() => handleDeleteLocation(location.id)}>
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        )}



        {activePage === "Orders" && (
          <section className="orders-section">
            <h3>Assigned Orders</h3>
            {assignedOrders.length === 0 ? (
              <div className="empty-orders">
                <div className="empty-icon">📋</div>
                <p>No assigned orders</p>
              </div>
            ) : (
              <div className="orders-by-date">
                {(() => {
                  const groupedOrders = {};

                  assignedOrders.forEach((order) => {
                    const orderDate = new Date(order.date).toISOString().split("T")[0];
                    if (!groupedOrders[orderDate]) {
                      groupedOrders[orderDate] = [];
                    }
                    groupedOrders[orderDate].push(order);
                  });

                  const sortedDates = Object.keys(groupedOrders).sort();

                  return sortedDates.map((date) => {
                    const ordersForDate = groupedOrders[date];
                    const today = new Date().toISOString().split("T")[0];
                    let dateLabel = "";

                    if (date === today) {
                      dateLabel = "Today's Orders";
                    } else {
                      dateLabel =
                        new Date(date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        }) + "'s Orders";
                    }

                    return (
                      <div key={date} className="date-group">
                        <div className="date-header">
                          <h4>{dateLabel}</h4>
                          <span className="order-count-badge">{ordersForDate.length} orders</span>
                        </div>
                        <div className="orders-grid">
                          {ordersForDate.map((order) => {
                            const product = order.productId || {};
                            const customer = order.guest || {};
                            const address = customer.address || {};
                            const slot = order.slot || {};

                            return (
                              <div key={order._id} className="order-card">
                                {product.image && (
                                  <div className="order-image-container mb-2">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-40 object-contain rounded"
                                      onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/150";
                                      }}
                                    />
                                  </div>
                                )}

                                <div className="order-info">
                                  <p><strong>Order ID:</strong> {order._id}</p>
                                  <p><strong>Customer:</strong> {customer.name || "N/A"}</p>
                                  <p><strong>Email:</strong> {customer.email || "N/A"}</p>
                                  <p><strong>Contact:</strong> {customer.contact || "N/A"}</p>
                                  <p><strong>Category:</strong> {product.category || "N/A"}</p>
                                  <p><strong>Service Type:</strong> {order.selectedOptions?.map(opt => opt.name).join(", ") || "N/A"}</p>

                                  <p><strong>Quantity:</strong> {order.quantity || 1}</p>
                                  <p><strong>Label:</strong> {slot.label || "N/A"}</p>
                                  <p><strong>Total Price:</strong> ₹{order.totalAmount || "N/A"}</p>
                                  <p><strong>Payment:</strong> {order.paymentMethod || "N/A"} ({order.paymentStatus || "N/A"})</p>
                                  <p><strong>Pickup Date:</strong> {new Date(order.date).toISOString().split("T")[0]}</p>
                                  <p><strong>Time Slot:</strong> {slot.range || "N/A"}</p>

                                  {order.deliveryAddress ? (
                                    <div>
                                      <p><strong>Delivery Address:</strong></p>
                                      <p style={{ marginLeft: '10px', fontSize: '14px', color: '#374151' }}>
                                        {order.deliveryAddress.fullAddress || formatAddress(order.deliveryAddress)}
                                      </p>
                                      {order.deliveryInstructions && (
                                        <p style={{ marginLeft: '10px', fontSize: '13px', color: '#6b7280', fontStyle: 'italic' }}>
                                          <strong>Instructions:</strong> {order.deliveryInstructions}
                                        </p>
                                      )}
                                    </div>
                                  ) : customer.address ? (
                                    <p><strong>Customer Address:</strong> {formatAddress(customer.address)}</p>
                                  ) : (
                                    <p><strong>Address:</strong> Not available</p>
                                  )}

                                  <p><strong>Status:</strong>{" "}
                                    <span className={`status-badge ${order.status?.toLowerCase().replace(" ", "-")}`}>
                                      {order.status || "N/A"}
                                    </span>
                                  </p>
                                </div>

                                <div className="action-buttons">
                                  {order.status === "Accepted" && (
                                    <button onClick={() => handleStatusUpdate(order._id, "Pickedup")} className="pickup-btn">✅ Pickup</button>
                                  )}
                                  {order.status === "Pickedup" && (
                                    <button onClick={() => handleStatusUpdate(order._id, "Washed")} className="wash-btn">🧺 Washed</button>
                                  )}
                                  {order.status === "Washed" && (
                                    <button onClick={() => handleStatusUpdate(order._id, "Ready for delivery")} className="ready-btn">✅ Ready</button>
                                  )}
                                  {order.status === "Ready for delivery" && (
                                    <button onClick={() => handleStatusUpdate(order._id, "Delivered")} className="deliver-btn">✅ Delivered</button>
                                  )}
                                </div>
                                <div className="action-buttons mt-2 space-y-2">
                                  {/* Auto-progressing status buttons */}
                                  {order.status === "booked" && (
                                    <button
                                      onClick={() => handleStatusUpdate(order._id, "picked_up")}
                                      className="px-3 py-1 bg-blue-500 text-white rounded"
                                    >
                                      ✅ Mark as Picked Up
                                    </button>
                                  )}
                                  {order.status === "picked_up" && (
                                    <button
                                      onClick={() => handleStatusUpdate(order._id, "in_progress")}
                                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                                    >
                                      🧺 Mark as In Progress
                                    </button>
                                  )}
                                  {order.status === "in_progress" && (
                                    <button
                                      onClick={() => handleStatusUpdate(order._id, "delivered")}
                                      className="px-3 py-1 bg-green-500 text-white rounded"
                                    >
                                      📦 Mark as Delivered
                                    </button>
                                  )}

                                  {/*Mark as Paid Button (if required) */}
                                  {order.paymentMethod === "cash" &&
                                    order.paymentStatus === "pending" &&
                                    order.status === "delivered" && (
                                      <button
                                        onClick={() => handlePaymentStatusUpdate(order._id)}
                                        className="px-3 py-1 bg-green-600 text-white rounded"
                                      >
                                        💵 Mark as Paid
                                      </button>
                                    )}
                                </div>


                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </section>
        )}








        {activePage === "Profile" && (
          <section className="edit-profile-section">
            <h3>Edit Profile</h3>
            <div className="profile-container">
              <img
                src={"/washer.webp"}
                alt="Profile Preview"
                className="profile-image-preview"
              />
              <form onSubmit={handleSaveProfile} className="edit-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={profile.name}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={profile.email}
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact">Contact</label>
                  <input
                    id="contact"
                    name="contact"
                    type="tel"
                    defaultValue={profile.contact}
                    required
                    placeholder="Enter your contact number"
                  />
                </div>

                <div className="profile-buttons">
                  <button type="submit">Save Changes</button>
                  <button type="button" className="cancel-btn" onClick={() => setActivePage("Home")}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}
      </main>

      {selectedTimeSlot && (
        <div className="time-slot-dialog">
          <div className="time-slot-dialog-content">
            <div className="time-slot-dialog-header">
              <h3>Time Slot Details</h3>
              <button className="time-slot-dialog-close" onClick={() => setSelectedTimeSlot(null)}>
                ×
              </button>
            </div>

            <div className="time-slot-details">
              <h4>{selectedTimeSlot.timeSlot}</h4>
              <p>
                {new Date(selectedTimeSlot.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="time-slot-stats">
              <div className="time-slot-stat-row">
                <span className="time-slot-stat-label">Current Bookings:</span>
                <span className="time-slot-stat-value">{selectedTimeSlot.availability.currentOrders}</span>
              </div>
              <div className="time-slot-stat-row">
                <span className="time-slot-stat-label">Max Capacity:</span>
                <span className="time-slot-stat-value">{selectedTimeSlot.availability.maxCapacity}</span>
              </div>
              <div className="time-slot-stat-row">
                <span className="time-slot-stat-label">Available Slots:</span>
                <span className="time-slot-stat-value available">{selectedTimeSlot.availability.availableSlots}</span>
              </div>
            </div>

            <div className="time-slot-progress">
              <div
                className="time-slot-progress-fill"
                style={{
                  width: `${selectedTimeSlot.availability.percentage}%`,
                  backgroundColor: selectedTimeSlot.availability.isFull
                    ? "#e74c3c"
                    : selectedTimeSlot.availability.isNearFull
                      ? "#f39c12"
                      : "#27ae60",
                }}
              ></div>
            </div>
            <div className="time-slot-status-container">
              <span
                className={`time-slot-status ${selectedTimeSlot.availability.isFull
                  ? "full"
                  : selectedTimeSlot.availability.isNearFull
                    ? "near-full"
                    : "available"
                  }`}
              >
                {selectedTimeSlot.availability.isFull
                  ? "Full"
                  : selectedTimeSlot.availability.isNearFull
                    ? "Near Full"
                    : "Available"}
              </span>
            </div>

            {selectedTimeSlot.availability.orders && selectedTimeSlot.availability.orders.length > 0 && (
              <div className="time-slot-orders-list">
                <h5>Current Orders:</h5>
                <div className="time-slot-orders-container">
                  {selectedTimeSlot.availability.orders.map((order) => (
                    <div key={order.id} className="time-slot-order-item">
                      <div className="time-slot-order-id">{order.id}</div>
                      <div className="time-slot-order-details">
                        {order.customerName} - {order.details}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showLogoutPopup && (
        <div className="logout-popup-overlay">
          <div className="logout-popup-content">
            <h3>Are you sure?</h3>
            <p>Do you want to logout?</p>
            <div className="logout-popup-buttons">
              <button
                className="yes-btn"
                onClick={() => {
                  setShowLogoutPopup(false);
                  navigate("/signin");
                }}
              >
                Yes
              </button>
              <button
                className="no-btn"
                onClick={() => setShowLogoutPopup(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const WashermanSlotToggle = () => {
  const [slotTemplates, setSlotTemplates] = useState([]);
  const [enabledSlots, setEnabledSlots] = useState({});
  const [maxBookingInputs, setMaxBookingInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingStates, setSavingStates] = useState({});
  const [savedStates, setSavedStates] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [currentBookingCounts, setCurrentBookingCounts] = useState({});

  useEffect(() => {
    const fetchAdminSlots = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        const res = await axios.get("/api/show/slot-templates", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter out past dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = res.data.filter((template) => {
          const templateDate = new Date(template.date);
          templateDate.setHours(0, 0, 0, 0);
          return templateDate >= today;
        });

        setSlotTemplates(upcoming);

        const savedEnabled = JSON.parse(localStorage.getItem("washermanEnabledSlots") || "{}");
        const savedMax = JSON.parse(localStorage.getItem("washermanMaxBookingInputs") || "{}");

        const filteredEnabled = {};
        const filteredMax = {};

        for (const date in savedEnabled) {
          if (new Date(date) >= today) {
            filteredEnabled[date] = savedEnabled[date];
          }
        }

        for (const date in savedMax) {
          if (new Date(date) >= today) {
            filteredMax[date] = savedMax[date];
          }
        }

        setEnabledSlots(filteredEnabled);
        setMaxBookingInputs(filteredMax);

        localStorage.setItem("washermanEnabledSlots", JSON.stringify(filteredEnabled));
        localStorage.setItem("washermanMaxBookingInputs", JSON.stringify(filteredMax));

        const bookingRes = await axios.get("/api/show/slot-booking-counts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentBookingCounts(bookingRes.data || {});
      } catch (err) {
        setError("Failed to load slot templates. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminSlots();
  }, []);

  const handleToggle = (date, slot) => {
    const current = new Set(enabledSlots[date] || []);
    const wasEnabled = current.has(slot.range);
    const updatedEnabledSlots = { ...enabledSlots };
    const previousMax = maxBookingInputs[date]?.[slot.range];

    if (wasEnabled) {
      current.delete(slot.range);
    } else {
      current.add(slot.range);
      setMaxBookingInputs((prev) => ({
        ...prev,
        [date]: {
          ...prev[date],
          [slot.range]: previousMax || "",
        },
      }));
    }

    updatedEnabledSlots[date] = [...current];
    setEnabledSlots(updatedEnabledSlots);
    localStorage.setItem("washermanEnabledSlots", JSON.stringify(updatedEnabledSlots));
    localStorage.setItem("washermanMaxBookingInputs", JSON.stringify(maxBookingInputs));

    setSavedStates((prev) => ({ ...prev, [date]: false }));
  };

  const handleMaxBookingChange = (date, range, value) => {
    const parsedValue = parseInt(value, 10);
    const updated = {
      ...maxBookingInputs,
      [date]: {
        ...maxBookingInputs[date],
        [range]: parsedValue,
      },
    };
    setMaxBookingInputs(updated);
    localStorage.setItem("washermanMaxBookingInputs", JSON.stringify(updated));

    setFieldErrors((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        [range]: false,
      },
    }));
  };

  const saveSlotsToBackend = async (date) => {
    setError(null);
    setSavingStates((prev) => ({ ...prev, [date]: true }));
    setFieldErrors({});

    const enabledRanges = enabledSlots[date] || [];
    const slotsForDate = slotTemplates.find((d) => d.date === date)?.slots || [];

    const errors = {};
    let hasError = false;

    for (const slot of slotsForDate) {
      if (enabledRanges.includes(slot.range)) {
        const value = maxBookingInputs[date]?.[slot.range];
        if (!value || isNaN(value) || value <= 0) {
          errors[slot.range] = true;
          hasError = true;
        }
      }
    }

    if (hasError) {
      setFieldErrors((prev) => ({ ...prev, [date]: errors }));
      setSavingStates((prev) => ({ ...prev, [date]: false }));
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const payload = {
        date,
        enabledSlots: slotsForDate
          .filter((s) => enabledRanges.includes(s.range))
          .map((s) => ({
            label: s.label,
            range: s.range,
            maxBookings: maxBookingInputs[date]?.[s.range],
          })),
      };

      await axios.post("/api/show/slots/washer", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSavedStates((prev) => ({ ...prev, [date]: true }));
      localStorage.setItem("washermanMaxBookingInputs", JSON.stringify(maxBookingInputs));
    } catch (err) {
      setError("Failed to save slots. Please try again.");
    } finally {
      setSavingStates((prev) => ({ ...prev, [date]: false }));
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getEnabledCount = (date) => new Set(enabledSlots[date] || []).size;
  const getTotalSlots = (date) => new Set(slotTemplates.find((t) => t.date === date)?.slots.map((slot) => slot.range)).size;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {slotTemplates.map((template) => {
        const date = template.date;
        const total = getTotalSlots(date);
        const active = getEnabledCount(date);
        const saving = savingStates[date];
        const saved = savedStates[date];
        const dateFieldErrors = fieldErrors[date] || {};

        return (
          <div key={date} className="bg-white shadow rounded-lg mb-6 border">
            <div className="flex justify-between items-center bg-blue-100 px-4 py-2 border-b">
              <div>
                <h2 className="font-bold text-blue-800">{formatDate(date)}</h2>
                <p className="text-sm text-gray-600">{date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{active}/{total} Active Slots</p>
                <div className="w-full bg-gray-200 h-2 rounded mt-1">
                  <div className="h-2 bg-green-500 rounded" style={{ width: `${(active / total) * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              {template.slots.map((slot) => {
                const isEnabled = enabledSlots[date]?.includes(slot.range);
                const hasFieldError = dateFieldErrors[slot.range];
                const max = maxBookingInputs[date]?.[slot.range];
                const booked = currentBookingCounts[date]?.[slot.range] || 0;
                const isFull = isEnabled && max !== undefined && booked >= max;

                return (
                  <div key={slot.range + slot.label} className={`p-4 rounded border relative ${isEnabled ? (isFull ? "bg-red-50 border-red-400" : "bg-green-50 border-green-300") : "bg-gray-50"}`}>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-medium text-gray-800">{slot.label}</h4>
                        <div className="flex items-center text-sm text-gray-600 space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{slot.range}</span>
                        </div>
                        {isEnabled && (
                          <>
                            <div className="mt-2">
                              <label className="text-xs text-gray-600">Max Bookings</label>
                              <input
                                type="number"
                                min="1"
                                value={max || ""}
                                onChange={(e) => handleMaxBookingChange(date, slot.range, e.target.value)}
                                className={`mt-1 w-20 px-2 py-1 border text-sm rounded ${hasFieldError ? "border-red-500" : "border-gray-300"}`}
                              />
                            </div>
                            <div className={`text-xs mt-1 ${isFull ? "text-red-600 font-semibold" : "text-gray-600"}`}>
                              {/* {booked}/{max} {isFull ? "(Slot Full)" : "Available"} */}
                            </div>
                          </>
                        )}
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={() => handleToggle(date, slot)}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 relative"></div>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            {Object.keys(dateFieldErrors).length > 0 && (
              <p className="text-red-600 text-sm px-4 pb-2">
                Please set Max Bookings for all enabled slots on this date.
              </p>
            )}

            <button
              onClick={() => saveSlotsToBackend(date)}
              disabled={saving}
              className={`w-full mt-4 py-2 rounded-lg font-semibold transition ${saving ? "bg-gray-400 text-white" : saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
            >
              {saving ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Saving...
                </span>
              ) : saved ? (
                <span className="flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" /> Saved!
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Save className="w-5 h-5 mr-2" />
                  Save for {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default LaundrymanDashboard;
