


const express = require('express');
const router = express.Router();

const { isAuth, isWasherman, isCustomer } = require('../middleware/isAuth');
const { getUserDashboardStats, getWasherDashboard } = require('../controllers/dashboard.controller');

// Customer dashboard route
router.get('/customer/dashboard', isAuth, isCustomer, getUserDashboardStats);

// Washerman dashboard route
router.get('/washer/dashboard', isAuth, isWasherman, getWasherDashboard);

module.exports = router;




