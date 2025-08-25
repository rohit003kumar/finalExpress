import React, { useState, useEffect } from 'react';
import { X, MapPin, Save, ArrowRight } from 'lucide-react';

interface AddressDetails {
  houseNo: string;
  street: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: AddressDetails) => void;
  initialAddress?: Partial<AddressDetails>;
}

export default function AddressModal({
  isOpen,
  onClose,
  onSave,
  initialAddress = {}
}: AddressModalProps) {
  const [address, setAddress] = useState<AddressDetails>({
    houseNo: '',
    street: '',
    landmark: '',
    city: 'Jatani',
    state: 'Odisha',
    pincode: '752054',
    fullAddress: '',
    ...initialAddress
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      // Auto-generate full address when fields change
      const fullAddress = [
        address.houseNo,
        address.street,
        address.landmark,
        address.city,
        address.state,
        address.pincode
      ].filter(Boolean).join(', ');
      
      setAddress(prev => ({ ...prev, fullAddress }));
    }
  }, [address.houseNo, address.street, address.landmark, address.city, address.state, address.pincode, isOpen]);

  const validateAddress = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!address.houseNo.trim()) {
      newErrors.houseNo = 'House/Flat/Block No. is required';
    }

    if (!address.street.trim()) {
      newErrors.street = 'Street/Area is required';
    }

    if (!address.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!address.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!address.pincode.trim() || address.pincode.length !== 6) {
      newErrors.pincode = 'Valid 6-digit pincode is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateAddress()) {
      return;
    }

    setIsLoading(true);
    try {
      // Get current location coordinates if available
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coordinates = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            const addressWithCoords = { ...address, coordinates };
            onSave(addressWithCoords);
          },
          () => {
            // If geolocation fails, save without coordinates
            onSave(address);
          }
        );
      } else {
        onSave(address);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      onSave(address);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof AddressDetails, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Add Delivery Address
            </h2>
            <p className="text-sm text-gray-600 mt-1">Complete address is required for delivery</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* House/Flat/Block No. */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              House/Flat/Block No. *
            </label>
            <input
              type="text"
              value={address.houseNo}
              onChange={(e) => handleInputChange('houseNo', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.houseNo ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter house/flat number"
            />
            {errors.houseNo && (
              <p className="text-red-500 text-xs mt-1">{errors.houseNo}</p>
            )}
          </div>

          {/* Street/Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street / Area *
            </label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.street ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter street name or area"
            />
            {errors.street && (
              <p className="text-red-500 text-xs mt-1">{errors.street}</p>
            )}
          </div>

          {/* Landmark */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Landmark (optional)
            </label>
            <input
              type="text"
              value={address.landmark}
              onChange={(e) => handleInputChange('landmark', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Near hospital, school, etc."
            />
          </div>

          {/* City, State, Pincode in a grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                value={address.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode *
              </label>
              <input
                type="text"
                value={address.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.pincode ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={6}
                placeholder="6 digits"
              />
              {errors.pincode && (
                <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
              )}
            </div>
          </div>

          {/* Full Address Preview */}
          {address.fullAddress && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Address Preview
              </label>
              <p className="text-sm text-gray-600">{address.fullAddress}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save and Continue
          </button>
        </div>
      </div>
    </div>
  );
}

