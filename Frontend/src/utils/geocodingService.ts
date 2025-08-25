// Geocoding service for address to coordinates conversion
export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface PlaceResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
  address?: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

/**
 * Search for address suggestions using Nominatim (OpenStreetMap)
 * Free alternative to Google Places API
 */
export const searchAddresses = async (query: string, limit: number = 5): Promise<PlaceResult[]> => {
  if (!query || query.length < 3) {
    return [];
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` + new URLSearchParams({
        format: 'json',
        addressdetails: '1',
        limit: limit.toString(),
        q: query,
        countrycodes: 'in', // Restrict to India
        'accept-language': 'en'
      })
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PlaceResult[] = await response.json();
    
    // Filter and sort results by importance
    return data
      .filter(place => place.importance > 0.3) // Filter out less relevant results
      .sort((a, b) => b.importance - a.importance);
  } catch (error) {
    console.error('Address search error:', error);
    throw new Error('Failed to search addresses. Please check your internet connection.');
  }
};

/**
 * Convert an address string to coordinates
 */
export const geocodeAddress = async (address: string): Promise<Location> => {
  if (!address.trim()) {
    throw new Error('Address is required');
  }

  try {
    const results = await searchAddresses(address, 1);
    
    if (results.length === 0) {
      throw new Error('Address not found. Please try a different address or be more specific.');
    }

    const result = results[0];
    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

/**
 * Convert coordinates to address (reverse geocoding) with multiple fallbacks
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  // Try multiple geocoding services for better accuracy
  const services = [
    // Primary: OpenCage Data (more accurate)
    async () => {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=fbddd9ac0aff4feb840edc8d63a8f264&language=en&countrycode=in`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted;
      }
      throw new Error('No results from OpenCage');
    },
    // Fallback 1: Nominatim (OpenStreetMap)
    async () => {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=en`
      );
      const data = await response.json();
      if (data.display_name) {
        return data.display_name;
      }
      throw new Error('No results from Nominatim');
    },
    // Fallback 2: BigDataCloud (free tier)
    async () => {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data = await response.json();
      if (data.locality && data.city) {
        return `${data.locality}, ${data.city}, ${data.countryName}`;
      }
      throw new Error('No results from BigDataCloud');
    }
  ];

  for (const service of services) {
    try {
      const address = await service();
      if (address && address.trim()) {
        return address;
      }
    } catch (error) {
      console.warn('Geocoding service failed:', error);
      continue;
    }
  }

  // Final fallback: return coordinates
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

/**
 * Validate if coordinates are within India (approximate bounds)
 */
export const isLocationInIndia = (lat: number, lng: number): boolean => {
  // Approximate bounds for India
  const INDIA_BOUNDS = {
    north: 37.6,
    south: 6.4,
    east: 97.25,
    west: 68.7
  };

  return (
    lat >= INDIA_BOUNDS.south &&
    lat <= INDIA_BOUNDS.north &&
    lng >= INDIA_BOUNDS.west &&
    lng <= INDIA_BOUNDS.east
  );
};

/**
 * Format address for display (shorter version)
 */
export const formatAddressForDisplay = (address: string, maxLength: number = 50): string => {
  if (address.length <= maxLength) {
    return address;
  }

  // Try to extract the most important parts
  const parts = address.split(',').map(part => part.trim());
  
  if (parts.length >= 3) {
    // Show first part (usually street/building) and last 2 parts (usually city, state)
    const important = [parts[0], ...parts.slice(-2)].join(', ');
    if (important.length <= maxLength) {
      return important;
    }
  }

  // Fallback to truncation
  return `${address.substring(0, maxLength - 3)}...`;
};

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Get user's current location using browser geolocation with high accuracy
 */
export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    // Check if user is logged in before requesting location
    const token = localStorage.getItem("token");
    if (!token) {
      reject(new Error('Please log in to use location services'));
      return;
    }

    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    // Use high accuracy settings for better precision
    const options = {
      enableHighAccuracy: true,
      timeout: 20000, // 20 seconds timeout
      maximumAge: 0 // Always get fresh location
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Log accuracy information
        console.log('Location accuracy:', {
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed
        });
        
        try {
          const address = await reverseGeocode(latitude, longitude);
          resolve({
            lat: latitude,
            lng: longitude,
            address
          });
        } catch (error) {
          // If reverse geocoding fails, still return coordinates
          resolve({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          });
        }
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user. Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please check your GPS settings and try again.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again in a better signal area.';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      options
    );
  });
};
