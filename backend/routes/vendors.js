const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/vendors
// @desc    Get all vendors with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isIn(['Jewelry', 'Decor', 'Clothing', 'Accessories', 'Home', 'Art']).withMessage('Invalid category'),
  query('location').optional().trim().isLength({ min: 2 }).withMessage('Location must be at least 2 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 20,
      search,
      category,
      location,
      verified
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    if (category) {
      filter.categories = category;
    }
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    if (verified === 'true') {
      filter.isVerified = true;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const vendors = await Vendor.find(filter)
      .sort({ rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Vendor.countDocuments(filter);

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
    console.error('Get vendors error:', error);
    res.status(500).json({ message: 'Server error while fetching vendors' });
  }
});

// @route   GET /api/vendors/:id
// @desc    Get single vendor with products
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Get vendor's products
    const products = await Product.find({ 
      vendor: req.params.id, 
      isActive: true 
    })
      .select('name price images rating reviews category featured')
      .sort({ featured: -1, createdAt: -1 })
      .limit(20);

    res.json({
      vendor,
      products
    });
  } catch (error) {
    console.error('Get vendor error:', error);
    res.status(500).json({ message: 'Server error while fetching vendor' });
  }
});

// @route   POST /api/vendors
// @desc    Create new vendor
// @access  Private (Admin)
router.post('/', adminAuth, [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('location').trim().isLength({ min: 2 }).withMessage('Location must be at least 2 characters'),
  body('contact.email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('logo').isURL().withMessage('Logo must be a valid URL'),
  body('banner').isURL().withMessage('Banner must be a valid URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vendor = new Vendor(req.body);
    await vendor.save();

    res.status(201).json({
      message: 'Vendor created successfully',
      vendor
    });
  } catch (error) {
    console.error('Create vendor error:', error);
    res.status(500).json({ message: 'Server error while creating vendor' });
  }
});

// @route   PUT /api/vendors/:id
// @desc    Update vendor
// @access  Private (Admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({
      message: 'Vendor updated successfully',
      vendor
    });
  } catch (error) {
    console.error('Update vendor error:', error);
    res.status(500).json({ message: 'Server error while updating vendor' });
  }
});

// @route   DELETE /api/vendors/:id
// @desc    Delete vendor
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Soft delete
    vendor.isActive = false;
    await vendor.save();

    // Also deactivate vendor's products
    await Product.updateMany(
      { vendor: req.params.id },
      { isActive: false }
    );

    res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    console.error('Delete vendor error:', error);
    res.status(500).json({ message: 'Server error while deleting vendor' });
  }
});

// @route   PUT /api/vendors/:id/verify
// @desc    Verify vendor
// @access  Private (Admin)
router.put('/:id/verify', adminAuth, async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({
      message: 'Vendor verified successfully',
      vendor
    });
  } catch (error) {
    console.error('Verify vendor error:', error);
    res.status(500).json({ message: 'Server error while verifying vendor' });
  }
});

// @route   GET /api/vendors/:id/stats
// @desc    Get vendor statistics
// @access  Private (Vendor/Admin)
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Check if user is the vendor or admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== vendor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view vendor stats' });
    }

    // Get vendor statistics
    const totalProducts = await Product.countDocuments({ 
      vendor: req.params.id, 
      isActive: true 
    });
    
    const totalOrders = await Order.countDocuments({ 
      'items.vendor': req.params.id 
    });
    
    const totalRevenue = await Order.aggregate([
      { $match: { 'items.vendor': req.params.id, status: 'delivered' } },
      { $unwind: '$items' },
      { $match: { 'items.vendor': req.params.id } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } }
    ]);

    res.json({
      vendor: {
        name: vendor.name,
        rating: vendor.rating,
        reviews: vendor.reviews
      },
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get vendor stats error:', error);
    res.status(500).json({ message: 'Server error while fetching vendor stats' });
  }
});

module.exports = router;
