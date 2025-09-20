const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  banner: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  categories: [{
    type: String,
    enum: ['Jewelry', 'Decor', 'Clothing', 'Accessories', 'Home', 'Art']
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  contact: {
    email: {
      type: String,
      required: true
    },
    phone: String,
    website: String,
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search
vendorSchema.index({ name: 'text', description: 'text' });
vendorSchema.index({ location: 1 });
vendorSchema.index({ categories: 1 });
vendorSchema.index({ isActive: 1, isVerified: 1 });

module.exports = mongoose.model('Vendor', vendorSchema);
