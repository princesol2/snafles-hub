const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Order = require('../models/Order');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        address: req.user.address,
        role: req.user.role,
        loyaltyPoints: req.user.loyaltyPoints,
        preferences: req.user.preferences,
        createdAt: req.user.createdAt,
        lastLogin: req.user.lastLogin
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, address, preferences } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (preferences) updateData.preferences = { ...req.user.preferences, ...preferences };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// @route   POST /api/users/wishlist
// @desc    Add item to wishlist
// @access  Private
router.post('/wishlist', auth, [
  body('productId').isMongoId().withMessage('Valid product ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId } = req.body;
    const Product = require('../models/Product');
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Avoid duplicates
    const exists = (req.user.wishlist || []).some(p => p.toString() === productId);
    if (!exists) {
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { wishlist: productId } });
    }

    res.json({ message: 'Product added to wishlist' });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error while adding to wishlist' });
  }
});

// Addresses CRUD
// @route   GET /api/users/addresses
// @desc    List addresses for current user
// @access  Private
router.get('/addresses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    const addresses = (user.addresses || []).map(a => ({
      id: a._id.toString(),
      fullName: a.fullName,
      phone: a.phone,
      addressLine1: a.addressLine1,
      addressLine2: a.addressLine2,
      city: a.city,
      state: a.state,
      zipCode: a.zipCode,
      country: a.country,
      isDefault: !!a.isDefault,
    }));
    res.json({ addresses });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ message: 'Server error while fetching addresses' });
  }
});

// @route   POST /api/users/addresses
// @desc    Add a new address
// @access  Private
router.post(
  '/addresses',
  auth,
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('addressLine1').notEmpty().withMessage('Address Line 1 is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('zipCode').notEmpty().withMessage('ZIP Code is required'),
    body('country').optional().isString(),
    body('isDefault').optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const user = await User.findById(req.user._id);
      user.addresses = user.addresses || [];

      const {
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        country = 'India',
        isDefault = false,
      } = req.body;

      // ensure single default
      if (isDefault || user.addresses.length === 0) {
        user.addresses.forEach(a => (a.isDefault = false));
      }

      user.addresses.push({
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        country,
        isDefault: isDefault || user.addresses.length === 0,
      });
      await user.save();

      const added = user.addresses[user.addresses.length - 1];
      res.status(201).json({
        message: 'Address added successfully',
        address: {
          id: added._id.toString(),
          fullName: added.fullName,
          phone: added.phone,
          addressLine1: added.addressLine1,
          addressLine2: added.addressLine2,
          city: added.city,
          state: added.state,
          zipCode: added.zipCode,
          country: added.country,
          isDefault: !!added.isDefault,
        },
      });
    } catch (error) {
      console.error('Add address error:', error);
      res.status(500).json({ message: 'Server error while adding address' });
    }
  }
);

// @route   PUT /api/users/addresses/:id
// @desc    Update an address
// @access  Private
router.put(
  '/addresses/:id',
  auth,
  [
    body('fullName').optional().notEmpty(),
    body('phone').optional().notEmpty(),
    body('addressLine1').optional().notEmpty(),
    body('addressLine2').optional(),
    body('city').optional().notEmpty(),
    body('state').optional().notEmpty(),
    body('zipCode').optional().notEmpty(),
    body('country').optional().isString(),
    body('isDefault').optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const user = await User.findById(req.user._id);
      const { id } = req.params;
      const idx = (user.addresses || []).findIndex(a => a._id.toString() === id);
      if (idx === -1) return res.status(404).json({ message: 'Address not found' });

      const updates = req.body || {};
      // Single default enforcement
      if (updates.isDefault === true) {
        user.addresses.forEach((a, i) => (a.isDefault = i === idx));
      }

      const target = user.addresses[idx];
      const allowed = ['fullName', 'phone', 'addressLine1', 'addressLine2', 'city', 'state', 'zipCode', 'country', 'isDefault'];
      allowed.forEach(k => {
        if (updates[k] !== undefined) target[k] = updates[k];
      });

      await user.save();
      const updated = user.addresses[idx];
      res.json({
        message: 'Address updated successfully',
        address: {
          id: updated._id.toString(),
          fullName: updated.fullName,
          phone: updated.phone,
          addressLine1: updated.addressLine1,
          addressLine2: updated.addressLine2,
          city: updated.city,
          state: updated.state,
          zipCode: updated.zipCode,
          country: updated.country,
          isDefault: !!updated.isDefault,
        },
      });
    } catch (error) {
      console.error('Update address error:', error);
      res.status(500).json({ message: 'Server error while updating address' });
    }
  }
);

// @route   DELETE /api/users/addresses/:id
// @desc    Remove an address
// @access  Private
router.delete('/addresses/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { id } = req.params;
    const list = user.addresses || [];
    const idx = list.findIndex(a => a._id.toString() === id);
    if (idx === -1) return res.status(404).json({ message: 'Address not found' });

    const wasDefault = !!list[idx].isDefault;
    list.splice(idx, 1);

    // If default removed, set first as default if any remain
    if (wasDefault && list.length > 0) {
      list.forEach((a, i) => (a.isDefault = i === 0));
    }

    user.addresses = list;
    await user.save();
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ message: 'Server error while deleting address' });
  }
});

// @route   DELETE /api/users/wishlist/:productId
// @desc    Remove item from wishlist
// @access  Private
router.delete('/wishlist/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: productId } });
    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error while removing from wishlist' });
  }
});

// @route   GET /api/users/wishlist
// @desc    Get user wishlist populated with product data
// @access  Private
router.get('/wishlist', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      match: { isActive: true },
      select: 'name price originalPrice images rating reviews category vendor'
    });

    const wishlist = (user.wishlist || []).map(p => ({
      id: p._id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      image: Array.isArray(p.images) && p.images.length ? p.images[0] : undefined,
      rating: p.rating,
      reviews: p.reviews,
      category: p.category,
    }));

    res.json({ wishlist });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error while fetching wishlist' });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user statistics
    const totalOrders = await Order.countDocuments({ user: userId });
    const totalSpent = await Order.aggregate([
      { $match: { user: userId, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const recentOrders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber status total createdAt');

    res.json({
      stats: {
        totalOrders,
        totalSpent: totalSpent[0]?.total || 0,
        loyaltyPoints: req.user.loyaltyPoints
      },
      recentOrders
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error while fetching user stats' });
  }
});

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalUsers: total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete a user (Admin only)
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // TODO: cascade clean-up if needed (orders, etc.)
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
});

// Account deletion requests
const AccountDeletionRequest = require('../models/AccountDeletionRequest');

// @route   POST /api/users/request-deletion
// @desc    Create account deletion request (user)
// @access  Private
router.post('/request-deletion', auth, [
  body('reason').optional().isLength({ min: 5 }).withMessage('Reason must be at least 5 characters')
], async (req, res) => {
  try {
    const existing = await AccountDeletionRequest.findOne({ user: req.user._id, status: 'pending' });
    if (existing) return res.status(400).json({ message: 'A pending request already exists' });

    const request = await AccountDeletionRequest.create({ user: req.user._id, reason: req.body.reason });
    res.status(201).json({ message: 'Deletion request submitted', request });
  } catch (error) {
    console.error('Create deletion request error:', error);
    res.status(500).json({ message: 'Server error while creating deletion request' });
  }
});

// @route   GET /api/users/deletion-requests
// @desc    List deletion requests (Admin)
// @access  Private (Admin)
router.get('/deletion-requests', adminAuth, async (req, res) => {
  try {
    const requests = await AccountDeletionRequest.find().populate('user', 'name email role');
    res.json({ requests });
  } catch (error) {
    console.error('List deletion requests error:', error);
    res.status(500).json({ message: 'Server error while listing deletion requests' });
  }
});

// @route   POST /api/users/deletion-requests/:id/approve
// @desc    Approve deletion request and delete user (Admin)
// @access  Private (Admin)
router.post('/deletion-requests/:id/approve', adminAuth, async (req, res) => {
  try {
    const request = await AccountDeletionRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    request.status = 'approved';
    request.processedBy = req.user._id;
    request.processedAt = new Date();
    await request.save();
    await User.findByIdAndDelete(request.user);
    res.json({ message: 'Account deletion approved and user deleted' });
  } catch (error) {
    console.error('Approve deletion request error:', error);
    res.status(500).json({ message: 'Server error while approving deletion request' });
  }
});

// @route   POST /api/users/deletion-requests/:id/reject
// @desc    Reject deletion request (Admin)
// @access  Private (Admin)
router.post('/deletion-requests/:id/reject', adminAuth, async (req, res) => {
  try {
    const request = await AccountDeletionRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    request.status = 'rejected';
    request.processedBy = req.user._id;
    request.processedAt = new Date();
    await request.save();
    res.json({ message: 'Account deletion request rejected' });
  } catch (error) {
    console.error('Reject deletion request error:', error);
    res.status(500).json({ message: 'Server error while rejecting deletion request' });
  }
});
// @route   PUT /api/users/:id/status
// @desc    Update user status (Admin only)
// @access  Private (Admin)
router.put('/:id/status', adminAuth, [
  body('isActive').isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User status updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error while updating user status' });
  }
});

module.exports = router;
