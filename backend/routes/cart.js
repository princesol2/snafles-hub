const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');

const router = express.Router();

// POST /api/cart/price -> compute price breakdown for items
router.post('/price', [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { items } = req.body; // [{ product, quantity }]
    let subtotal = 0;
    let shippingTotal = 0;
    const defaultFlat = parseFloat(process.env.DEFAULT_SHIPPING_FLAT || '0');
    for (const item of items) {
      const product = await Product.findById(item.product).select('price shipping');
      if (!product) return res.status(400).json({ message: `Product ${item.product} not found` });
      subtotal += product.price * (item.quantity || 1);
      if (product?.shipping?.type === 'FLAT') {
        shippingTotal += (product.shipping.amount || defaultFlat) * (item.quantity || 1);
      }
    }
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shippingTotal + tax;
    res.json({ subtotal, shippingTotal, tax, total, currency: 'INR' });
  } catch (e) {
    console.error('Cart price error:', e);
    res.status(500).json({ message: 'Server error while calculating cart price' });
  }
});

module.exports = router;

