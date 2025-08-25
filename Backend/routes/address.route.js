const express = require('express');
const router = express.Router();
const { isAuth } = require('../middleware/isAuth');
const User = require('../models/user.model');
const Order = require('../models/booking.model');

// Save customer address
router.post('/user/address', isAuth, async (req, res) => {
  try {
    const { address, isDefault = true } = req.body;
    const userId = req.user.id;

    // Validate address data
    if (!address || !address.houseNo || !address.street || !address.city || !address.state || !address.pincode) {
      return res.status(400).json({ message: 'Missing required address fields' });
    }

    // Update user with address
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'address.houseNo': address.houseNo,
          'address.street': address.street,
          'address.landmark': address.landmark || '',
          'address.city': address.city,
          'address.state': address.state,
          'address.pincode': address.pincode,
          'address.fullAddress': address.fullAddress,
          'address.coordinates': address.coordinates || null,
          'address.isDefault': isDefault
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Address saved successfully',
      address: updatedUser.address
    });
  } catch (error) {
    console.error('Error saving address:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get customer addresses
router.get('/user/addresses', isAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      addresses: user.address ? [user.address] : []
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Send address to washerman for order
router.post('/order/delivery-address', isAuth, async (req, res) => {
  try {
    const { orderId, washermanId, deliveryAddress, deliveryInstructions } = req.body;
    const customerId = req.user.id;

    // Validate required fields
    if (!orderId || !washermanId || !deliveryAddress) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify order belongs to customer
    if (order.customer.toString() !== customerId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update order with delivery address
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          'deliveryAddress.houseNo': deliveryAddress.houseNo,
          'deliveryAddress.street': deliveryAddress.street,
          'deliveryAddress.landmark': deliveryAddress.landmark || '',
          'deliveryAddress.city': deliveryAddress.city,
          'deliveryAddress.state': deliveryAddress.state,
          'deliveryAddress.pincode': deliveryAddress.pincode,
          'deliveryAddress.fullAddress': deliveryAddress.fullAddress,
          'deliveryAddress.coordinates': deliveryAddress.coordinates || null,
          'deliveryInstructions': deliveryInstructions || '',
          'addressSentToWasherman': true,
          'addressSentAt': new Date()
        }
      },
      { new: true }
    );

    // TODO: Send notification to washerman about the delivery address
    // This could be implemented with push notifications, SMS, or email

    res.status(200).json({
      message: 'Address sent to washerman successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error sending address to washerman:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update order with delivery address
router.put('/order/:orderId/address', isAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryAddress } = req.body;
    const customerId = req.user.id;

    // Validate address data
    if (!deliveryAddress || !deliveryAddress.houseNo || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.pincode) {
      return res.status(400).json({ message: 'Missing required address fields' });
    }

    // Find and update the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify order belongs to customer
    if (order.customer.toString() !== customerId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          'deliveryAddress.houseNo': deliveryAddress.houseNo,
          'deliveryAddress.street': deliveryAddress.street,
          'deliveryAddress.landmark': deliveryAddress.landmark || '',
          'deliveryAddress.city': deliveryAddress.city,
          'deliveryAddress.state': deliveryAddress.state,
          'deliveryAddress.pincode': deliveryAddress.pincode,
          'deliveryAddress.fullAddress': deliveryAddress.fullAddress,
          'deliveryAddress.coordinates': deliveryAddress.coordinates || null,
          'addressUpdatedAt': new Date()
        }
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Order address updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order address:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get delivery address for washerman
router.get('/washerman/order/:orderId/address', isAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const washermanId = req.user.id;

    // Find the order
    const order = await Order.findById(orderId).populate('customer', 'name phone email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify order belongs to washerman
    if (order.washerman.toString() !== washermanId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({
      order: {
        _id: order._id,
        customer: order.customer,
        deliveryAddress: order.deliveryAddress,
        deliveryInstructions: order.deliveryInstructions,
        addressSentToWasherman: order.addressSentToWasherman,
        addressSentAt: order.addressSentAt,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Error fetching delivery address:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all orders with addresses for washerman
router.get('/washerman/orders-with-addresses', isAuth, async (req, res) => {
  try {
    const washermanId = req.user.id;

    const orders = await Order.find({
      washerman: washermanId,
      'deliveryAddress.fullAddress': { $exists: true, $ne: null }
    }).populate('customer', 'name phone email')
      .select('_id customer deliveryAddress deliveryInstructions status createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      orders: orders.map(order => ({
        _id: order._id,
        customer: order.customer,
        deliveryAddress: order.deliveryAddress,
        deliveryInstructions: order.deliveryInstructions,
        status: order.status,
        createdAt: order.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching orders with addresses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

