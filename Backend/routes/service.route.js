

const express = require('express');
const router = express.Router();
const Service = require('../models/service.model');

// GET all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// OPTIONAL: POST to add new services (for seeding or admin)
router.post('/', async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;








