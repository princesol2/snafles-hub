const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/reviews/:type/:id
// @desc    Get reviews for product or vendor
// @access  Public
router.get('/:type/:id', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('rating').optional().isInt({ min: 1, max: 5 }),
  query('sortBy').optional().isIn(['rating', 'createdAt', 'helpful']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, id } = req.params;
    const { page = 1, limit = 20, rating, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    if (!['product', 'vendor'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either product or vendor' });
    }

    // Check if product/vendor exists
    if (type === 'product') {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
    } else {
      const vendor = await Vendor.findById(id);
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
    }

    // Build filter
    const filter = { [type]: id };
    if (rating) {
      filter.rating = parseInt(rating);
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get reviews from the appropriate model
    let reviews, total;
    if (type === 'product') {
      const product = await Product.findById(id).populate({
        path: 'customerReviews.user',
        select: 'name avatar'
      });
      reviews = product.customerReviews || [];
      total = reviews.length;

      // Apply filters
      if (rating) {
        reviews = reviews.filter(review => review.rating === parseInt(rating));
      }

      // Apply sorting
      reviews.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      // Apply pagination
      reviews = reviews.slice(skip, skip + parseInt(limit));
    } else {
      const vendor = await Vendor.findById(id).populate({
        path: 'reviews.user',
        select: 'name avatar'
      });
      reviews = vendor.reviews || [];
      total = reviews.length;

      // Apply filters and sorting similar to products
      if (rating) {
        reviews = reviews.filter(review => review.rating === parseInt(rating));
      }

      reviews.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      reviews = reviews.slice(skip, skip + parseInt(limit));
    }

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalReviews: total,
        hasNext: skip + reviews.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error while fetching reviews' });
  }
});

// @route   POST /api/reviews
// @desc    Create new review
// @access  Private
router.post('/', auth, [
  body('type').isIn(['product', 'vendor']).withMessage('Type must be product or vendor'),
  body('targetId').isMongoId().withMessage('Valid target ID required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').optional().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('comment').optional().isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),
  body('images').optional().isArray().withMessage('Images must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, targetId, rating, title, comment, images } = req.body;

    // Check if target exists
    if (type === 'product') {
      const product = await Product.findById(targetId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
    } else {
      const vendor = await Vendor.findById(targetId);
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
    }

    // Check if user has already reviewed this item
    if (type === 'product') {
      const product = await Product.findById(targetId);
      const existingReview = product.customerReviews.find(
        review => review.user.toString() === req.user._id.toString()
      );
      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this product' });
      }
    } else {
      const vendor = await Vendor.findById(targetId);
      const existingReview = vendor.reviews.find(
        review => review.user.toString() === req.user._id.toString()
      );
      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this vendor' });
      }
    }

    // Create review object
    const reviewData = {
      user: req.user._id,
      name: req.user.name,
      rating,
      title,
      comment,
      images: images || [],
      verified: true, // For now, all reviews are verified
      createdAt: new Date()
    };

    // Add review to appropriate model
    if (type === 'product') {
      const product = await Product.findById(targetId);
      product.customerReviews.push(reviewData);
      
      // Update product rating
      const totalRating = product.customerReviews.reduce((sum, review) => sum + review.rating, 0);
      product.rating = totalRating / product.customerReviews.length;
      product.reviews = product.customerReviews.length;
      
      await product.save();
    } else {
      const vendor = await Vendor.findById(targetId);
      vendor.reviews.push(reviewData);
      
      // Update vendor rating
      const totalRating = vendor.reviews.reduce((sum, review) => sum + review.rating, 0);
      vendor.rating = totalRating / vendor.reviews.length;
      vendor.reviewCount = vendor.reviews.length;
      
      await vendor.save();
    }

    res.status(201).json({
      message: 'Review created successfully',
      review: reviewData
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error while creating review' });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private
router.put('/:id', auth, [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').optional().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('comment').optional().isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),
  body('images').optional().isArray().withMessage('Images must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, title, comment, images } = req.body;

    // Find review in products
    const products = await Product.find({ 'customerReviews._id': req.params.id });
    let review = null;
    let product = null;

    if (products.length > 0) {
      product = products[0];
      review = product.customerReviews.id(req.params.id);
    } else {
      // Find review in vendors
      const vendors = await Vendor.find({ 'reviews._id': req.params.id });
      if (vendors.length > 0) {
        const vendor = vendors[0];
        review = vendor.reviews.id(req.params.id);
        product = vendor; // For consistency in the rest of the code
      }
    }

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    // Update review
    if (rating !== undefined) review.rating = rating;
    if (title !== undefined) review.title = title;
    if (comment !== undefined) review.comment = comment;
    if (images !== undefined) review.images = images;
    review.updatedAt = new Date();

    await product.save();

    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error while updating review' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find review in products
    const products = await Product.find({ 'customerReviews._id': req.params.id });
    let review = null;
    let product = null;

    if (products.length > 0) {
      product = products[0];
      review = product.customerReviews.id(req.params.id);
    } else {
      // Find review in vendors
      const vendors = await Vendor.find({ 'reviews._id': req.params.id });
      if (vendors.length > 0) {
        const vendor = vendors[0];
        review = vendor.reviews.id(req.params.id);
        product = vendor;
      }
    }

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review or is admin
    if (req.user.role !== 'admin' && review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    // Remove review
    review.remove();
    await product.save();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error while deleting review' });
  }
});

module.exports = router;
