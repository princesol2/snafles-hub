const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// Helper to generate JWT
const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Helper to set auth cookie and redirect based on role
function handlePostAuthRedirect(res, user) {
  const token = signToken(user._id);
  // Set JWT as httpOnly cookie
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const redirectTo = user.role === 'vendor' ? '/vendor' : '/home';
  // Use 303 for POST -> GET redirect semantics
  return res.redirect(303, redirectTo);
}

// Example login route (form-POST friendly)
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 1 }).withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const ok = await user.comparePassword(password);
      if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

      user.lastLogin = new Date();
      await user.save();

      return handlePostAuthRedirect(res, user);
    } catch (err) {
      console.error('Login redirect error:', err);
      return res.status(500).json({ message: 'Server error during login' });
    }
  }
);

// Example register route (form-POST friendly)
router.post(
  '/register',
  [
    body('name').isLength({ min: 2 }).withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['customer', 'vendor', 'admin']).withMessage('Invalid role'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, role } = req.body;

      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) return res.status(400).json({ message: 'User already exists' });

      const user = new User({
        name,
        email: email.toLowerCase(),
        password,
        role: role || 'customer',
        lastLogin: new Date(),
        emailVerified: true, // streamline example flow
      });

      await user.save();

      return handlePostAuthRedirect(res, user);
    } catch (err) {
      console.error('Register redirect error:', err);
      return res.status(500).json({ message: 'Server error during registration' });
    }
  }
);

module.exports = router;

