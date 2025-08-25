import React, { useState } from 'react';
import { MapPin, Plus, RefreshCw, Database } from 'lucide-react';
import { apiFetch } from '../utilss/apifetch';

interface MapTestProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const MapTest: React.FC<MapTestProps> = ({ onLocationSelect }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [savedWashermen, setSavedWashermen] = useState<any[]>([]);
  const [showSavedData, setShowSavedData] = useState(false);

  const createSampleData = async () => {
    setLoading(true);
    setMessage('');

    try {
      // Get current location first
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const response = await apiFetch('/api/washer/sample', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lat, lng })
          });

          if (response.ok) {
            const data = await response.json();
            setMessage(`✅ Created ${data.count} sample washermen around your location!`);
            onLocationSelect(lat, lng);
          } else {
            setMessage('❌ Failed to create sample data');
          }
        },
        (error) => {
          setMessage('❌ Unable to get your location');
        }
      );
    } catch (error) {
      setMessage('❌ Error creating sample data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedWashermen = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await apiFetch('/api/washer/all-locations');
      
      if (response.ok) {
        const data = await response.json();
        setSavedWashermen(data.washermen || []);
        setMessage(`✅ Found ${data.count} washermen with saved locations`);
        setShowSavedData(true);
      } else {
        setMessage('❌ Failed to fetch saved washermen');
      }
    } catch (error) {
      setMessage('❌ Error fetching saved washermen');
    } finally {
      setLoading(false);
    }
  };

  const testScheduleSaving = async () => {
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('❌ Please login first to test schedule saving');
        return;
      }

      const testSlots = [
        {
          timeRange: "09:00-10:00",
          enabled: true,
          maxCapacity: 5,
          currentBookings: 0
        },
        {
          timeRange: "10:00-11:00",
          enabled: false,
          maxCapacity: 10,
          currentBookings: 0
        }
      ];

      const response = await apiFetch('/api/slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          slots: testSlots
        })
      });

      if (response.ok) {
        setMessage('✅ Test schedule saved successfully! Check the Schedule page.');
      } else {
        const errorData = await response.json();
        setMessage(`❌ Failed to save test schedule: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage('❌ Error testing schedule saving');
    } finally {
      setLoading(false);
    }
  };

  const clearMessage = () => {
    setMessage('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🧪 Map Testing Tools</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <button
          onClick={createSampleData}
          disabled={loading}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 mr-2" />
          {loading ? 'Creating...' : 'Create Sample Washermen'}
        </button>

        <button
          onClick={fetchSavedWashermen}
          disabled={loading}
          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Database className="w-4 h-4 mr-2" />
          {loading ? 'Loading...' : 'View Saved Locations'}
        </button>

        <button
          onClick={testScheduleSaving}
          disabled={loading}
          className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {loading ? 'Testing...' : 'Test Schedule Saving'}
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">{message}</span>
            <button onClick={clearMessage} className="text-blue-600 hover:text-blue-800">
              ✕
            </button>
          </div>
        </div>
      )}

      {showSavedData && savedWashermen.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-gray-900 mb-2">📍 Saved Washermen Locations:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedWashermen.map((washerman) => (
              <div key={washerman._id} className="p-3 bg-gray-50 rounded-lg border">
                <h5 className="font-medium text-gray-900">{washerman.name}</h5>
                <p className="text-sm text-gray-600">📞 {washerman.contact}</p>
                <p className="text-sm text-gray-600">📧 {washerman.email}</p>
                <p className="text-sm text-gray-600">
                  📍 {washerman.location.lat.toFixed(6)}, {washerman.location.lng.toFixed(6)}
                </p>
                <p className="text-sm text-gray-600">🎯 Range: {washerman.range}m</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSavedData && savedWashermen.length === 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">No washermen with saved locations found. Create some sample data first!</p>
        </div>
      )}
    </div>
  );
};

export default MapTest; 