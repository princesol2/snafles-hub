const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/orders
// @desc    Get user orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('items.product', 'name images')
      .populate('items.vendor', 'name logo')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    })
      .populate('items.product', 'name images description')
      .populate('items.vendor', 'name logo location');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', auth, [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('shipping').isObject().withMessage('Shipping information is required'),
  body('payment.method').isIn(['card', 'upi', 'cod', 'wallet']).withMessage('Invalid payment method')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, shipping, payment, coupon, redeemPoints = 0 } = req.body;

    // Validate and get product details
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0],
        vendor: product.vendor
      });
    }

    // Calculate totals
    const shippingCost = subtotal > 999 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18);
    const discount = coupon ? Math.round(subtotal * (coupon.discount || 0)) : 0;

    // Apply Snapples (loyalty) points as discount: 1 point = ₹1
    let pointsApplied = 0;
    let pointsDiscount = 0;
    if (redeemPoints && redeemPoints > 0) {
      const dbUser = await User.findById(req.user._id).select('loyaltyPoints');
      const usable = Math.min(redeemPoints, dbUser?.loyaltyPoints || 0);
      pointsApplied = usable;
      pointsDiscount = usable; // 1:1 INR value
      // Deduct immediately to avoid double-spend
      if (usable > 0) {
        await User.findByIdAndUpdate(req.user._id, { $inc: { loyaltyPoints: -usable } });
      }
    }

    const total = Math.max(0, subtotal + shippingCost + tax - discount - pointsDiscount);

    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shipping,
      payment: {
        ...payment,
        amount: total
      },
      subtotal,
      shippingCost,
      tax,
      discount,
      points: { applied: pointsApplied, discount: pointsDiscount },
      coupon,
      total,
      status: 'pending'
    });

    await order.save();

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Populate order for response
    await order.populate([
      { path: 'items.product', select: 'name images' },
      { path: 'items.vendor', select: 'name logo' }
    ]);

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error while creating order' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private
router.put('/:id/status', auth, [
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, trackingNumber, carrier } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status
    order.status = status;

    // Add tracking information if provided
    if (trackingNumber && carrier) {
      order.tracking = {
        carrier,
        trackingNumber,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'in_transit',
        updates: [{
          status: 'shipped',
          location: 'Warehouse',
          description: 'Order has been shipped',
          timestamp: new Date()
        }]
      };
    }

    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error while updating order status' });
  }
});

// @route   POST /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    // Update order status
    order.status = 'cancelled';
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error while cancelling order' });
  }
});

// @route   GET /api/orders/tracking/:orderNumber
// @desc    Track order by order number
// @access  Public
router.get('/tracking/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('items.product', 'name images')
      .populate('items.vendor', 'name logo');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        tracking: order.tracking,
        items: order.items,
        shipping: order.shipping,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({ message: 'Server error while tracking order' });
  }
});

module.exports = router;
