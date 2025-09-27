const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, vendorAuth } = require('../middleware/auth');
const Order = require('../models/Order');
const shippingService = require('../services/shippingService');

const router = express.Router();

// @route   GET /api/shipping/carriers
// @desc    Get available shipping carriers
// @access  Public
router.get('/carriers', (req, res) => {
  try {
    const carriers = shippingService.getAvailableCarriers();
    res.json({ carriers });
  } catch (error) {
    console.error('Get carriers error:', error);
    res.status(500).json({ message: 'Server error while fetching carriers' });
  }
});

// @route   POST /api/shipping/calculate
// @desc    Calculate shipping cost
// @access  Public
router.post('/calculate', [
  body('items').isArray({ min: 1 }).withMessage('Items array is required'),
  body('shipping').isObject().withMessage('Shipping information is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, shipping, carrier = 'bluedart' } = req.body;

    // Validate address
    const addressValidation = shippingService.validateAddress(shipping);
    if (!addressValidation.valid) {
      return res.status(400).json({ 
        message: 'Invalid shipping address',
        errors: addressValidation.errors 
      });
    }

    // Create mock order for cost calculation
    const mockOrder = {
      items,
      shipping,
      subtotal: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    const cost = shippingService.calculateShippingCost(mockOrder);
    const estimatedDelivery = shippingService.calculateEstimatedDelivery(shipping);

    res.json({
      cost,
      estimatedDelivery,
      carrier,
      freeShippingThreshold: 999
    });
  } catch (error) {
    console.error('Calculate shipping error:', error);
    res.status(500).json({ message: 'Server error while calculating shipping' });
  }
});

// @route   POST /api/shipping/label/:orderId
// @desc    Generate shipping label for order
// @access  Private (Vendor/Admin)
router.post('/label/:orderId', vendorAuth, [
  body('carrier').isIn(['bluedart', 'delhivery', 'dtdc', 'fedex']).withMessage('Invalid carrier')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { carrier } = req.body;
    const orderId = req.params.orderId;

    // Find order
    const order = await Order.findById(orderId)
      .populate('items.product', 'name weight')
      .populate('items.vendor', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized (vendor or admin)
    const isVendor = order.items.some(item => 
      item.vendor && item.vendor._id.toString() === req.user._id.toString()
    );
    
    if (!isVendor && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to generate label for this order' });
    }

    // Generate shipping label
    const labelResult = await shippingService.generateShippingLabel({
      order,
      carrier
    });

    if (!labelResult.success) {
      return res.status(500).json({ message: labelResult.error });
    }

    // Update order with tracking information
    order.tracking = {
      carrier: labelResult.label.carrier,
      trackingNumber: labelResult.label.trackingNumber,
      estimatedDelivery: labelResult.label.estimatedDelivery,
      status: 'shipped',
      updates: [{
        status: 'shipped',
        location: 'Origin Warehouse',
        description: 'Order has been shipped',
        timestamp: new Date()
      }]
    };

    order.status = 'shipped';
    await order.save();

    res.json({
      message: 'Shipping label generated successfully',
      label: labelResult.label
    });
  } catch (error) {
    console.error('Generate shipping label error:', error);
    res.status(500).json({ message: 'Server error while generating shipping label' });
  }
});

// @route   GET /api/shipping/track/:trackingNumber
// @desc    Track shipment
// @access  Public
router.get('/track/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const { carrier } = req.query;

    // Find order by tracking number
    const order = await Order.findOne({ 'tracking.trackingNumber': trackingNumber })
      .populate('items.product', 'name images')
      .populate('items.vendor', 'name logo');

    if (!order) {
      return res.status(404).json({ message: 'Tracking number not found' });
    }

    // Get updated tracking information
    const trackingResult = await shippingService.trackShipment(
      trackingNumber, 
      carrier || order.tracking.carrier
    );

    if (!trackingResult.success) {
      return res.status(500).json({ message: trackingResult.error });
    }

    // Update order tracking if status changed
    if (trackingResult.tracking.status !== order.tracking.status) {
      order.tracking.status = trackingResult.tracking.status;
      order.tracking.updates = trackingResult.tracking.updates;
      
      // Update order status based on tracking status
      if (trackingResult.tracking.status === 'delivered') {
        order.status = 'delivered';
      }
      
      await order.save();
    }

    res.json({
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        tracking: order.tracking,
        items: order.items,
        shipping: order.shipping,
        createdAt: order.createdAt
      },
      tracking: trackingResult.tracking
    });
  } catch (error) {
    console.error('Track shipment error:', error);
    res.status(500).json({ message: 'Server error while tracking shipment' });
  }
});

// @route   PUT /api/shipping/update/:orderId
// @desc    Update shipping information
// @access  Private (Vendor/Admin)
router.put('/update/:orderId', vendorAuth, [
  body('status').optional().isIn(['shipped', 'delivered', 'exception']),
  body('trackingNumber').optional().isString(),
  body('carrier').optional().isString(),
  body('location').optional().isString(),
  body('description').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const orderId = req.params.orderId;
    const { status, trackingNumber, carrier, location, description } = req.body;

    // Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    const isVendor = order.items.some(item => 
      item.vendor && item.vendor.toString() === req.user._id.toString()
    );
    
    if (!isVendor && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // Update tracking information
    if (!order.tracking) {
      order.tracking = {
        carrier: carrier || 'bluedart',
        trackingNumber: trackingNumber || '',
        status: status || 'shipped',
        updates: []
      };
    }

    // Add tracking update
    if (status || location || description) {
      order.tracking.updates.push({
        status: status || order.tracking.status,
        location: location || 'Unknown',
        description: description || 'Status updated',
        timestamp: new Date()
      });
    }

    // Update fields if provided
    if (status) order.tracking.status = status;
    if (trackingNumber) order.tracking.trackingNumber = trackingNumber;
    if (carrier) order.tracking.carrier = carrier;

    // Update order status
    if (status === 'delivered') {
      order.status = 'delivered';
    } else if (status === 'shipped') {
      order.status = 'shipped';
    }

    await order.save();

    res.json({
      message: 'Shipping information updated successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        tracking: order.tracking
      }
    });
  } catch (error) {
    console.error('Update shipping error:', error);
    res.status(500).json({ message: 'Server error while updating shipping information' });
  }
});

module.exports = router;
