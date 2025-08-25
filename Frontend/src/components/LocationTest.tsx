import React, { useState, useEffect } from 'react';
import { saveCustomerLocation, getCurrentLocation, getCustomerSavedLocation } from '../utils/locationUtils';

const LocationTest: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [savedLocation, setSavedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGetCurrentLocation = async () => {
    setLoading(true);
    setStatus('Getting current location...');
    
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      setStatus('Current location obtained successfully!');
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!currentLocation) {
      setStatus('Please get current location first');
      return;
    }

    setLoading(true);
    setStatus('Saving location to database...');
    
    try {
      const success = await saveCustomerLocation(currentLocation.lat, currentLocation.lng);
      if (success) {
        setStatus('Location saved to database successfully!');
        // Refresh saved location
        const saved = await getCustomerSavedLocation();
        setSavedLocation(saved);
      } else {
        setStatus('Failed to save location to database');
      }
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSavedLocation = async () => {
    setLoading(true);
    setStatus('Getting saved location from database...');
    
    try {
      const location = await getCustomerSavedLocation();
      if (location) {
        setSavedLocation(location);
        setStatus('Saved location retrieved successfully!');
      } else {
        setStatus('No saved location found in database');
      }
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to get saved location on component mount
    handleGetSavedLocation();
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">📍 Location Test</h2>
      
      <div className="space-y-4">
        {/* Current Location Section */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Current Location</h3>
          {currentLocation ? (
            <div className="text-sm text-gray-600">
              <p>Latitude: {currentLocation.lat.toFixed(6)}</p>
              <p>Longitude: {currentLocation.lng.toFixed(6)}</p>
            </div>
          ) : (
            <p className="text-gray-500">No current location</p>
          )}
          <button
            onClick={handleGetCurrentLocation}
            disabled={loading}
            className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Get Current Location
          </button>
        </div>

        {/* Saved Location Section */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Saved Location (Database)</h3>
          {savedLocation ? (
            <div className="text-sm text-gray-600">
              <p>Latitude: {savedLocation.lat.toFixed(6)}</p>
              <p>Longitude: {savedLocation.lng.toFixed(6)}</p>
            </div>
          ) : (
            <p className="text-gray-500">No saved location</p>
          )}
          <button
            onClick={handleGetSavedLocation}
            disabled={loading}
            className="mt-2 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Get Saved Location
          </button>
        </div>

        {/* Save Location Button */}
        <button
          onClick={handleSaveLocation}
          disabled={loading || !currentLocation}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Save Current Location to Database
        </button>

        {/* Status */}
        {status && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-700">{status}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Instructions:</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Click "Get Current Location" to get your GPS coordinates</li>
            <li>2. Click "Save Current Location to Database" to save it</li>
            <li>3. Click "Get Saved Location" to retrieve from database</li>
            <li>4. Check the status messages for feedback</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default LocationTest; 