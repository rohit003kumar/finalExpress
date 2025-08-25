import React, { useState, useEffect } from 'react';
import { saveCustomerLocation, getCurrentLocation, getCustomerSavedLocation } from '../utils/locationUtils';
import { apiFetch } from '../utilss/apifetch';

const LocationDebug: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [savedLocation, setSavedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  // Check if user is logged in
  const checkUserAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setStatus('No authentication token found. Please sign in first.');
      return;
    }

    try {
      const res = await apiFetch('/api/user/currentuser', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        const userData = await res.json();
        setUserInfo(userData);
        setStatus(`Logged in as: ${userData.name} (${userData.email})`);
        console.log('User info:', userData);
      } else {
        setStatus('Authentication failed. Please sign in again.');
      }
    } catch (err) {
      setStatus('Error checking authentication');
      console.error('Auth error:', err);
    }
  };

  const handleGetCurrentLocation = async () => {
    setLoading(true);
    setStatus('Getting current location...');
    
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      setStatus(`Current location obtained: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
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
        setTimeout(() => {
          handleGetSavedLocation();
        }, 1000);
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
        setStatus(`Saved location retrieved: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
      } else {
        setStatus('No saved location found in database');
      }
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSave = async () => {
    setLoading(true);
    setStatus('Auto-saving location...');
    
    try {
      // Get current location
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      
      // Save to database
      const success = await saveCustomerLocation(location.lat, location.lng);
      if (success) {
        setStatus('Location auto-saved successfully!');
        // Get saved location
        const saved = await getCustomerSavedLocation();
        setSavedLocation(saved);
      } else {
        setStatus('Failed to auto-save location');
      }
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication on mount
    checkUserAuth();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">🔍 Location Debug</h2>
      
      {/* Authentication Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Authentication Status</h3>
        {userInfo ? (
          <div className="text-sm text-gray-600">
            <p><strong>Name:</strong> {userInfo.name}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Role:</strong> {userInfo.role}</p>
            <p><strong>Current Location in DB:</strong> {userInfo.location?.coordinates ? 
              `${userInfo.location.coordinates[1].toFixed(6)}, ${userInfo.location.coordinates[0].toFixed(6)}` : 
              'Not set'}</p>
          </div>
        ) : (
          <p className="text-red-600">Not authenticated</p>
        )}
        <button
          onClick={checkUserAuth}
          className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Refresh Auth Status
        </button>
      </div>

      <div className="space-y-4">
        {/* Current Location Section */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Current GPS Location</h3>
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

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleSaveLocation}
            disabled={loading || !currentLocation}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            Save Current Location to Database
          </button>
          
          <button
            onClick={handleAutoSave}
            disabled={loading}
            className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 disabled:opacity-50"
          >
            Auto-Save Location (Get + Save)
          </button>
        </div>

        {/* Status */}
        {status && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-700">{status}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Debug Instructions:</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Check authentication status first</li>
            <li>2. Use "Auto-Save Location" to test the complete flow</li>
            <li>3. Check browser console for detailed logs</li>
            <li>4. Verify location is saved in database</li>
            <li>5. Check backend console for server-side logs</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default LocationDebug; 