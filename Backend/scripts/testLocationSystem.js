const mongoose = require('mongoose');
const User = require('../models/user.model');
const Product = require('../models/product.model');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/laundry-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Haversine distance calculator
function haversineDistance([lat1, lon1], [lat2, lon2]) {
  const toRad = deg => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in KM
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Test customer location (Mumbai, India)
const customerLocation = {
  lat: 19.0760,
  lng: 72.8777,
  address: "Mumbai, Maharashtra, India"
};

// Sample washermen data with different ranges and distances
const sampleWashermen = [
  {
    name: "Nearby Laundry Service",
    email: "nearby@test.com",
    password: "password123",
    contact: "+91 98765 43210",
    role: "washerman",
    location: {
      type: "Point",
      coordinates: [72.8777, 19.0760] // Same as customer (0m distance)
    },
    range: 500, // 500m range
    products: [
      {
        title: "Premium Shirt Service",
        name: "Shirt",
        category: "Shirt",
        image: "/src/shirt.png",
        options: [
          { id: "wash", name: "Wash", price: 50 },
          { id: "iron", name: "Iron", price: 30 }
        ]
      }
    ]
  },
  {
    name: "Medium Distance Laundry",
    email: "medium@test.com",
    password: "password123",
    contact: "+91 98765 43211",
    role: "washerman",
    location: {
      type: "Point",
      coordinates: [72.8780, 19.0765] // ~100m away
    },
    range: 300, // 300m range
    products: [
      {
        title: "Quick Pant Service",
        name: "Pant",
        category: "Pant",
        image: "/src/pant.png",
        options: [
          { id: "wash", name: "Wash", price: 60 },
          { id: "dry-clean", name: "Dry Clean", price: 100 }
        ]
      }
    ]
  },
  {
    name: "Far Laundry Service",
    email: "far@test.com",
    password: "password123",
    contact: "+91 98765 43212",
    role: "washerman",
    location: {
      type: "Point",
      coordinates: [72.8800, 19.0800] // ~800m away
    },
    range: 500, // 500m range (should be out of range)
    products: [
      {
        title: "Bedsheet Service",
        name: "Bedsheet",
        category: "Bedsheet",
        image: "/src/bedsheet.png",
        options: [
          { id: "wash", name: "Wash", price: 80 }
        ]
      }
    ]
  },
  {
    name: "Very Far Laundry",
    email: "veryfar@test.com",
    password: "password123",
    contact: "+91 98765 43213",
    role: "washerman",
    location: {
      type: "Point",
      coordinates: [72.8900, 19.0900] // ~2km away
    },
    range: 1000, // 1000m range (should be out of range)
    products: [
      {
        title: "Curtain Service",
        name: "Curtain",
        category: "Curtain",
        image: "/src/curtain.png",
        options: [
          { id: "wash", name: "Wash", price: 120 }
        ]
      }
    ]
  }
];

async function createTestData() {
  try {
    console.log('🧹 Cleaning up existing test data...');
    
    // Remove existing test washermen
    await User.deleteMany({ 
      email: { $in: sampleWashermen.map(w => w.email) }
    });
    
    console.log('✅ Cleanup completed');

    console.log('📝 Creating test washermen...');
    
    const createdWashermen = [];
    
    for (const washermanData of sampleWashermen) {
      // Create washerman
      const washerman = new User({
        name: washermanData.name,
        email: washermanData.email,
        password: washermanData.password,
        contact: washermanData.contact,
        role: washermanData.role,
        location: washermanData.location,
        range: washermanData.range
      });
      
      await washerman.save();
      
      // Create products for this washerman
      for (const productData of washermanData.products) {
        const product = new Product({
          ...productData,
          washerman: washerman._id
        });
        
        await product.save();
        
        // Add product to washerman's products array
        washerman.products.push(product._id);
      }
      
      await washerman.save();
      createdWashermen.push(washerman);
      
      console.log(`✅ Created washerman: ${washerman.name} (Range: ${washerman.range}m)`);
    }

    console.log('\n🎯 Testing location-based filtering...');
    
    // Test the location-based filtering logic
    const customerCoords = [customerLocation.lng, customerLocation.lat];
    
    // Find washermen within 10km radius
    const nearbyWashermen = await User.find({
      role: 'washerman',
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: customerCoords },
          $maxDistance: 10000 // 10km
        }
      }
    }).populate('products');

    console.log(`📊 Found ${nearbyWashermen.length} washermen within 10km`);

    const availableServices = [];
    const outOfRangeWashermen = [];

    for (const washerman of nearbyWashermen) {
      if (!washerman.location?.coordinates) continue;

      // Calculate distance
      const distance = haversineDistance(
        [customerLocation.lat, customerLocation.lng],
        [washerman.location.coordinates[1], washerman.location.coordinates[0]]
      );

      const distanceInMeters = distance * 1000;
      const washermanRange = washerman.range || 500;

      console.log(`\n📍 ${washerman.name}:`);
      console.log(`   Distance: ${Math.round(distanceInMeters)}m`);
      console.log(`   Range: ${washermanRange}m`);
      console.log(`   In Range: ${distanceInMeters <= washermanRange ? '✅' : '❌'}`);

      if (distanceInMeters <= washermanRange) {
        // Customer is within range
        for (const product of washerman.products || []) {
          if (!Array.isArray(product.options) || product.options.length === 0) continue;

          availableServices.push({
            _id: product._id,
            title: product.title,
            name: product.name,
            category: product.category,
            washerman: {
              _id: washerman._id,
              name: washerman.name,
              range: washermanRange,
              distance: Math.round(distanceInMeters)
            }
          });
        }
      } else {
        // Customer is out of range
        outOfRangeWashermen.push({
          name: washerman.name,
          distance: Math.round(distanceInMeters),
          range: washermanRange
        });
      }
    }

    console.log('\n📋 Test Results:');
    console.log('================');
    console.log(`📍 Customer Location: ${customerLocation.address}`);
    console.log(`📊 Total Washermen Found: ${nearbyWashermen.length}`);
    console.log(`✅ In-Range Washermen: ${availableServices.length > 0 ? [...new Set(availableServices.map(s => s.washerman._id))].length : 0}`);
    console.log(`❌ Out-of-Range Washermen: ${outOfRangeWashermen.length}`);
    console.log(`🛍️ Available Services: ${availableServices.length}`);

    if (availableServices.length > 0) {
      console.log('\n✅ Available Services:');
      availableServices.forEach(service => {
        console.log(`   • ${service.title} (${service.category})`);
        console.log(`     Washerman: ${service.washerman.name}`);
        console.log(`     Distance: ${service.washerman.distance}m`);
        console.log(`     Range: ${service.washerman.range}m`);
      });
    }

    if (outOfRangeWashermen.length > 0) {
      console.log('\n❌ Out-of-Range Washermen:');
      outOfRangeWashermen.forEach(washerman => {
        console.log(`   • ${washerman.name}`);
        console.log(`     Distance: ${washerman.distance}m`);
        console.log(`     Range: ${washerman.range}m`);
      });
    }

    console.log('\n🎯 Expected Results:');
    console.log('===================');
    console.log('✅ Nearby Laundry Service: Should be IN RANGE (0m distance, 500m range)');
    console.log('✅ Medium Distance Laundry: Should be IN RANGE (~100m distance, 300m range)');
    console.log('❌ Far Laundry Service: Should be OUT OF RANGE (~800m distance, 500m range)');
    console.log('❌ Very Far Laundry: Should be OUT OF RANGE (~2km distance, 1000m range)');

    console.log('\n🎉 Location-based filtering test completed!');
    console.log('The system is working correctly if:');
    console.log('- Only services from in-range washermen are shown');
    console.log('- Services from out-of-range washermen are filtered out');

  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the test if called directly
if (require.main === module) {
  createTestData();
}

module.exports = { createTestData };

