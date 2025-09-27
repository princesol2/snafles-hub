const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ChatMessage = require('../models/ChatMessage');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    // Get basic counts
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalVendors = await User.countDocuments({ role: 'vendor' });
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();

    // Get revenue data
    const revenueData = await Order.aggregate([
      { $match: { status: 'delivered' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' }
        }
      }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    const averageOrderValue = revenueData.length > 0 ? revenueData[0].averageOrderValue : 0;

    // Get pending approvals
    const pendingVendorApprovals = await User.countDocuments({ 
      role: 'vendor', 
      isVerified: false 
    });
    const pendingProductApprovals = await Product.countDocuments({ 
      approved: false, 
      isActive: true 
    });

    // Get active negotiations
    const activeNegotiations = await ChatMessage.countDocuments({ 
      type: 'offer', 
      status: 'pending' 
    });

    // Get platform rating (average of all product ratings)
    const ratingData = await Product.aggregate([
      { $match: { isActive: true, approved: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    const platformRating = ratingData.length > 0 ? ratingData[0].averageRating : 0;

    // Get recent activity
    const recentUsers = await User.find({ role: 'customer' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    const recentVendors = await User.find({ role: 'vendor' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt isVerified');

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .select('orderNumber total status createdAt');

    res.json({
      stats: {
        totalUsers,
        totalVendors,
        totalProducts,
        totalOrders,
        totalRevenue,
        averageOrderValue,
        pendingApprovals: pendingVendorApprovals + pendingProductApprovals,
        activeNegotiations,
        platformRating: Math.round(platformRating * 10) / 10
      },
      recentActivity: {
        users: recentUsers,
        vendors: recentVendors,
        orders: recentOrders
      }
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard data' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with filtering and pagination
// @access  Private (Admin)
router.get('/users', adminAuth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role').optional().isIn(['customer', 'vendor', 'admin']),
  query('status').optional().isIn(['active', 'inactive', 'banned']),
  query('search').optional().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { page = 1, limit = 20, role, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter
    const filter = {};
    if (role) filter.role = role;
    if (status) {
      if (status === 'active') filter.isActive = true;
      if (status === 'inactive') filter.isActive = false;
      if (status === 'banned') filter.isBanned = true;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalUsers: total,
        hasNext: skip + users.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// @route   GET /api/admin/vendors
// @desc    Get all vendors with filtering and pagination
// @access  Private (Admin)
router.get('/vendors', adminAuth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['verified', 'unverified', 'banned']),
  query('search').optional().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter
    const filter = { role: 'vendor' };
    if (status === 'verified') filter.isVerified = true;
    if (status === 'unverified') filter.isVerified = false;
    if (status === 'banned') filter.isBanned = true;
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const vendors = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      vendors,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalVendors: total,
        hasNext: skip + vendors.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get admin vendors error:', error);
    res.status(500).json({ message: 'Server error while fetching vendors' });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (ban/unban, activate/deactivate)
// @access  Private (Admin)
router.put('/users/:id/status', adminAuth, [
  body('status').isIn(['active', 'inactive', 'banned']).withMessage('Invalid status'),
  body('reason').optional().isLength({ min: 1, max: 500 }).withMessage('Reason must be between 1 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from modifying other admins
    if (user.role === 'admin' && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Cannot modify other admin accounts' });
    }

    // Update user status
    if (status === 'active') {
      user.isActive = true;
      user.isBanned = false;
    } else if (status === 'inactive') {
      user.isActive = false;
      user.isBanned = false;
    } else if (status === 'banned') {
      user.isActive = false;
      user.isBanned = true;
    }

    // Add reason to user's status history
    if (reason) {
      if (!user.statusHistory) user.statusHistory = [];
      user.statusHistory.push({
        status,
        reason,
        changedBy: req.user._id,
        changedAt: new Date()
      });
    }

    await user.save();

    res.json({
      message: 'User status updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isBanned: user.isBanned
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error while updating user status' });
  }
});

// @route   PUT /api/admin/vendors/:id/status
// @desc    Update vendor verification status
// @access  Private (Admin)
router.put('/vendors/:id/status', adminAuth, [
  body('isVerified').isBoolean().withMessage('isVerified must be boolean'),
  body('reason').optional().isLength({ min: 1, max: 500 }).withMessage('Reason must be between 1 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { isVerified, reason } = req.body;
    const vendor = await User.findById(req.params.id);

    if (!vendor || vendor.role !== 'vendor') {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    vendor.isVerified = isVerified;

    // Add verification history
    if (!vendor.verificationHistory) vendor.verificationHistory = [];
    vendor.verificationHistory.push({
      isVerified,
      reason,
      verifiedBy: req.user._id,
      verifiedAt: new Date()
    });

    await vendor.save();

    res.json({
      message: 'Vendor verification status updated successfully',
      vendor: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        isVerified: vendor.isVerified
      }
    });
  } catch (error) {
    console.error('Update vendor status error:', error);
    res.status(500).json({ message: 'Server error while updating vendor status' });
  }
});

// @route   GET /api/admin/negotiations
// @desc    Get all negotiations for moderation
// @access  Private (Admin)
router.get('/negotiations', adminAuth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'accepted', 'rejected', 'completed']),
  query('type').optional().isIn(['offer', 'counter-offer'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { page = 1, limit = 20, status, type } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter
    const filter = { type: 'offer' };
    if (status) filter.status = status;

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
    console.error('Get admin negotiations error:', error);
    res.status(500).json({ message: 'Server error while fetching negotiations' });
  }
});

// @route   PUT /api/admin/negotiations/:id/moderate
// @desc    Moderate a negotiation (approve/reject)
// @access  Private (Admin)
router.put('/negotiations/:id/moderate', adminAuth, [
  body('action').isIn(['approve', 'reject']).withMessage('Action must be approve or reject'),
  body('reason').optional().isLength({ min: 1, max: 500 }).withMessage('Reason must be between 1 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { action, reason } = req.body;
    const negotiation = await ChatMessage.findById(req.params.id);

    if (!negotiation) {
      return res.status(404).json({ message: 'Negotiation not found' });
    }

    if (action === 'approve') {
      negotiation.status = 'accepted';
    } else {
      negotiation.status = 'rejected';
    }

    // Add moderation history
    if (!negotiation.moderationHistory) negotiation.moderationHistory = [];
    negotiation.moderationHistory.push({
      action,
      reason,
      moderatedBy: req.user._id,
      moderatedAt: new Date()
    });

    await negotiation.save();

    res.json({
      message: `Negotiation ${action}d successfully`,
      negotiation
    });
  } catch (error) {
    console.error('Moderate negotiation error:', error);
    res.status(500).json({ message: 'Server error while moderating negotiation' });
  }
});

module.exports = router;
