const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Repayment = require('../models/Repayment');

const router = express.Router();

// @route   GET /api/repayment/settings
// @desc    Get current user's repayment settings
// @access  Private
router.get('/settings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('repaymentSettings');
    res.json(user?.repaymentSettings || { autoRepay: false, maxAmount: 0, preferredMethod: 'card', notificationDays: 3 });
  } catch (error) {
    console.error('Get repayment settings error:', error);
    res.status(500).json({ message: 'Server error while fetching settings' });
  }
});

// @route   PUT /api/repayment/settings
// @desc    Update repayment settings
// @access  Private
router.put('/settings', auth, [
  body('autoRepay').optional().isBoolean(),
  body('maxAmount').optional().isFloat({ min: 0 }),
  body('preferredMethod').optional().isIn(['card', 'bank', 'wallet']),
  body('notificationDays').optional().isInt({ min: 1, max: 7 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const update = { repaymentSettings: { ...req.body } };
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true, runValidators: true }).select('repaymentSettings');
    res.json(user.repaymentSettings);
  } catch (error) {
    console.error('Update repayment settings error:', error);
    res.status(500).json({ message: 'Server error while updating settings' });
  }
});

// @route   GET /api/repayment/pending
// @desc    List pending repayments for current user (as borrower)
// @access  Private
router.get('/pending', auth, async (req, res) => {
  try {
    const items = await Repayment.find({ borrowerId: req.user._id, status: { $in: ['pending', 'processing'] } }).sort({ dueDate: 1 });
    const result = items.map(r => ({
      id: r._id,
      amount: r.amount,
      dueDate: r.dueDate,
      status: r.status,
      helperName: 'Helper',
      productName: 'Item'
    }));
    res.json(result);
  } catch (error) {
    console.error('List pending repayments error:', error);
    res.status(500).json({ message: 'Server error while listing pending repayments' });
  }
});

// @route   GET /api/repayment/history
// @desc    List completed/failed repayments for current user (as borrower)
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const items = await Repayment.find({ borrowerId: req.user._id, status: { $in: ['completed', 'failed'] } }).sort({ updatedAt: -1 });
    const result = items.map(r => ({
      id: r._id,
      amount: r.amount,
      paidDate: r.paidDate || r.updatedAt,
      status: r.status,
      helperName: 'Helper',
      paymentMethod: r.paymentMethod
    }));
    res.json(result);
  } catch (error) {
    console.error('List repayment history error:', error);
    res.status(500).json({ message: 'Server error while listing repayment history' });
  }
});

// @route   POST /api/repayment/process/:id
// @desc    Process a repayment (manual trigger)
// @access  Private
router.post('/process/:id', auth, async (req, res) => {
  try {
    const repayment = await Repayment.findById(req.params.id);
    if (!repayment) return res.status(404).json({ message: 'Repayment not found' });
    if (repayment.borrowerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to process this repayment' });
    }

    // Simulate wallet-based repayment; deduct from borrower, credit helper
    const borrower = await User.findById(repayment.borrowerId);
    const helper = await User.findById(repayment.helperId);
    if (!borrower || !helper) return res.status(404).json({ message: 'Users not found' });

    if ((borrower.walletBalance || 0) < repayment.amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    borrower.walletBalance -= repayment.amount;
    helper.walletBalance = (helper.walletBalance || 0) + repayment.amount;
    await borrower.save();
    await helper.save();

    repayment.status = 'completed';
    repayment.paidDate = new Date();
    await repayment.save();

    res.json({ message: 'Repayment processed', id: repayment._id });
  } catch (error) {
    console.error('Process repayment error:', error);
    res.status(500).json({ message: 'Server error while processing repayment' });
  }
});

module.exports = router;

