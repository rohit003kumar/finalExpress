import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader, Circle } from '@react-google-maps/api';
import { saveCustomerLocation, getCurrentLocation, calculateDistance } from '../utils/locationUtils';
import { apiFetch } from '../utilss/apifetch';

interface Washerman {
  _id: string;
  name: string;
  contact: string;
  range: number;
  location: {
    lat: number;
    lng: number;
  };
  isAvailable?: boolean;
  availableSlots?: Array<{
    timeRange: string;
    period: string;
    available: number;
    maxCapacity: number;
  }>;
  totalAvailableSlots?: number;
}

const NearbyWashermenWithSlots: React.FC = () => {
  const [customerLocation, setCustomerLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [washermen, setWashermen] = useState<Washerman[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [noWashermenFound, setNoWashermenFound] = useState(false);
  const [selectedWasherman, setSelectedWasherman] = useState<Washerman | null>(null);

  // Google Maps API configuration
  const GOOGLE_LIBRARIES: ("places")[] = ["places"];
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: GOOGLE_LIBRARIES as unknown as string[]
  });

  useEffect(() => {
    // Get user's current location and save to database
    const getLocationAndSave = async () => {
      try {
        const location = await getCurrentLocation();
        setCustomerLocation(location);
        
        // Save customer location to database
        await saveCustomerLocation(location.lat, location.lng);
        
        await fetchNearbyWashermen(location.lat, location.lng);
        setLoading(false);
      } catch (err: any) {
        console.error('Geolocation error:', err);
        setError(err.message || "📍 Location access denied. Please enable GPS and refresh.");
        setLoading(false);
      }
    };

    getLocationAndSave();
  }, []);

  const fetchNearbyWashermen = async (lat: number, lng: number) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching nearby washermen for coordinates:', lat, lng);
      
      const url = selectedDate 
        ? `/api/washer/nearby?lat=${lat}&lng=${lng}&date=${selectedDate}`    
        : `/api/washer/nearby?lat=${lat}&lng=${lng}`;                  
      
      const res = await apiFetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Please sign in to view nearby washermen");
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Received washermen data:', data);
      
      if (Array.isArray(data) && data.length === 0) {
        console.log('No washermen found in the area');
        setNoWashermenFound(true);
      } else {
        console.log(`Found ${data.length} washermen in the area`);
        setWashermen(data);
      }
    } catch (err: any) {
      console.error('Failed to fetch washermen:', err);
      setError(err.message || "❌ Failed to fetch nearby washermen. Please try again.");
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    
    if (customerLocation) {
      fetchNearbyWashermen(customerLocation.lat, customerLocation.lng);
    }
  };

  const handleWashermanSelect = (washerman: Washerman) => {
    setSelectedWasherman(washerman);
  };

  const handleBooking = (washermanId: string, timeSlot: string) => {
    // Navigate to booking page or open booking modal
    console.log(`Booking ${timeSlot} with washerman ${washermanId}`);
    // You can implement booking logic here or navigate to a booking page
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <div className="text-red-600 text-2xl mb-2">⚠️</div>
          <p className="text-red-700 font-medium mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!customerLocation) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-600">Unable to get your location</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <div className="text-red-600 text-2xl mb-2">⚠️</div>
          <p className="text-red-700 font-medium mb-4">Failed to load Google Maps. Please check your internet connection.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Nearby Washermen</h1>
      
      {/* Date Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Select Date for Booking</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min={new Date().toISOString().split('T')[0]}
        />
        {selectedDate && (
          <p className="mt-2 text-sm text-gray-600">
            Showing washermen available on {selectedDate}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Map View</h2>
          <div className="h-96 rounded-lg overflow-hidden">
            <GoogleMap
              center={customerLocation}
              zoom={15}
              mapContainerStyle={{ height: '100%', width: '100%' }}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: true,
                fullscreenControl: false,
              }}
            >
              {/* Customer Marker */}
              <Marker 
                position={customerLocation}
                icon={{
                  url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="12" fill="#3b82f6" stroke="white" stroke-width="3"/>
                      <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">📍</text>
                    </svg>
                  `)
                }}
              />

              {/* Washermen Markers */}
              {washermen.map((washerman) => {
                const isAvailable = selectedDate ? washerman.isAvailable : true;
                const hasSlots = selectedDate ? (washerman.totalAvailableSlots || 0) > 0 : true;
                
                return (
                  <React.Fragment key={washerman._id}>
                    <Marker
                      position={{ lat: washerman.location.lat, lng: washerman.location.lng }}
                      icon={{
                        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="16" r="12" fill="${isAvailable && hasSlots ? '#10b981' : '#6b7280'}" stroke="white" stroke-width="3"/>
                            <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">👕</text>
                          </svg>
                        `)
                      }}
                      title={`${washerman.name} - ${isAvailable && hasSlots ? 'Available' : 'Not Available'}`}
                      onClick={() => handleWashermanSelect(washerman)}
                    />
                    
                    <Circle
                      center={{ lat: washerman.location.lat, lng: washerman.location.lng }}
                      radius={washerman.range}
                      options={{
                        fillColor: isAvailable && hasSlots ? '#10b981' : '#6b7280',
                        fillOpacity: 0.1,
                        strokeColor: isAvailable && hasSlots ? '#10b981' : '#6b7280',
                        strokeOpacity: 0.8,
                        strokeWeight: 2
                      }}
                    />
                  </React.Fragment>
                );
              })}
            </GoogleMap>
          </div>
        </div>

        {/* Washermen List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Available Washermen</h2>
          
          {washermen.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">🏠</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Washermen Found</h3>
              <p className="text-gray-600 text-sm">
                {selectedDate 
                  ? `No washermen available in your area on ${selectedDate}. Try a different date.`
                  : 'There are no washermen available in your area at the moment.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {washermen.map((washerman) => {
                const isAvailable = selectedDate ? washerman.isAvailable : true;
                const hasSlots = selectedDate ? (washerman.totalAvailableSlots || 0) > 0 : true;
                
                return (
                  <div 
                    key={washerman._id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedWasherman?._id === washerman._id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    } ${!isAvailable || !hasSlots ? 'opacity-50' : ''}`}
                    onClick={() => handleWashermanSelect(washerman)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{washerman.name}</h3>
                        <p className="text-sm text-gray-500">{washerman.contact}</p>
                        <p className="text-sm text-gray-500">Range: {washerman.range}m</p>
                        
                        {selectedDate && (
                          <div className="mt-2">
                            {isAvailable && hasSlots ? (
                              <div>
                                <p className="text-sm text-green-600 font-medium">
                                  ✅ Available ({washerman.totalAvailableSlots} slots)
                                </p>
                                {washerman.availableSlots && washerman.availableSlots.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-xs text-gray-500 mb-1">Available slots:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {washerman.availableSlots.slice(0, 3).map((slot, index) => (
                                        <span 
                                          key={index}
                                          className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                                        >
                                          {slot.timeRange}
                                        </span>
                                      ))}
                                      {washerman.availableSlots.length > 3 && (
                                        <span className="text-xs text-gray-500">
                                          +{washerman.availableSlots.length - 3} more
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-red-600 font-medium">
                                ❌ Not available on {selectedDate}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {isAvailable && hasSlots && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBooking(washerman._id, 'any');
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Book Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Selected Washerman Details */}
      {selectedWasherman && selectedDate && selectedWasherman.availableSlots && selectedWasherman.availableSlots.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Book with {selectedWasherman.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedWasherman.availableSlots.map((slot, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="text-center">
                  <h3 className="font-medium text-gray-900">{slot.timeRange}</h3>
                  <p className="text-sm text-gray-500">{slot.period}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Available: {slot.available} of {slot.maxCapacity}
                  </p>
                  <button
                    onClick={() => handleBooking(selectedWasherman._id, slot.timeRange)}
                    className="mt-3 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                  >
                    Book This Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NearbyWashermenWithSlots; 