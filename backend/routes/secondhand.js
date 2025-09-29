const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const SecondHandProduct = require('../models/SecondHandProduct');

const router = express.Router();

// Public: list approved second-hand products
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isIn(['Jewelry', 'Decor', 'Clothing', 'Accessories', 'Home', 'Art'])
], async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    const filter = { approved: true, isActive: true };
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const items = await SecondHandProduct.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await SecondHandProduct.countDocuments(filter);
    res.json({
      products: items,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total
      }
    });
  } catch (error) {
    console.error('List second-hand error:', error);
    res.status(500).json({ message: 'Server error while fetching second-hand products' });
  }
});

// Public: get by id
router.get('/:id', async (req, res) => {
  try {
    const item = await SecondHandProduct.findById(req.params.id).populate('seller', 'name email');
    if (!item || !item.isActive) return res.status(404).json({ message: 'Product not found' });
    res.json(item);
  } catch (error) {
    console.error('Get second-hand error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Auth: create (customer or vendor)
router.post('/', auth, [
  body('name').trim().isLength({ min: 2 }),
  body('description').trim().isLength({ min: 10 }),
  body('price').isFloat({ min: 0 }),
  body('category').isIn(['Jewelry', 'Decor', 'Clothing', 'Accessories', 'Home', 'Art']),
  body('images').isArray({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const data = { ...req.body, seller: req.user._id, approved: false };
    const doc = new SecondHandProduct(data);
    await doc.save();
    res.status(201).json({ message: 'Second-hand product submitted for approval', product: doc });
  } catch (error) {
    console.error('Create second-hand error:', error);
    res.status(500).json({ message: 'Server error while creating product' });
  }
});

// Auth: update own
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await SecondHandProduct.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Product not found' });
    if (item.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updated = await SecondHandProduct.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ message: 'Product updated', product: updated });
  } catch (error) {
    console.error('Update second-hand error:', error);
    res.status(500).json({ message: 'Server error while updating product' });
  }
});

// Auth: delete (soft)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await SecondHandProduct.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Product not found' });
    if (item.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    item.isActive = false;
    await item.save();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete second-hand error:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
});

// Admin: approve/unapprove
router.put('/:id/approve', adminAuth, [
  body('approved').isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const updated = await SecondHandProduct.findByIdAndUpdate(req.params.id, { approved: req.body.approved }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Approval status updated', product: updated });
  } catch (error) {
    console.error('Approve second-hand error:', error);
    res.status(500).json({ message: 'Server error while updating approval' });
  }
});

module.exports = router;

