const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payments/create-payment-intent
// @desc    Create Stripe payment intent
// @access  Private
router.post('/create-payment-intent', auth, [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be a positive number'),
  body('currency').optional().isIn(['usd', 'inr', 'eur']).withMessage('Invalid currency')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, currency = 'inr', orderId } = req.body;

    // In a real implementation, you would integrate with Stripe here
    // For now, we'll simulate the payment intent creation
    
    const paymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      status: 'requires_payment_method',
      orderId: orderId
    };

    res.json({
      message: 'Payment intent created successfully',
      paymentIntent
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Server error while creating payment intent' });
  }
});

// @route   POST /api/payments/confirm-payment
// @desc    Confirm payment
// @access  Private
router.post('/confirm-payment', auth, [
  body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required'),
  body('orderId').notEmpty().withMessage('Order ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentIntentId, orderId } = req.body;

    // In a real implementation, you would verify the payment with Stripe here
    // For now, we'll simulate a successful payment confirmation

    const Order = require('../models/Order');
    const order = await Order.findOne({ 
      _id: orderId, 
      user: req.user._id 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order payment status
    order.payment.status = 'completed';
    order.payment.transactionId = paymentIntentId;
    order.status = 'confirmed';
    await order.save();

    res.json({
      message: 'Payment confirmed successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.payment.status
      }
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Server error while confirming payment' });
  }
});

// @route   POST /api/payments/refund
// @desc    Process refund
// @access  Private
router.post('/refund', auth, [
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('amount').optional().isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('reason').optional().trim().isLength({ min: 5 }).withMessage('Reason must be at least 5 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, amount, reason = 'Customer request' } = req.body;

    const Order = require('../models/Order');
    const order = await Order.findOne({ 
      _id: orderId, 
      user: req.user._id 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.payment.status !== 'completed') {
      return res.status(400).json({ message: 'Order payment not completed' });
    }

    // In a real implementation, you would process the refund with Stripe here
    // For now, we'll simulate a successful refund

    const refundAmount = amount || order.total;
    const refund = {
      id: `re_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: refundAmount,
      currency: 'inr',
      status: 'succeeded',
      reason: reason,
      createdAt: new Date()
    };

    // Update order status
    order.payment.status = 'refunded';
    order.status = 'cancelled';
    await order.save();

    res.json({
      message: 'Refund processed successfully',
      refund
    });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({ message: 'Server error while processing refund' });
  }
});

// @route   GET /api/payments/methods
// @desc    Get available payment methods
// @access  Public
router.get('/methods', (req, res) => {
  try {
    const paymentMethods = [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        description: 'Visa, Mastercard, American Express',
        icon: '💳',
        enabled: true
      },
      {
        id: 'upi',
        name: 'UPI',
        description: 'Google Pay, PhonePe, Paytm',
        icon: '📱',
        enabled: true
      },
      {
        id: 'netbanking',
        name: 'Net Banking',
        description: 'All major banks',
        icon: '🏦',
        enabled: true
      },
      {
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay when your order is delivered',
        icon: '💰',
        enabled: true
      }
    ];

    res.json({
      paymentMethods
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ message: 'Server error while fetching payment methods' });
  }
});

module.exports = router;
