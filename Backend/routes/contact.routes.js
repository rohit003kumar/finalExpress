const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/contactMessage.model');

// POST /contact — user submits contact form
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const saved = await ContactMessage.create({ name, email, message });
    res.status(201).json({ success: true, message: 'Message saved!', data: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to save message' });
  }
});

// GET /contact/admin — admin sees all messages
router.get('/admin', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching messages' });
  }
});

module.exports = router;
