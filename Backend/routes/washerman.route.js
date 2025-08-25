


// const express = require('express');
// const router = express.Router();
// const washermanController = require('../controllers/washerman.controller');
// const { isAuth, isWasherman } = require('../middleware/isAuth');

// // Public/Customer/Admin routes
// router.get('/', washermanController.getAllWashermen);

// // ✅ Admin Dashboard Data Route (must be before `/:id` to avoid conflict)
// router.get('/dashboard/all', washermanController.getAllLaundrymen);

// // Get individual washerman
// router.get('/:id', washermanController.getWashermanById);

// // Protected Washerman-only routes
// router.put('/range', isAuth, isWasherman, washermanController.updateRange);
// router.put('/location', isAuth, isWasherman, washermanController.updateLocation);
// router.get('/search', isAuth, isWasherman, washermanController.findWashermenWithinRange);

// module.exports = router;




const express = require('express');
const router = express.Router();
const washermanController = require('../controllers/washerman.controller');
const { isAuth, isWasherman } = require('../middleware/isAuth');

// Public/Customer/Admin routes
router.get('/', washermanController.getAllWashermen);

// ✅ Admin Dashboard Data Route (must be before `/:id`)
router.get('/dashboard/all', washermanController.getAllLaundrymen);

// ✅ These must come BEFORE `/:id`
router.put('/range', isAuth, isWasherman, washermanController.updateRange);
router.put('/location', isAuth, isWasherman, washermanController.updateLocation);
router.get('/search', isAuth, isWasherman, washermanController.findWashermenWithinRange);

// 🔻 Move this to the BOTTOM to avoid conflict
router.get('/:id', washermanController.getWashermanById);

module.exports = router;
