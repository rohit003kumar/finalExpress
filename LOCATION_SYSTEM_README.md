# Location-Based Customer Service System

This document explains the enhanced location-based system that allows customers to set their location and only see washerman services that are within their service range.

## 🎯 Features

### For Customers:
1. **Location Setting**: Customers can set their location using:
   - Current GPS location detection
   - Manual address input with autocomplete
   
2. **Service Availability Check**: System automatically checks if washerman services are available in the customer's area

3. **Range-Based Filtering**: Only shows services from washermen whose service range covers the customer's location

4. **Real-time Updates**: Location changes immediately update available services

### For Washermen:
1. **Service Range Management**: Each washerman can set their service range (default: 500m)
2. **Location-Based Customer Discovery**: Washermen can see customers within their service area

## 🚀 How It Works

### 1. Customer Location Flow

```
Customer Login → Set Location → Check Availability → View Services
```

1. **Login**: Customer must be logged in to use location services
2. **Location Setting**: 
   - Option A: Detect current location using GPS
   - Option B: Enter address manually with autocomplete
3. **Availability Check**: System checks for washermen within range
4. **Service Display**: Shows only services from in-range washermen

### 2. Range Checking Logic

```javascript
// Distance calculation using Haversine formula
const distance = haversineDistance(customerLocation, washermanLocation);
const distanceInMeters = distance * 1000;

// Check if customer is within washerman's range
if (distanceInMeters <= washerman.range) {
  // Show services
} else {
  // Hide services
}
```

## 📁 New Components

### Frontend Components:

1. **LocationModal** (`Frontend/src/components/LocationModal.tsx`)
   - Comprehensive location setting interface
   - GPS detection and manual address input
   - Address autocomplete with suggestions
   - Error handling and user feedback

2. **LocationBanner** (`Frontend/src/components/LocationBanner.tsx`)
   - Displays current location in header
   - Quick access to change location
   - Visual indicators for location status

3. **ServiceAvailability** (`Frontend/src/components/ServiceAvailability.tsx`)
   - Shows service availability status
   - Displays statistics about nearby washermen
   - Provides helpful suggestions when no services available

4. **EnhancedMainApp** (`Frontend/src/components/EnhancedMainApp.tsx`)
   - Integrated location-based service flow
   - Automatic availability checking
   - Seamless user experience

### Backend Endpoints:

1. **POST** `/api/location/check-availability`
   - Enhanced service availability checking
   - Returns detailed availability information
   - Updates customer location in database

2. **GET** `/api/location/user/location`
   - Get customer's saved location
   - Returns location with address

3. **POST** `/api/location/user/location`
   - Save customer location
   - Updates both coordinates and address

## 🛠️ Setup Instructions

### 1. Backend Setup

1. **Install Dependencies**:
   ```bash
   cd Backend
   npm install
   ```

2. **Database Setup**:
   - Ensure MongoDB is running
   - The system uses geospatial indexes for location queries

3. **Create Sample Data**:
   ```bash
   cd Backend/scripts
   node createSampleData.js
   ```
   This creates 5 sample washermen with different locations and ranges.

### 2. Frontend Setup

1. **Install Dependencies**:
   ```bash
   cd Frontend
   npm install
   ```

2. **Required Dependencies**:
   ```bash
   npm install lucide-react axios
   ```

### 3. Environment Configuration

1. **Geocoding API**: The system uses OpenCage Data API for geocoding
   - API Key: `fbddd9ac0aff4feb840edc8d63a8f264` (included in code)
   - For production, use your own API key

2. **MongoDB**: Ensure MongoDB is running with geospatial support

## 🧪 Testing the System

### 1. Create Test Data

Run the sample data script:
```bash
cd Backend/scripts
node createSampleData.js
```

This creates:
- 5 washermen with different locations around Mumbai
- 4 products per washerman
- Different service ranges (500m - 1200m)

### 2. Test Scenarios

#### Scenario 1: Customer in Range
1. Login as customer
2. Set location near Mumbai (19.076, 72.8777)
3. Should see services from nearby washermen

#### Scenario 2: Customer Out of Range
1. Login as customer
2. Set location far from Mumbai (e.g., Delhi coordinates)
3. Should see "No services available" message

#### Scenario 3: Manual Address Input
1. Login as customer
2. Use manual address input
3. Enter "Mumbai, Maharashtra"
4. Should see available services

### 3. Test Credentials

**Washermen Accounts:**
- Email: `john@laundry.com`, Password: `password123`
- Email: `quickwash@laundry.com`, Password: `password123`
- Email: `premium@laundry.com`, Password: `password123`

## 📊 API Response Examples

### Service Availability Check Response

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
      "name": "Shirt",
      "category": "Shirt",
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
  "customerLocation": {
    "lat": 28.6139,
    "lng": 77.2090,
    "address": "Delhi, India"
  },
  "availability": {
    "servicesAvailable": false,
    "totalServices": 0,
    "totalWashermen": 0,
    "inRangeWashermen": 0,
    "outOfRangeWashermen": 0
  },
  "services": [],
  "message": "No services available in your area. Found 0 washermen but all are outside their service range."
}
```

## 🔧 Configuration Options

### Washerman Range Settings

Each washerman can set their service range:
- Default: 500 meters
- Configurable: 100m - 5000m
- Stored in `User.range` field

### Search Radius

Initial search radius for finding washermen:
- Default: 10km
- Configurable in `getNearbyWashermen` function

### Geocoding Service

Currently using OpenCage Data API:
- Free tier: 2,500 requests/day
- For production: Consider Google Maps API or other services

## 🚨 Error Handling

### Common Errors and Solutions

1. **"Geolocation not supported"**
   - Use HTTPS in production
   - Fallback to manual address input

2. **"Location access denied"**
   - Guide user to enable location permissions
   - Provide manual address input option

3. **"No services available"**
   - Show helpful message with closest washerman info
   - Suggest trying different location

4. **"Geocoding failed"**
   - Retry with different address format
   - Use coordinates as fallback

## 🔒 Security Considerations

1. **Location Privacy**: Customer locations are stored securely
2. **API Rate Limiting**: Implement rate limiting for geocoding API
3. **Input Validation**: All location inputs are validated
4. **Authentication**: Location services require user authentication

## 📈 Performance Optimization

1. **Geospatial Indexes**: MongoDB 2dsphere indexes for fast location queries
2. **Caching**: Cache geocoding results when possible
3. **Batch Processing**: Process multiple location checks efficiently
4. **Lazy Loading**: Load services only when needed

## 🔄 Future Enhancements

1. **Real-time Location Updates**: WebSocket-based location updates
2. **Advanced Range Types**: Polygon-based service areas
3. **Location History**: Track customer location changes
4. **Predictive Availability**: ML-based service availability prediction
5. **Multi-language Support**: International address formats

## 📞 Support

For issues or questions:
1. Check the console logs for detailed error messages
2. Verify MongoDB geospatial indexes are created
3. Ensure all required dependencies are installed
4. Test with sample data first

---

**Note**: This system provides a robust foundation for location-based service delivery. The modular design allows for easy customization and extension based on specific business requirements.
