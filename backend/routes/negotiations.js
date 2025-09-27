const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { auth, vendorAuth } = require('../middleware/auth');
const ChatMessage = require('../models/ChatMessage');
const Product = require('../models/Product');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/negotiations
// @desc    Get user negotiations
// @access  Private
router.get('/', auth, [
  query('status').optional().isIn(['pending', 'accepted', 'rejected', 'completed']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter based on user role
    let filter = {};
    if (req.user.role === 'vendor') {
      filter = { sellerId: req.user._id };
    } else {
      filter = { buyerId: req.user._id };
    }

    if (status) {
      filter.status = status;
    }

    const negotiations = await ChatMessage.find(filter)
      .populate('productId', 'name price images')
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ChatMessage.countDocuments(filter);

    res.json({
      negotiations,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalNegotiations: total,
        hasNext: skip + negotiations.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get negotiations error:', error);
    res.status(500).json({ message: 'Server error while fetching negotiations' });
  }
});

// @route   GET /api/negotiations/:id
// @desc    Get single negotiation
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const negotiation = await ChatMessage.findById(req.params.id)
      .populate('productId', 'name price images vendor')
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email');

    if (!negotiation) {
      return res.status(404).json({ message: 'Negotiation not found' });
    }

    // Check if user is part of this negotiation
    if (req.user.role !== 'admin' && 
        negotiation.buyerId._id.toString() !== req.user._id.toString() && 
        negotiation.sellerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this negotiation' });
    }

    res.json(negotiation);
  } catch (error) {
    console.error('Get negotiation error:', error);
    res.status(500).json({ message: 'Server error while fetching negotiation' });
  }
});

// @route   POST /api/negotiations
// @desc    Create new negotiation
// @access  Private
router.post('/', auth, [
  body('productId').isMongoId().withMessage('Valid product ID required'),
  body('proposedPrice').isFloat({ min: 0.01 }).withMessage('Valid proposed price required'),
  body('message').optional().isLength({ min: 1, max: 500 }).withMessage('Message must be between 1 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, proposedPrice, message } = req.body;

    // Check if product exists and is negotiable
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.negotiable === false) {
      return res.status(400).json({ message: 'This product is not negotiable' });
    }

    // Check if user is not the vendor
    if (product.vendor.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot negotiate on your own product' });
    }

    // Create negotiation
    const negotiation = new ChatMessage({
      productId,
      buyerId: req.user._id,
      sellerId: product.vendor,
      senderId: req.user._id,
      type: 'offer',
      amount: proposedPrice,
      message: message || `Proposed price: ${proposedPrice}`,
      status: 'pending'
    });

    await negotiation.save();

    await negotiation.populate([
      { path: 'productId', select: 'name price images' },
      { path: 'buyerId', select: 'name email' },
      { path: 'sellerId', select: 'name email' }
    ]);

    res.status(201).json({
      message: 'Negotiation created successfully',
      negotiation
    });
  } catch (error) {
    console.error('Create negotiation error:', error);
    res.status(500).json({ message: 'Server error while creating negotiation' });
  }
});

// @route   PUT /api/negotiations/:id/status
// @desc    Update negotiation status
// @access  Private
router.put('/:id/status', auth, [
  body('status').isIn(['pending', 'accepted', 'rejected', 'completed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const negotiation = await ChatMessage.findById(req.params.id);

    if (!negotiation) {
      return res.status(404).json({ message: 'Negotiation not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && 
        negotiation.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this negotiation' });
    }

    negotiation.status = status;
    await negotiation.save();

    res.json({
      message: 'Negotiation status updated successfully',
      negotiation
    });
  } catch (error) {
    console.error('Update negotiation status error:', error);
    res.status(500).json({ message: 'Server error while updating negotiation status' });
  }
});

module.exports = router;
