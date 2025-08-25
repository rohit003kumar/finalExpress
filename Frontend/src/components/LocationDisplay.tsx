import React from 'react';
import { MapPin, Edit3, Navigation } from 'lucide-react';
import { formatAddressForDisplay } from '../utils/geocodingService';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface LocationDisplayProps {
  location: Location | null;
  onEditLocation?: () => void;
  showEditButton?: boolean;
  className?: string;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({
  location,
  onEditLocation,
  showEditButton = true,
  className = ""
}) => {
  if (!location) {
    return (
      <div className={`flex items-center space-x-2 text-gray-500 ${className}`}>
        <MapPin className="w-4 h-4" />
        <span className="text-sm">No location set</span>
        {showEditButton && onEditLocation && (
          <button
            onClick={onEditLocation}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Set Location
          </button>
        )}
      </div>
    );
  }

  const displayAddress = formatAddressForDisplay(location.address, 60);

  return (
    <div className={`flex items-start space-x-2 ${className}`}>
      <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <Navigation className="w-3 h-3 text-gray-400" />
          <span className="text-sm font-medium text-gray-900">Current Location</span>
        </div>
        <p className="text-sm text-gray-600 mt-1" title={location.address}>
          {displayAddress}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </p>
      </div>
      {showEditButton && onEditLocation && (
        <button
          onClick={onEditLocation}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium p-1 hover:bg-blue-50 rounded transition-colors"
          title="Change location"
        >
          <Edit3 className="w-3 h-3" />
          <span className="hidden sm:inline">Change</span>
        </button>
      )}
    </div>
  );
};

export default LocationDisplay;
