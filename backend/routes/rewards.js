const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Helper: compute level based on loyaltyPoints
const computeLevel = (points) => {
  if (points >= 2500) return 5;
  if (points >= 1000) return 4;
  if (points >= 500) return 3;
  if (points >= 100) return 2;
  return 1;
};

// Static available rewards (could be DB-backed later)
const AVAILABLE_REWARDS = [
  { id: 'rw10', name: '10% Discount', type: 'discount', pointsCost: 200, description: 'Save 10% on your next order' },
  { id: 'rwFree', name: 'Free Gift Item', type: 'free_item', pointsCost: 500, description: 'Receive a curated free item' },
  { id: 'rwPrem', name: 'Premium Badge', type: 'premium', pointsCost: 800, description: 'Showcase a premium helper badge' },
  { id: 'rwExcl', name: 'Exclusive Access', type: 'exclusive', pointsCost: 1200, description: 'Early access to new collections' }
];

// @route   GET /api/rewards/points
// @desc    Get current user points and level
// @access  Private
router.get('/points', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('loyaltyPoints');
    const points = user?.loyaltyPoints || 0;
    const level = computeLevel(points);
    res.json({ points, level });
  } catch (error) {
    console.error('Get points error:', error);
    res.status(500).json({ message: 'Server error while fetching points' });
  }
});

// @route   GET /api/rewards/available
// @desc    List available rewards
// @access  Private
router.get('/available', auth, (req, res) => {
  res.json(AVAILABLE_REWARDS);
});

// @route   GET /api/rewards/redeemed
// @desc    List redeemed rewards for current user
// @access  Private
router.get('/redeemed', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('redeemedRewards');
    res.json(user?.redeemedRewards || []);
  } catch (error) {
    console.error('Get redeemed rewards error:', error);
    res.status(500).json({ message: 'Server error while fetching redeemed rewards' });
  }
});

// @route   POST /api/rewards/redeem/:rewardId
// @desc    Redeem a reward
// @access  Private
router.post('/redeem/:rewardId', auth, async (req, res) => {
  try {
    const reward = AVAILABLE_REWARDS.find(r => r.id === req.params.rewardId);
    if (!reward) return res.status(404).json({ message: 'Reward not found' });

    const user = await User.findById(req.user._id).select('loyaltyPoints redeemedRewards');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if ((user.loyaltyPoints || 0) < reward.pointsCost) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    user.loyaltyPoints = (user.loyaltyPoints || 0) - reward.pointsCost;
    user.redeemedRewards = user.redeemedRewards || [];
    user.redeemedRewards.push({
      rewardId: reward.id,
      name: reward.name,
      type: reward.type,
      pointsCost: reward.pointsCost,
      redeemedAt: new Date()
    });
    await user.save();

    res.json({ message: 'Reward redeemed', points: user.loyaltyPoints });
  } catch (error) {
    console.error('Redeem reward error:', error);
    res.status(500).json({ message: 'Server error while redeeming reward' });
  }
});

module.exports = router;

