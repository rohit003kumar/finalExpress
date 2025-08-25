









// const express = require('express');
// const router = express.Router();
// const { isAuth } = require('../middleware/isAuth');
// const {
//   updateCustomerLocation,
//   getNearbyWashermen,
//   getAllWashermenLocations,
//   getCustomersNearLaundryman,
//   createSampleWashermen,
// } = require('../controllers/location.controller');

// router.post('/user/location', isAuth, updateCustomerLocation);  // ✅ Save    //>>>>>
// router.get('/user/location', isAuth, async (req, res) => {       // ✅ Get
//   try {
//     const user = await User.findById(req.userId);
//     if (!user || !user.location) {
//       return res.status(404).json({ message: "Location not found" });
//     }
//     res.json({
//       location: {
//         lat: user.location.coordinates[1],
//         lng: user.location.coordinates[0],
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.get('/washer/nearby', getNearbyWashermen);       //>>>>
// router.get('/customer/nearby-services', getNearbyWashermen);

// router.get('/washer/all-locations', getAllWashermenLocations);       //>>>
// router.get('/customers-near-laundryman', isAuth, getCustomersNearLaundryman);
// router.post('/washer/sample', createSampleWashermen);     //>>>

// module.exports = router;















const express = require('express');
const router = express.Router();
const { isAuth } = require('../middleware/isAuth');
const {
  updateCustomerLocation,
  getNearbyWashermen,
  getNearbyWashermenByAddress,
  getAllWashermenLocations,
  getCustomersNearLaundryman,
  createSampleWashermen,
  checkServiceAvailability,
  getCustomerLocation,
} = require('../controllers/location.controller');

// Customer location management
router.post('/user/location', isAuth, updateCustomerLocation);  // ✅ Save location
router.get('/user/location', isAuth, getCustomerLocation);      // ✅ Get saved location

// Service availability checking
router.post('/check-availability', isAuth, checkServiceAvailability);  // ✅ Enhanced service availability check

// Nearby services
router.get('/washer/nearby', getNearbyWashermen);       // ✅ Get nearby washermen by coordinates
router.get('/customer/nearby-services', getNearbyWashermen);
router.get('/customer/nearby-services-by-address', getNearbyWashermenByAddress);

// Admin/Washerman endpoints
router.get('/washer/all-locations', getAllWashermenLocations);       // ✅ Get all washermen locations
router.get('/customers-near-laundryman', isAuth, getCustomersNearLaundryman);
router.post('/washer/sample', createSampleWashermen);     // ✅ Create sample data

module.exports = router;







