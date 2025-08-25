import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import type { Library } from '@googlemaps/js-api-loader';
// Keep Google libraries as a stable reference to avoid LoadScript reloads
const GOOGLE_LIBRARIES: Library[] = ['places'];

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface Washerman {
  _id: string;
  name: string;
  contact: string;
  range: number;
  location: {
    lat: number;
    lng: number;
  };
  distance?: number;
}

interface Service {
  _id: string;
  title: string;
  name: string;
  category: string;
  description: string;
  image: string;
  options: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  washerman: Washerman;
}

interface ServiceAvailabilityResponse {
  success: boolean;
  customerLocation: Location;
  availability: {
    servicesAvailable: boolean;
    totalServices: number;
    totalWashermen: number;
    inRangeWashermen: number;
    outOfRangeWashermen: number;
  };
  services: Service[];
  message: string;
  suggestion?: string;
}

interface LocationBasedServiceFilterProps {
  onServicesFound: (services: Service[]) => void;
  onNoServices: () => void;
  onLocationSet: (location: Location) => void;
  startInMap?: boolean; // If true, open directly in map selection mode
}

const LocationBasedServiceFilter: React.FC<LocationBasedServiceFilterProps> = ({
  onServicesFound,
  onNoServices,
  onLocationSet,
  startInMap = false
}) => {
  const [customerLocation, setCustomerLocation] = useState<Location | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityData, setAvailabilityData] = useState<ServiceAvailabilityResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [manualAddress, setManualAddress] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Default to India center
  const [selectedMapLocation, setSelectedMapLocation] = useState<Location | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  interface AddressDetails {
    houseNumber?: string;
    street?: string;
    landmark?: string;
    city?: string;
    state?: string;
    zip?: string;
  }

  const [addressDetails, setAddressDetails] = useState<AddressDetails>({});
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  const deriveAddressDetails = (addr: any): AddressDetails => {
    if (!addr) return {};
    const streetParts = [addr.road, addr.suburb, addr.neighbourhood].filter(Boolean);
    return {
      houseNumber: addr.house_number || '',
      street: streetParts.join(', '),
      landmark: addr.landmark || addr.public_building || '',
      city: addr.city || addr.town || addr.village || addr.county || '',
      state: addr.state || '',
      zip: addr.postcode || ''
    };
  };

  const validateAddressDetails = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!addressDetails.houseNumber?.trim()) {
      newErrors.houseNumber = 'House/Flat/Block No. is required';
    }

    if (!addressDetails.street?.trim()) {
      newErrors.street = 'Street/Area is required';
    }

    if (!addressDetails.city?.trim()) {
      newErrors.city = 'City is required';
    }

    if (!addressDetails.state?.trim()) {
      newErrors.state = 'State is required';
    }

    if (!addressDetails.zip?.trim() || addressDetails.zip?.length !== 6) {
      newErrors.zip = 'Valid 6-digit pincode is required';
    }

    setAddressErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Google Maps API configuration
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: GOOGLE_LIBRARIES,
  });

  // Check for saved location on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('customerLocation');
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        setCustomerLocation(location);
        // When in change-location mode, do NOT auto close by firing callbacks
        if (!startInMap) {
          onLocationSet(location);
          checkServiceAvailability(location);
        }
      } catch (err) {
        console.error('Error parsing saved location:', err);
      }
    }
    // If invoked from "Change Location", open the map directly and center
    if (startInMap) {
      setShowMap(true);
      if (savedLocation) {
        try {
          const location = JSON.parse(savedLocation);
          setMapCenter({ lat: location.lat, lng: location.lng });
        } catch {}
      }
    }
  }, [startInMap]);

  // Check service availability when location changes
  useEffect(() => {
    if (customerLocation) {
      checkServiceAvailability(customerLocation);
    }
  }, [customerLocation]);

  const detectCurrentLocation = async () => {
    setIsDetectingLocation(true);
    setError('');

    try {
      // Use improved geocoding service with multiple fallbacks
      const { getCurrentLocation } = await import('../utils/geocodingService');
      
      const location = await getCurrentLocation();
      
      setCustomerLocation(location);
      onLocationSet(location);
      
      // Try to get detailed address information for form prefilling
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        setAddressDetails(deriveAddressDetails(data.address));
      } catch (err) {
        console.warn('Could not get detailed address info:', err);
        setAddressDetails({});
      }
      
      setShowAddressForm(true);
      localStorage.setItem('customerLocation', JSON.stringify(location));
      
    } catch (err: any) {
      console.error('Location detection error:', err);
      setError(err.message || 'Unable to detect your location. Please try manual address input.');
      setShowManualInput(true);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const saveLocationToBackend = async (location: Location, details?: AddressDetails) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // Create detailed address format for orders
      const detailedAddress = details ? {
        houseNo: details.houseNumber || '',
        street: details.street || '',
        landmark: details.landmark || '',
        city: details.city || '',
        state: details.state || '',
        pincode: details.zip || '',
        fullAddress: [
          details.houseNumber,
          details.street,
          details.landmark,
          details.city,
          details.state,
          details.zip
        ].filter(Boolean).join(', '),
        coordinates: {
          lat: location.lat,
          lng: location.lng
        }
      } : null;

      // Save to backend with detailed address
      await axios.post('/api/user/location', {
        lat: location.lat,
        lng: location.lng,
        address: details
          ? {
              street: [details.houseNumber, details.street, details.landmark]
                .filter(Boolean)
                .join(', '),
              city: details.city,
              state: details.state,
              zip: details.zip,
            }
          : location.address,
        deliveryAddress: detailedAddress // Save detailed address for orders
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Also save to localStorage for order creation
      if (detailedAddress) {
        localStorage.setItem('deliveryAddress', JSON.stringify(detailedAddress));
      }
    } catch (err) {
      console.error('Failed to save location to backend:', err);
    }
  };

  const checkServiceAvailability = async (location: Location) => {
    setIsCheckingAvailability(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to check service availability');
      setIsCheckingAvailability(false);
      return;
    }

    try {
      // Match backend mount: app.use('/api', require('./routes/location.route'))
      const response = await axios.post('/api/check-availability', {
        lat: location.lat,
        lng: location.lng,
        address: location.address
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data: ServiceAvailabilityResponse = response.data;
      setAvailabilityData(data);

      if (data.availability.servicesAvailable) {
        onServicesFound(data.services);
      } else {
        onNoServices();
      }

    } catch (err: any) {
      console.error('Error checking service availability:', err);
      setError(err.response?.data?.message || 'Failed to check service availability');
      onNoServices();
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleManualAddressSubmit = async () => {
    if (!manualAddress.trim()) {
      setError('Please enter an address');
      return;
    }

    setIsCheckingAvailability(true);
    setError('');

    try {
      // Geocode the address
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(manualAddress)}`
      );
      const data = await response.json();

      if (data.length === 0) {
        setError('Address not found. Please try a different address.');
        setIsCheckingAvailability(false);
        return;
      }

      const result = data[0];
      const location: Location = {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        address: result.display_name
      };

      setCustomerLocation(location);
      onLocationSet(location);
      setAddressDetails(deriveAddressDetails(result.address));
      setShowAddressForm(true);
      localStorage.setItem('customerLocation', JSON.stringify(location));
      setShowManualInput(false);

    } catch (err) {
      console.error('Error geocoding address:', err);
      setError('Failed to process address. Please try again.');
      setIsCheckingAvailability(false);
    }
  };

  const resetLocation = () => {
    setCustomerLocation(null);
    setAvailabilityData(null);
    setError('');
    setManualAddress('');
    setShowManualInput(false);
    setShowMap(false);
    setSelectedMapLocation(null);
    localStorage.removeItem('customerLocation');
  };

  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      try {
        // Get address from coordinates using reverse geocoding
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        
        const location: Location = {
          lat: lat,
          lng: lng,
          address: data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
        };

        setSelectedMapLocation(location);
        setAddressDetails(deriveAddressDetails(data.address));
      } catch (err) {
        console.error('Error getting address:', err);
        const location: Location = {
          lat: lat,
          lng: lng,
          address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
        };
        setSelectedMapLocation(location);
        setAddressDetails({});
      }
    }
  };

  const confirmMapLocation = () => {
    if (selectedMapLocation) {
      setCustomerLocation(selectedMapLocation);
      onLocationSet(selectedMapLocation);
      setShowAddressForm(true);
    }
  };

  // Leaflet fallback click handler
  // no-op: if Google Map fails to load we will show a static fallback UI

  if (!customerLocation) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">📍 Set Your Location</h2>
          <p className="text-gray-600">We need your location to show you available laundry services</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={detectCurrentLocation}
            disabled={isDetectingLocation}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isDetectingLocation ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Detecting Location...
              </>
            ) : (
              <>
                📍 Detect My Location
              </>
            )}
          </button>

          <div className="text-center">
            <span className="text-gray-500">or</span>
          </div>

          <button
            onClick={() => setShowManualInput(true)}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200"
          >
            📝 Enter Address Manually
          </button>

          <button
            onClick={() => setShowMap(true)}
            className="w-full bg-green-100 text-green-700 py-3 px-4 rounded-lg hover:bg-green-200"
          >
            🗺️ Select from Map
          </button>
        </div>

        {showManualInput && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <input
              type="text"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              placeholder="Enter your address..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-3"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleManualAddressSubmit}
                disabled={isCheckingAvailability}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isCheckingAvailability ? 'Checking...' : 'Submit'}
              </button>
              <button
                onClick={() => setShowManualInput(false)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showMap && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🗺️ Select Location from Map</h3>
              <p className="text-sm text-gray-600 mb-4">
                Click anywhere on the map to select your location. The selected location will be highlighted.
              </p>
            </div>
            
        {!isLoaded || loadError ? (
          <div className="h-96 md:h-[480px] bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
            <div className="text-center px-4">
              <p className="text-gray-700 mb-1">Map unavailable.</p>
              <p className="text-sm text-gray-500">Please use Detect Location or Enter Address Manually.</p>
            </div>
          </div>
        ) : (
          <div className="h-96 md:h-[480px] rounded-lg overflow-hidden border border-gray-300">
            <GoogleMap
              center={mapCenter}
              zoom={12}
              mapContainerStyle={{ height: '100%', width: '100%' }}
              onClick={handleMapClick}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: true,
                fullscreenControl: false,
              }}
            >
              {selectedMapLocation && (
                <Marker
                  position={{ lat: selectedMapLocation.lat, lng: selectedMapLocation.lng }}
                  icon={{
                    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="12" fill="#ef4444" stroke="white" stroke-width="3"/>
                        <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">📍</text>
                      </svg>
                    `)
                  }}
                />
              )}
            </GoogleMap>
          </div>
        )}

          {selectedMapLocation && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">Selected Location:</p>
                <p className="text-sm text-blue-700 mb-3">{selectedMapLocation.address}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={confirmMapLocation}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                  >
                    ✅ Confirm This Location
                  </button>
                  <button
                    onClick={() => setSelectedMapLocation(null)}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                  >
                    🔄 Reselect
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setShowMap(false);
                  setSelectedMapLocation(null);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">📍 Your Location</h2>
          <p className="text-gray-600">{customerLocation.address}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowMap(true)}
            className="text-blue-600 hover:text-blue-700 px-3 py-1 rounded border border-blue-300 hover:border-blue-400"
            title="Change location on map"
          >
            🗺️ Change on Map
          </button>
          <button
            onClick={resetLocation}
            className="text-gray-500 hover:text-gray-700"
            title="Reset location"
          >
            🔄
          </button>
        </div>
      </div>

      {isCheckingAvailability ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking service availability in your area...</p>
        </div>
      ) : availabilityData ? (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${
            availabilityData.availability.servicesAvailable 
              ? 'bg-green-100 border border-green-400' 
              : 'bg-yellow-100 border border-yellow-400'
          }`}>
            <div className="flex items-center mb-2">
              {availabilityData.availability.servicesAvailable ? (
                <span className="text-green-600 text-xl mr-2">✅</span>
              ) : (
                <span className="text-yellow-600 text-xl mr-2">⚠️</span>
              )}
              <h3 className="font-semibold text-gray-900">
                {availabilityData.availability.servicesAvailable 
                  ? 'Services Available!' 
                  : 'No Services Available'
                }
              </h3>
            </div>
            <p className="text-gray-700">{availabilityData.message}</p>
            
            {availabilityData.availability.servicesAvailable && (
              <div className="mt-3 text-sm text-gray-600">
                <p>📊 Found {availabilityData.availability.totalServices} services</p>
                <p>👥 From {availabilityData.availability.inRangeWashermen} washermen in your area</p>
              </div>
            )}
            
                      {availabilityData.suggestion && (
            <p className="mt-2 text-sm text-gray-600">{availabilityData.suggestion}</p>
          )}
        </div>

        {availabilityData.availability.servicesAvailable && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">🎯 Range-Based Filtering Active</h4>
            <p className="text-sm text-gray-700">
              You're only seeing services from washermen whose service range covers your location. 
              This ensures you can actually receive the services you see.
            </p>
          </div>
        )}
      </div>
    ) : null}

      {/* Address details form (Zomato-like) */}
      {showAddressForm && customerLocation && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Add Address Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <input
                className={`border rounded px-3 py-2 w-full ${addressErrors.houseNumber ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="House/Flat/Block No. *"
                value={addressDetails.houseNumber || ''}
                onChange={(e) => setAddressDetails({ ...addressDetails, houseNumber: e.target.value })}
              />
              {addressErrors.houseNumber && (
                <p className="text-red-500 text-xs mt-1">{addressErrors.houseNumber}</p>
              )}
            </div>
            <div>
              <input
                className={`border rounded px-3 py-2 w-full ${addressErrors.street ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Street / Area *"
                value={addressDetails.street || ''}
                onChange={(e) => setAddressDetails({ ...addressDetails, street: e.target.value })}
              />
              {addressErrors.street && (
                <p className="text-red-500 text-xs mt-1">{addressErrors.street}</p>
              )}
            </div>
            <div>
              <input
                className="border border-gray-300 rounded px-3 py-2 w-full"
                placeholder="Landmark (optional)"
                value={addressDetails.landmark || ''}
                onChange={(e) => setAddressDetails({ ...addressDetails, landmark: e.target.value })}
              />
            </div>
            <div>
              <input
                className={`border rounded px-3 py-2 w-full ${addressErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="City *"
                value={addressDetails.city || ''}
                onChange={(e) => setAddressDetails({ ...addressDetails, city: e.target.value })}
              />
              {addressErrors.city && (
                <p className="text-red-500 text-xs mt-1">{addressErrors.city}</p>
              )}
            </div>
            <div>
              <input
                className={`border rounded px-3 py-2 w-full ${addressErrors.state ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="State *"
                value={addressDetails.state || ''}
                onChange={(e) => setAddressDetails({ ...addressDetails, state: e.target.value })}
              />
              {addressErrors.state && (
                <p className="text-red-500 text-xs mt-1">{addressErrors.state}</p>
              )}
            </div>
            <div>
              <input
                className={`border rounded px-3 py-2 w-full ${addressErrors.zip ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Pincode *"
                value={addressDetails.zip || ''}
                onChange={(e) => setAddressDetails({ ...addressDetails, zip: e.target.value })}
                maxLength={6}
              />
              {addressErrors.zip && (
                <p className="text-red-500 text-xs mt-1">{addressErrors.zip}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={() => setShowAddressForm(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={async () => {
                // Validate address details before proceeding
                if (!validateAddressDetails()) {
                  return;
                }
                
                try {
                  await saveLocationToBackend(customerLocation, addressDetails);
                } catch {}
                // trigger availability check and parent callbacks
                await checkServiceAvailability(customerLocation);
                setShowAddressForm(false);
                setShowMap(false);
                setSelectedMapLocation(null);
              }}
            >
              Save and Continue
            </button>
          </div>
        </div>
      )}

    {/* Map interface for changing location */}
    {showMap && (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">🗺️ Change Location on Map</h3>
          <p className="text-sm text-gray-600 mb-4">
            Click anywhere on the map to select a new location. The selected location will be highlighted.
          </p>
        </div>
        
        {!isLoaded ? (
          <div className="h-96 md:h-[480px] bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        ) : loadError ? (
          <div className="h-96 md:h-[480px] bg-red-50 rounded-lg flex items-center justify-center">
            <p className="text-red-600">Failed to load map. Please try again.</p>
          </div>
        ) : (
          <div className="h-96 md:h-[480px] rounded-lg overflow-hidden border border-gray-300">
            <GoogleMap
              center={customerLocation ? { lat: customerLocation.lat, lng: customerLocation.lng } : mapCenter}
              zoom={15}
              mapContainerStyle={{ height: '100%', width: '100%' }}
              onClick={handleMapClick}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: true,
                fullscreenControl: false,
              }}
            >
              {/* Current location marker */}
              {customerLocation && (
                <Marker
                  position={{ lat: customerLocation.lat, lng: customerLocation.lng }}
                  icon={{
                    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="12" fill="#3b82f6" stroke="white" stroke-width="3"/>
                        <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">📍</text>
                      </svg>
                    `)
                  }}
                />
              )}
              
              {/* New selected location marker */}
              {selectedMapLocation && (
                <Marker
                  position={{ lat: selectedMapLocation.lat, lng: selectedMapLocation.lng }}
                  icon={{
                    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="12" fill="#ef4444" stroke="white" stroke-width="3"/>
                        <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">🎯</text>
                      </svg>
                    `)
                  }}
                />
              )}
            </GoogleMap>
          </div>
        )}

        {selectedMapLocation && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">New Selected Location:</p>
            <p className="text-sm text-blue-700 mb-3">{selectedMapLocation.address}</p>
            <div className="flex space-x-2">
              <button
                onClick={confirmMapLocation}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                ✅ Update to This Location
              </button>
              <button
                onClick={() => setSelectedMapLocation(null)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                🔄 Reselect
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setShowMap(false);
              setSelectedMapLocation(null);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default LocationBasedServiceFilter;

