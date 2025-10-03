const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const HelperPoints = require('../models/HelperPoints');
const HelperPointsObligation = require('../models/HelperPointsObligation');

const router = express.Router();

async function ensureAccount(userId) {
  let acct = await HelperPoints.findOne({ user: userId });
  if (!acct) {
    acct = await HelperPoints.create({ user: userId, balance: 0, transactions: [] });
  }
  return acct;
}

// GET /api/helper-points/summary
router.get('/summary', auth, async (req, res) => {
  try {
    const acct = await ensureAccount(req.user._id);
    // Count obligations where current user is borrower
    const outstanding = await HelperPointsObligation.aggregate([
      { $match: { borrower: req.user._id } },
      { $group: { _id: null, total: { $sum: '$amountOutstanding' } } }
    ]);
    const totalOutstanding = outstanding[0]?.total || 0;
    res.json({ balance: acct.balance || 0, totalOutstanding });
  } catch (err) {
    console.error('HelperPoints summary error:', err);
    res.status(500).json({ message: 'Server error while fetching helper points' });
  }
});

// GET /api/helper-points/transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '50', 10);
    const acct = await ensureAccount(req.user._id);
    // Include own transactions plus any transactions where recipient is current user stored in other accounts
    // For simplicity return only own account transactions here
    const tx = (acct.transactions || [])
      .slice()
      .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
    res.json({ transactions: tx });
  } catch (err) {
    console.error('HelperPoints tx error:', err);
    res.status(500).json({ message: 'Server error while fetching transactions' });
  }
});

// POST /api/helper-points/topup { amount }
router.post('/topup', auth, [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be positive')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const amount = Math.floor(parseFloat(req.body.amount));
    const acct = await ensureAccount(req.user._id);
    acct.balance = (acct.balance || 0) + amount;
    acct.transactions.push({ type: 'topup', amount, helperUser: req.user._id, note: 'Top-up' });
    await acct.save();
    res.json({ message: 'Helper Points added', balance: acct.balance });
  } catch (err) {
    console.error('HelperPoints topup error:', err);
    res.status(500).json({ message: 'Server error while topping up helper points' });
  }
});

module.exports = router;

