const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const ChatMessage = require('../models/ChatMessage');
const Product = require('../models/Product');

const router = express.Router();

// Utility: pick sellerId from product.vendor
const resolveSellerId = async (productId) => {
  const product = await Product.findById(productId).select('vendor');
  return product?.vendor;
};

// @route   GET /api/chat/messages/:productId
// @desc    Get chat messages for a product between current user and seller
// @access  Private
router.get('/messages/:productId', auth, async (req, res) => {
  try {
    const productId = req.params.productId;
    const sellerId = await resolveSellerId(productId);
    if (!sellerId) return res.status(404).json({ message: 'Product or seller not found' });

    const filter = {
      productId,
      $or: [
        { buyerId: req.user._id, sellerId },
        { buyerId: sellerId, sellerId: req.user._id }
      ]
    };

    // Normalize response to match frontend expectations
    const messages = await ChatMessage.find(filter).sort({ createdAt: 1 });
    const result = messages.map(m => ({
      id: m._id,
      productId: m.productId,
      senderId: m.senderId,
      message: m.message,
      type: m.type,
      amount: m.amount,
      status: m.status,
      timestamp: m.createdAt
    }));
    res.json(result);
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ message: 'Server error while fetching chat messages' });
  }
});

// @route   POST /api/chat/send
// @desc    Send a text message
// @access  Private
router.post('/send', auth, [
  body('productId').isMongoId().withMessage('Valid productId required'),
  body('message').isLength({ min: 1 }).withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { productId, sellerId: sellerIdBody, message } = req.body;
    const sellerId = sellerIdBody || await resolveSellerId(productId);
    if (!sellerId) return res.status(404).json({ message: 'Seller not found' });

    const msg = await ChatMessage.create({
      productId,
      buyerId: req.user._id,
      sellerId,
      senderId: req.user._id,
      type: 'text',
      message
    });

    res.status(201).json({ message: 'Message sent', id: msg._id });
  } catch (error) {
    console.error('Send chat message error:', error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
});

// @route   POST /api/chat/send-offer
// @desc    Send an offer message
// @access  Private
router.post('/send-offer', auth, [
  body('productId').isMongoId().withMessage('Valid productId required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { productId, sellerId: sellerIdBody, amount } = req.body;
    const sellerId = sellerIdBody || await resolveSellerId(productId);
    if (!sellerId) return res.status(404).json({ message: 'Seller not found' });

    // Negotiation limits: require minimal order history for buyer
    const Order = require('../models/Order');
    const pastOrders = await Order.countDocuments({ user: req.user._id, status: 'delivered' });
    const minOrdersRequired = parseInt(process.env.NEGOTIATION_MIN_ORDERS || '0');
    if (pastOrders < minOrdersRequired) {
      return res.status(403).json({ message: `Negotiation not allowed. Requires at least ${minOrdersRequired} delivered orders.` });
    }

    // Payment verification required
    if (!req.user.paymentVerified) {
      return res.status(403).json({ message: 'Please verify your payment method to negotiate prices.' });
    }

    // Helper Points + product configuration influence: enforce a minimum offer threshold
    const product = await Product.findById(productId).select('price negotiable minOfferRatio');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.negotiable === false) {
      return res.status(403).json({ message: 'This product has a fixed price. Negotiation is not allowed.' });
    }
    const points = req.user.loyaltyPoints || 0;
    let minRatio = typeof product.minOfferRatio === 'number' ? product.minOfferRatio : 0.9;
    if (points >= 2500) minRatio = Math.min(minRatio, 0.5);
    else if (points >= 1000) minRatio = Math.min(minRatio, 0.6);
    else if (points >= 500) minRatio = Math.min(minRatio, 0.7);
    else if (points >= 100) minRatio = Math.min(minRatio, 0.8);

    // Penalize bad repayment history (stricter requirement)
    try {
      const Repayment = require('../models/Repayment');
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const failed = await Repayment.exists({ borrowerId: req.user._id, status: 'failed', updatedAt: { $gte: sixMonthsAgo } });
      if (failed) {
        minRatio = Math.max(minRatio, 0.95);
      }
    } catch (_) {}

    const maxDiscount = parseInt(process.env.MAX_NEGOTIATION_DISCOUNT || '500', 10);
    const floorByRatio = Math.round(product.price * minRatio);
    const floorByAbsolute = Math.max(0, Math.round(product.price - maxDiscount));
    const minAllowed = Math.max(floorByRatio, floorByAbsolute);
    if (amount < minAllowed) {
      return res.status(400).json({ message: `Offer too low. Minimum allowed is ${minAllowed} based on your points.` });
    }

    const msg = await ChatMessage.create({
      productId,
      buyerId: req.user._id,
      sellerId,
      senderId: req.user._id,
      type: 'offer',
      amount,
      status: 'pending',
      message: `Offer: ${amount}`
    });

    res.status(201).json({ message: 'Offer sent', id: msg._id });
  } catch (error) {
    console.error('Send offer error:', error);
    res.status(500).json({ message: 'Server error while sending offer' });
  }
});

// @route   POST /api/chat/accept-offer/:messageId
// @desc    Accept an offer (seller/admin)
// @access  Private
router.post('/accept-offer/:messageId', auth, async (req, res) => {
  try {
    const msg = await ChatMessage.findById(req.params.messageId);
    if (!msg) return res.status(404).json({ message: 'Offer not found' });

    // Only the seller/admin can accept
    if (req.user.role !== 'admin' && req.user._id.toString() !== msg.sellerId.toString()) {
      return res.status(403).json({ message: 'Not authorized to accept this offer' });
    }

    if (msg.type !== 'offer' || msg.status !== 'pending') {
      return res.status(400).json({ message: 'Offer is not pending' });
    }

    msg.status = 'accepted';
    await msg.save();

    res.json({ message: 'Offer accepted' });
  } catch (error) {
    console.error('Accept offer error:', error);
    res.status(500).json({ message: 'Server error while accepting offer' });
  }
});

// @route   POST /api/chat/reject-offer/:messageId
// @desc    Reject an offer (seller/admin)
// @access  Private
router.post('/reject-offer/:messageId', auth, async (req, res) => {
  try {
    const msg = await ChatMessage.findById(req.params.messageId);
    if (!msg) return res.status(404).json({ message: 'Offer not found' });

    // Only the seller/admin can reject
    if (req.user.role !== 'admin' && req.user._id.toString() !== msg.sellerId.toString()) {
      return res.status(403).json({ message: 'Not authorized to reject this offer' });
    }

    if (msg.type !== 'offer' || msg.status !== 'pending') {
      return res.status(400).json({ message: 'Offer is not pending' });
    }

    msg.status = 'rejected';
    await msg.save();

    res.json({ message: 'Offer rejected' });
  } catch (error) {
    console.error('Reject offer error:', error);
    res.status(500).json({ message: 'Server error while rejecting offer' });
  }
});

module.exports = router;
