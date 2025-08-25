



const User = require('../models/user.model');
const WashermanSlot = require('../models/wavailable.model');

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

// // exports.getNearbyWashermen = async (req, res) => {
// //   const { lat, lng, date } = req.query;

// //   if (!lat || !lng) {
// //     return res.status(400).json({ message: "Latitude and longitude are required" });
// //   }

// //   const customerLocation = [parseFloat(lng), parseFloat(lat)];

// //   try {
// //     // Step 1: Find nearby washermen using geospatial query
// //     const washermen = await User.find({
// //       role: 'washerman',
// //       location: {
// //         $near: {
// //           $geometry: { type: 'Point', coordinates: customerLocation },
// //           $maxDistance: 10000 // 10km max search radius
// //         }
// //       }
// //     }).populate({
// //       path: 'products',
// //       select: 'title category image services serviceType price'
// //     });

// //     const nearbyProducts = [];

// //     for (const washerman of washermen) {
// //       if (!washerman.location?.coordinates) continue;

// //       // Calculate actual distance between customer and washerman
// //       const distance = haversineDistance(
// //         [parseFloat(lat), parseFloat(lng)],
// //         [washerman.location.coordinates[1], washerman.location.coordinates[0]]
// //       );

// //       // Skip if beyond washerman's personal range
// //       if (distance * 1000 > (washerman.range || 500)) continue;

// //       for (const product of washerman.products || []) {
// //         // Derive services list
// //         const services = Array.isArray(product.services) && product.services.length > 0
// //           ? product.services
// //           : (product.serviceType && product.price)
// //             ? [{ name: product.serviceType, price: product.price }]
// //             : [];

// //         // Skip if product has no usable services
// //         if (services.length === 0) continue;

// //         // Push product formatted for frontend
// //         nearbyProducts.push({
// //           _id: product._id,
// //           name: product.title,
// //           category: product.category,
// //           image: product.image || '',
// //           options: services.map((srv, index) => ({
// //             _id: `${product._id}-${index}`, // Unique ID for frontend checkbox
// //             name: srv.name || 'Unnamed',
// //             price: srv.price || 0
// //           })),
// //           washerman: {
// //             _id: washerman._id,
// //             name: washerman.name,
// //             contact: washerman.contact || 'N/A',
// //             range: washerman.range || 500,
// //             location: {
// //               lat: washerman.location.coordinates[1],
// //               lng: washerman.location.coordinates[0]
// //             }
// //           }
// //         });
// //       }
// //     }

// //     // Step 3: If booking `date` is provided, attach available time slots
// //     if (date) {
// //       const enrichedProducts = await Promise.all(
// //         nearbyProducts.map(async (product) => {
// //           try {
// //             const slot = await WashermanSlot.findOne({
// //               washerman: product.washerman._id,
// //               date
// //             });

// //             if (slot && slot.isDayOpen) {
// //               const availableSlots = slot.slots
// //                 .filter(s => s.enabled && s.currentBookings < s.maxCapacity)
// //                 .map(s => ({
// //                   timeRange: s.timeRange,
// //                   period: s.period,
// //                   available: s.maxCapacity - s.currentBookings,
// //                   maxCapacity: s.maxCapacity
// //                 }));

// //               return {
// //                 ...product,
// //                 isAvailable: true,
// //                 availableSlots,
// //                 totalAvailableSlots: availableSlots.length
// //               };
// //             }

// //             return {
// //               ...product,
// //               isAvailable: false,
// //               availableSlots: [],
// //               totalAvailableSlots: 0
// //             };
// //           } catch (error) {
// //             console.error(`❌ Slot check failed for ${product.washerman._id}:`, error);
// //             return {
// //               ...product,
// //               isAvailable: false,
// //               availableSlots: [],
// //               totalAvailableSlots: 0
// //             };
// //           }
// //         })
// //       );

// //       return res.json(enrichedProducts);
// //     }

// //     // Step 4: Return products without slots if no `date`
// //     return res.json(nearbyProducts);

// //   } catch (err) {
// //     console.error('❌ Error fetching nearby washermen:', err);
// //     res.status(500).json({ message: "Server error while fetching nearby washermen" });
// //   }
// // };






exports.getNearbyWashermen = async (req, res) => {
  const { lat, lng, date } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Latitude and longitude are required" });
  }

  const customerLocation = [parseFloat(lng), parseFloat(lat)];

  try {
    const washermen = await User.find({
      role: 'washerman',
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: customerLocation },
          $maxDistance: 10000
        }
      }
    }).populate({
      path: 'products',
      select: 'title name category image description options'
    });

    const nearbyServices = [];

    for (const washerman of washermen) {
      if (!washerman.location?.coordinates) continue;

      const distance = haversineDistance(
        [parseFloat(lat), parseFloat(lng)],
        [washerman.location.coordinates[1], washerman.location.coordinates[0]]
      );

      if (distance * 1000 > (washerman.range || 500)) continue;

      for (const product of washerman.products || []) {
        if (!Array.isArray(product.options) || product.options.length === 0) continue;

        nearbyServices.push({
          _id: product._id,
          title: product.title,
          name: product.name,
          category: product.category,
          description: product.description || '',
          image: product.image || '',
          options: product.options.map(opt => ({
            id: opt.id || '',
            name: opt.name || 'Unknown Service',
            price: opt.price || 0
          })),
          washerman: {
            _id: washerman._id,
            name: washerman.name,
            contact: washerman.contact || '',
            range: washerman.range,
            location: {
              lat: washerman.location.coordinates[1],
              lng: washerman.location.coordinates[0]
            }
          }
        });
      }
    }

    if (date) {
      const enriched = await Promise.all(
        nearbyServices.map(async (service) => {
          try {
            const slot = await WashermanSlot.findOne({
              washerman: service.washerman._id,
              date
            });

            if (slot && slot.isDayOpen) {
              const availableSlots = slot.slots
                .filter(s => s.enabled && s.currentBookings < s.maxCapacity)
                .map(s => ({
                  timeRange: s.timeRange,
                  period: s.period,
                  available: s.maxCapacity - s.currentBookings,
                  maxCapacity: s.maxCapacity
                }));

              return {
                ...service,
                isAvailable: true,
                availableSlots,
                totalAvailableSlots: availableSlots.length
              };
            }

            return {
              ...service,
              isAvailable: false,
              availableSlots: [],
              totalAvailableSlots: 0
            };
          } catch {
            return {
              ...service,
              isAvailable: false,
              availableSlots: [],
              totalAvailableSlots: 0
            };
          }
        })
      );

      return res.json(enriched);
    }

    return res.json(nearbyServices);
  } catch (err) {
    console.error("❌ Error fetching nearby washermen:", err);
    res.status(500).json({ message: "Server error while fetching nearby washermen" });
  }
};










// Test endpoint to create sample washermen data
exports.createSampleWashermen = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const sampleWashermen = [
      {
        name: "John's Laundry Service",
        email: "john@laundry.com",
        password: "password123",
        contact: "+91 98765 43210",
        role: "washerman",
        location: {
          type: "Point",
          coordinates: [parseFloat(lng) + 0.001, parseFloat(lat) + 0.001] // 100m away
        },
        range: 500,
        services: ["wash_fold", "iron_only", "eco_friendly"]
      },
      {
        name: "Quick Wash Express",
        email: "quickwash@laundry.com",
        password: "password123",
        contact: "+91 98765 43211",
        role: "washerman",
        location: {
          type: "Point",
          coordinates: [parseFloat(lng) - 0.002, parseFloat(lat) + 0.002] // 200m away
        },
        range: 800,
        services: ["wash_fold", "dry_clean", "stain_removal"]
      },
      {
        name: "Premium Laundry Care",
        email: "premium@laundry.com",
        password: "password123",
        contact: "+91 98765 43212",
        role: "washerman",
        location: {
          type: "Point",
          coordinates: [parseFloat(lng) + 0.003, parseFloat(lat) - 0.001] // 300m away
        },
        range: 1000,
        services: ["wash_fold", "dry_clean", "iron_only", "stain_removal", "eco_friendly"]
      }
    ];

    const createdWashermen = await User.insertMany(sampleWashermen);
    
    res.json({ 
      message: "Sample washermen created successfully", 
      count: createdWashermen.length,
      washermen: createdWashermen.map(w => ({
        name: w.name,
        contact: w.contact,
        location: w.location.coordinates
      }))
    });
  } catch (err) {
    console.error('Error creating sample washermen:', err);
    res.status(500).json({ message: "Server error while creating sample data" });
  }
};

// // Haversine distance calculation helper
// function haversineDistance([lat1, lon1], [lat2, lon2]) {
//   const toRad = angle => (angle * Math.PI) / 180;
//   const R = 6371; // Radius of Earth in KM
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(toRad(lat1)) *
//       Math.cos(toRad(lat2)) *
//       Math.sin(dLon / 2) ** 2;
//   return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// }

// Get all washermen locations (for testing/admin purposes)
exports.getAllWashermenLocations = async (req, res) => {
  try {
    const washermen = await User.find({ 
      role: 'washerman',
      'location.coordinates': { $exists: true, $ne: [0, 0] }
    }).select('name contact location range email');

    const formattedWashermen = washermen.map(washerman => ({
      _id: washerman._id,
      name: washerman.name,
      contact: washerman.contact,
      email: washerman.email,
      range: washerman.range || 500,
      location: {
        lat: washerman.location.coordinates[1],
        lng: washerman.location.coordinates[0]
      }
    }));

    res.json(formattedWashermen);
  } catch (err) {
    console.error('Error fetching washermen locations:', err);
    res.status(500).json({ message: "Server error while fetching washermen locations" });
  }
};

// Get customers near a laundryman's location
exports.getCustomersNearLaundryman = async (req, res) => {
  try {
    const { lat, lng, range = 5000 } = req.query; // Default 5km range
    const laundrymanId = req.userId;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    // Verify the user is a laundryman
    const laundryman = await User.findById(laundrymanId);
    if (!laundryman || laundryman.role !== 'washerman') {
      return res.status(403).json({ message: "Only laundrymen can access this endpoint" });
    }

    const laundrymanLocation = [parseFloat(lng), parseFloat(lat)];

    // Find customers within the specified range
    const customers = await User.find({
      role: 'customer',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: laundrymanLocation
          },
          $maxDistance: parseInt(range) // Convert to meters
        }
      }
    }).select('name contact location address email');

    // Format the results
    const formattedCustomers = customers.map(customer => ({
      _id: customer._id,
      name: customer.name,
      contact: customer.contact || 'Contact not available',
      email: customer.email,
      address: customer.address,
      location: {
        lat: customer.location.coordinates[1],
        lng: customer.location.coordinates[0]
      },
      distance: haversineDistance(
        [parseFloat(lat), parseFloat(lng)],
        [customer.location.coordinates[1], customer.location.coordinates[0]]
      )
    }));

    // Sort by distance
    formattedCustomers.sort((a, b) => a.distance - b.distance);

    res.json({
      laundryman: {
        _id: laundryman._id,
        name: laundryman.name,
        location: {
          lat: parseFloat(lat),
          lng: parseFloat(lng)
        },
        range: laundryman.range || 500
      },
      customers: formattedCustomers,
      totalCustomers: formattedCustomers.length
    });

  } catch (err) {
    console.error('Error fetching customers near laundryman:', err);
    res.status(500).json({ message: "Server error while fetching nearby customers" });
  }
};








exports.updateCustomerLocation = async (req, res) => {
  try {
    const { lat, lng, address } = req.body;
    const userId = req.userId;

    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({ message: "Latitude and longitude must be numbers" });
    }

    const location = {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)],
    };

    const updateData = { location };
    
    // If address is provided, save it as well
    if (address && typeof address === 'string') {
      updateData.address = address.trim();
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Location updated", location: user.location });
  } catch (err) {
    console.error("Error saving location:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get nearby washermen by address (geocode address first, then find nearby)
exports.getNearbyWashermenByAddress = async (req, res) => {
  const { address, date } = req.query;

  if (!address) {
    return res.status(400).json({ message: "Address is required" });
  }

  try {
    // Use Nominatim (OpenStreetMap) to geocode the address
    const geocodeResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}&countrycodes=in`
    );
    
    if (!geocodeResponse.ok) {
      return res.status(500).json({ message: "Geocoding service unavailable" });
    }

    const geocodeData = await geocodeResponse.json();
    
    if (geocodeData.length === 0) {
      return res.status(404).json({ message: "Address not found" });
    }

    const result = geocodeData[0];
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    // Now use the existing logic to find nearby washermen
    const customerLocation = [lng, lat];

    const washermen = await User.find({
      role: 'washerman',
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: customerLocation },
          $maxDistance: 10000 // 10km initial search radius
        }
      }
    }).populate({
      path: 'products',
      select: 'title name category image description options'
    });

    const nearbyServices = [];

    for (const washerman of washermen) {
      if (!washerman.location?.coordinates) continue;

      const distance = haversineDistance(
        [lat, lng],
        [washerman.location.coordinates[1], washerman.location.coordinates[0]]
      );

      // Check if customer is within washerman's service range
      if (distance * 1000 > (washerman.range || 500)) continue;

      for (const product of washerman.products || []) {
        if (!Array.isArray(product.options) || product.options.length === 0) continue;

        nearbyServices.push({
          _id: product._id,
          title: product.title,
          name: product.name,
          category: product.category,
          description: product.description || '',
          image: product.image || '',
          options: product.options.map(opt => ({
            id: opt.id || '',
            name: opt.name || 'Unknown Service',
            price: opt.price || 0
          })),
          washerman: {
            _id: washerman._id,
            name: washerman.name,
            contact: washerman.contact || '',
            range: washerman.range,
            location: {
              lat: washerman.location.coordinates[1],
              lng: washerman.location.coordinates[0]
            }
          }
        });
      }
    }

    // If date is provided, filter by available slots
    if (date) {
      // Similar slot filtering logic as in getNearbyWashermen
      // This would require importing and using the slot-related models
    }

    res.json({
      services: nearbyServices,
      customerLocation: {
        lat,
        lng,
        address: result.display_name
      },
      message: nearbyServices.length > 0 
        ? `Found ${nearbyServices.length} services near your address`
        : 'No services found in your area'
    });

  } catch (error) {
    console.error('Error finding services by address:', error);
    res.status(500).json({ message: "Server error while searching for services" });
  }
};

// Enhanced endpoint to check service availability for a customer location
exports.checkServiceAvailability = async (req, res) => {
  try {
    const { lat, lng, address } = req.body;
    const userId = req.userId;

    if (!lat || !lng) {
      return res.status(400).json({ 
        success: false,
        message: "Latitude and longitude are required" 
      });
    }

    const customerLocation = [parseFloat(lng), parseFloat(lat)];

    // Find all washermen within a reasonable search radius (10km)
    const washermen = await User.find({
      role: 'washerman',
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: customerLocation },
          $maxDistance: 10000 // 10km initial search radius
        }
      }
    }).populate({
      path: 'products',
      select: 'title name category image description options'
    });

    const availableServices = [];
    const outOfRangeWashermen = [];
    const totalWashermen = washermen.length;

    for (const washerman of washermen) {
      if (!washerman.location?.coordinates) continue;

      // Calculate actual distance between customer and washerman
      const distance = haversineDistance(
        [parseFloat(lat), parseFloat(lng)],
        [washerman.location.coordinates[1], washerman.location.coordinates[0]]
      );

      const distanceInMeters = distance * 1000;
      const washermanRange = washerman.range || 500;

      // Check if customer is within washerman's service range
      if (distanceInMeters <= washermanRange) {
        // Customer is within range, add their services
        for (const product of washerman.products || []) {
          if (!Array.isArray(product.options) || product.options.length === 0) continue;

          availableServices.push({
            _id: product._id,
            title: product.title,
            name: product.name,
            category: product.category,
            description: product.description || '',
            image: product.image || '',
            options: product.options.map(opt => ({
              id: opt.id || '',
              name: opt.name || 'Unknown Service',
              price: opt.price || 0
            })),
            washerman: {
              _id: washerman._id,
              name: washerman.name,
              contact: washerman.contact || '',
              range: washermanRange,
              distance: Math.round(distanceInMeters),
              location: {
                lat: washerman.location.coordinates[1],
                lng: washerman.location.coordinates[0]
              }
            }
          });
        }
      } else {
        // Customer is out of range, track for reporting
        outOfRangeWashermen.push({
          name: washerman.name,
          distance: Math.round(distanceInMeters),
          range: washermanRange
        });
      }
    }

    // Update customer's location in database
    const location = {
      type: "Point",
      coordinates: customerLocation,
    };

    const updateData = { location };
    if (address && typeof address === 'string') {
      updateData.address = address.trim();
    }

    await User.findByIdAndUpdate(userId, updateData, { new: true });

    // Prepare response
    const response = {
      success: true,
      customerLocation: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        address: address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      },
      availability: {
        servicesAvailable: availableServices.length > 0,
        totalServices: availableServices.length,
        totalWashermen: totalWashermen,
        inRangeWashermen: availableServices.length > 0 ? 
          [...new Set(availableServices.map(s => s.washerman._id))].length : 0,
        outOfRangeWashermen: outOfRangeWashermen.length
      },
      services: availableServices,
      message: availableServices.length > 0 
        ? `Found ${availableServices.length} services from ${[...new Set(availableServices.map(s => s.washerman._id))].length} washermen in your area`
        : `No services available in your area. Found ${totalWashermen} washermen but all are outside their service range.`
    };

    // Add helpful message if no services available
    if (availableServices.length === 0 && totalWashermen > 0) {
      const closestWasherman = outOfRangeWashermen.sort((a, b) => a.distance - b.distance)[0];
      response.suggestion = `The closest washerman (${closestWasherman.name}) is ${closestWasherman.distance}m away, but their service range is ${closestWasherman.range}m.`;
    }

    res.json(response);

  } catch (err) {
    console.error("Error checking service availability:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error while checking service availability" 
    });
  }
};

// Get customer's saved location
exports.getCustomerLocation = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    if (!user.location || !user.location.coordinates) {
      return res.status(404).json({ 
        success: false,
        message: "Location not found" 
      });
    }

    res.json({
      success: true,
      location: {
        lat: user.location.coordinates[1],
        lng: user.location.coordinates[0],
        address: user.address || null
      }
    });

  } catch (err) {
    console.error("Error fetching customer location:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error while fetching location" 
    });
  }
};

