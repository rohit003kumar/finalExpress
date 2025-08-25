import React from 'react';
import { MapPin, Edit3, Navigation } from 'lucide-react';

interface LocationBannerProps {
  customerLocation: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  onLocationChange: () => void;
  isLoggedIn: boolean;
}

const LocationBanner: React.FC<LocationBannerProps> = ({
  customerLocation,
  onLocationChange,
  isLoggedIn
}) => {
  if (!isLoggedIn) {
    return null;
  }

  if (!customerLocation) {
    return (
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-yellow-800">Location not set</span>
          </div>
          <button
            onClick={onLocationChange}
            className="text-yellow-600 text-sm font-medium hover:text-yellow-700 flex items-center space-x-1"
          >
            <Navigation className="w-4 h-4" />
            <span>Set Location</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <span className="text-sm text-blue-800 font-medium">Delivering to:</span>
            <span className="text-sm text-blue-700 ml-1 truncate block sm:inline">
              {customerLocation.address}
            </span>
          </div>
        </div>
        <button
          onClick={onLocationChange}
          className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center space-x-1 ml-4 flex-shrink-0"
        >
          <Edit3 className="w-4 h-4" />
          <span className="hidden sm:inline">Change</span>
        </button>
      </div>
    </div>
  );
};

export default LocationBanner;
