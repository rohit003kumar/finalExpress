import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader, Circle } from '@react-google-maps/api';
import { saveCustomerLocation, getCurrentLocation, calculateDistance } from '../utils/locationUtils';
import { apiFetch } from '../utilss/apifetch';

// Types
type Washerman = {
  _id: string;
  name: string;
  contact: string;
  range?: number;
  location: {
    lat: number;
    lng: number;
  };
};



const NearbyWashermenMap: React.FC = () => {
  const [customerLocation, setCustomerLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [washermen, setWashermen] = useState<Washerman[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [noWashermenFound, setNoWashermenFound] = useState(false);

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
      
      const res = await apiFetch(`/api/washer/nearby?lat=${lat}&lng=${lng}`, {   
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

  if (noWashermenFound) {
    return (
      <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg relative">
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
        </GoogleMap>
        
        {/* Overlay message */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 text-center max-w-sm">
            <div className="text-gray-500 text-4xl mb-4">🏠</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Washermen Found</h3>
            <p className="text-gray-600 text-sm mb-4">
              There are no washermen available in your area at the moment. Please try again later or check back soon.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
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

        {/* Nearby Washermen */}
        {washermen
          .filter(w => w.location?.lat != null && w.location?.lng != null)
          .map((washerman) => {
            const distance = calculateDistance(
              customerLocation.lat,
              customerLocation.lng,
              washerman.location.lat,
              washerman.location.lng
            );

            const inRange = distance <= (washerman.range || 500);

            return (
              <React.Fragment key={washerman._id}>
                <Marker
                  position={{ lat: washerman.location.lat, lng: washerman.location.lng }}
                  icon={{
                    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="12" fill="${inRange ? '#10b981' : '#6b7280'}" stroke="white" stroke-width="3"/>
                        <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">👕</text>
                      </svg>
                    `)
                  }}
                  title={`${washerman.name} - ${distance.toFixed(0)}m away`}
                />
                
                <Circle
                  center={{ lat: washerman.location.lat, lng: washerman.location.lng }}
                  radius={washerman.range || 500}
                  options={{
                    fillColor: inRange ? '#10b981' : '#6b7280',
                    fillOpacity: 0.1,
                    strokeColor: inRange ? '#10b981' : '#6b7280',
                    strokeOpacity: 0.8,
                    strokeWeight: 2
                  }}
                />
              </React.Fragment>
            );
          })}
      </GoogleMap>
    </div>
  );
};

export default NearbyWashermenMap; 