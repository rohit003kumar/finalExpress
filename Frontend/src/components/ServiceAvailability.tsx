import React, { useState, useEffect } from 'react';
import { MapPin, AlertCircle, CheckCircle, Info, Loader, Users, Package } from 'lucide-react';
import axios from 'axios';

interface ServiceAvailabilityProps {
  customerLocation: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  onServicesFound: (services: any[]) => void;
  onNoServices: () => void;
}

interface AvailabilityData {
  success: boolean;
  customerLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  availability: {
    servicesAvailable: boolean;
    totalServices: number;
    totalWashermen: number;
    inRangeWashermen: number;
    outOfRangeWashermen: number;
  };
  services: any[];
  message: string;
  suggestion?: string;
}

const ServiceAvailability: React.FC<ServiceAvailabilityProps> = ({
  customerLocation,
  onServicesFound,
  onNoServices
}) => {
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (customerLocation) {
      checkServiceAvailability();
    }
  }, [customerLocation]);

  const checkServiceAvailability = async () => {
    if (!customerLocation) return;

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to check service availability');
        setIsLoading(false);
        return;
      }

      const response = await axios.post('/api/location/check-availability', {
        lat: customerLocation.lat,
        lng: customerLocation.lng,
        address: customerLocation.address
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
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
      setIsLoading(false);
    }
  };

  if (!customerLocation) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Required</h3>
        <p className="text-gray-600">Please set your location to check service availability</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-center space-x-3">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-700">Checking service availability...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">Error</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={checkServiceAvailability}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!availabilityData) {
    return null;
  }

  const { availability, services, message, suggestion } = availabilityData;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        {availability.servicesAvailable ? (
          <CheckCircle className="w-8 h-8 text-green-600" />
        ) : (
          <AlertCircle className="w-8 h-8 text-orange-600" />
        )}
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {availability.servicesAvailable ? 'Services Available' : 'No Services Available'}
          </h3>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
      </div>

      {/* Location Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <MapPin className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Your Location</span>
        </div>
        <p className="text-gray-800">{customerLocation.address}</p>
      </div>

      {/* Availability Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">{availability.totalServices}</div>
          <div className="text-xs text-blue-700">Total Services</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">{availability.inRangeWashermen}</div>
          <div className="text-xs text-green-700">In Range</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-900">{availability.outOfRangeWashermen}</div>
          <div className="text-xs text-orange-700">Out of Range</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Users className="w-6 h-6 text-gray-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{availability.totalWashermen}</div>
          <div className="text-xs text-gray-700">Total Found</div>
        </div>
      </div>

      {/* Services Available */}
      {availability.servicesAvailable && services.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Services</h4>
          <div className="space-y-3">
            {services.slice(0, 3).map((service, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{service.title}</p>
                  <p className="text-sm text-gray-600">
                    by {service.washerman.name} • {service.washerman.distance}m away
                  </p>
                </div>
              </div>
            ))}
            {services.length > 3 && (
              <p className="text-sm text-gray-600 text-center">
                +{services.length - 3} more services available
              </p>
            )}
          </div>
        </div>
      )}

      {/* Suggestion */}
      {suggestion && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Suggestion</h4>
              <p className="text-sm text-blue-800">{suggestion}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-6">
        <button
          onClick={checkServiceAvailability}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Availability
        </button>
        {!availability.servicesAvailable && (
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Try Different Location
          </button>
        )}
      </div>
    </div>
  );
};

export default ServiceAvailability;
