# Location-Based Service Filtering System

## 🎯 Overview

This system ensures that customers only see laundry services from washermen whose service range covers their location. The system automatically filters out washermen who are outside their service range, providing a seamless and accurate service discovery experience.

## 🚀 How It Works

### 1. Customer Location Flow

```
Customer Login → Set Location → Check Availability → View Filtered Services
```

1. **Customer Login**: User must be logged in to use location services
2. **Location Setting**: Customer sets their location via GPS or manual address input
3. **Availability Check**: System checks for washermen within range
4. **Service Display**: Only shows services from in-range washermen

### 2. Range Checking Logic

```javascript
// Distance calculation using Haversine formula
const distance = haversineDistance(customerLocation, washermanLocation);
const distanceInMeters = distance * 1000;

// Check if customer is within washerman's range
if (distanceInMeters <= washerman.range) {
  // Show services from this washerman
} else {
  // Hide services from this washerman
}
```

## 📁 System Components

### Backend Components

#### 1. Location Controller (`Backend/controllers/location.controller.js`)

**Key Functions:**
- `getNearbyWashermen`: Finds washermen within customer's area and filters by range
- `checkServiceAvailability`: Comprehensive service availability check with range filtering
- `updateCustomerLocation`: Saves customer's location to database
- `getCustomersNearLaundryman`: Allows washermen to see customers in their area

**Range Filtering Logic:**
```javascript
// Find washermen within initial search radius (10km)
const washermen = await User.find({
  role: 'washerman',
  location: {
    $near: {
      $geometry: { type: 'Point', coordinates: customerLocation },
      $maxDistance: 10000 // 10km initial search
    }
  }
});

// Filter by actual service range
for (const washerman of washermen) {
  const distance = haversineDistance(customerLocation, washerman.location);
  const distanceInMeters = distance * 1000;
  
  if (distanceInMeters <= washerman.range) {
    // Customer is within range - show services
    availableServices.push(...washerman.products);
  } else {
    // Customer is out of range - hide services
    outOfRangeWashermen.push(washerman);
  }
}
```

#### 2. User Model (`Backend/models/user.model.js`)

**Location Fields:**
```javascript
location: {
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [lng, lat]
    default: [0, 0]
  }
},
range: {
  type: Number,
  default: function () {
    return this.role === 'washerman' ? 500 : null; // 500m default range
  }
}
```

**Geospatial Index:**
```javascript
userSchema.index({ location: '2dsphere' });
```

#### 3. Location Routes (`Backend/routes/location.route.js`)

**Available Endpoints:**
- `POST /api/location/user/location` - Save customer location
- `POST /api/location/check-availability` - Check service availability
- `GET /api/location/washer/nearby` - Get nearby washermen
- `GET /api/location/customers-near-laundryman` - Get customers near washerman

### Frontend Components

#### 1. LocationBasedServiceFilter (`Frontend/src/components/LocationBasedServiceFilter.tsx`)

**Features:**
- GPS location detection
- Manual address input with geocoding
- Real-time service availability checking
- Range-based filtering display
- Location persistence

**Key Functions:**
```typescript
// Detect current location
const detectCurrentLocation = () => {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        address: await getAddressFromCoords(position.coords)
      };
      checkServiceAvailability(location);
    }
  );
};

// Check service availability with range filtering
const checkServiceAvailability = async (location: Location) => {
  const response = await axios.post('/api/location/check-availability', {
    lat: location.lat,
    lng: location.lng,
    address: location.address
  });
  
  const data = response.data;
  if (data.availability.servicesAvailable) {
    onServicesFound(data.services); // Only in-range services
  } else {
    onNoServices();
  }
};
```

#### 2. ServiceAvailability (`Frontend/src/components/ServiceAvailability.tsx`)

**Features:**
- Service availability checking
- Integration with location system
- Error handling and user feedback

#### 3. EnhancedMainApp (`Frontend/src/components/EnhancedMainApp.tsx`)

**Integration:**
- Location-based service filtering
- Customer location management
- Service display with range filtering

## 🔧 Configuration

### Washerman Range Settings

Each washerman can set their service range:
- **Default**: 500 meters
- **Configurable**: 100m - 5000m
- **Storage**: `User.range` field in database

### Search Parameters

- **Initial Search Radius**: 10km (configurable in `getNearbyWashermen`)
- **Geocoding Service**: OpenStreetMap Nominatim (free)
- **Distance Calculation**: Haversine formula for accuracy

## 📊 API Responses

### Service Availability Response

```json
{
  "success": true,
  "customerLocation": {
    "lat": 19.076,
    "lng": 72.8777,
    "address": "Mumbai, Maharashtra, India"
  },
  "availability": {
    "servicesAvailable": true,
    "totalServices": 20,
    "totalWashermen": 5,
    "inRangeWashermen": 3,
    "outOfRangeWashermen": 2
  },
  "services": [
    {
      "_id": "service_id",
      "title": "Premium Shirt Service",
      "washerman": {
        "_id": "washerman_id",
        "name": "John's Laundry Service",
        "range": 500,
        "distance": 150
      }
    }
  ],
  "message": "Found 20 services from 3 washermen in your area"
}
```

### No Services Available Response

```json
{
  "success": true,
  "availability": {
    "servicesAvailable": false,
    "totalServices": 0,
    "inRangeWashermen": 0,
    "outOfRangeWashermen": 2
  },
  "services": [],
  "message": "No services available in your area",
  "suggestion": "The closest washerman is 800m away, but their service range is 500m."
}
```

## 🎯 Key Features

### 1. Automatic Range Filtering

- **Real-time Calculation**: Distance calculated using Haversine formula
- **Range Comparison**: Only shows services from washermen within their service range
- **Accurate Results**: Ensures customers can actually receive the services they see

### 2. Location Management

- **GPS Detection**: Automatic location detection using browser geolocation
- **Manual Input**: Fallback to manual address input with geocoding
- **Persistence**: Location saved to localStorage and backend database
- **Updates**: Real-time updates when location changes

### 3. Service Discovery

- **Proximity Search**: Initial search within 10km radius
- **Range Filtering**: Secondary filter based on washerman's service range
- **Detailed Information**: Shows distance, range, and availability status

### 4. User Experience

- **Clear Feedback**: Shows availability status and service counts
- **Helpful Messages**: Suggests alternatives when no services available
- **Range Indicators**: Visual indicators for in-range vs out-of-range services

## 🚨 Error Handling

### Common Scenarios

1. **Geolocation Not Supported**
   - Fallback to manual address input
   - Clear error message to user

2. **Location Access Denied**
   - Guide user to enable location permissions
   - Provide manual address input option

3. **No Services in Range**
   - Show helpful message with closest washerman info
   - Suggest expanding search area

4. **Network Errors**
   - Retry mechanism for API calls
   - Graceful degradation to basic service listing

## 🔒 Security Considerations

### Location Privacy

- **User Consent**: Location only accessed with explicit permission
- **Data Storage**: Location stored securely in database
- **Access Control**: Only authenticated users can access location services

### API Security

- **Authentication**: All location endpoints require valid JWT token
- **Validation**: Input validation for coordinates and addresses
- **Rate Limiting**: Geocoding API calls are rate-limited

## 🚀 Usage Examples

### 1. Customer Setting Location

```typescript
// Using the LocationBasedServiceFilter component
<LocationBasedServiceFilter
  onServicesFound={(services) => {
    // services only contains in-range washerman services
    setAvailableServices(services);
  }}
  onNoServices={() => {
    // No washermen in range
    setNoServicesMessage("No services available in your area");
  }}
  onLocationSet={(location) => {
    // Location saved and validated
    setCustomerLocation(location);
  }}
/>
```

### 2. Checking Service Availability

```typescript
// Direct API call
const checkAvailability = async (lat: number, lng: number) => {
  const response = await axios.post('/api/location/check-availability', {
    lat,
    lng,
    address: "Customer Address"
  });
  
  if (response.data.availability.servicesAvailable) {
    // Services available from in-range washermen
    return response.data.services;
  } else {
    // No services available in range
    return [];
  }
};
```

### 3. Washerman Range Management

```typescript
// Update washerman service range
const updateRange = async (range: number) => {
  await axios.put('/api/user/profile', {
    range: range * 1000 // Convert km to meters
  });
};
```

## 📈 Performance Optimization

### Database Queries

- **Geospatial Index**: `2dsphere` index on location field for fast queries
- **Compound Queries**: Combine role and location filters
- **Pagination**: Limit results for large datasets

### Caching

- **Location Caching**: Customer location cached in localStorage
- **Service Caching**: Service availability results cached temporarily
- **Geocoding Cache**: Address-to-coordinate caching

## 🔄 Future Enhancements

### Planned Features

1. **Dynamic Range Adjustment**: Allow washermen to adjust range based on demand
2. **Service Area Visualization**: Show service areas on map
3. **Real-time Availability**: Live updates when washermen change availability
4. **Multi-location Support**: Support for washermen with multiple service locations
5. **Advanced Filtering**: Filter by service type, rating, and availability

### Technical Improvements

1. **WebSocket Integration**: Real-time location and availability updates
2. **Progressive Web App**: Offline support for saved locations
3. **Advanced Geocoding**: Support for multiple geocoding providers
4. **Analytics Dashboard**: Track service area performance and customer reach

## 📝 Testing

### Test Scenarios

1. **Location Detection**: Test GPS and manual address input
2. **Range Filtering**: Verify only in-range services are shown
3. **Edge Cases**: Test boundary conditions (exact range limits)
4. **Error Handling**: Test network failures and invalid inputs
5. **Performance**: Test with large numbers of washermen

### Test Data

```javascript
// Sample test washermen
const testWashermen = [
  {
    name: "Nearby Laundry",
    location: { lat: 19.076, lng: 72.8777 },
    range: 500 // 500m range
  },
  {
    name: "Far Laundry", 
    location: { lat: 19.080, lng: 72.8800 },
    range: 300 // 300m range (too far)
  }
];
```

This location-based system ensures that customers only see services they can actually receive, providing a reliable and user-friendly experience while helping washermen manage their service areas effectively.

