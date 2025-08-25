import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import axios from 'axios';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSet: (location: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  } | null;
}

interface LocationSuggestion {
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  };
}

const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  onLocationSet,
  currentLocation
}) => {
  const [locationMethod, setLocationMethod] = useState<'current' | 'manual'>('current');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    if (!isOpen) {
      setError('');
      setSuccess('');
      setManualAddress('');
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  }, [isOpen]);

  const handleDetectCurrentLocation = async () => {
    if (!isLoggedIn) {
      setError('Please log in to use location services');
      return;
    }

    setIsDetectingLocation(true);
    setError('');
    setSuccess('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Get address from coordinates
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=fbddd9ac0aff4feb840edc8d63a8f264`
          );
          const data = await response.json();

          const address = data.results.length > 0
            ? data.results[0].formatted
            : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

          const location = {
            lat: latitude,
            lng: longitude,
            address,
          };

          // Save to backend
          const token = localStorage.getItem('token');
          if (token) {
            try {
              await axios.post('/api/user/location', {
                lat: latitude,
                lng: longitude,
                address: address
              }, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              });
            } catch (error) {
              console.error('Failed to save location to backend:', error);
            }
          }

          // Save to localStorage
          localStorage.setItem('customerLocation', JSON.stringify(location));
          
          setSuccess('Location detected successfully!');
          setTimeout(() => {
            onLocationSet(location);
            onClose();
          }, 1500);

        } catch (error) {
          console.error('Geocoding error:', error);
          setError('Failed to get address from coordinates');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.error('Location error:', error.message);
        let errorMessage = 'Could not detect location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please try again.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }
        
        setError(errorMessage);
        setIsDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleAddressSearch = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearchingAddress(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=fbddd9ac0aff4feb840edc8d63a8f264&limit=5`
      );
      const data = await response.json();

      if (data.results) {
        setAddressSuggestions(data.results);
        setShowSuggestions(true);
      } else {
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Address search error:', error);
      setError('Failed to search for addresses');
    } finally {
      setIsSearchingAddress(false);
    }
  };

  const handleAddressSelect = async (suggestion: LocationSuggestion) => {
    setIsSearchingAddress(true);
    setError('');
    setSuccess('');

    try {
      const location = {
        lat: suggestion.geometry.lat,
        lng: suggestion.geometry.lng,
        address: suggestion.formatted,
      };

      // Save to backend
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios.post('/api/user/location', {
            lat: location.lat,
            lng: location.lng,
            address: location.address
          }, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.error('Failed to save location to backend:', error);
        }
      }

      // Save to localStorage
      localStorage.setItem('customerLocation', JSON.stringify(location));
      
      setSuccess('Location set successfully!');
      setManualAddress(suggestion.formatted);
      setShowSuggestions(false);
      
      setTimeout(() => {
        onLocationSet(location);
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Error setting location:', error);
      setError('Failed to set location');
    } finally {
      setIsSearchingAddress(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!manualAddress.trim()) {
      setError('Please enter an address');
      return;
    }

    setIsSearchingAddress(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(manualAddress)}&key=fbddd9ac0aff4feb840edc8d63a8f264&limit=1`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const location = {
          lat: result.geometry.lat,
          lng: result.geometry.lng,
          address: result.formatted,
        };

        // Save to backend
        const token = localStorage.getItem('token');
        if (token) {
          try {
            await axios.post('/api/user/location', {
              lat: location.lat,
              lng: location.lng,
              address: location.address
            }, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            });
          } catch (error) {
            console.error('Failed to save location to backend:', error);
          }
        }

        // Save to localStorage
        localStorage.setItem('customerLocation', JSON.stringify(location));
        
        setSuccess('Location set successfully!');
        setTimeout(() => {
          onLocationSet(location);
          onClose();
        }, 1500);

      } else {
        setError('Address not found. Please try a different address.');
      }
    } catch (error) {
      console.error('Manual location error:', error);
      setError('Failed to find location. Please try again.');
    } finally {
      setIsSearchingAddress(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Set Your Location</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isLoggedIn && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <p className="text-yellow-800 text-sm">
                  Please log in to save your location and get personalized services.
                </p>
              </div>
            </div>
          )}

          {/* Current Location Display */}
          {currentLocation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-blue-800 font-medium">Current Location</span>
              </div>
              <p className="text-blue-700 text-sm">{currentLocation.address}</p>
            </div>
          )}

          {/* Method Selection */}
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setLocationMethod('current')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                locationMethod === 'current'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Navigation className="w-4 h-4 inline mr-2" />
              Current Location
            </button>
            <button
              onClick={() => setLocationMethod('manual')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                locationMethod === 'manual'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Search className="w-4 h-4 inline mr-2" />
              Manual Address
            </button>
          </div>

          {/* Current Location Method */}
          {locationMethod === 'current' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Detect Your Current Location
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  We'll use your device's GPS to find your exact location
                </p>
              </div>

              <button
                onClick={handleDetectCurrentLocation}
                disabled={isDetectingLocation}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isDetectingLocation ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Detecting Location...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-5 h-5" />
                    <span>Detect My Location</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Manual Address Method */}
          {locationMethod === 'manual' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Enter Your Address
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Type your address and we'll find the exact location
                </p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={manualAddress}
                  onChange={(e) => {
                    setManualAddress(e.target.value);
                    handleAddressSearch(e.target.value);
                  }}
                  placeholder="Enter your address (e.g., 123 Main St, City, State)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSearchingAddress}
                />
                {isSearchingAddress && (
                  <Loader className="w-5 h-5 animate-spin absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                )}
              </div>

              {/* Address Suggestions */}
              {showSuggestions && addressSuggestions.length > 0 && (
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                  {addressSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleAddressSelect(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <p className="text-sm text-gray-900">{suggestion.formatted}</p>
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={handleManualSubmit}
                disabled={!manualAddress.trim() || isSearchingAddress}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSearchingAddress ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Setting Location...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5" />
                    <span>Set Location</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
