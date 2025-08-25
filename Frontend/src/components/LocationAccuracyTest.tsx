import React, { useState } from 'react';
import { getCurrentLocation } from '../utils/geocodingService';

interface LocationAccuracyTestProps {
  onLocationSet?: (location: any) => void;
}

const LocationAccuracyTest: React.FC<LocationAccuracyTestProps> = ({ onLocationSet }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testLocationAccuracy = async () => {
    setIsLoading(true);
    setError('');
    setLocationData(null);

    try {
      const location = await getCurrentLocation();
      
      // Get additional accuracy information
      const accuracyInfo = {
        ...location,
        timestamp: new Date().toISOString(),
        accuracy: 'High accuracy mode enabled',
        geocodingServices: 'Multiple fallback services (OpenCage, Nominatim, BigDataCloud)',
        coordinates: `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`,
        precision: '6 decimal places (precision to ~1 meter)'
      };

      setLocationData(accuracyInfo);
      
      if (onLocationSet) {
        onLocationSet(location);
      }

    } catch (err: any) {
      setError(err.message || 'Failed to get location');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">📍 Location Accuracy Test</h3>
      
      <button
        onClick={testLocationAccuracy}
        disabled={isLoading}
        className="w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? '🔍 Detecting Location...' : '🎯 Test Location Accuracy'}
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {locationData && (
        <div className="space-y-3">
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            <strong>✅ Location Detected Successfully!</strong>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-semibold text-gray-800 mb-2">📍 Coordinates</h4>
              <p className="text-sm text-gray-600">{locationData.coordinates}</p>
              <p className="text-xs text-gray-500 mt-1">{locationData.precision}</p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-semibold text-gray-800 mb-2">🏠 Address</h4>
              <p className="text-sm text-gray-600">{locationData.address}</p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-semibold text-gray-800 mb-2">⚙️ Accuracy Settings</h4>
              <p className="text-sm text-gray-600">{locationData.accuracy}</p>
              <p className="text-xs text-gray-500 mt-1">20s timeout, fresh location</p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-semibold text-gray-800 mb-2">🌐 Geocoding</h4>
              <p className="text-sm text-gray-600">{locationData.geocodingServices}</p>
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-semibold text-blue-800 mb-2">📊 Technical Details</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Timestamp:</strong> {locationData.timestamp}</p>
              <p><strong>Latitude:</strong> {locationData.lat.toFixed(8)}</p>
              <p><strong>Longitude:</strong> {locationData.lng.toFixed(8)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <h4 className="font-semibold text-yellow-800 mb-2">💡 Tips for Better Accuracy</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Ensure GPS is enabled on your device</li>
          <li>• Allow location access in browser settings</li>
          <li>• Try outdoors or near windows for better signal</li>
          <li>• Wait a few seconds for GPS to stabilize</li>
          <li>• Use a modern browser with geolocation support</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationAccuracyTest;
