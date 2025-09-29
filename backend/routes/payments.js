const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Stripe setup
let stripe = null;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  }
} catch (e) {
  console.warn('Stripe SDK not loaded:', e?.message || e);
}

// @route   POST /api/payments/create-payment-intent
// @desc    Create payment intent for card/upi/cod/wallet
// @access  Private
router.post('/create-payment-intent', auth, [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be a positive number'),
  body('currency').optional().isIn(['usd', 'inr', 'eur']).withMessage('Invalid currency'),
  body('orderId').optional().isString(),
  body('paymentMethod').optional().isIn(['card', 'upi', 'cod', 'wallet']).withMessage('Invalid payment method')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { amount, currency = 'inr', orderId, paymentMethod = 'card', upiId } = req.body;
    const amountInMinor = Math.round(amount * 100);

    if (paymentMethod === 'card') {
      if (!stripe) {
        return res.status(500).json({ message: 'Stripe not configured. Set STRIPE_SECRET_KEY.' });
      }
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInMinor,
        currency,
        metadata: {
          userId: String(req.user._id),
          orderId: orderId || ''
        },
        automatic_payment_methods: { enabled: true }
      });
      return res.json({
        message: 'Payment intent created successfully',
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        method: 'card'
      });
    }

    if (paymentMethod === 'upi') {
      // Generate a basic UPI link; client can open and pay via installed app
      const payee = encodeURIComponent('merchant@snafles');
      const txnRef = `upi_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
      const note = encodeURIComponent('SnaflesHub Order Payment');
      const upiAmount = (amount).toFixed(2);
      const upiLink = `upi://pay?pa=${payee}&pn=SnaflesHub&tr=${txnRef}&tn=${note}&am=${upiAmount}&cu=INR`;
      const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;
      return res.json({
        message: 'UPI payment initiated',
        upiLink,
        qrCode,
        paymentIntentId: txnRef,
        method: 'upi'
      });
    }

    if (paymentMethod === 'cod') {
      const pid = `cod_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
      return res.json({
        message: 'COD selected. Order will be paid on delivery.',
        paymentIntentId: pid,
        method: 'cod'
      });
    }

    if (paymentMethod === 'wallet') {
      // Validate wallet balance without deducting yet
      const User = require('../models/User');
      const user = await User.findById(req.user._id).select('walletBalance');
      if (!user) return res.status(404).json({ message: 'User not found' });
      if ((user.walletBalance || 0) < amount) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }
      const pid = `wallet_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
      return res.json({
        message: 'Wallet payment authorized',
        paymentIntentId: pid,
        method: 'wallet'
      });
    }

    return res.status(400).json({ message: 'Unsupported payment method' });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: error?.message || 'Server error while creating payment intent' });
  }
});

// @route   POST /api/payments/confirm-payment
// @desc    Confirm and verify payment, update order
// @access  Private
router.post('/confirm-payment', auth, [
  body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required'),
  body('orderId').notEmpty().withMessage('Order ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { paymentIntentId, orderId } = req.body;

    const Order = require('../models/Order');
    const User = require('../models/User');
    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const method = order.payment?.method || 'card';

    if (method === 'card') {
      if (!stripe) return res.status(500).json({ message: 'Stripe not configured' });
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (!pi) return res.status(404).json({ message: 'Payment Intent not found' });
      if (pi.status !== 'succeeded') {
        return res.status(400).json({ message: `Payment not succeeded (status: ${pi.status})` });
      }
      order.payment.status = 'completed';
      order.payment.transactionId = paymentIntentId;
      order.status = 'confirmed';
    } else if (method === 'upi') {
      // Trust client confirmation for now; in production, verify via PSP webhook
      order.payment.status = 'completed';
      order.payment.transactionId = paymentIntentId;
      order.status = 'confirmed';
    } else if (method === 'wallet') {
      // Deduct wallet and mark completed
      const user = await User.findById(req.user._id).select('walletBalance loyaltyPoints');
      if (!user) return res.status(404).json({ message: 'User not found' });
      if ((user.walletBalance || 0) < (order.total || 0)) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }
      user.walletBalance = (user.walletBalance || 0) - (order.total || 0);
      await user.save();
      order.payment.status = 'completed';
      order.payment.transactionId = paymentIntentId;
      order.status = 'confirmed';
    } else if (method === 'cod') {
      // COD stays pending until delivery
      order.payment.status = 'pending';
      order.payment.transactionId = paymentIntentId;
      order.status = 'pending';
    }

    // Award Snapples points on successful non-COD payments
    if (order.payment.status === 'completed') {
      const earned = Math.floor((order.total || 0) / 100); // 1 point per ₹100
      if (earned > 0) {
        await User.findByIdAndUpdate(req.user._id, { $inc: { loyaltyPoints: earned } });
      }
    }

    await order.save();

    res.json({
      message: 'Payment confirmation processed',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.payment.status
      }
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: error?.message || 'Server error while confirming payment' });
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
